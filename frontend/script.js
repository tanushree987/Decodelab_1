const API_URL = "http://127.0.0.1:5000/tasks";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// Load tasks when page opens
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task button
addBtn.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// =========================
// Load Tasks
// =========================
async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch tasks.");
        }

        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {

            const li = document.createElement("li");

            if (task.completed) {
                li.classList.add("completed");
            }

            // Task title
            const title = document.createElement("span");
            title.textContent = task.title;

            // Buttons container
            const actions = document.createElement("div");
            actions.className = "actions";

            // Complete Button
            const completeBtn = document.createElement("button");
            completeBtn.textContent = "✔";
            completeBtn.className = "done";

            completeBtn.addEventListener("click", () => {
                completeTask(task);
            });

            // Edit Button
            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit";

            editBtn.addEventListener("click", () => {
                editTask(task);
            });

            // Delete Button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete";

            deleteBtn.addEventListener("click", () => {
                deleteTask(task.id);
            });

            actions.appendChild(completeBtn);
            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(title);
            li.appendChild(actions);

            taskList.appendChild(li);
        });

    } catch (error) {
        console.error(error);
        alert("Cannot connect to the backend.");
    }
}

// =========================
// Add Task
// =========================
async function addTask() {

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add task.");
        }

        taskInput.value = "";

        loadTasks();

    } catch (error) {
        console.error(error);
        alert("Unable to add task.");
    }

}

// =========================
// Delete Task
// =========================
async function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed.");
        }

        loadTasks();

    } catch (error) {

        console.error(error);
        alert("Unable to delete task.");

    }

}

// =========================
// Complete Task
// =========================
async function completeTask(task) {

    try {

        const response = await fetch(`${API_URL}/${task.id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title: task.title,
                completed: !task.completed

            })

        });

        if (!response.ok) {
            throw new Error("Update failed.");
        }

        loadTasks();

    } catch (error) {

        console.error(error);
        alert("Unable to update task.");

    }

}

// =========================
// Edit Task
// =========================
async function editTask(task) {

    const newTitle = prompt("Edit Task", task.title);

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${task.id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                title: newTitle.trim(),
                completed: task.completed

            })

        });

        if (!response.ok) {
            throw new Error("Update failed.");
        }

        loadTasks();

    } catch (error) {

        console.error(error);
        alert("Unable to edit task.");

    }

}