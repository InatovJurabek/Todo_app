document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("todo-input");
  const addTaskBtn = document.getElementById("add-btn");
  const taskList = document.getElementById("task-list");
  const voiceBtn = document.getElementById("speakBtn");

  const addTask = (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (!taskText) {
      return;
    }
    const li = document.createElement("li");
    li.innerHTML = `
    <input type="checkbox" class="task-checkbox">
    <span class="task-text">${taskText}</span>
    <div class="task-buttons">
        <button class="edit-btn"><i data-lucide="pencil"></i></button>
        <button class="delete-btn"><i data-lucide="trash"></i></button>
    </div>
    `;

    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", () => {
       anime({
         targets: li,
         translateX: [0, 60],
         opacity: [1, 0],
         duration: 300,
         easing: "easeInQuad",
         complete: () => {
           li.remove();
           saveTasks();
           if (typeof toggleeEmptyState === "function") {
             toggleeEmptyState();
           }
         },
       });
    });
    editBtn.addEventListener("click", () => {
      const newTaskText = prompt("Edit your task:", taskText);
      if (newTaskText !== null) {
        li.querySelector("span").textContent = newTaskText.trim();
      }
    });
    taskList.prepend(li);

    anime({
      targets: li,
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 500,
      easing: "easeOutQuad",
    });
    lucide.createIcons();
    taskInput.value = "";
    toggleeEmptyState();
  };
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask(event);
    }
  });
  voiceBtn.addEventListener("click", () => {
    voiceBtn.classList.add("active");
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      taskInput.value = transcript;
      addTask({ preventDefault: () => {} });
    };
    recognition.start();
    recognition.onend = () => {
      voiceBtn.classList.remove("active");
    };
  });
});
(function () {
  const STORAGE_KEY = "todo_tasks";
  function getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  }
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#task-list li").forEach((li) => {
      tasks.push({
        text: li.querySelector("span").textContent,
        checked: li.querySelector(".task-checkbox").checked,
      });
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
  function createTaskElement(text, checked = false) {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${checked ? "checked" : ""}>
      <span class="task-text">${text}</span>
      <div class="task-buttons">
        <button class="edit-btn"><i data-lucide="pencil"></i></button>
        <button class="delete-btn"><i data-lucide="trash"></i></button>
      </div>
    `;
    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", () => {
      anime({
        targets: li,
        translateX: [0, 60],
        opacity: [1, 0],
        duration: 300,
        easing: "easeInQuad",
        complete: () => {
          li.remove();
          saveTasks();
          if (typeof toggleeEmptyState === "function") {
            toggleeEmptyState();
          }
        },
      });
    });

    editBtn.addEventListener("click", () => {
      const currentText = li.querySelector("span").textContent;
      const newText = prompt("Edit your task:", currentText);
      if (newText !== null) {
        li.querySelector("span").textContent = newText.trim();
        saveTasks();
      }
    });

    li.querySelector(".task-checkbox").addEventListener("change", () => {
      saveTasks();
      const allTasks = document.querySelectorAll("#task-list li");
      const allCompleted = [...allTasks].every(
        (li) => li.querySelector(".task-checkbox").checked,
      );

      if (allCompleted && allTasks.length > 0) {
        launchConfetti();
      }
    });

    return li;
  }
  document.addEventListener("DOMContentLoaded", () => {
    console.log("Loading tasks from localStorage...");
    const taskList = document.getElementById("task-list");
    const tasks = getTasks();

    tasks.forEach(({ text, checked }) => {
      const li = createTaskElement(text, checked);
      taskList.appendChild(li);
    });

    if (typeof lucide !== "undefined") lucide.createIcons();
    if (typeof toggleeEmptyState === "function") toggleeEmptyState();
    const observer = new MutationObserver(() => {
      saveTasks();
    });

    observer.observe(taskList, { childList: true, subtree: false });
  });

  function launchConfetti() {
    const container = document.getElementById("confetti-container");
    container.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;";
    container.appendChild(canvas);

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const ctx = canvas.getContext("2d");

    const colors = [
      "#ff6b6b",
      "#ffd93d",
      "#6bcb77",
      "#4d96ff",
      "#c77dff",
      "#ff9f43",
      "#48dbfb",
    ];
    const shapes = ["rect", "circle", "line"];
    const particles = [];

    for (let i = 0; i < 800; i++) {
      const fromLeft = Math.random() < 0.5;
      const angle = fromLeft
        ? ((Math.random() * 60 - 10) * Math.PI) / 180
        : Math.PI - ((Math.random() * 60 - 10) * Math.PI) / 180;
      const speed = 4 + Math.random() * 5;
      particles.push({
        x: fromLeft ? -6 : W + 6,
        y: H * (0.1 + Math.random() * 0.8),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (2 + Math.random() * 2),
        gravity: 0.12 + Math.random() * 0.08,
        wind: (Math.random() - 0.5) * 0.08,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        w: 5 + Math.random() * 5,
        h: 4 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        alpha: 1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.05 + Math.random() * 0.08,
      });
    }

    (function animate() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        p.vy += p.gravity;
        p.vx += p.wind;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.6;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > H + 10) p.alpha = 0;
        if (p.alpha <= 0) continue;
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        if (p.shape === "rect") ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, 0);
          ctx.lineTo(p.w / 2, 0);
          ctx.stroke();
        }
        ctx.restore();
      }
      if (alive) requestAnimationFrame(animate);
      else canvas.remove();
    })();
  }
})();
