
let currentUser = null;
const threadsPerPage = 6;
let currentPage = 1;
let filteredThreads = [];
let currentSort = "newest";
let allThreads = [];

const newThreadModal = document.getElementById('newThreadModal');
const modalClose = document.getElementById('modalClose');
const cancelThreadBtn = document.getElementById('cancelThreadBtn');
const desktopNewThreadBtn = document.getElementById('desktopNewThreadBtn');
const mobileNewThreadBtn = document.getElementById('mobileNewThreadBtn');
const newThreadForm = document.getElementById('newThreadForm');
const submitThreadBtn = document.getElementById('submitThreadBtn');
const threadTitle = document.getElementById('threadTitle');
const threadQuestion = document.getElementById('threadQuestion');
const titleCounter = document.getElementById('titleCounter');
const questionCounter = document.getElementById('questionCounter');

function calculateAccountAge(createdAt) {
    if (!createdAt) return null;

    try {
        const creationDate = new Date(createdAt);
        const currentDate = new Date();
        const ageInMilliseconds = currentDate - creationDate;
        const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);

        return ageInYears;
    } catch (error) {
        console.error('Error calculating account age:', error);
        return null;
    }
}

function getAvatarImage(createdAt) {
    if (!createdAt) return '../Assets/Images/bronze_logo.png';

    const accountAge = calculateAccountAge(createdAt);

    if (accountAge < 2) {
        return '../Assets/Images/bronze_logo.png';
    } else if (accountAge >= 2 && accountAge < 5) {
        return '../Assets/Images/silver_logo.png';
    } else {
        return '../Assets/Images/gold_logo.png';
    }
}

window.addEventListener('load', async function () {
    const loader = document.getElementById('loader');

    await loadCurrentUser();

    setTimeout(async () => {
        loader.classList.add('hidden');
        await loadPosts();
        renderPagination();
        initModal();
    }, 1000);
});

function updateStatistics(threadsCount) {
    const totalThreadsElement = document.getElementById('totalThreadsCount');
    if (totalThreadsElement) {
        totalThreadsElement.textContent = threadsCount;
    }
}

function calculateTodayStats(posts) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayPosts = 0;
    let todayReplies = 0;

    posts.forEach(post => {

        const postDate = new Date(post.createdAt);
        postDate.setHours(0, 0, 0, 0);

        if (postDate.getTime() === today.getTime()) {
            todayPosts++;
        }

        if (post.comments && post.comments.length > 0) {
            post.comments.forEach(comment => {
                const commentDate = new Date(comment.createdAt);
                commentDate.setHours(0, 0, 0, 0);

                if (commentDate.getTime() === today.getTime()) {
                    todayReplies++;
                }
            });
        }
    });

    const todayPostsElement = document.getElementById('todayPostsCount');
    const todayRepliesElement = document.getElementById('todayRepliesCount');

    if (todayPostsElement) {
        todayPostsElement.textContent = todayPosts;
    }

    if (todayRepliesElement) {
        todayRepliesElement.textContent = todayReplies;
    }
}

async function loadCurrentUser() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        currentUser = null;
        return;
    }

    try {
        const response = await fetch(`${window.API_CONFIG.USER}/current-user`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            currentUser = await response.json();
        } else if (response.status === 401) {

            localStorage.removeItem('authToken');
            currentUser = null;
        }
    } catch (error) {
        console.error('Error loading current user:', error);
        currentUser = null;
    }
}

function initModal() {
    if (threadTitle) {
        threadTitle.addEventListener('input', function () {
            titleCounter.textContent = this.value.length + '/120';
        });
    }

    if (threadQuestion) {
        threadQuestion.addEventListener('input', function () {
            questionCounter.textContent = this.value.length;
        });
    }
}

function showModal() {

    const authToken = localStorage.getItem('authToken');
    if (!authToken || !currentUser) {
        showAlert('Трябва да сте логнат, за да създадете нова тема!', 'error');
        return;
    }

    newThreadModal.classList.add('active');
    document.body.classList.add('modal-open');
    if (threadTitle) threadTitle.focus();
}

