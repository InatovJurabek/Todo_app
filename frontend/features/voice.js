export function initVoiceRecognition(voiceBtn, taskInput) {
  voiceBtn.addEventListener("click", () => {
    voiceBtn.classList.add("active");

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "uz-UZ";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();

      taskInput.value = transcript;
    };

    recognition.start();

    recognition.onend = () => {
      voiceBtn.classList.remove("active");
    };
  });
}
