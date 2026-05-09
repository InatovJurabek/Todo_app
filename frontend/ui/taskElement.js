import { deleteAnimation } from "../features/animation.js";
import { showSuccessToast } from "../utils/toast.js";
import { launchConfetti } from "../features/animation.js";

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
      <button class="edit-btn" type="button" aria-label="Edit task">
        <i data-lucide="pencil"></i>
      </button>

      <button class="delete-btn" type="button" aria-label="Delete task">
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

  deleteBtn.addEventListener("click", async (e) => {
    console.log("[DEBUG] Delete button clicked");
    e.preventDefault();
    e.stopPropagation();

    if (callbacks.onDelete) {
      console.log("[DEBUG] Calling onDelete callback");
      const deleted = await callbacks.onDelete();
      console.log("[DEBUG] onDelete returned:", deleted);
      if (!deleted) return;
    }

    console.log("[DEBUG] Starting delete animation");
    deleteAnimation(li, () => {
      console.log("[DEBUG] Delete animation complete, removing element");
      li.remove();
      
      // Check if all tasks are deleted
      const taskList = document.getElementById("task-list");
      const remainingTasks = taskList.querySelectorAll("li").length;
      
      if (remainingTasks === 0) {
        showSuccessToast("✓ Barcha tasklarni muvaffaqiyatli o'chirdingiz!");
      } else {
        showSuccessToast("✓ Task o'chirildi");
      }
    });
  });

  editBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const span = li.querySelector(".task-text");
    const newText = prompt("Task nomini tahrirlash:", span.textContent);

    if (newText !== null) {
      const trimmedText = newText.trim();
      if (trimmedText === "") {
        showSuccessToast("❌ Task nomi bo'sh bo'lishi mumkin emas!");
        return;
      }
      if (callbacks.onEdit) {
        const updated = await callbacks.onEdit(trimmedText);
        if (!updated) return;
      }

      span.textContent = trimmedText;
      showSuccessToast("✓ Task muvaffaqiyatli tahrirlandi");
    }
  });

  checkbox.addEventListener("change", async (event) => {
    console.log("[DEBUG] Checkbox changed, checked:", event.target.checked);
    event.stopPropagation();
    const completed = event.target.checked;

    if (callbacks.onToggle) {
      console.log(
        "[DEBUG] Calling onToggle callback with completed:",
        completed,
      );
      const updated = await callbacks.onToggle(completed);
      console.log("[DEBUG] onToggle returned:", updated);
      if (!updated) {
        console.log("[DEBUG] onToggle failed, reverting checkbox");
        checkbox.checked = !completed;
        return;
      }
    }

    // Check if all tasks are completed
    const taskList = document.getElementById("task-list");
    const allCheckboxes = taskList.querySelectorAll(".task-checkbox");
    const allCompleted = Array.from(allCheckboxes).every((cb) => cb.checked);

    if (allCompleted && allCheckboxes.length > 0) {
      console.log("[DEBUG] All tasks completed!");
      showSuccessToast(
        "🎉 Siz barcha tasklarni bajardingiz! Tabriklayman!",
      );
      setTimeout(() => {
        launchConfetti();
      }, 500);
    }

    console.log("[DEBUG] Checkbox update complete");
  });
}
