import { postTask, updateTask, deleteTask } from "../scripts/api.js";
import { createTaskElement } from "../ui/taskElement.js";
import { showSuccessToast } from "../utils/toast.js";
export const handleAddTask = async (event, taskInput) => {
  if (event && event.preventDefault) {
    event.preventDefault();
  }

  const taskText = taskInput.value.trim();

  if (!taskText) return;

  const createdTask = await postTask(taskText);
  if (!createdTask) return;

  const taskList = document.getElementById("task-list");
  const li = createTaskElement(
    createdTask.title,
    createdTask.completed,
    createdTask.id,
    {
      onEdit: async (newText) =>
        await updateTask(createdTask.id, { title: newText }),
      onDelete: async () => await deleteTask(createdTask.id),
      onToggle: async (completed) =>
        await updateTask(createdTask.id, { completed }),
    },
  );

  taskList.prepend(li);
  showSuccessToast("✓ Task qo'shildi");
  taskInput.value = "";
};
