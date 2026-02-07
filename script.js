const memo = document.getElementById('memo');
const statusDiv = document.getElementById('status');
const STORAGE_KEY = 'simple_memo_content';

// Load saved content
document.addEventListener('DOMContentLoaded', () => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
        memo.value = savedContent;
    }
    memo.focus();
});

// Save content with debounce status
let timeoutId;

memo.addEventListener('input', () => {
    localStorage.setItem(STORAGE_KEY, memo.value);

    // Show "Saved" status
    statusDiv.textContent = '저장됨';
    statusDiv.classList.add('show');

    // Clear previous timeout to keep "Saved" visible while typing
    clearTimeout(timeoutId);

    // Hide status after 1 second of inactivity
    timeoutId = setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 1000);
});

// Manual Save Button
const saveBtn = document.getElementById('save-btn');
saveBtn.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, memo.value);

    statusDiv.textContent = '저장됨';
    statusDiv.classList.add('show');

    // Animate button for feedback
    saveBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        saveBtn.style.transform = '';
    }, 100);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 1000);
});
