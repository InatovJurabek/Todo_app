/**
 * Show a toast notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification: 'success', 'error', 'info'
 * @param {number} duration - How long to show the notification in milliseconds (default: 3000)
 */
export function showToast(message, type = "info", duration = 3) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  if (!toast || !toastMessage) {
    console.error("Toast elements not found in DOM");
    return;
  }

  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, duration);
}

export function showSuccessToast(message, duration = 3000) {
  showToast(message, "success", duration);
}

export function showErrorToast(message, duration = 3000) {
  showToast(message, "error", duration);
}

export function showInfoToast(message, duration = 3000) {
  showToast(message, "info", duration);
}
