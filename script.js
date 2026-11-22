import { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "./firebaseConfig.js";

let todos = [];
let todoInput = document.querySelector("#todo-inp");
let todoListElm = document.querySelector(".todo-lists");

let fetchTodos = async () => {
    try {
        todos = [];
        const querySnapshot = await getDocs(collection(db, "todos"));

        querySnapshot.forEach((docSnap) => {
            todos.push({ ...docSnap.data(), id: docSnap.id });
        });

        todos.sort((a, b) => a.createdAt - b.createdAt);
    } catch (error) {
        console.error(error);
    }
};

let addTodo = async () => {
    if (todoInput.value.trim() === "") return;

    let newTodo = {
        text: todoInput.value,
        isCompleted: false,
        createdAt: Date.now()
    };

    todoInput.value = "";

    try {
        let docRef = await addDoc(collection(db, "todos"), newTodo);

        todos.push({ ...newTodo, id: docRef.id });
        renderTodos();
    } catch (error) {
        console.error("Could not save todo:", error);
    }
};

let deleteTodo = async (todo_id) => {
    try {
        await deleteDoc(doc(db, "todos", todo_id));

        todos = todos.filter((todo) => todo.id != todo_id);
        renderTodos();
    } catch (error) {
        console.error(error);
    }
};

let doneTodo = async (todo_id) => {
    try {
        await updateDoc(doc(db, "todos", todo_id), {
            isCompleted: true
        });

        todos.forEach((todoObj) => {
            if (todoObj.id == todo_id) {
                todoObj.isCompleted = true;
            }
        });

        renderTodos();

        let todoDiv = document.getElementById(todo_id);
        showActions(todoDiv);
    } catch (error) {
        console.error(error);
    }
};

let renderTodos = () => {
    todoListElm.innerHTML = "";

    todos.forEach((todo) => {
        let todoDiv = document.createElement("div");
        todoDiv.className = "todo";

        if (todo.isCompleted) {
            todoDiv.className += " done";
        }

        todoDiv.id = todo.id;
        todoDiv.innerText = todo.text;

        todoDiv.addEventListener("click", () => {
            showActions(todoDiv);
        });

        todoListElm.appendChild(todoDiv);
    });
};

let showActions = (todoDiv) => {
    if (todoDiv.querySelector("button")) return;

    let isDone = todoDiv.classList.contains("done");

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "del-btn";
    deleteBtn.addEventListener("click", () => {
        deleteTodo(todoDiv.id);
    });

    if (isDone) {
        todoDiv.appendChild(deleteBtn);
        return;
    }

    let doneBtn = document.createElement("button");
    doneBtn.innerText = "✔";
    doneBtn.className = "done-btn";
    doneBtn.addEventListener("click", () => {
        doneTodo(todoDiv.id);
    });

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
        editTodo(todoDiv.id);
    });

    todoDiv.appendChild(doneBtn);
    todoDiv.appendChild(editBtn);
    todoDiv.appendChild(deleteBtn);
};

let editTodo = (todo_id) => {
    let findTodo = todos.find((todo) => todo.id == todo_id);
    todoInput.value = findTodo.text;

    document.querySelector("#delAllBtn").disabled = true;
    document.querySelectorAll(".todo-lists button").forEach((btn) => {
        btn.disabled = true;
    });

    let addBtn = document.querySelector("#addBtn");
    addBtn.innerText = "update";
    addBtn.setAttribute("onClick", `updateTodo('${todo_id}')`);
};

let updateTodo = async (todo_id) => {
    if (todoInput.value.trim() === "") return;

    try {
        await updateDoc(doc(db, "todos", todo_id), {
            text: todoInput.value
        });

        todos.forEach((todoObj) => {
            if (todoObj.id == todo_id) {
                todoObj.text = todoInput.value;
            }
        });

        todoInput.value = "";

        document.querySelector("#delAllBtn").disabled = false;

        let addBtn = document.querySelector("#addBtn");
        addBtn.innerText = "add";
        addBtn.setAttribute("onClick", "addTodo()");

        renderTodos();
    } catch (error) {
        console.error(error);
    }
};

let deleteAllTodos = async () => {
    try {
        await Promise.all(
            todos.map((todo) => deleteDoc(doc(db, "todos", todo.id)))
        );

        todos = [];
        renderTodos();
    } catch (error) {
        console.error(error);
    }
};

fetchTodos().then(() => {
    renderTodos();
});

window.addTodo = addTodo;
window.deleteAllTodos = deleteAllTodos;
window.updateTodo = updateTodo;