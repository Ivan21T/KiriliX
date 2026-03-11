const adminData = {
    users: [],  // Започваме с празен масив
    articles: [],
    posts: []
};

// ================ СЪСТОЯНИЕ ================
let currentEditingArticleId = null;
let currentEditingUserId = null;
let currentAction = null;
let currentImageFile = null;

// Пагинация
const pagination = {
    users: { page: 1, pageSize: 10, total: 0 },
    articles: { page: 1, pageSize: 10, total: 0 },
    posts: { page: 1, pageSize: 10, total: 0 }
};

// ================ ИНИЦИАЛИЗАЦИЯ ================
document.addEventListener('DOMContentLoaded', async function() {
    initMobileMenu();
    initNavigation();
    initFileUpload();
    initPaginationControls();
    
    // Добавяме респонсив стилове за модалите
    addResponsiveModalStyles();
    
    // Първо зареждаме потребителите
    showAlert('Зареждане на потребители...', 'pending');
    adminData.users = await getUsers();
    
    // Зареждаме постовете
    showAlert('Зареждане на постове...', 'pending');
    adminData.posts = await getPosts();
    
    // След като имаме потребители, зареждаме останалото
    loadStatistics();
    loadUsers();
    loadArticles();
    loadPosts();
    
    showAlert('Данните са заредени успешно!', 'success');
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        if (confirm('Сигурни ли сте?')) {
            showAlert('Излизане от системата...', 'info');
            window.location.href = '#';
        }
    });
});

// ================ МОБИЛНО МЕНЮ ================
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

// ================ НАВИГАЦИЯ ================
function initNavigation() {
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    const sections = document.querySelectorAll('.admin-section');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(sectionId + '-section').classList.add('active');
            
            if (sectionId === 'add-article') {
                document.getElementById('articleFormTitle').textContent = 'Добави нова новина';
                clearArticleForm();
            }
        });
    });
}

