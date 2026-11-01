// ==================== STATE MANAGEMENT ====================
let user = JSON.parse(localStorage.getItem('sp_user')) || null;
let tasks = JSON.parse(localStorage.getItem('sp_tasks')) || [];
let subjects = JSON.parse(localStorage.getItem('sp_subjects')) || ['Mathematics', 'Physics', 'Chemistry'];
let timetable = JSON.parse(localStorage.getItem('sp_timetable')) || [];
let resources = JSON.parse(localStorage.getItem('sp_resources')) || [];

// Save to LocalStorage
function saveData() {
    localStorage.setItem('sp_user', JSON.stringify(user));
    localStorage.setItem('sp_tasks', JSON.stringify(tasks));
    localStorage.setItem('sp_subjects', JSON.stringify(subjects));
    localStorage.setItem('sp_timetable', JSON.stringify(timetable));
    localStorage.setItem('sp_resources', JSON.stringify(resources));
    updateStats();
}

// ==================== AUTHENTICATION LOGIC ====================
function handleLogin(e) {
    e.preventDefault();
    user = {
        name: document.getElementById('login-name').value.trim(),
        course: document.getElementById('login-course').value.trim(),
        prn: document.getElementById('login-prn').value.trim(),
        email: document.getElementById('login-email').value.trim()
    };

    saveData();
    checkAuth();
}

function handleLogout() {
    localStorage.removeItem('sp_user');
    user = null;
    checkAuth();
}

function checkAuth() {
    const authModal = document.getElementById('auth-modal');
    const appContainer = document.getElementById('app-container');

    if (user) {
        authModal.classList.add('hidden');
        appContainer.classList.remove('hidden');

        // Render User Info in Dashboard Header
        document.getElementById('welcome-heading').innerText = `Good day, ${user.name} 👋`;
        document.getElementById('profile-btn-label').innerText = user.name;
        document.getElementById('modal-user-name').innerText = user.name;
        document.getElementById('modal-user-email').innerText = user.email;
        document.getElementById('modal-user-course').innerText = user.course;
        document.getElementById('modal-user-prn').innerText = user.prn;
    } else {
        authModal.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
}

// ==================== NAVIGATION TAB SWITCHER ====================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) activeTab.classList.remove('hidden');

    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) activeNav.classList.add('active');
}

// ==================== DARK MODE TOGGLE ====================
function toggleDarkMode() {
    const body = document.getElementById('body');
    const themeBtn = document.getElementById('theme-btn');
    
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeBtn.innerHTML = `<i class="fa-solid fa-sun text-amber-400"></i> Light Mode`;
    } else {
        themeBtn.innerHTML = `<i class="fa-solid fa-moon text-amber-500"></i> Dark Mode`;
    }
}

