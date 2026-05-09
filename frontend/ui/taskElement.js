import { saveTasks } from "../storage/localStorage.js";
import { deleteAnimation } from "../features/animation.js";

export function createTaskElement(
  text,
  checked = false,
  id = null,
  callbacks = {},
) {
  const li = document.createElement("li");
  if (id !== null) {
    li.dataset.id = id;
  }

  li.innerHTML = `
    <input type="checkbox" class="task-checkbox" ${checked ? "checked" : ""}>
    <span class="task-text">${text}</span>

    <div class="task-buttons">
      <button class="edit-btn" type="button">
        <i data-lucide="pencil"></i>
      </button>

      <button class="delete-btn" type="button">
        <i data-lucide="trash"></i>
      </button>
    </div>
  `;

  setupTaskEvents(li, callbacks);

  return li;
}

function setupTaskEvents(li, callbacks) {
  const deleteBtn = li.querySelector(".delete-btn");
  const editBtn = li.querySelector(".edit-btn");
  const checkbox = li.querySelector(".task-checkbox");

  deleteBtn.addEventListener("click", async () => {
    if (callbacks.onDelete) {
      const deleted = await callbacks.onDelete();
      if (!deleted) return;
    }

    deleteAnimation(li, () => {
      li.remove();
      saveTasks();
    });
  });

  editBtn.addEventListener("click", async () => {
    const span = li.querySelector(".task-text");
    const newText = prompt("Edit task:", span.textContent);

    if (newText !== null) {
      const trimmedText = newText.trim();
      if (callbacks.onEdit) {
        const updated = await callbacks.onEdit(trimmedText);
        if (!updated) return;
      }

      span.textContent = trimmedText;
      saveTasks();
    }
  });

  checkbox.addEventListener("change", async (event) => {
    const completed = event.target.checked;

    if (callbacks.onToggle) {
      const updated = await callbacks.onToggle(completed);
      if (!updated) {
        checkbox.checked = !completed;
        return;
      }
    }

    saveTasks();
  });
}