// ================ API ФУНКЦИИ ================
async function getUsers() {
    try {
        const response = await fetch(`${API_CONFIG.ADMIN}/get-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        
        return users.map(user => ({
            id: user.id,
            username: user.username || 'Потребител',
            name: user.username || 'Потребител', // За обратна съвместимост
            email: user.email,
            role: user.role === 0 ? 'admin' : 'user',
            initials: (user.username || 'П').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'П'
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        showAlert('Грешка при зареждане на потребителите', 'error');
        return [];
    }
}

async function getPosts() {
    try {
        const response = await fetch(`${API_CONFIG.ADMIN}/get-posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        return posts;
    } catch (error) {
        console.error('Error fetching posts:', error);
        showAlert('Използват се примерни данни за постовете', 'info');
        return getSamplePosts();
    }
}

function getSamplePosts() {
    return [
        {
            id: 1,
            title: "Как да започнем с KiriliX?",
            content: "Пълно ръководство за начинаещи, които искат да научат основите на програмирането с KiriliX...",
            author: "Георги Петров",
            authorId: 1,
            createdAt: "2024-01-15",
            comments: 12,
            views: 345,
            status: "active"
        },
        {
            id: 2,
            title: "Нови функции в езика",
            content: "Представяме ви новите възможности в последната версия на KiriliX...",
            author: "Иван Иванов",
            authorId: 2,
            createdAt: "2024-01-20",
            comments: 8,
            views: 234,
            status: "active"
        },
        {
            id: 3,
            title: "Оптимизация на код с KiriliX",
            content: "Съвети и трикове за по-бърз и ефективен код...",
            author: "Мария Георгиева",
            authorId: 3,
            createdAt: "2024-01-25",
            comments: 15,
            views: 567,
            status: "active"
        },
        {
            id: 4,
            title: "Интеграция с популярни API-та",
            content: "Как да свържем KiriliX с външни услуги...",
            author: "Петър Димитров",
            authorId: 4,
            createdAt: "2024-01-28",
            comments: 5,
            views: 123,
            status: "active"
        },
        {
            id: 5,
            title: "Създаване на игри с KiriliX",
            content: "Въведение в гейм разработката с нашия език...",
            author: "Николай Стоянов",
            authorId: 5,
            createdAt: "2024-01-30",
            comments: 23,
            views: 789,
            status: "active"
        }
    ];
}

// ================ РЕСПОНСИВ МОДАЛНИ СТИЛОВЕ ================
function addResponsiveModalStyles() {
    if (document.getElementById('responsiveModalStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'responsiveModalStyles';
    style.textContent = `
        /* Основни модални стилове */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            padding: 20px;
            overflow-y: auto;
        }
        
        .modal-overlay.active {
            display: flex;
        }
        
        .modal-window {
            background: var(--bg-darker);
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(0, 255, 157, 0.2);
            width: 100%;
            max-width: 500px;
            margin: auto;
            animation: modalSlideIn 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(0, 255, 157, 0.1);
        }
        
        .modal-header h3 {
            color: var(--neon-green);
            font-size: 1.3rem;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-close-btn {
            background: none;
            border: none;
            color: #b0b0d0;
            font-size: 24px;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-close-btn:hover {
            color: var(--neon-green);
            background: rgba(0, 255, 157, 0.1);
        }
        
        .modal-body {
            padding: 24px;
            max-height: calc(90vh - 120px);
            overflow-y: auto;
        }
        
        .modal-form-group {
            margin-bottom: 20px;
        }
        
        .modal-form-label {
            display: block;
            margin-bottom: 8px;
            color: #b0b0d0;
            font-size: 14px;
            font-weight: 500;
        }
        
        .modal-form-label i {
            color: var(--neon-green);
            margin-right: 8px;
            width: 20px;
        }
        
        .modal-form-control {
            width: 100%;
            padding: 12px 16px;
            font-size: 16px;
            border-radius: 8px;
            border: 1px solid rgba(0, 255, 157, 0.3);
            background: rgba(0, 0, 0, 0.3);
            color: #fff;
            transition: all 0.3s ease;
            box-sizing: border-box;
        }
        
        .modal-form-control:focus {
            border-color: var(--neon-green);
            outline: none;
            box-shadow: 0 0 0 3px rgba(0, 255, 157, 0.1);
        }
        
        .modal-form-control.error {
            border-color: #ff4444;
            animation: shake 0.3s ease;
        }
        
        .modal-select {
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2300ff9d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 16px;
            padding-right: 48px;
        }
        
        .password-hint {
            display: block;
            margin-top: 8px;
            font-size: 12px;
            color: #b0b0d0;
            line-height: 1.4;
        }
        
        .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
            flex-wrap: wrap;
        }
        
        .modal-btn {
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            min-width: 120px;
            border: none;
            font-weight: 500;
        }
        
        .modal-btn i {
            font-size: 18px;
        }
        
        .modal-btn-primary {
            background: var(--neon-green);
            color: var(--bg-darker);
        }
        
        .modal-btn-primary:hover {
            background: #00cc7d;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 255, 157, 0.3);
        }
        
        .modal-btn-outline {
            background: transparent;
            border: 1px solid var(--neon-green);
            color: var(--neon-green);
        }
        
        .modal-btn-outline:hover {
            background: rgba(0, 255, 157, 0.1);
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .modal-window {
                width: 95%;
            }
            
            .modal-header {
                padding: 16px 20px;
            }
            
            .modal-header h3 {
                font-size: 1.2rem;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                flex-direction: column;
                gap: 10px;
            }
            
            .modal-btn {
                width: 100%;
                margin: 0;
                padding: 14px 20px;
            }
            
            .modal-form-control {
                padding: 14px 16px;
                font-size: 16px;
            }
            
            .modal-close-btn {
                padding: 10px;
                font-size: 22px;
            }
        }
        
        @media (max-width: 480px) {
            .modal-overlay {
                padding: 0;
                align-items: flex-end;
            }
            
            .modal-window {
                width: 100%;
                max-width: none;
                border-radius: 20px 20px 0 0;
                animation: modalSlideUp 0.3s ease;
            }
            
            .modal-header {
                padding: 16px;
            }
            
            .modal-body {
                padding: 16px;
                max-height: 70vh;
            }
            
            .modal-form-group {
                margin-bottom: 16px;
            }
            
            .modal-footer {
                margin-top: 20px;
                gap: 8px;
            }
            
            .modal-btn {
                padding: 16px 20px;
                font-size: 16px;
            }
            
            .modal-btn i {
                font-size: 20px;
            }
            
            .password-hint {
                font-size: 11px;
            }
        }
        
        @media (max-width: 360px) {
            .modal-header h3 {
                font-size: 1rem;
            }
            
            .modal-header h3 i {
                font-size: 18px;
            }
            
            .modal-body {
                padding: 12px;
            }
            
            .modal-form-label {
                font-size: 13px;
            }
            
            .modal-form-control {
                padding: 12px 14px;
                font-size: 15px;
            }
        }
        
        /* Ландшафтна ориентация */
        @media (max-height: 600px) and (orientation: landscape) {
            .modal-window {
                max-height: 90vh;
            }
            
            .modal-body {
                max-height: 60vh;
            }
            
            .modal-form-group {
                margin-bottom: 12px;
            }
            
            .modal-form-control {
                padding: 10px 14px;
            }
            
            .modal-footer {
                margin-top: 16px;
            }
            
            .modal-btn {
                padding: 10px 16px;
            }
        }
        
        /* Анимации */
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes modalSlideUp {
            from {
                opacity: 0;
                transform: translateY(100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        /* Скрол бар */
        .modal-body::-webkit-scrollbar {
            width: 6px;
        }
        
        .modal-body::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }
        
        .modal-body::-webkit-scrollbar-thumb {
            background: var(--neon-green);
            border-radius: 3px;
        }
        
        .modal-body::-webkit-scrollbar-thumb:hover {
            background: #00cc7d;
        }
        
        /* Touch устройства */
        @media (hover: none) and (pointer: coarse) {
            .modal-btn:hover {
                transform: none;
            }
            
            .modal-btn:active {
                transform: scale(0.98);
            }
            
            .modal-close-btn {
                padding: 12px;
            }
            
            .modal-select {
                background-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ================ МОДАЛ ЗА РЕДАКТИРАНЕ НА ПОТРЕБИТЕЛ ================
function showEditUserModal(id) {
    const user = adminData.users?.find(u => u.id === id);
    if (!user) return;
    
    currentEditingUserId = id;
    
    let modalOverlay = document.getElementById('editUserModalOverlay');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'editUserModalOverlay';
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
                    <h3><i class="fas fa-user-edit"></i>Редактиране на потребител</h3>
                    <button class="modal-close-btn" onclick="closeEditUserModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form id="editUserModalForm" onsubmit="saveEditedUser(event)">
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editModalUsername">
                                <i class="fas fa-user"></i> Потребителско име
                            </label>
                            <input type="text" 
                                   id="editModalUsername" 
                                   class="modal-form-control" 
                                   placeholder="Въведете потребителско име"
                                   required 
                                   minlength="3" 
                                   maxlength="50"
                                   autocomplete="off">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editModalEmail">
                                <i class="fas fa-envelope"></i> Имейл
                            </label>
                            <input type="email" 
                                   id="editModalEmail" 
                                   class="modal-form-control" 
                                   placeholder="user@example.com"
                                   required 
                                   autocomplete="off">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editModalPassword">
                                <i class="fas fa-lock"></i> Нова парола
                            </label>
                            <input type="password" 
                                   id="editModalPassword" 
                                   class="modal-form-control" 
                                   placeholder="Оставете празно за да запазите старата"
                                   minlength="6"
                                   oninput="checkEditPasswordStrength(this.value)">
                            <small class="password-hint">Ако полето остане празно, паролата няма да се промени</small>
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editModalRole">
                                <i class="fas fa-shield-alt"></i> Роля
                            </label>
                            <select id="editModalRole" class="modal-form-control modal-select" required>
                                <option value="user">Потребител</option>
                                <option value="admin">Администратор</option>
                            </select>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="modal-btn modal-btn-outline" onclick="closeEditUserModal()">
                                <i class="fas fa-times"></i> <span>Отказ</span>
                            </button>
                            <button type="submit" class="modal-btn modal-btn-primary">
                                <i class="fas fa-save"></i> <span>Запази промените</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeEditUserModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeEditUserModal();
            }
        });
    }
    
    // Използваме username вместо name
    document.getElementById('editModalUsername').value = user.username || user.name;
    document.getElementById('editModalEmail').value = user.email;
    document.getElementById('editModalRole').value = user.role;
    document.getElementById('editModalPassword').value = '';
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('editModalUsername')?.focus();
    }, 100);
}

function closeEditUserModal() {
    const modalOverlay = document.getElementById('editUserModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        
        const form = document.getElementById('editUserModalForm');
        if (form) form.reset();
        
        document.body.style.overflow = '';
        currentEditingUserId = null;
    }
}

function checkEditPasswordStrength(password) {
    // Функцията може да се имплементира ако имате индикатор за сила на паролата
    if (!password) return;
}

async function saveEditedUser(event) {
    event.preventDefault();
    
    if (!currentEditingUserId) return;
    
    const usernameInput = document.getElementById('editModalUsername');
    const emailInput = document.getElementById('editModalEmail');
    const passwordInput = document.getElementById('editModalPassword');
    const roleSelect = document.getElementById('editModalRole');
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;
    
    let hasError = false;
    
    if (username.length < 3) {
        usernameInput.classList.add('error');
        showAlert('Потребителското име трябва да е поне 3 символа', 'error');
        hasError = true;
        setTimeout(() => usernameInput.classList.remove('error'), 500);
    }
    
    if (!isValidEmail(email)) {
        emailInput.classList.add('error');
        showAlert('Моля, въведете валиден имейл адрес', 'error');
        hasError = true;
        setTimeout(() => emailInput.classList.remove('error'), 500);
    }
    
    if (password && password.length < 6) {
        passwordInput.classList.add('error');
        showAlert('Паролата трябва да е поне 6 символа', 'error');
        hasError = true;
        setTimeout(() => passwordInput.classList.remove('error'), 500);
    }
    
    if (hasError) return;
    
    // Проверка за съществуващо потребителско име
    const existingUserWithSameName = adminData.users?.find(u => 
        u.id !== currentEditingUserId && (u.username || u.name).toLowerCase() === username.toLowerCase()
    );
    
    if (existingUserWithSameName) {
        usernameInput.classList.add('error');
        showAlert('Потребител с това име вече съществува', 'error');
        setTimeout(() => usernameInput.classList.remove('error'), 500);
        return;
    }
    
    // Проверка за съществуващ имейл
    const existingUserWithSameEmail = adminData.users?.find(u => 
        u.id !== currentEditingUserId && u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUserWithSameEmail) {
        emailInput.classList.add('error');
        showAlert('Потребител с този имейл вече съществува', 'error');
        setTimeout(() => emailInput.classList.remove('error'), 500);
        return;
    }
    
    showAlert('Запазване на промените...', 'pending');
    
    try {
        const updates = {};
        
        const originalUser = adminData.users.find(u => u.id === currentEditingUserId);
        const originalUsername = originalUser.username || originalUser.name;
        
        if (username !== originalUsername) {
            updates.username = username; // Изпращаме username вместо name
        }
        
        if (email !== originalUser.email) {
            updates.email = email;
        }
        
        if (password) {
            updates.password = password;
        }
        
        const roleValue = role === 'admin' ? 0 : 1;
        const originalRoleValue = originalUser.role === 'admin' ? 0 : 1;
        
        if (roleValue !== originalRoleValue) {
            updates.role = roleValue;
        }
        
        if (Object.keys(updates).length === 0) {
            showAlert('Няма промени за запазване', 'info');
            closeEditUserModal();
            return;
        }
        
        const response = await fetch(`${API_CONFIG.USER}/${currentEditingUserId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Грешка при редактиране на потребител');
        }
        
        const index = adminData.users.findIndex(u => u.id === currentEditingUserId);
        
        if (index !== -1) {
            // Обновяваме локалните данни
            adminData.users[index] = {
                ...adminData.users[index],
                ...(updates.username && { 
                    username: updates.username, 
                    name: updates.username // Запазваме и name за съвместимост
                }),
                ...(updates.email && { email: updates.email }),
                ...(updates.role !== undefined && { role: role }),
                initials: updates.username 
                    ? updates.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || updates.username.substring(0, 2).toUpperCase()
                    : adminData.users[index].initials
            };
        }
        
        loadUsers();
        loadStatistics();
        
        closeEditUserModal();
        showAlert(`Потребителят ${username} е обновен успешно!`, 'success');
        
    } catch (error) {
        console.error('Error updating user:', error);
        showAlert(error.message, 'error');
    }
}

// ================ МОДАЛ ЗА ДОБАВЯНЕ НА ПОТРЕБИТЕЛ ================
function showAddUserModal() {
    let modalOverlay = document.getElementById('addUserModalOverlay');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'addUserModalOverlay';
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
                    <h3><i class="fas fa-user-plus"></i>Нов потребител</h3>
                    <button class="modal-close-btn" onclick="closeAddUserModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form id="addUserModalForm" onsubmit="saveNewUser(event)">
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="modalUsername">
                                <i class="fas fa-user"></i> Потребителско име
                            </label>
                            <input type="text" 
                                   id="modalUsername" 
                                   class="modal-form-control" 
                                   placeholder="Въведете потребителско име"
                                   required 
                                   minlength="3" 
                                   maxlength="50"
                                   autocomplete="off">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="modalEmail">
                                <i class="fas fa-envelope"></i> Имейл
                            </label>
                            <input type="email" 
                                   id="modalEmail" 
                                   class="modal-form-control" 
                                   placeholder="user@example.com"
                                   required 
                                   autocomplete="off">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="modalPassword">
                                <i class="fas fa-lock"></i> Парола
                            </label>
                            <input type="password" 
                                   id="modalPassword" 
                                   class="modal-form-control" 
                                   placeholder="Минимум 6 символа"
                                   required 
                                   minlength="6"
                                   oninput="checkPasswordStrength(this.value)">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="modalRole">
                                <i class="fas fa-shield-alt"></i> Роля
                            </label>
                            <select id="modalRole" class="modal-form-control modal-select" required>
                                <option value="user">👤 Потребител</option>
                                <option value="admin">🛡️ Администратор</option>
                            </select>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="modal-btn modal-btn-outline" onclick="closeAddUserModal()">
                                <i class="fas fa-times"></i> <span>Отказ</span>
                            </button>
                            <button type="submit" class="modal-btn modal-btn-primary">
                                <i class="fas fa-save"></i> <span>Запази</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeAddUserModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeAddUserModal();
            }
        });
    }
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('modalUsername')?.focus();
    }, 100);
}

