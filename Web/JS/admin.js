const adminData = {
    users: [],  // Започваме с празен масив
    articles: [],
    posts: []
};

// ================ СЪСТОЯНИЕ ================
let currentEditingArticleId = null;
let currentEditingUserId = null;
let currentAction = null;

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
    initPaginationControls();
    
    // Добавяме респонсив стилове за модалите
    addResponsiveModalStyles();
    
    // Първо зареждаме потребителите
    showAlert('Зареждане на потребители...', 'pending');
    adminData.users = await getUsers();
    
    // Зареждаме постовете
    await fetchPosts();
    
    // Зареждаме новините
    await fetchArticles();
    
    // След като имаме всички данни, зареждаме останалото
    loadStatistics();
    loadUsers();
    loadArticles();
    
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

// ================ API ФУНКЦИИ ЗА ПОТРЕБИТЕЛИ ================
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
            name: user.username || 'Потребител',
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

// ================ API ФУНКЦИИ ЗА НОВИНИ ================

// ВЗЕМАНЕ НА НОВИНИ
async function fetchArticles() {
    try {
        showAlert('Зареждане на новини...', 'pending');
        
        const response = await fetch(`${API_CONFIG.NEWS}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const articles = await response.json();
        
        console.log('Сървърът върна:', articles);
        
        // Трансформираме данните според формата от сървъра
        adminData.articles = articles.map(article => ({
            id: article.id,
            title: article.title || 'Без заглавие',
            description: article.description || '',
            content: article.description || '',
            author: 'Администратор',
            date: article.publishedAt ? article.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            publishedAt: article.publishedAt
        }));
        
        console.log('Трансформирани новини:', adminData.articles);
        
        loadArticles();
        loadStatistics();
        showAlert('Новините са заредени успешно!', 'success');
        
    } catch (error) {
        console.error('Error fetching articles:', error);
        showAlert('Грешка при зареждане на новините: ' + error.message, 'error');
        adminData.articles = [];
        loadArticles();
    }
}

// СЪЗДАВАНЕ НА НОВА НОВИНА
async function createArticle(title, description) {
    try {
        showAlert('Създаване на новина...', 'pending');
        
        const response = await fetch(`${API_CONFIG.NEWS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                publishedAt: new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Грешка при създаване! Status: ${response.status}`);
        }

        const newArticle = await response.json();
        
        console.log('Създадена новина от сървъра:', newArticle);
        
        const articleToAdd = {
            id: newArticle.id || Date.now(),
            title: title,
            content: description,
            description: description,
            author: 'Администратор',
            date: newArticle.publishedAt ? newArticle.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            publishedAt: newArticle.publishedAt || new Date().toISOString()
        };
        
        adminData.articles = [articleToAdd, ...(adminData.articles || [])];
        pagination.articles.page = 1;
        
        loadArticles();
        loadStatistics();
        
        showAlert('Новината е създадена успешно!', 'success');
        return newArticle;
        
    } catch (error) {
        console.error('Error creating article:', error);
        showAlert('Грешка при създаване на новина: ' + error.message, 'error');
        throw error;
    }
}

// РЕДАКТИРАНЕ НА НОВИНА
async function updateArticle(id, title, description) {
    try {
        showAlert('Обновяване на новина...', 'pending');
        
        console.log('Опит за редакция на новина с ID:', id);
        
        const article = adminData.articles.find(a => a.id === id);
        
        if (!article) {
            throw new Error('Новината не е намерена в локалния списък');
        }
        
        const response = await fetch(`${API_CONFIG.NEWS}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                title: title,
                description: description,
                publishedAt: article.publishedAt || new Date().toISOString()
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Грешка при обновяване! Status: ${response.status}`);
        }

        const updatedArticle = await response.json();
        console.log('Обновена новина от сървъра:', updatedArticle);

        const index = adminData.articles.findIndex(a => a.id === id);
        if (index !== -1) {
            adminData.articles[index] = {
                ...adminData.articles[index],
                title: title,
                description: description,
                content: description
            };
        }
        
        loadArticles();
        showAlert('Новината е обновена успешно!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error updating article:', error);
        
        const index = adminData.articles.findIndex(a => a.id === id);
        if (index !== -1) {
            adminData.articles[index] = {
                ...adminData.articles[index],
                title: title,
                content: description,
                description: description
            };
            loadArticles();
            showAlert('Новината е обновена локално!', 'info');
            return true;
        }
        
        showAlert('Грешка при обновяване на новина: ' + error.message, 'error');
        throw error;
    }
}

// ИЗТРИВАНЕ НА НОВИНА
async function deleteArticle(id) {
    try {
        showAlert('Изтриване на новина...', 'pending');
        
        console.log('Опит за изтриване на новина с ID:', id);
        
        const response = await fetch(`${API_CONFIG.NEWS}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Грешка при изтриване! Status: ${response.status}`);
        }

        adminData.articles = adminData.articles?.filter(a => a.id !== id) || [];
        pagination.articles.page = 1;
        
        loadArticles();
        loadStatistics();
        
        showAlert('Новината е изтрита успешно!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error deleting article:', error);
        
        adminData.articles = adminData.articles?.filter(a => a.id !== id) || [];
        pagination.articles.page = 1;
        loadArticles();
        loadStatistics();
        
        showAlert('Новината е изтрита локално!', 'info');
        return true;
    }
}

// ================ API ФУНКЦИИ ЗА ПОСТОВЕ ================

// ВЗЕМАНЕ НА ПОСТОВЕ
async function fetchPosts() {
    try {
        showAlert('Зареждане на постове...', 'pending');
        
        const response = await fetch(`${API_CONFIG.POST}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        
        adminData.posts = posts.map(post => ({
            id: post.id,
            title: post.title || 'Без заглавие',
            content: post.content || '',
            author: post.author?.username || 'Неизвестен',
            authorId: post.author?.id,
            createdAt: post.createdAt,
            comments: post.comments?.length || 0,
            status: 'active'
        }));
        
        loadPosts();
        loadStatistics();
        showAlert('Постовете са заредени успешно!', 'success');
        
    } catch (error) {
        console.error('Error fetching posts:', error);
        showAlert('Грешка при зареждане на постовете: ' + error.message, 'error');
        adminData.posts = [];
        loadPosts();
    }
}

// ИЗТРИВАНЕ НА ПОСТ
async function deletePost(id) {
    try {
        showAlert('Изтриване на пост...', 'pending');
        
        const response = await fetch(`${API_CONFIG.POST}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Грешка при изтриване! Status: ${response.status}`);
        }

        adminData.posts = adminData.posts?.filter(p => p.id !== id) || [];
        pagination.posts.page = 1;
        
        loadPosts();
        loadStatistics();
        
        showAlert('Постът е изтрит успешно!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error deleting post:', error);
        showAlert('Грешка при изтриване на поста: ' + error.message, 'error');
        return false;
    }
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
        
        /* Стилове за автор балона в таблицата */
        .author-bubble {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(145deg, rgba(0, 255, 157, 0.15), rgba(0, 255, 157, 0.05));
            border: 1px solid rgba(0, 255, 157, 0.3);
            border-radius: 30px;
            padding: 6px 16px 6px 12px;
            font-size: 13px;
            color: #fff;
            box-shadow: 0 2px 8px rgba(0, 255, 157, 0.1);
            transition: all 0.3s ease;
            white-space: nowrap;
        }
        
        .author-bubble:hover {
            border-color: var(--neon-green);
            box-shadow: 0 4px 12px rgba(0, 255, 157, 0.2);
            transform: translateY(-1px);
        }
        
        .author-bubble i {
            color: var(--neon-green);
            font-size: 12px;
            filter: drop-shadow(0 0 4px rgba(0, 255, 157, 0.5));
        }
        
        .author-bubble .author-name {
            font-weight: 500;
            color: var(--neon-green);
            letter-spacing: 0.3px;
        }
        
        @media (max-width: 768px) {
            .author-bubble {
                padding: 4px 12px 4px 8px;
                font-size: 12px;
                white-space: normal;
                word-break: break-word;
            }
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
                    <form id="editUserModalForm" onsubmit="saveEditedUser(event)" novalidate>
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
    
    const existingUserWithSameName = adminData.users?.find(u => 
        u.id !== currentEditingUserId && (u.username || u.name).toLowerCase() === username.toLowerCase()
    );
    
    if (existingUserWithSameName) {
        usernameInput.classList.add('error');
        showAlert('Потребител с това име вече съществува', 'error');
        setTimeout(() => usernameInput.classList.remove('error'), 500);
        return;
    }
    
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
            updates.username = username;
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
            adminData.users[index] = {
                ...adminData.users[index],
                ...(updates.username && { 
                    username: updates.username, 
                    name: updates.username
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
                    <form id="addUserModalForm" onsubmit="saveNewUser(event)" novalidate>
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
    
    if (adminData.users?.some(u => (u.username || u.name).toLowerCase() === username.toLowerCase())) {
        usernameInput.classList.add('error');
        showAlert('Потребител с това име вече съществува', 'error');
        setTimeout(() => usernameInput.classList.remove('error'), 500);
        return;
    }
    
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
                username: username,
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
            name: username,
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

// ================ МОДАЛ ЗА РЕДАКТИРАНЕ НА НОВИНА ================
function showEditArticleModal(id) {
    const article = adminData.articles?.find(a => a.id === id);
    if (!article) return;
    
    currentEditingArticleId = id;
    
    let modalOverlay = document.getElementById('editArticleModalOverlay');
    
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'editArticleModalOverlay';
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
                    <h3><i class="fas fa-newspaper"></i>Редактиране на новина</h3>
                    <button class="modal-close-btn" onclick="closeEditArticleModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <form id="editArticleModalForm" onsubmit="saveEditedArticle(event)" novalidate>
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editArticleTitle">
                                <i class="fas fa-heading"></i> Заглавие
                            </label>
                            <input type="text" 
                                   id="editArticleTitle" 
                                   class="modal-form-control" 
                                   placeholder="Въведете заглавие на новината"
                                   required 
                                   minlength="3" 
                                   maxlength="200">
                        </div>
                        
                        <div class="modal-form-group">
                            <label class="modal-form-label" for="editArticleContent">
                                <i class="fas fa-align-left"></i> Съдържание
                            </label>
                            <textarea id="editArticleContent" 
                                      class="modal-form-control" 
                                      placeholder="Въведете съдържание на новината"
                                      required
                                      rows="8"
                                      style="resize: vertical; min-height: 150px;"></textarea>
                        </div>
                        
                        <div class="modal-footer">
                            <button type="button" class="modal-btn modal-btn-outline" onclick="closeEditArticleModal()">
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
                closeEditArticleModal();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeEditArticleModal();
            }
        });
    }
    
    document.getElementById('editArticleTitle').value = article.title || '';
    document.getElementById('editArticleContent').value = article.description || article.content || '';
    
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        document.getElementById('editArticleTitle')?.focus();
    }, 100);
}

