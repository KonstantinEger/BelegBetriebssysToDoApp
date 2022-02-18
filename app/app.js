const path = require("path");
const {promises: fs} = require("fs");

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

document.querySelector("#save-btn").addEventListener("click", () => {
    const p = path.join(__dirname, "mytodos.json");
    saveModel(model, p);
});
