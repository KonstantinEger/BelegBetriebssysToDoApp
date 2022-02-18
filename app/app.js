const path = require("path");
const {promises: fs} = require("fs");
const remote = require("@electron/remote");

let model = {
    idcount: 0,
    todos: []
};

const todoCons = text => ({ text, id: model.idcount++, done: false });

const viewTodo = todo => {
    const wrap = document.createElement("div");
    wrap.classList.add("todo");
    const text = document.createElement("span");
    text.classList.add("todo-text");
    if (todo.done) text.classList.add("done-todo-text");
    text.textContent = todo.text;
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = todo.done;
    cb.addEventListener("change", event => {
        const td = model.todos.find(t => t.id === todo.id);
        if (!td) return;
        td.done = event.target.checked;
        render(model);
    });
    wrap.append(cb, text);
    return wrap;
};

const render = model => {
    const container = document.querySelector("#todo-container");
    container.innerHTML = "";
    container.append(...model.todos.map(viewTodo));
};

document.querySelector("#todo-input").addEventListener("change", event => {
    const newValue = event.target.value;
    if (newValue.length < 5) return;

    const todo = todoCons(newValue);
    const existing = model.todos.find(t => t.text === todo.text);
    if (existing) return;

    model.todos.push(todo);
    event.target.value = "";
    
    render(model);
});

document.querySelector("#clear-btn").addEventListener("click", () => {
    model.todos = model.todos.filter(t => !t.done);
    render(model);
});

const saveModel = async (model, filePath) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(model));
    } catch (err) {
        alert("There was an error saving the file");
    }
};

document.querySelector("#save-btn").addEventListener("click", async () => {
    const dialog = remote.dialog;
    const browserWin = remote.getCurrentWindow();
    const opts = {
        title: "To Do Liste speichern",
        defaultPath: path.join(process.env.HOME || process.env.HOMEPATH, "todos.json"),
    };
    const {canceled, filePath} = await dialog.showSaveDialog(browserWin, opts);
    if (canceled || !filePath) return;

    saveModel(model, filePath);
});

const loadModel = async () => {
    const dialog = remote.dialog;
    const browserWin = remote.getCurrentWindow();
    const opts = {
        title: "To Do Liste öffnen",
        filePath: process.env.HOME || process.env.HOMEPATH,
        buttonLabel: "Öffnen",
        properties: ["openFile"]
    };

    const {canceled, filePaths} = await dialog.showOpenDialog(browserWin, opts);
    if (canceled || filePaths.length === 0) return;

    const json = await fs.readFile(filePaths[0], "utf8");
    return JSON.parse(json);
};

document.querySelector("#load-btn").addEventListener("click", async () => {
    const newModel = await loadModel();
    if (!newModel) return;
    model = newModel;
    render(model);
});