function closeEditArticleModal() {
    const modalOverlay = document.getElementById('editArticleModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        
        const form = document.getElementById('editArticleModalForm');
        if (form) form.reset();
        
        document.body.style.overflow = '';
        currentEditingArticleId = null;
    }
}

async function saveEditedArticle(event) {
    event.preventDefault();
    
    if (!currentEditingArticleId) return;
    
    const titleInput = document.getElementById('editArticleTitle');
    const contentInput = document.getElementById('editArticleContent');
    
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    
    let hasError = false;
    
    if (title.length < 3) {
        titleInput.classList.add('error');
        showAlert('Заглавието трябва да е поне 3 символа', 'error');
        hasError = true;
        setTimeout(() => titleInput.classList.remove('error'), 500);
    }
    
    if (content.length < 10) {
        contentInput.classList.add('error');
        showAlert('Съдържанието трябва да е поне 10 символа', 'error');
        hasError = true;
        setTimeout(() => contentInput.classList.remove('error'), 500);
    }
    
    if (hasError) return;
    
    try {
        await updateArticle(currentEditingArticleId, title, content);
        closeEditArticleModal();
        showAlert('Новината е обновена успешно!', 'success');
    } catch (error) {
        console.error('Error saving article:', error);
        showAlert('Грешка при запазване на новината', 'error');
    }
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
        
        const displayName = user.username || user.name;
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.initials || 'П'}</div>
                        <div>
                            <div class="user-name">${escapeHtml(displayName)}</div>
                            <div class="user-email">${escapeHtml(user.email)}</div>
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
        const authorBubble = `
            <div class="author-bubble">
                <i class="fas fa-pen-fancy"></i>
                <span class="author-name">${escapeHtml(article.author)}</span>
            </div>
        `;
        
        tbody.innerHTML += `
            <tr>
                <td><strong>${escapeHtml(article.title)}</strong></td>
                <td>${authorBubble}</td>
                <td>${formatDate(article.date)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewArticle(${article.id})" title="Преглед">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="showEditArticleModal(${article.id})" title="Редактиране">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="confirmDelete('article', ${article.id})" title="Изтриване">
                            <i class="fas fa-trash"></i>
                        </button>
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
                    <strong>${escapeHtml(post.title)}</strong>
                    <div style="font-size: 12px; color: #b0b0d0; margin-top: 5px;">${escapeHtml(post.content.substring(0, 60))}...</div>
                </td>
                <td>
                    <div class="user-info">
                        <div class="user-avatar" style="width: 32px; height: 32px; font-size: 12px;">${authorInitials}</div>
                        <div>${escapeHtml(post.author)}</div>
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
                        <button class="action-btn delete" onclick="confirmDeletePost(${post.id})" title="Изтрий">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button class="action-btn view" onclick="viewPost(${post.id})" title="Преглед">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    updatePagination('posts', adminData.posts?.length || 0);
}

// ================ ФУНКЦИЯ ЗА ОБНОВЯВАНЕ НА ПОСТОВЕТЕ ================
function refreshPosts() {
    fetchPosts();
}

function getInitials(name) {
    if (!name) return 'П';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// ================ ПОМОЩНА ФУНКЦИЯ ЗА ЕСКЕЙПВАНЕ НА HTML ================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================ ФУНКЦИИ ЗА ПОСТОВЕ ================
function viewPost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (post) {
        showAlert(`Пренасочване към пост: ${post.title}`, 'info');
        window.location.href = `forum_details.html?id=${id}`;
    }
}

function confirmDeletePost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (!post) return;
    
    document.getElementById('modalMessage').textContent = `Сигурни ли сте, че искате да изтриете поста "${post.title}"?`;
    
    document.getElementById('confirmActionBtn').onclick = async () => {
        closeModal();
        await deletePost(id);
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
    currentEditingArticleId = null;
    document.getElementById('articleFormTitle').textContent = 'Добави нова новина';
}

async function saveArticle(event) {
    event.preventDefault();
    
    const title = document.getElementById('articleTitle').value;
    const content = document.getElementById('articleContent').value;
    
    if (!title) {
        showAlert('Моля, попълнете заглавие!', 'error');
        return;
    }
    
    if (!content) {
        showAlert('Моля, попълнете съдържание!', 'error');
        return;
    }
    
    if (title.trim().length < 3) {
        showAlert('Заглавието трябва да е поне 3 символа!', 'error');
        return;
    }
    
    if (content.trim().length < 10) {
        showAlert('Съдържанието трябва да е поне 10 символа!', 'error');
        return;
    }
    
    try {
        if (currentEditingArticleId) {
            await updateArticle(currentEditingArticleId, title, content);
        } else {
            await createArticle(title, content);
        }
        
        clearArticleForm();
        document.querySelector('[data-section="articles"]').click();
        
    } catch (error) {
        console.error('Error saving article:', error);
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
        closeModal();
        
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
                await deleteArticle(id);
            }

            loadStatistics();

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