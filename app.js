"use strict";
const addNewTask = document.querySelector('#add-new-task');
const tasksList = document.querySelector('#tasks-list');
const filters = document.querySelectorAll('#filters span');

let isEditMode = false;
let editedTaskId;
let filterMode = "all";
let tasksListArray = [];

const addTask = (e) => {
    e.preventDefault();
    let addedNewTaskValue = addNewTask.value.trim();
    if (addedNewTaskValue) {
        let id = tasksListArray == 0 ? 1 : tasksListArray[tasksListArray.length - 1].id + 1;
        tasksListArray.push(
            {
                "id": id,
                "text": addedNewTaskValue,
                "status": "pending"
            }
        );
        displayTasks(filterMode);
        setLocalStorage();
    } else {
        alert("Please do not leave blank !")
    }
    addNewTask.value = "";
    addNewTask.focus();
}

const displayTasks = (filterMode) => {
    tasksList.innerHTML = "";
    if (tasksListArray.filter((taskItem) => {
        if (taskItem.status == filterMode) return true;
    }).length == 0 && filterMode != "all") {
        tasksList.innerHTML = `<div class='alert alert-warning mb-0 text-danger'>${filterMode == "pending" ? "Pending" : "Completed"} task is not found.</div>`;
        return;
    } else if (tasksListArray.length == 0) {
        tasksList.innerHTML = `<div class='alert alert-warning mb-0 text-danger'>Task is not found.</div>`;
        return;
    } else {
        for (const taskItem of tasksListArray) {
            if (filterMode == "all" || filterMode == taskItem.status) {
                let completed = taskItem.status == "completed" ? "text-decoration-line-through" : "";
                let taskLiElement = `
                  <li class="list-group-item" id="${taskItem.id}">
                           <div class="form-check d-flex justify-content-between align-items-center" >
                               <input onclick="updateTaskStatus(this);" class="form-check-input" type="checkbox" role="checkbox" id="${taskItem.id}" ${taskItem.status == "completed" ? "checked" : ""}>
                               
                               <div class="input-group">
                                   <input type="text" class="form-control ${completed}" value="${taskItem.text}" id="${taskItem.id}" disabled>
                                   <button onclick="" class="btn btn-warning fs-4" id="${taskItem.id}"><i class="fa-regular fa-pen-to-square text-white"></i></button>
                                   <button onclick="deleteTask(${taskItem.id})" class="btn btn-danger fs-4" id="${taskItem.id}"><i class="fa-regular fa-trash-can text-white"></i></button>
                               </div>
                           </div>
                       </li>
    `;
                tasksList.insertAdjacentHTML("beforeend", taskLiElement);
            }
        }
    }
}

const updateTaskStatus = (element) => {
    const newStatus = element.checked ? "completed" : "pending";
    for (const taskItem of tasksListArray) {
        if (element.id == taskItem.id) {
            taskItem.status = newStatus;
            break;
        };
    };
    setLocalStorage();
    displayTasks(filterMode);
}

const clearAll = () => {
    tasksListArray = [];
    setLocalStorage();
    displayTasks(filterMode);
}

const deleteTask = (id) = {
    //BURADA KALDIM. SIKINTI VAR.

}

const getFromLocalStorage = () => {
    tasksListArray = localStorage.getItem("tasks-list-js") == null ? [] : JSON.parse(localStorage.getItem("tasks-list-js"));
}

const setLocalStorage = () => {
    localStorage.setItem("tasks-list-js", JSON.stringify(tasksListArray));
}

const assignSpanClickEvents = () => {
    for (const span of filters) {
        span.addEventListener("click", () => {
            let activeSpan = document.querySelector('#filters span.text-primary');
            activeSpan.className = "";
            span.classList.add("text-primary");
            span.classList.add("fw-bold");
            filterMode = span.id;
            displayTasks(filterMode);
        });
    }
}

getFromLocalStorage();
displayTasks(filterMode);
assignSpanClickEvents();