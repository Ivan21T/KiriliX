const adminData = {
    users: [],  // Започваме с празен масив
    articles: [],
    posts: []
};

// ================ СЪСТОЯНИЕ ================
let currentEditingArticleId = null;
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
    initAutocomplete();
    initFileUpload();
    initPaginationControls();
    
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

// Мобилно меню
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        menu.classList.toggle('active');
    });
}

// Навигация
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
        
        // Трансформираме потребителите към очаквания формат
        return users.map(user => ({
            id: user.id,
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

// Функция за зареждане на постове от базата
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

// Примерни данни за тест
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

// ================ FILE UPLOAD ================
function initFileUpload() {
    const fileInput = document.getElementById('articleImage');
    const uploadArea = document.getElementById('fileUploadArea');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const preview = document.getElementById('imagePreview');
    
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

// ================ AUTOCOMPLETE ================
function initAutocomplete() {
    const input = document.getElementById('articleAuthor');
    const suggestions = document.getElementById('authorSuggestions');
    
    input.addEventListener('input', function() {
        const term = this.value.toLowerCase();
        
        if (term.length < 2 || !adminData.users || adminData.users.length === 0) {
            suggestions.style.display = 'none';
            return;
        }
        
        const matches = adminData.users.filter(u => 
            u.name.toLowerCase().includes(term) || 
            u.email.toLowerCase().includes(term)
        );
        
        if (matches.length === 0) {
            suggestions.style.display = 'none';
            return;
        }
        
        suggestions.innerHTML = '';
        matches.slice(0, 8).forEach(user => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <div class="user-avatar" style="width: 32px; height: 32px;">${user.initials}</div>
                <div>
                    <div style="font-weight: 600;">${user.name}</div>
                    <div style="font-size: 12px; color: #b0b0d0;">${user.email}</div>
                </div>
                ${user.role === 'admin' ? '<i class="fas fa-shield-alt" style="color: var(--neon-green);"></i>' : ''}
            `;
            
            div.addEventListener('click', () => {
                input.value = user.name;
                suggestions.style.display = 'none';
                showAlert(`Избран автор: ${user.name}`, 'success');
            });
            
            suggestions.appendChild(div);
        });
        
        suggestions.style.display = 'block';
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== input && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            suggestions.style.display = 'none';
        }
    });
}

// ================ ПАГИНАЦИЯ ================
function initPaginationControls() {
    // Потребители
    const usersPageSize = document.getElementById('usersPageSize');
    if (usersPageSize) {
        usersPageSize.addEventListener('change', function() {
            pagination.users.pageSize = parseInt(this.value);
            pagination.users.page = 1;
            loadUsers();
            showAlert(`Показване на ${this.value} потребителя на страница`, 'info');
        });
    }
    
    // Новини
    const articlesPageSize = document.getElementById('articlesPageSize');
    if (articlesPageSize) {
        articlesPageSize.addEventListener('change', function() {
            pagination.articles.pageSize = parseInt(this.value);
            pagination.articles.page = 1;
            loadArticles();
            showAlert(`Показване на ${this.value} новини на страница`, 'info');
        });
    }
    
    // Постове
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
    
    // Информация
    const start = totalItems === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, totalItems);
    info.textContent = totalItems === 0 ? 'Няма записи за показване' : `Показване на ${start}-${end} от ${totalItems}`;
    
    // Бутони
    container.innerHTML = '';
    
    if (totalPages <= 1) {
        return;
    }
    
    // Бутон Предишна
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
    
    // Номера на страници
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
    
    // Бутон Следваща
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
    
    const totalComments = adminData.posts?.reduce((sum, p) => sum + (p.comments || 0), 0) || 0;
    document.getElementById('totalCommentsCount').textContent = totalComments;
    
    const activeUsers = adminData.users?.filter(u => u.status === 'active').length || 0;
    document.getElementById('activeUsers').textContent = activeUsers;
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
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-avatar">${user.initials || 'П'}</div>
                        <div>
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${roleBadge}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="editUser(${user.id})"><i class="fas fa-edit"></i></button>
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
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Няма намерени новини</td></tr>';
        updatePagination('articles', 0);
        return;
    }
    
    articlesToShow.forEach(article => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${article.title}</strong></td>
                <td>${article.author}</td>
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
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Няма намерени постове</td></tr>';
        updatePagination('posts', 0);
        updatePostsStats();
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
                    <span class="badge" style="background: rgba(0, 255, 157, 0.1); color: var(--neon-green);">
                        <i class="fas fa-eye"></i> ${post.views || 0}
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
    updatePostsStats();
}

function updatePostsStats() {
    const posts = adminData.posts || [];
    const totalPosts = posts.length;
    const totalComments = posts.reduce((sum, p) => sum + (p.comments || 0), 0);
    const popularPosts = posts.filter(p => p.views > 200).length;
    
    // Изчисляваме ръст спрямо предходния период
    const now = new Date();
    const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
    const postsThisWeek = posts.filter(p => new Date(p.createdAt) >= oneWeekAgo).length;
    const postsLastWeek = posts.filter(p => {
        const date = new Date(p.createdAt);
        return date < oneWeekAgo && date >= new Date(oneWeekAgo.setDate(oneWeekAgo.getDate() - 7));
    }).length;
    
    let growth = 0;
    if (postsLastWeek > 0) {
        growth = ((postsThisWeek - postsLastWeek) / postsLastWeek) * 100;
    } else if (postsThisWeek > 0) {
        growth = 100;
    }
    
    document.getElementById('totalPostsCount').textContent = totalPosts;
    document.getElementById('totalCommentsCount').textContent = totalComments;
    document.getElementById('popularPostsCount').textContent = popularPosts;
    document.getElementById('postsGrowth').textContent = Math.round(growth) + '%';
}

function refreshPosts() {
    showAlert('Обновяване на постовете...', 'pending');
    // Тук може да направите заявка към сървъра за нови данни
    setTimeout(() => {
        adminData.posts = getSamplePosts(); // Временно използваме примерни данни
        pagination.posts.page = 1;
        loadPosts();
        loadStatistics();
        showAlert('Постовете са обновени успешно!', 'success');
    }, 500);
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
        // Тук може да отворите форма за редактиране
    }
}

function viewPost(id) {
    const post = adminData.posts?.find(p => p.id === id);
    if (post) {
        showAlert(`Преглед на пост: ${post.title}`, 'info');
        // Тук може да отворите поста за преглед
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
    document.getElementById('articleExcerpt').value = '';
    document.getElementById('articleContent').value = '';
    document.getElementById('articleCategory').value = 'update';
    document.getElementById('articleAuthor').value = 'Администратор';
    document.getElementById('authorSuggestions').style.display = 'none';
    removeImage();
    currentEditingArticleId = null;
    document.getElementById('articleFormTitle').textContent = 'Добави нова новина';
}

function saveArticle(event) {
    event.preventDefault();
    
    const title = document.getElementById('articleTitle').value;
    const excerpt = document.getElementById('articleExcerpt').value;
    const content = document.getElementById('articleContent').value;
    const author = document.getElementById('articleAuthor').value;
    
    if (!title || !author) {
        showAlert('Моля, попълнете заглавие и автор!', 'error');
        return;
    }
    
    showAlert('Запазване на новината...', 'pending');
    
    // Проверка за автор
    const existingUser = adminData.users?.find(u => u.name.toLowerCase() === author.toLowerCase());
    
    if (!existingUser && author !== 'Администратор' && author !== 'Екип KiriliX') {
        if (confirm(`Потребител "${author}" не съществува. Желаете ли да го добавите?`)) {
            const newUser = {
                id: (adminData.users?.length || 0) + 1,
                name: author,
                email: `${author.toLowerCase().replace(/\s+/g, '.')}@example.com`,
                role: 'user',
                status: 'active',
                initials: author.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            };
            adminData.users = [...(adminData.users || []), newUser];
            showAlert(`Нов потребител "${author}" е добавен!`, 'success');
        } else {
            return;
        }
    }
    
    // Обработка на изображението
    if (currentImageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            saveArticleWithImage(e.target.result, title, excerpt, content, author);
        };
        reader.readAsDataURL(currentImageFile);
    } else {
        saveArticleWithImage(null, title, excerpt, content, author);
    }
}

function saveArticleWithImage(imageData, title, excerpt, content, author) {
    if (currentEditingArticleId) {
        // Редактиране
        const index = adminData.articles.findIndex(a => a.id === currentEditingArticleId);
        if (index !== -1) {
            adminData.articles[index] = {
                ...adminData.articles[index],
                title,
                author,
                excerpt,
                content,
                image: imageData || adminData.articles[index].image
            };
            showAlert('Новината е обновена успешно!', 'success');
        }
    } else {
        // Добавяне
        const newArticle = {
            id: (adminData.articles?.length || 0) + 1,
            title,
            author,
            excerpt,
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
        document.getElementById('articleExcerpt').value = article.excerpt || '';
        document.getElementById('articleContent').value = article.content || '';
        document.getElementById('articleAuthor').value = article.author;
        currentEditingArticleId = id;
        
        // Ако има изображение, покажи го
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

// ================ ФУНКЦИИ ЗА ПОТРЕБИТЕЛИ ================
function editUser(id) {
    const user = adminData.users?.find(u => u.id === id);
    if (user) {
        showAlert(`Редактиране на потребител: ${user.name}`, 'info');
    }
}

// ================ ПОТВЪРЖДЕНИЕ ЗА ИЗТРИВАНЕ ================
async function confirmDelete(type, id) {
    let message = '';

    if (type === 'user') {
        const user = adminData.users?.find(u => u.id === id);
        message = `Сигурни ли сте, че искате да изтриете потребителя ${user?.name}?`;
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

                // Update local data
                adminData.users = adminData.users?.filter(u => u.id !== id) || [];
                pagination.users.page = 1;
                loadUsers();
                showAlert('Потребителят е изтрит успешно!', 'success');
            } else {
                // For articles, keep same logic if no backend endpoint yet
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
// ================ НОВ МОДАЛ ЗА ДОБАВЯНЕ НА ПОТРЕБИТЕЛ (без иконки) ================
function showAddUserModal() {
    // Проверяваме дали модалът вече съществува
    let modalOverlay = document.getElementById('addUserModalOverlay');
    
    if (!modalOverlay) {
        // Създаваме модала
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'addUserModalOverlay';
        modalOverlay.className = 'modal-overlay';
        
        modalOverlay.innerHTML = `
            <div class="modal-window">
                <div class="modal-header">
                    <h3><i class="fas fa-user-plus" style="margin-right: 10px;"></i>Нов потребител</h3>
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
                            <div class="password-strength">
                                <div class="password-strength-bar" id="passwordStrengthBar"></div>
                            </div>
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
                                <i class="fas fa-times"></i> Отказ
                            </button>
                            <button type="submit" class="modal-btn modal-btn-primary">
                                <i class="fas fa-save"></i> Запази
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalOverlay);
        
        // Добавяме event listener за затваряне при клик извън модала
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeAddUserModal();
            }
        });
        
        // Добавяме listener за Escape клавиш
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeAddUserModal();
            }
        });
    }
    
    // Показваме модала
    modalOverlay.classList.add('active');
    
    // Фокусираме първото поле след малка пауза
    setTimeout(() => {
        document.getElementById('modalUsername')?.focus();
    }, 100);
    
    // Заключваме скрола на body-то
    document.body.style.overflow = 'hidden';
}

function closeAddUserModal() {
    const modalOverlay = document.getElementById('addUserModalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        
        const form = document.getElementById('addUserModalForm');
        if (form) form.reset();
        
        const strengthBar = document.getElementById('passwordStrengthBar');
        if (strengthBar) {
            strengthBar.className = 'password-strength-bar';
        }
        
        document.body.style.overflow = '';
    }
}

function checkPasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    if (!strengthBar) return;
    
    strengthBar.className = 'password-strength-bar';
    
    if (!password) {
        return;
    }
    
    let strength = 0;
    
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
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
    
    if (adminData.users?.some(u => u.name.toLowerCase() === username.toLowerCase())) {
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

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}