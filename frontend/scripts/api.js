import { createTaskElement } from "../ui/taskElement.js";
import { launchConfetti } from "../features/animation.js";
import { showSuccessToast, showInfoToast } from "../utils/toast.js";

const API_BASE_URL = "http://127.0.0.1:8000/api/";

const API_CONFIG = {
  GET: API_BASE_URL + "todos/",
  POST: API_BASE_URL + "todos/",
  UPDATE: (id) => API_BASE_URL + "todos/" + id + "/",
};

console.log("[API] Initialized with base URL:", API_BASE_URL);


export async function renderTasks() {
  console.log("[API] renderTasks() called");
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  try {
    const response = await fetch(API_CONFIG.GET);
    console.log("[API] GET response status:", response.status);

    if (!response.ok) {
      console.error("Failed to load tasks", response.status);
      return;
    }

    const data = await response.json();
    console.log("[API] Received tasks:", data);

    data.forEach((item) => {
      const li = createTaskElement(item.title, item.completed, item.id, {
        onEdit: async (newText) =>
          await updateTask(item.id, { title: newText }),
        onDelete: async () => await deleteTask(item.id),
        onToggle: async (completed) => await updateTask(item.id, { completed }),
      });
      taskList.appendChild(li);
    });

    // Check if all tasks are completed and show confetti
    if (data.length > 0 && data.every((item) => item.completed)) {
      console.log("[API] All tasks completed! Launching confetti...");
      showSuccessToast("🎉 Siz barcha tasklarni bajardingiz! Tabriklayman!");
      setTimeout(() => {
        launchConfetti();
      }, 300);
    }

    // Check if no tasks left
    if (data.length === 0) {
      console.log("[API] No tasks left");
    }

    lucide.createIcons();
  } catch (error) {
    console.error("[API] Error in renderTasks:", error);
  }
}

export async function postTask(title) {
  console.log("[API] postTask() called with title:", title);
  try {
    const response = await fetch(API_CONFIG.POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, completed: false }),
    });

    console.log("[API] POST response status:", response.status);

    if (!response.ok) {
      showInfoToast("✓ Yangi task qo'shildi");
      console.error("Failed to save task", response.status);
      return null;
    }
    const data = await response.json();
    console.log("[API] Created task:", data);
    return data;
  } catch (error) {
    console.error("[API] Error in postTask:", error);
    return null;
  }
}

export async function updateTask(id, updates) {
  console.log("[API] updateTask() called with id:", id, "updates:", updates);
  try {
    const response = await fetch(API_CONFIG.UPDATE(id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    console.log("[API] PATCH response status:", response.status);

    if (!response.ok) {
      console.error("Failed to update task", response.status);
      return null;
    }

    const data = await response.json();
    console.log("[API] Updated task:", data);
    return data;
  } catch (error) {
    console.error("[API] Error in updateTask:", error);
    return null;
  }
}

export async function deleteTask(id) {
  console.log("[API] deleteTask() called with id:", id);
  try {
    const response = await fetch(API_CONFIG.UPDATE(id), {
      method: "DELETE",
    });

    console.log("[API] DELETE response status:", response.status);

    if (!response.ok) {
      console.error("Failed to delete task", response.status);
      return false;
    }

    console.log("[API] Task deleted successfully");
    return true;
  } catch (error) {
    console.error("[API] Error in deleteTask:", error);
    return false;
  }
}