function hideModal() {
    newThreadModal.classList.remove('active');
    document.body.classList.remove('modal-open');

    if (newThreadForm) {
        newThreadForm.reset();
        titleCounter.textContent = '0/120';
        questionCounter.textContent = '0';
    }
}

if (desktopNewThreadBtn) desktopNewThreadBtn.addEventListener('click', showModal);
if (mobileNewThreadBtn) mobileNewThreadBtn.addEventListener('click', showModal);
if (modalClose) modalClose.addEventListener('click', hideModal);
if (cancelThreadBtn) cancelThreadBtn.addEventListener('click', hideModal);

if (newThreadModal) {
    newThreadModal.addEventListener('click', function (e) {
        if (e.target === this) {
            hideModal();
        }
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && newThreadModal.classList.contains('active')) {
        hideModal();
    }
});

if (submitThreadBtn) {
    submitThreadBtn.addEventListener('click', async function () {

        const authToken = localStorage.getItem('authToken');
        if (!authToken || !currentUser) {
            showAlert('Трябва да сте логнат, за да публикувате тема!', 'error');
            return;
        }

        if (!threadTitle.value.trim() || threadTitle.value.trim().length < window.Validation.TITLE_MIN_LENGTH) {
            showAlert(`Моля, въведете заглавие с поне ${window.Validation.TITLE_MIN_LENGTH} символа`, 'error');
            threadTitle.focus();
            return;
        }

        if (!threadQuestion.value.trim() || threadQuestion.value.trim().length < window.Validation.CONTENT_MIN_LENGTH) {
            showAlert(`Моля, въведете съдържание с поне ${window.Validation.CONTENT_MIN_LENGTH} символа`, 'error');
            threadQuestion.focus();
            return;
        }

        try {
            submitThreadBtn.disabled = true;
            submitThreadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Зареждане...';

            const newPost = {
                title: threadTitle.value,
                content: threadQuestion.value,
                createdAt: new Date().toISOString(),
                authorId: currentUser.id,
                author: currentUser
            };

            const response = await fetch(`${window.API_CONFIG.POST}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(newPost)
            });

            const result = await response.json();

            if (response.ok) {
                hideModal();
                showAlert(result.message || 'Темата е публикувана успешно!', 'success');
                await refreshPosts();
            } else if (response.status === 401) {
                showAlert('Сесията ви е изтекла. Моля, влезте отново!', 'error');
                localStorage.removeItem('authToken');
                currentUser = null;
            } else {
                showAlert(result.message || 'Възникна грешка', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAlert('Възникна грешка при комуникация със сървъра', 'error');
        } finally {
            submitThreadBtn.disabled = false;
            submitThreadBtn.innerHTML = 'Публикувай';
        }
    });
}

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function () {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

function formatDate(utcDateString) {
    if (!utcDateString) return 'Неизвестна дата';

    let dateString = utcDateString;
    if (!dateString.endsWith('Z') && !dateString.includes('+')) {
        dateString = dateString + 'Z';
    }

    const utcDate = new Date(dateString);

    if (isNaN(utcDate.getTime())) return 'Невалидна дата';

    const now = new Date();

    const diffTime = now - utcDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    if (diffSeconds < 60) {
        return 'Току-що';
    }

    if (diffDays === 0) {
        if (diffHours === 0) {
            if (diffMinutes === 1) {
                return 'Преди 1 минута';
            }
            return `Преди ${diffMinutes} минути`;
        } else if (diffHours === 1) {
            return 'Преди 1 час';
        }
        return `Преди ${diffHours} часа`;
    }

    if (diffDays === 1) {
        return 'Преди 1 ден';
    }

    if (diffDays < 7) {
        return `Преди ${diffDays} дни`;
    }

    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        if (weeks === 1) {
            return 'Преди 1 седмица';
        }
        return `Преди ${weeks} седмици`;
    }

    if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        if (months === 1) {
            return 'Преди 1 месец';
        }
        return `Преди ${months} месеца`;
    }

    const years = Math.floor(diffDays / 365);
    if (years === 1) {
        return 'Преди 1 година';
    }
    return `Преди ${years} години`;
}

async function loadPosts() {
    try {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.remove('hidden');

        const useNavigationalProperties = true;
        const isReadOnly = true;

        const response = await fetch(`${window.API_CONFIG.POST}?useNavigationalProperties=${useNavigationalProperties}&isReadOnly=${isReadOnly}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Грешка при зареждане на постове');
        }

        const posts = await response.json();

        processPostsData(posts);

    } catch (error) {
        console.error('Error loading posts:', error);
        showAlert('Възникна грешка при зареждане на темите', 'error');
    } finally {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }
}

async function refreshPosts() {
    await loadPosts();
}

function processPostsData(posts) {

    allThreads = posts.map((post, index) => {
        let authorName = post.author?.username || 'Анонимен';

        if (post.author?.role === 0) {
            authorName = 'Админ';
        }

        let authorAvatarUrl = '../Assets/Images/bronze_logo.png';
        if (authorName === 'Админ') {
            authorAvatarUrl = '../Assets/Images/gold_logo.png';
        } else if (post.author?.createdAt) {
            authorAvatarUrl = getAvatarImage(post.author.createdAt);
        }

        const repliesCount = post.comments?.length || 0;
        const datePosted = post.createdAt ? formatDate(post.createdAt) : 'Неизвестна дата';

        const preview = post.content
            ? post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
            : 'Няма съдържание';

        return {
            id: post.id || index + 1,
            title: post.title || 'Без заглавие',
            preview: preview,
            content: post.content,
            author: authorName,
            authorAvatarUrl: authorAvatarUrl,
            replies: repliesCount,
            date: datePosted,
            createdAt: post.createdAt,
            authorId: post.author?.id,
            comments: post.comments || []
        };
    });

    filteredThreads = [...allThreads];

    updateStatistics(allThreads.length);

    calculateTodayStats(posts);

    renderThreads();
    renderPagination();
}

function sortThreads(threads, sortType) {
    const sortedThreads = [...threads];

    switch (sortType) {
        case "newest":
            return sortedThreads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case "oldest":
            return sortedThreads.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case "popular":
            return sortedThreads.sort((a, b) => b.replies - a.replies);
        default:
            return sortedThreads;
    }
}

function renderThreads() {
    const container = document.getElementById('threadsContainer');
    if (!container) return;

    const startIndex = (currentPage - 1) * threadsPerPage;
    const endIndex = startIndex + threadsPerPage;

    const sortedThreads = sortThreads(filteredThreads, currentSort);
    const threadsToShow = sortedThreads.slice(startIndex, endIndex);

    let html = `<div class="thread-header">Всички теми (${filteredThreads.length})</div>`;

    if (threadsToShow.length === 0) {
        html += `
            <div class="thread-item" style="text-align: center; padding: 3rem 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--neon-green); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--white); margin-bottom: 0.5rem;">Няма намерени теми</h3>
                <p style="color: #b0b0d0;">Променете критериите за търсене</p>
            </div>
        `;
    } else {
        threadsToShow.forEach(thread => {
            const hasFullContent = thread.content && thread.content.length > 100;

            html += `
                <div class="thread-item" data-thread-id="${thread.id}">
                    <h3 class="thread-title">
                        <a href="forum_details.html?id=${thread.id}" class="thread-title-link">${escapeHtml(thread.title)}</a>
                    </h3>
                    <p class="thread-preview">
                        ${escapeHtml(thread.preview)}
                        ${hasFullContent ? '<span class="read-more-link" data-thread-id="' + thread.id + '">Вижте повече...</span>' : ''}
                    </p>
                    <div class="thread-meta">
                        <div class="thread-author">
                            <img class="author-avatar" src="${thread.authorAvatarUrl}" alt="${escapeHtml(thread.author)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                            <span>${escapeHtml(thread.author)}</span>
                        </div>
                        <div class="thread-info">
                            <span><i class="far fa-comment"></i> ${thread.replies} ${thread.replies === 1 ? 'отговор' : 'отговора'}</span>
                            <span><i class="far fa-clock"></i> ${escapeHtml(thread.date)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    container.innerHTML = html;

    document.querySelectorAll('.read-more-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const threadId = this.getAttribute('data-thread-id');
            window.location.href = `forum_details.html?id=${threadId}`;
        });
    });

    document.querySelectorAll('.thread-title-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    document.querySelectorAll('.thread-item').forEach(item => {
        item.addEventListener('click', function (e) {
            if (!e.target.classList.contains('read-more-link') &&
                !e.target.classList.contains('thread-title-link') &&
                e.target.tagName !== 'A') {
                const threadId = this.getAttribute('data-thread-id');
                if (threadId) {
                    window.location.href = `forum_details.html?id=${threadId}`;
                }
            }
        });

        item.style.cursor = 'pointer';
    });

    document.querySelectorAll('.thread-item').forEach(el => {
        el.classList.add('fade-in');
    });

    updatePaginationInfo();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    html += `
        <li class="page-item">
            <a class="page-link prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
                <i class="fas fa-chevron-left"></i> Назад
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item">
                    <a class="page-link ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `
                <li class="page-item">
                    <a class="page-link disabled">...</a>
                </li>
            `;
        }
    }

    html += `
        <li class="page-item">
            <a class="page-link next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
                Напред <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;

    pagination.innerHTML = html;

    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (!this.classList.contains('disabled')) {
                const page = parseInt(this.getAttribute('data-page'));
                if (page) {
                    currentPage = page;
                    renderThreads();
                    renderPagination();
                    window.scrollTo({ top: document.querySelector('.latest-threads')?.offsetTop - 100, behavior: 'smooth' });
                }
            }
        });
    });
}

function updatePaginationInfo() {
    const infoElement = document.getElementById('paginationInfo');
    if (!infoElement) return;

    const startThread = filteredThreads.length === 0 ? 0 : (currentPage - 1) * threadsPerPage + 1;
    const endThread = Math.min(currentPage * threadsPerPage, filteredThreads.length);

    infoElement.innerHTML = filteredThreads.length === 0
        ? 'Няма намерени теми'
        : `Показване на теми ${startThread} - ${endThread} от общо ${filteredThreads.length}`;
}

function performSearch(searchTerm) {
    if (!searchTerm || searchTerm === '') {
        filteredThreads = [...allThreads];
    } else {
        const searchLower = searchTerm.toLowerCase();
        filteredThreads = allThreads.filter(thread =>
            thread.title.toLowerCase().includes(searchLower) ||
            thread.preview.toLowerCase().includes(searchLower) ||
            thread.author.toLowerCase().includes(searchLower)
        );
    }

    currentPage = 1;
    renderThreads();
    renderPagination();
}

const desktopSearchInput = document.getElementById('desktopProblemSearch');
if (desktopSearchInput) {
    desktopSearchInput.addEventListener('input', function () {
        performSearch(this.value.toLowerCase().trim());
    });
}

const mobileSearchInput = document.getElementById('mobileProblemSearch');
if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', function () {
        performSearch(this.value.toLowerCase().trim());
    });
}

