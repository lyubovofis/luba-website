// Helper для сповіщень
function showNotification(message, type = 'success') {
    const div = document.createElement('div');
    const bg = type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-warning)';
    div.style.cssText = `position:fixed;top:20px;right:20px;background:${bg};color:white;padding:15px 25px;border-radius:12px;box-shadow:var(--shadow);z-index:10000;font-weight:600`;
    div.textContent = message;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}
