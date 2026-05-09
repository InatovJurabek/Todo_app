import { handleAddTask } from "./handlers/taskHandlers.js";
import { initVoiceRecognition } from "./features/voice.js";
import { renderTasks } from "./scripts/api.js";
import { launchConfetti } from "./features/animation.js";

// Detect page reloads and API calls
console.log("[DEBUG] main.js loaded at:", new Date().toLocaleTimeString());

// Track if page was reloaded
if (performance.navigation.type === 1) {
  console.warn("[DEBUG] Page was reloaded!");
}

// Intercept all fetch calls to see what's happening
const originalFetch = window.fetch;
window.fetch = function (...args) {
  console.log("[DEBUG] FETCH:", args[0], args[1]?.method || "GET");
  return originalFetch
    .apply(this, args)
    .then((response) => {
      console.log("[DEBUG] FETCH RESPONSE:", args[0], response.status);
      return response;
    })
    .catch((error) => {
      console.error("[DEBUG] FETCH ERROR:", args[0], error);
      throw error;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  console.log("[DEBUG] DOMContentLoaded fired");

  const taskInput = document.getElementById("todo-input");
  const addTaskBtn = document.getElementById("add-btn");
  const voiceBtn = document.getElementById("speakBtn");
  const taskList = document.getElementById("task-list");

  renderTasks();

  addTaskBtn.addEventListener("click", (e) => {
    console.log("[DEBUG] Add button clicked");
    e.preventDefault();
    e.stopPropagation();
    handleAddTask(e, taskInput);
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      console.log("[DEBUG] Enter key pressed");
      e.preventDefault();
      handleAddTask(e, taskInput);
    }
  });

  initVoiceRecognition(voiceBtn, taskInput);
});

// Monitor for unload/beforeunload
window.addEventListener("beforeunload", () => {
  console.warn("[DEBUG] Page is about to unload/refresh!");
});

// Prevent any accidental form submissions
document.addEventListener(
  "submit",
  (e) => {
    console.error("[DEBUG] Form submission detected! Preventing...");
    e.preventDefault();
    e.stopPropagation();
  },
  true,
);