function closeAddUserModal() {
    const modalOverlay = document.getElementById('addUserModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        
        const form = document.getElementById('addUserModalForm');
        if (form) form.reset();
        
        document.body.style.overflow = '';
    }
}

function checkPasswordStrength(password) {
    // Функцията може да се имплементира ако имате индикатор за сила на паролата
    if (!password) return;
}

async function saveNewUser(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('modalUsername');
    const emailInput = document.getElementById('modalEmail');
    const passwordInput = document.getElementById('modalPassword');
    const roleSelect = document.getElementById('modalRole');
    
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;
    
    let hasError = false;
    
    if (username.length < 3) {
        usernameInput.classList.add('error');
        showAlert('Потребителското име трябва да е поне 3 символа', 'error');
        hasError = true;
        setTimeout(() => usernameInput.classList.remove('error'), 500);
    }
    
    if (!isValidEmail(email)) {
        emailInput.classList.add('error');
        showAlert('Моля, въведете валиден имейл адрес', 'error');
        hasError = true;
        setTimeout(() => emailInput.classList.remove('error'), 500);
    }
    
    if (password.length < 6) {
        passwordInput.classList.add('error');
        showAlert('Паролата трябва да е поне 6 символа', 'error');
        hasError = true;
        setTimeout(() => passwordInput.classList.remove('error'), 500);
    }
    
    if (hasError) return;
    
    // Проверка за съществуващо потребителско име
    if (adminData.users?.some(u => (u.username || u.name).toLowerCase() === username.toLowerCase())) {
        usernameInput.classList.add('error');
        showAlert('Потребител с това име вече съществува', 'error');
        setTimeout(() => usernameInput.classList.remove('error'), 500);
        return;
    }
    
    // Проверка за съществуващ имейл
    if (adminData.users?.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        emailInput.classList.add('error');
        showAlert('Потребител с този имейл вече съществува', 'error');
        setTimeout(() => emailInput.classList.remove('error'), 500);
        return;
    }
    
    showAlert('Създаване на потребител...', 'pending');
    
    try {
        const response = await fetch(`${API_CONFIG.ADMIN}/create-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, // Изпращаме username
                email: email,
                password: password,
                role: role === 'admin' ? 0 : 1
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Грешка при създаване на потребител');
        }
        
        const newUser = {
            id: result.id || (adminData.users?.length || 0) + 1,
            username: username,
            name: username, // За обратна съвместимост
            email: email,
            role: role,
            initials: username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || username.substring(0, 2).toUpperCase()
        };
        
        adminData.users = [newUser, ...(adminData.users || [])];
        
        pagination.users.page = 1;
        loadUsers();
        loadStatistics();
        
        closeAddUserModal();
        showAlert(`Потребителят ${username} е създаден успешно!`, 'success');
        
    } catch (error) {
        console.error('Error creating user:', error);
        showAlert(error.message, 'error');
    }
}

// ================ FILE UPLOAD ================
function initFileUpload() {
    const fileInput = document.getElementById('articleImage');
    const uploadArea = document.getElementById('fileUploadArea');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    
    if (!fileInput || !uploadArea) return;
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--neon-green)';
        uploadArea.style.background = 'rgba(0, 255, 157, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0, 255, 157, 0.3)';
        uploadArea.style.background = 'rgba(0, 255, 157, 0.03)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'rgba(0, 255, 157, 0.3)';
        uploadArea.style.background = 'rgba(0, 255, 157, 0.03)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        } else {
            showAlert('Моля, качете само изображения!', 'error');
        }
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file);
        }
    });
}

function handleImageFile(file) {
    if (file.size > 5 * 1024 * 1024) {
        showAlert('Файлът е твърде голям! Максимален размер: 5MB', 'error');
        return;
    }
    
    currentImageFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imagePreview');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const uploadArea = document.getElementById('fileUploadArea');
        
        preview.src = e.target.result;
        preview.classList.add('active');
        previewContainer.style.display = 'block';
        uploadArea.style.display = 'none';
        showAlert('Изображението е качено успешно!', 'success');
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageFile = null;
    document.getElementById('articleImage').value = '';
    document.getElementById('imagePreview').classList.remove('active');
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('fileUploadArea').style.display = 'flex';
    showAlert('Изображението е премахнато', 'info');
}

// ================ ПАГИНАЦИЯ ================
function initPaginationControls() {
    const usersPageSize = document.getElementById('usersPageSize');
    if (usersPageSize) {
        usersPageSize.addEventListener('change', function() {
            pagination.users.pageSize = parseInt(this.value);
            pagination.users.page = 1;
            loadUsers();
            showAlert(`Показване на ${this.value} потребителя на страница`, 'info');
        });
    }
    
    const articlesPageSize = document.getElementById('articlesPageSize');
    if (articlesPageSize) {
        articlesPageSize.addEventListener('change', function() {
            pagination.articles.pageSize = parseInt(this.value);
            pagination.articles.page = 1;
            loadArticles();
            showAlert(`Показване на ${this.value} новини на страница`, 'info');
        });
    }
    
    const postsPageSize = document.getElementById('postsPageSize');
    if (postsPageSize) {
        postsPageSize.addEventListener('change', function() {
            pagination.posts.pageSize = parseInt(this.value);
            pagination.posts.page = 1;
            loadPosts();
            showAlert(`Показване на ${this.value} поста на страница`, 'info');
        });
    }
}

function updatePagination(type, totalItems) {
    const state = pagination[type];
    state.total = totalItems;
    const totalPages = Math.ceil(totalItems / state.pageSize);
    
    const container = document.getElementById(type + 'PaginationButtons');
    const info = document.getElementById(type + 'PaginationInfo');
    
    if (!container) return;
    
    const start = totalItems === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, totalItems);
    info.textContent = totalItems === 0 ? 'Няма записи за показване' : `Показване на ${start}-${end} от ${totalItems}`;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = state.page === 1;
    prevBtn.onclick = () => {
        state.page--;
        if (type === 'users') loadUsers();
        else if (type === 'articles') loadArticles();
        else loadPosts();
    };
    container.appendChild(prevBtn);
    
    let startPage = Math.max(1, state.page - 2);
    let endPage = Math.min(totalPages, state.page + 2);
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => {
            state.page = 1;
            if (type === 'users') loadUsers();
            else if (type === 'articles') loadArticles();
            else loadPosts();
        };
        container.appendChild(firstBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('button');
            dots.className = 'page-btn';
            dots.textContent = '...';
            dots.disabled = true;
            container.appendChild(dots);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === state.page ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            state.page = i;
            if (type === 'users') loadUsers();
            else if (type === 'articles') loadArticles();
            else loadPosts();
        };
        container.appendChild(btn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('button');
            dots.className = 'page-btn';
            dots.textContent = '...';
            dots.disabled = true;
            container.appendChild(dots);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => {
            state.page = totalPages;
            if (type === 'users') loadUsers();
            else if (type === 'articles') loadArticles();
            else loadPosts();
        };
        container.appendChild(lastBtn);
    }
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = state.page === totalPages || totalPages === 0;
    nextBtn.onclick = () => {
        state.page++;
        if (type === 'users') loadUsers();
        else if (type === 'articles') loadArticles();
        else loadPosts();
    };
    container.appendChild(nextBtn);
}

// ================ СТАТИСТИКИ ================
function loadStatistics() {
    document.getElementById('totalUsers').textContent = adminData.users?.length || 0;
    document.getElementById('totalArticles').textContent = adminData.articles?.length || 0;
    document.getElementById('totalPosts').textContent = adminData.posts?.length || 0;
}

// ================ ЗАРЕЖДАНЕ НА ПОТРЕБИТЕЛИ ================
function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    const state = pagination.users;
    
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const usersToShow = adminData.users?.slice(start, end) || [];
    
    tbody.innerHTML = '';
    
    if (usersToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">Няма намерени потребители</td></tr>';
        updatePagination('users', 0);
        return;
    }
    
    usersToShow.forEach(user => {
        const roleBadge = user.role === 'admin'
            ? '<span class="badge badge-admin"><i class="fas fa-shield-alt"></i> Админ</span>'
            : '<span class="badge badge-user"><i class="fas fa-user"></i> Потребител</span>';
        
        // Използваме username за показване
        const displayName = user.username || user.name;
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.initials || 'П'}</div>
                        <div>
                            <div class="user-name">${displayName}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="showEditUserModal(${user.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="confirmDelete('user', ${user.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    updatePagination('users', adminData.users?.length || 0);
}

// ================ ЗАРЕЖДАНЕ НА НОВИНИ ================
function loadArticles() {
    const tbody = document.getElementById('articlesTableBody');
    if (!tbody) return;
    
    const state = pagination.articles;
    
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const articlesToShow = adminData.articles?.slice(start, end) || [];
    
    tbody.innerHTML = '';
    
    if (articlesToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Няма намерени новини</td></tr>';
        updatePagination('articles', 0);
        return;
    }
    
    articlesToShow.forEach(article => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${article.title}</strong></td>
                <td>${formatDate(article.date)}</td>
                <td>${article.views || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editArticle(${article.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="confirmDelete('article', ${article.id})"><i class="fas fa-trash"></i></button>
                        <button class="action-btn view" onclick="viewArticle(${article.id})"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    updatePagination('articles', adminData.articles?.length || 0);
}

// ================ ЗАРЕЖДАНЕ НА ПОСТОВЕ ================
function loadPosts() {
    const tbody = document.getElementById('postsTableBody');
    if (!tbody) return;
    
    const state = pagination.posts;
    
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const postsToShow = adminData.posts?.slice(start, end) || [];
    
    tbody.innerHTML = '';
    
    if (postsToShow.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Няма намерени постове</td></tr>';
        updatePagination('posts', 0);
        return;
    }
    
    postsToShow.forEach(post => {
        const authorInitials = getInitials(post.author);
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <strong>${post.title}</strong>
                    <div style="font-size: 12px; color: #b0b0d0; margin-top: 5px;">${post.content.substring(0, 60)}...</div>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 12px;">${authorInitials}</div>
                        <div>${post.author}</div>
                    </div>
                </td>
                <td>${formatDate(post.createdAt)}</td>
                <td>
                    <span class="badge" style="background: rgba(138, 43, 226, 0.1); color: var(--purple);">
                        <i class="fas fa-comment"></i> ${post.comments || 0}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editPost(${post.id})"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete" onclick="confirmDeletePost(${post.id})"><i class="fas fa-trash"></i></button>
                        <button class="action-btn view" onclick="viewPost(${post.id})"><i class="fas fa-eye"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    updatePagination('posts', adminData.posts?.length || 0);
}

function getInitials(name) {
    if (!name) return 'П';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// ================ ФУНКЦИИ ЗА ПОСТОВЕ ================
function editPost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (post) {
        showAlert(`Редактиране на пост: ${post.title}`, 'info');
    }
}

function viewPost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (post) {
        showAlert(`Преглед на пост: ${post.title}`, 'info');
    }
}

function confirmDeletePost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('modalMessage').textContent = `Сигурни ли сте, че искате да изтриете поста "${post.title}"?`;
    
    document.getElementById('confirmActionBtn').onclick = () => {
        adminData.posts = adminData.posts?.filter(p => p.id !== id) || [];
        pagination.posts.page = 1;
        loadPosts();
        loadStatistics();
        closeModal();
        showAlert('Постът е изтрит успешно!', 'success');
    };
    
    openModal();
}

// ================ ФУНКЦИИ ЗА НОВИНИ ================
function showAddArticleForm() {
    document.querySelector('[data-section="add-article"]').click();
}

function clearArticleForm() {
    document.getElementById('articleTitle').value = '';
    document.getElementById('articleContent').value = '';
    document.getElementById('articleCategory').value = 'update';
    removeImage();
    currentEditingArticleId = null;
    document.getElementById('articleFormTitle').textContent = 'Добави нова новина';
}

function saveArticle(event) {
    event.preventDefault();
    
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    
    if (!title) {
        showAlert('Моля, попълнете заглавие!', 'error');
        return;
    }
    
    showAlert('Запазване на новината...', 'pending');
    
    if (currentImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            saveArticleWithImage(e.target.result, title, content);
        };
        reader.readAsDataURL(currentImageFile);
    } else {
        saveArticleWithImage(null, title, content);
    }
}

function saveArticleWithImage(imageData, title, content) {
    if (currentEditingArticleId) {
        const index = adminData.articles.findIndex(a => a.id === currentEditingArticleId);
        if (index !== -1) {
            adminData.articles[index] = {
                ...adminData.articles[index],
                title,
                content,
                image: imageData || adminData.articles[index].image
            };
            showAlert('Новината е обновена успешно!', 'success');
        }
    } else {
        const newArticle = {
            id: (adminData.articles?.length || 0) + 1,
            title,
            content,
            image: imageData,
            date: new Date().toISOString().split('T')[0],
            views: 0
        };
        adminData.articles = [newArticle, ...(adminData.articles || [])];
        showAlert('Новината е добавена успешно!', 'success');
    }
    
    pagination.articles.page = 1;
    loadArticles();
    loadStatistics();
    clearArticleForm();
    document.querySelector('[data-section="articles"]').click();
}

function editArticle(id) {
    const article = adminData.articles?.find(a => a.id === id);
    if (article) {
        document.getElementById('articleTitle').value = article.title;
        document.getElementById('articleContent').value = article.content || '';
        currentEditingArticleId = id;
        
        if (article.image) {
            const preview = document.getElementById('imagePreview');
            const previewContainer = document.getElementById('imagePreviewContainer');
            const uploadArea = document.getElementById('fileUploadArea');
            
            preview.src = article.image;
            preview.classList.add('active');
            previewContainer.style.display = 'block';
            uploadArea.style.display = 'none';
        }
        
        document.getElementById('articleFormTitle').textContent = 'Редактирай новина';
        document.querySelector('[data-section="add-article"]').click();
        showAlert(`Редактиране на новина: ${article.title}`, 'info');
    }
}

function viewArticle(id) {
    const article = adminData.articles?.find(a => a.id === id);
    if (article) {
        showAlert(`Преглед на новина: ${article.title}`, 'info');
    }
}

// ================ ПОТВЪРЖДЕНИЕ ЗА ИЗТРИВАНЕ ================
async function confirmDelete(type, id) {
    let message = '';

    if (type === 'user') {
        const user = adminData.users?.find(u => u.id === id);
        const displayName = user?.username || user?.name;
        message = `Сигурни ли сте, че искате да изтриете потребителя ${displayName}?`;
    } else {
        const article = adminData.articles?.find(a => a.id === id);
        message = `Сигурни ли сте, че искате да изтриете новината "${article?.title}"?`;
    }

    document.getElementById('modalMessage').textContent = message;

    document.getElementById('confirmActionBtn').onclick = async () => {
        showAlert('Изтриване...', 'pending');
        
        try {
            if (type === 'user') {
                const response = await fetch(`${API_CONFIG.ADMIN}/delete-user/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.message || 'Грешка при изтриване на потребителя');

                adminData.users = adminData.users?.filter(u => u.id !== id) || [];
                pagination.users.page = 1;
                loadUsers();
                showAlert('Потребителят е изтрит успешно!', 'success');
            } else {
                adminData.articles = adminData.articles?.filter(a => a.id !== id) || [];
                pagination.articles.page = 1;
                loadArticles();
                showAlert('Новината е изтрита успешно!', 'success');
            }

            loadStatistics();
            closeModal();

        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    openModal();
}

// ================ МОДАЛ ================
function openModal() {
    document.getElementById('confirmModal').classList.add('active');
}

function closeModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

// ================ ПОМОЩНИ ФУНКЦИИ ================
function formatDate(dateStr) {
    if (!dateStr) return 'Няма дата';
    const date = new Date(dateStr);
    return date.toLocaleDateString('bg-BG');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