document.querySelectorAll('.thread-item, .quick-link').forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 10px 20px rgba(0, 255, 157, 0.1)';
    });

    item.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.thread-item, .sidebar-widget').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .read-more-link {
        color: var(--neon-green);
        cursor: pointer;
        font-weight: 500;
        margin-left: 5px;
        transition: all 0.3s ease;
        display: inline-block;
    }
    
    .read-more-link:hover {
        text-decoration: underline;
        opacity: 0.8;
        transform: translateX(3px);
    }
    
    .thread-title-link {
        color: var(--white);
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .thread-title-link:hover {
        color: var(--neon-green);
    }
    
    .thread-item {
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .thread-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 20px rgba(0, 255, 157, 0.1);
    }
    
    .thread-item::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background: var(--neon-green);
        transition: width 0.3s ease;
    }
    
    .thread-item:hover::after {
        width: 100%;
    }
    
    .thread-preview {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 5px;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }
    
    .author-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid var(--neon-green);
        box-shadow: 0 0 8px rgba(0, 255, 157, 0.3);
        transition: all 0.3s ease;
    }
    
    .thread-author:hover .author-avatar {
        transform: scale(1.1);
        border-color: var(--neon-red);
        box-shadow: 0 0 12px rgba(0, 255, 157, 0.5);
    }
`;
document.head.appendChild(additionalStyles);