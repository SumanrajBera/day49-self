const todo = document.querySelector("#todo")
const progress = document.querySelector("#progress")
const done = document.querySelector("#done")
const tasks = document.querySelectorAll(".task")

const toggleModalBtn = document.querySelector("#toggle-modal")
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal")
const addTaskBtn = document.querySelector("#add-new-task")


let columns = [todo, progress, done]
let target = null;

let tasksData = {};


function updateTaskCount() {
    for (let column of columns) {
        const tasks = column.querySelectorAll(".task");
        const count = tasks.length;

        tasksData[column.id] = Array.from(tasks).map(t => {
            return {
                title: t.querySelector("h2").textContent,
                desc: t.querySelector("p").textContent
            }
        })

        localStorage.setItem("tasks", JSON.stringify(tasksData))

        column.children[0].children[1].textContent = count;
    }
}

function createTask(taskTitle, taskDesc, column) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.setAttribute("draggable", "true");

    // Title
    const h2 = document.createElement("h2");
    h2.textContent = taskTitle;

    // Description
    const p = document.createElement("p");
    p.textContent = taskDesc;

    // Delete button
    const btn = document.createElement("button");
    btn.textContent = "Delete";

    btn.addEventListener("click", function() {
        console.log("clicked");  
        task.remove()

        updateTaskCount()
    })

    // Append children
    task.appendChild(h2);
    task.appendChild(p);
    task.appendChild(btn);

    task.addEventListener("drag", (e) => {
        target = task;
    })

    column.appendChild(task);
}

if (localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"))

    for (const col in data) {
        const column = document.querySelector(`#${col}`)
        data[col].forEach(task => {
            createTask(task.title, task.desc, column)
        })

        updateTaskCount()
    }
}


tasks.forEach(task => {
    task.addEventListener("drag", (e) => {
        target = task;
    })
})

for (let column of columns) {
    column.addEventListener("dragenter", function (e) {
        e.preventDefault()
        // console.log(this)
        this.classList.add("hover-over")
    })

    column.addEventListener("dragleave", function (e) {
        // console.log(this)
        this.classList.remove("hover-over")
    })

    column.addEventListener("dragover", function (e) {
        e.preventDefault()
    })

    column.addEventListener("drop", function (e) {
        column.appendChild(target);
        this.classList.remove("hover-over");

        updateTaskCount()

        target = null;
    })
}

toggleModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click", () => {
    modal.classList.remove("active")
})

addTaskBtn.addEventListener("click", () => {
    let taskTitle = document.querySelector("#taskTitleInp");
    let taskDesc = document.querySelector("#taskDescInp");
    
    taskTitleValue = taskTitle.value.trim();
    taskDescValue = taskDesc.value.trim()
    
    if (taskTitle.value.trim() === "") return
    
    createTask(taskTitleValue, taskDescValue, todo)

    updateTaskCount()

    taskTitle.value = ""
    taskDesc.value = ""
})