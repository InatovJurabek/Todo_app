document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("todo-input");
  const addTaskBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");
    const voiceBtn = document.getElementById("speakBtn");

  const addTask = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if(!taskText){
      return;
    }
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="task-checkbox">
    <span>${taskText}</span>
    <div class="task-buttons">
        <button class="edit-btn"><i data-lucide="pencil"></i></button>
        <button class="delete-btn"><i data-lucide="trash"></i></button>
    </div>
    `;
    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", () => {
      li.remove();
    });
    editBtn.addEventListener("click", () => {
        const newTaskText = prompt("Edit your task:", taskText);
        if(newTaskText !== null){
            li.querySelector("span").textContent = newTaskText.trim();
        }
    });
    taskList.appendChild(li);
    lucide.createIcons();
    taskInput.value = "";
    toggleeEmptyState();
    };
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (event) => {
        if(event.key === "Enter"){
            addTask(event);
        }
    });
    voiceBtn.addEventListener("click", () => {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
            const transcript = event
            .results[0][0]
            .transcript.trim();
            taskInput.value = transcript;
            addTask({ preventDefault: () => {} });
        };
        recognition.start();
    });
    const saveTasks = () => {
      const tasks = [];

      document.querySelectorAll("#task-list li").forEach((li) => {
        const text = li.querySelector("span").textContent;
        const completed = li.querySelector(".task-checkbox").checked;

        tasks.push({ text, completed });
      });

      localStorage.setItem("tasks", JSON.stringify(tasks));
    };
});

