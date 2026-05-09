import { createTaskElement } from "../ui/taskElement.js";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const API_CONFIG = {
  GET: API_BASE_URL + "todos/",
  POST: API_BASE_URL + "todos/",
  UPDATE: (id) => API_BASE_URL + "todos/" + id + "/",
};

export async function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  const response = await fetch(API_CONFIG.GET);
  if (!response.ok) {
    console.error("Failed to load tasks", response.status);
    return;
  }

  const data = await response.json();

  data.forEach((item) => {
    const li = createTaskElement(item.title, item.completed, item.id, {
      onEdit: async (newText) => await updateTask(item.id, { title: newText }),
      onDelete: async () => await deleteTask(item.id),
      onToggle: async (completed) => await updateTask(item.id, { completed }),
    });
    taskList.appendChild(li);
  });
  lucide.createIcons();
}

export async function postTask(title) {
  const response = await fetch(API_CONFIG.POST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, completed: false }),
  });

  if (!response.ok) {
    console.error("Failed to save task", response.status);
    return null;
  }

  return response.json();
}

export async function updateTask(id, updates) {
  const response = await fetch(API_CONFIG.UPDATE(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    console.error("Failed to update task", response.status);
    return null;
  }

  return response.json();
}

export async function deleteTask(id) {
  const response = await fetch(API_CONFIG.UPDATE(id), {
    method: "DELETE",
  });

  if (!response.ok) {
    console.error("Failed to delete task", response.status);
    return false;
  }

  return true;
}