// ==================== TASKS CONTROLLER ====================
function renderTasks() {
    const listFullContainer = document.getElementById('tasks-list-full');

    if (tasks.length === 0) {
        listFullContainer.innerHTML = `<p class="text-gray-400 text-sm italic py-4">Add your first study task!</p>`;
        return;
    }

    const html = tasks.map((task, index) => `
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})" class="w-5 h-5 accent-blue-600 rounded cursor-pointer">
                <span class="${task.completed ? 'line-through text-gray-400' : 'font-medium'}">${task.title}</span>
                ${task.subject ? `<span class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-md">${task.subject}</span>` : ''}
            </div>
            <div class="flex items-center gap-3">
                ${task.date ? `<span class="text-xs text-gray-400"><i class="fa-regular fa-calendar"></i> ${task.date}</span>` : ''}
                <button onclick="deleteTask(${index})" class="text-red-400 hover:text-red-600 transition">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </div>
        </div>
    `).join('');

    listFullContainer.innerHTML = html;
}

function addTask(e) {
    e.preventDefault();
    const titleInput = document.getElementById('task-input');
    const subjectSelect = document.getElementById('task-subject-select');
    const dateInput = document.getElementById('task-date');

    tasks.push({
        title: titleInput.value.trim(),
        subject: subjectSelect.value,
        date: dateInput.value,
        completed: false
    });

    titleInput.value = '';
    dateInput.value = '';
    saveData();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveData();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveData();
    renderTasks();
}

// ==================== SUBJECTS CONTROLLER ====================
function renderSubjects() {
    const select = document.getElementById('task-subject-select');
    const list = document.getElementById('subjects-list');

    // Populate dropdown selection
    select.innerHTML = `<option value="">No subject</option>` + 
        subjects.map(s => `<option value="${s}">${s}</option>`).join('');

    if (subjects.length === 0) {
        list.innerHTML = `<p class="text-gray-400 text-sm italic col-span-3">Add subjects to organise your tasks.</p>`;
        return;
    }

    // Fixed contrast: White background and dark font for light theme
    list.innerHTML = subjects.map((subj, idx) => `
        <div class="subject-card p-4 rounded-xl flex justify-between items-center shadow-sm">
            <span class="font-semibold text-base">${subj}</span>
            <button onclick="deleteSubject(${idx})" class="text-red-400 hover:text-red-600">
                <i class="fa-solid fa-trash text-sm"></i>
            </button>
        </div>
    `).join('');
}

function addSubject(e) {
    e.preventDefault();
    const input = document.getElementById('subject-input');
    if (input.value.trim() && !subjects.includes(input.value.trim())) {
        subjects.push(input.value.trim());
        input.value = '';
        saveData();
        renderSubjects();
    }
}

function deleteSubject(index) {
    subjects.splice(index, 1);
    saveData();
    renderSubjects();
}

// ==================== TIMETABLE CONTROLLER ====================
function renderTimetable() {
    const list = document.getElementById('timetable-list');
    if (timetable.length === 0) {
        list.innerHTML = `<p class="text-gray-400 text-sm italic">No slots scheduled yet.</p>`;
        return;
    }

    list.innerHTML = timetable.map((slot, idx) => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
                <span class="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2.5 py-1 rounded-lg">
                    ${slot.from} - ${slot.to}
                </span>
                <span class="font-medium">${slot.title}</span>
            </div>
            <button onclick="deleteTimetableSlot(${idx})" class="text-red-400 hover:text-red-600">
                <i class="fa-solid fa-trash text-sm"></i>
            </button>
        </div>
    `).join('');
}

function addTimetableSlot(e) {
    e.preventDefault();
    const from = document.getElementById('time-from').value;
    const to = document.getElementById('time-to').value;
    const title = document.getElementById('slot-title').value.trim();

    timetable.push({ from, to, title });
    document.getElementById('slot-title').value = '';
    saveData();
    renderTimetable();
}

function deleteTimetableSlot(index) {
    timetable.splice(index, 1);
    saveData();
    renderTimetable();
}

// ==================== RESOURCES CONTROLLER (WITH VIEW OPTION) ====================
function renderResources() {
    const list = document.getElementById('resources-list');
    if (resources.length === 0) {
        list.innerHTML = `<p class="text-gray-400 text-sm italic col-span-2">No resource links added yet.</p>`;
        return;
    }

    list.innerHTML = resources.map((res, idx) => `
        <div class="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex justify-between items-center gap-3">
            <div class="truncate">
                <h4 class="font-semibold truncate">${res.name}</h4>
                <a href="${res.url}" target="_blank" class="text-xs text-blue-500 hover:underline truncate block">${res.url}</a>
            </div>
            <div class="flex items-center gap-2">
                <a href="${res.url}" target="_blank" class="bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition">
                    <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i> View
                </a>
                <button onclick="deleteResource(${idx})" class="text-red-400 hover:text-red-600 p-1">
                    <i class="fa-solid fa-trash text-sm"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function addResource(e) {
    e.preventDefault();
    const name = document.getElementById('resource-name').value.trim();
    const url = document.getElementById('resource-url').value.trim();

    resources.push({ name, url });
    document.getElementById('resource-name').value = '';
    document.getElementById('resource-url').value = '';
    saveData();
    renderResources();
}

function deleteResource(index) {
    resources.splice(index, 1);
    saveData();
    renderResources();
}

// ==================== STATS CALCULATOR ====================
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    document.getElementById('stat-completed-count').innerText = completed;
    document.getElementById('stat-total-count').innerText = total;
    document.getElementById('stat-subject-count').innerText = subjects.length;
    document.getElementById('stat-session-count').innerText = timetable.length;
    document.getElementById('stat-progress-percent').innerText = `${percent}%`;
    document.getElementById('progress-bar').style.width = `${percent}%`;
    
    const taskBadge = document.getElementById('task-badge');
    if (taskBadge) taskBadge.innerText = `${total} tasks`;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    renderTasks();
    renderSubjects();
    renderTimetable();
    renderResources();
    updateStats();
});