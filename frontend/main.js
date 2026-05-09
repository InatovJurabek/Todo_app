import { handleAddTask } from "./handlers/taskHandlers.js";
import { initVoiceRecognition } from "./features/voice.js";
import { renderTasks } from "./scripts/api.js";
import { launchConfetti } from "./features/animation.js";

document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("todo-input");
  const addTaskBtn = document.getElementById("add-btn");
  const voiceBtn = document.getElementById("speakBtn");
  const taskList = document.getElementById("task-list");

  renderTasks();

  addTaskBtn.addEventListener("click", (e) => {
    handleAddTask(e, taskInput);
  });

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleAddTask(e, taskInput);
    }
  });

  initVoiceRecognition(voiceBtn, taskInput);
});
