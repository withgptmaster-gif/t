const memoTextarea = document.getElementById('memo');
const statusDiv = document.getElementById('status');
const memoList = document.getElementById('memo-list');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

const MEMOS_KEY = 'memos_data';
const OLD_KEY = 'simple_memo_content';

let memos = [];
let currentMemoId = null;
let timeoutId;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMemos();

    // Migration check
    const oldContent = localStorage.getItem(OLD_KEY);
    if (oldContent && memos.length === 0) {
        createMemo(oldContent);
        localStorage.removeItem(OLD_KEY); // Cleanup
    } else if (memos.length === 0) {
        createMemo(''); // Start with one empty memo
    }

    // Select first memo if none selected
    if (!currentMemoId && memos.length > 0) {
        selectMemo(memos[0].id);
    }

    renderApp();
});

// Memo Logic
function createMemo(initialContent = '') {
    const newMemo = {
        id: Date.now(),
        content: initialContent,
        updatedAt: Date.now()
    };
    memos.unshift(newMemo); // Add to top
    selectMemo(newMemo.id);
    saveMemosToStorage();
}

function selectMemo(id) {
    currentMemoId = id;
    const memo = memos.find(m => m.id === id);
    if (memo) {
        memoTextarea.value = memo.content;
    }
    renderApp();
}

function updateCurrentMemo(content) {
    const memo = memos.find(m => m.id === currentMemoId);
    if (memo) {
        memo.content = content;
        memo.updatedAt = Date.now();
        // Move to top
        memos = memos.filter(m => m.id !== currentMemoId);
        memos.unshift(memo);

        saveMemosToStorage();
        renderNoteList(); // Re-render list to show updated preview/order
    }
}

function deleteCurrentMemo() {
    if (confirm('정말로 이 메모를 삭제하시겠습니까?')) {
        memos = memos.filter(m => m.id !== currentMemoId);
        saveMemosToStorage();

        if (memos.length === 0) {
            createMemo('');
        } else {
            selectMemo(memos[0].id);
        }
    }
}

function saveMemosToStorage() {
    localStorage.setItem(MEMOS_KEY, JSON.stringify(memos));
}

function loadMemos() {
    const saved = localStorage.getItem(MEMOS_KEY);
    if (saved) {
        try {
            memos = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load memos', e);
            memos = [];
        }
    }
}

// UI Rendering
function renderApp() {
    renderNoteList();
}

function renderNoteList() {
    memoList.innerHTML = '';
    memos.forEach(memo => {
        const li = document.createElement('li');
        li.className = `memo-item ${memo.id === currentMemoId ? 'active' : ''}`;

        let preview = memo.content.trim().split('\n')[0] || '새로운 메모';
        if (preview.length > 20) preview = preview.substring(0, 20) + '...';

        const date = new Date(memo.updatedAt).toLocaleDateString();

        li.innerHTML = `
            <div class="title">${preview}</div>
            <span class="date">${date}</span>
        `;

        li.addEventListener('click', () => selectMemo(memo.id));
        memoList.appendChild(li);
    });
}

// Event Listeners
memoTextarea.addEventListener('input', () => {
    updateCurrentMemo(memoTextarea.value);

    // Status visual
    statusDiv.textContent = '저장됨';
    statusDiv.classList.add('show');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 1000);
});

addBtn.addEventListener('click', () => {
    createMemo('');
    memoTextarea.focus();
});

deleteBtn.addEventListener('click', deleteCurrentMemo);

saveBtn.addEventListener('click', () => {
    // Explicit save visual feedback (it's already saved by input)
    updateCurrentMemo(memoTextarea.value);
    statusDiv.textContent = '저장됨';
    statusDiv.classList.add('show');

    saveBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        saveBtn.style.transform = '';
    }, 100);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 1000);
});
