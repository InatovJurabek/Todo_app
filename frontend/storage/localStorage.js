const STORAGE_KEY = "todo_tasks";

export function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTasks() {
  const tasks = [];

  document.querySelectorAll("#task-list li").forEach((li) => {
    tasks.push({
      text: li.querySelector(".task-text").textContent,
      checked: li.querySelector(".task-checkbox").checked,
    });
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
