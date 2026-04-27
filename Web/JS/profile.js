document.addEventListener("DOMContentLoaded", function () {
    let currentUser = null;
    let userPosts = [];
    let currentPage = 1;
    let postsPerPage = 6;
    let totalPages = 1;
    let currentEditPostId = null;

    function checkAuthAndRedirect() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            showAlert('Моля, влезте в профила си', 'error');
            setTimeout(() => window.location.href = '../HTML/login.html', 1000);
            return false;
        }
        return true;
    }

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

    function customConfirm(message, onConfirm, onCancel) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'custom-confirm-overlay';

        modalOverlay.innerHTML = `
            <div class="custom-confirm-modal">
                <div class="custom-confirm-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="custom-confirm-title">Потвърждение</h3>
                <p class="custom-confirm-message">${message}</p>
                <div class="custom-confirm-actions">
                    <button class="custom-confirm-btn cancel-btn">
                        <i class="fas fa-times"></i>
                        Отказ
                    </button>
                    <button class="custom-confirm-btn confirm-btn">
                        <i class="fas fa-trash-alt"></i>
                        Изтрий
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);

        if (!document.getElementById('custom-confirm-styles')) {
            const style = document.createElement('style');
            style.id = 'custom-confirm-styles';
            style.textContent = `
                .custom-confirm-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(10px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }
                
                .custom-confirm-modal {
                    background: var(--dark-secondary, #151522);
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 255, 157, 0.3);
                    animation: slideIn 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .custom-confirm-modal::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, transparent, var(--neon-green, #00ff9d), var(--neon-red, #ff003c), transparent);
                    transition: var(--transition, all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1));
                    animation: flagMove 2s infinite linear;
                }
                
                @keyframes flagMove {
                    0% { left: -100%; opacity: 0.5; }
                    100% { left: 100%; opacity: 0.5; }
                }
                
                .custom-confirm-icon {
                    font-size: 4rem;
                    color: var(--neon-red, #ff003c);
                    margin-bottom: 20px;
                    text-shadow: 0 0 30px var(--neon-red, #ff003c);
                    animation: pulse 0.5s ease;
                }
                
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .custom-confirm-title {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    background: linear-gradient(45deg, var(--white, #ffffff), var(--neon-green, #00ff9d));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                
                .custom-confirm-message {
                    color: #b0b0d0;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    margin-bottom: 30px;
                }
                
                .custom-confirm-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                
                .custom-confirm-btn {
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition, all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1));
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    border: none;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.5px;
                    font-size: 1rem;
                    position: relative;
                    overflow: hidden;
                }
                
                .custom-confirm-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: var(--transition, all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1));
                }
                
                .custom-confirm-btn:hover::before {
                    left: 100%;
                }
                
                .cancel-btn {
                    border: 2px solid var(--neon-green, #00ff9d);
                    color: var(--neon-green, #00ff9d);
                    background: transparent;
                    text-shadow: 0 0 5px var(--neon-green, #00ff9d);
                    box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
                }
                
                .cancel-btn:hover {
                    color: var(--dark, #0a0a14);
                    background: var(--neon-green, #00ff9d);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0, 255, 157, 0.5);
                }
                
                .confirm-btn {
                    border: 2px solid var(--neon-red, #ff003c);
                    color: var(--neon-red, #ff003c);
                    background: transparent;
                    text-shadow: 0 0 5px var(--neon-red, #ff003c);
                    box-shadow: 0 0 15px rgba(255, 0, 60, 0.3);
                }
                
                .confirm-btn:hover {
                    color: var(--dark, #0a0a14);
                    background: var(--neon-red, #ff003c);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(255, 0, 60, 0.5);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        const confirmBtn = modalOverlay.querySelector('.confirm-btn');
        const cancelBtn = modalOverlay.querySelector('.cancel-btn');

        function closeModal() {
            modalOverlay.remove();
        }

        confirmBtn.addEventListener('click', () => {
            closeModal();
            if (onConfirm) onConfirm();
        });

        cancelBtn.addEventListener('click', () => {
            closeModal();
            if (onCancel) onCancel();
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
                if (onCancel) onCancel();
            }
        });
    }

    async function refreshUser() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return null;

            const response = await fetch(`${window.API_CONFIG.USER}/current-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                window.location.href = '../HTML/login.html';
                return null;
            }

            if (!response.ok) return null;

            const user = await response.json();
            currentUser = user;

            const profileNameEl = document.getElementById('profileName');
            const profileEmailEl = document.getElementById('profileEmail');

            if (profileNameEl) profileNameEl.textContent = currentUser.username || 'Потребител';
            if (profileEmailEl) profileEmailEl.textContent = currentUser.email || 'user@example.com';

            const avatarUrl = getAvatarImage(currentUser.createdAt);
            const profileAvatarImg = document.getElementById('profileAvatarImg');
            if (profileAvatarImg) profileAvatarImg.src = avatarUrl;

            if (currentUser.createdAt) {
                const memberSinceEl = document.getElementById('memberSince');
                if (memberSinceEl) memberSinceEl.textContent = new Date(currentUser.createdAt).getFullYear();
            }

            return user;
        } catch (error) {
            console.error('Грешка при refresh:', error);
            return null;
        }
    }

    async function loadUserPosts(page = 1, silent = true) {
        const postsContainer = document.getElementById('postsContainer');
        const paginationContainer = document.getElementById('pagination');
        currentPage = page;

        try {
            if (!silent) {
                showLoadingState(postsContainer);
            }

            const token = localStorage.getItem('authToken');

            const response = await fetch(
                `${window.API_CONFIG.POST}/author/${currentUser.id}?useNavigationalProperties=true&isReadOnly=false`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                return;
            }

            if (!response.ok) throw new Error('Грешка при зареждане на публикации');

            const newUserPosts = await response.json();
            userPosts = newUserPosts;

            const postsCountEl = document.getElementById('postsCount');
            if (postsCountEl) {
                postsCountEl.textContent = userPosts.length;
            }

            const totalComments = userPosts.reduce((total, post) => {
                return total + (post.comments ? post.comments.length : 0);
            }, 0);
            const commentsCountEl = document.getElementById('commentsCount');
            if (commentsCountEl) {
                commentsCountEl.textContent = totalComments;
            }

            totalPages = Math.ceil(userPosts.length / postsPerPage);

            if (userPosts.length === 0) {
                postsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-newspaper"></i>
                        <h3>Нямате публикации</h3>
                        <p>Започнете да споделяте вашето знание с общността!</p>
                        <button class="btn btn-primary" onclick="window.location.href='forum.html'">
                            <i class="fas fa-plus"></i>
                            Създай публикация
                        </button>
                    </div>
                `;
                if (paginationContainer) paginationContainer.style.display = 'none';
                return;
            }

            const startIndex = (page - 1) * postsPerPage;
            const endIndex = Math.min(startIndex + postsPerPage, userPosts.length);
            const postsForPage = userPosts.slice(startIndex, endIndex);

            postsContainer.innerHTML = postsForPage.map(post => `
                <div class="post-card">
                    <div class="post-header">
                        <span class="post-date">
                            <i class="far fa-calendar-alt"></i>
                            ${post.createdAt ? new Date(post.createdAt).toLocaleDateString('bg-BG') : 'скоро'}
                        </span>
                    </div>
                    <h3 class="post-title">${escapeHtml(post.title) || 'Без заглавие'}</h3>
                    <p class="post-excerpt">${escapeHtml(post.content || post.excerpt || '').substring(0, 150)}${(post.content || '').length > 150 ? '...' : ''}</p>
                    <div class="post-footer">
                        <div class="post-stats">
                            <span class="post-stat">
                                <i class="far fa-comment"></i> ${post.comments ? post.comments.length : 0}
                            </span>
                        </div>
                        <div class="post-actions">
                            <button class="post-action-btn" onclick="window.viewPost(${post.id})" title="Преглед">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="post-action-btn" onclick="window.openEditModal(${post.id})" title="Редактирай">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="post-action-btn delete" onclick="window.deletePost(${post.id})" title="Изтрий">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            if (totalPages > 1) {
                generatePagination();
                if (paginationContainer) paginationContainer.style.display = 'flex';
            } else {
                if (paginationContainer) paginationContainer.style.display = 'none';
            }

        } catch (error) {
            console.error('Грешка при зареждане на публикации:', error);
            if (!silent) {
                postsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Грешка при зареждане</h3>
                        <p>Неуспешно зареждане на вашите публикации.</p>
                        <button class="btn btn-primary" onclick="window.refreshPosts()">
                            <i class="fas fa-sync-alt"></i>
                            Опитай отново
                        </button>
                    </div>
                `;
                if (paginationContainer) paginationContainer.style.display = 'none';
            }
        }
    }

    function showLoadingState(container) {
        if (!container) return;
        container.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Зареждане на вашите публикации...</p>
            </div>
        `;
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.refreshPosts = function () {
        loadUserPosts(1, false);
        showAlert('Публикациите са обновени', 'success');
    };

    function generatePagination() {
        const paginationContainer = document.getElementById('pagination');
        if (!paginationContainer) return;

        let paginationHTML = '';

        paginationHTML += `<button class="pagination-btn" onclick="window.changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;

        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="window.changePage(1)">1</button>`;
            if (startPage > 2) paginationHTML += `<span class="pagination-dots">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="window.changePage(${i})">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHTML += `<span class="pagination-dots">...</span>`;
            paginationHTML += `<button class="pagination-btn" onclick="window.changePage(${totalPages})">${totalPages}</button>`;
        }

        paginationHTML += `<button class="pagination-btn" onclick="window.changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;

        paginationContainer.innerHTML = paginationHTML;
    }

    window.changePage = function (page) {
        if (page < 1 || page > totalPages) return;
        loadUserPosts(page, false);
        document.querySelector('.section-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.viewPost = function (postId) {
        window.location.href = `forum_details.html?id=${postId}`;
    };

    window.openEditModal = function (postId) {
        const post = userPosts.find(p => p.id === postId);
        if (post) {
            currentEditPostId = postId;
            document.getElementById('editPostTitle').value = post.title || '';
            document.getElementById('editPostContent').value = post.content || '';
            document.getElementById('editPostModal').classList.add('show');
        }
    };

    async function saveEditPost() {
        const title = document.getElementById('editPostTitle').value.trim();
        const content = document.getElementById('editPostContent').value.trim();

        if (!title || title.length < window.Validation.TITLE_MIN_LENGTH) { showAlert(`Заглавието трябва да е поне ${window.Validation.TITLE_MIN_LENGTH} символа`, 'error'); return; }
        if (!content || content.length < window.Validation.CONTENT_MIN_LENGTH) { showAlert(`Съдържанието трябва да е поне ${window.Validation.CONTENT_MIN_LENGTH} символа`, 'error'); return; }

        const saveBtnText = document.getElementById('saveEditText');
        const saveBtnLoader = document.getElementById('saveEditLoader');
        const saveBtn = document.getElementById('saveEditBtn');

        saveBtnText.style.display = 'none';
        saveBtnLoader.style.display = 'inline-block';
        saveBtn.disabled = true;

        try {
            const token = localStorage.getItem('authToken');

            const originalPost = userPosts.find(p => p.id === currentEditPostId);
            const updates = {};

            if (originalPost.title !== title) {
                updates.title = title;
            }

            if (originalPost.content !== content) {
                updates.content = content;
            }

            if (Object.keys(updates).length === 0) {
                showAlert('Няма направени промени', 'info');
                document.getElementById('editPostModal').classList.remove('show');
                return;
            }

            const response = await fetch(`${window.API_CONFIG.POST}/${currentEditPostId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updates)
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                return;
            }

            if (response.status === 404) {
                showAlert('Публикацията не беше намерена', 'error');
                document.getElementById('editPostModal').classList.remove('show');
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Грешка при редактиране');
            }

            const result = await response.json();
            showAlert(result.message || 'Публикацията е обновена успешно!', 'success');

            document.getElementById('editPostModal').classList.remove('show');
            await loadUserPosts(currentPage, false);

        } catch (error) {
            console.error('Грешка при редактиране:', error);
            showAlert(error.message || 'Грешка при редактиране на публикацията', 'error');
        } finally {
            saveBtnText.style.display = 'inline';
            saveBtnLoader.style.display = 'none';
            saveBtn.disabled = false;
        }
    }

    window.deletePost = async function (postId) {
        customConfirm('Сигурни ли сте, че искате да изтриете тази публикация?', async () => {
            try {
                const token = localStorage.getItem('authToken');

                const response = await fetch(`${window.API_CONFIG.POST}/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                    setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                    return;
                }

                if (!response.ok) throw new Error('Грешка при изтриване');

                showAlert('Публикацията е изтрита успешно!', 'success');
                await loadUserPosts(1, false);

            } catch (error) {
                console.error('Грешка при изтриване:', error);
                showAlert('Грешка при изтриване на публикацията', 'error');
            }
        }, () => {
        });
    };

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            showAlert('Успешен изход!', 'success');
            setTimeout(() => window.location.href = '../HTML/index.html', 1500);
        });
    }

    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.href = 'edit_profile.html';
        });
    }

    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            document.getElementById('editPostModal').classList.remove('show');
            currentEditPostId = null;
        });
    }

    const saveEditBtn = document.getElementById('saveEditBtn');
    if (saveEditBtn) {
        saveEditBtn.addEventListener('click', saveEditPost);
    }

    const deleteModal = document.getElementById('deleteModal');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteBtnText = document.getElementById('deleteBtnText');
    const deleteLoader = document.getElementById('deleteLoader');

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => deleteModal?.classList.add('show'));
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => deleteModal?.classList.remove('show'));
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            deleteBtnText.style.display = 'none';
            deleteLoader.style.display = 'inline-block';
            confirmDeleteBtn.disabled = true;

            try {
                const token = localStorage.getItem('authToken');

                if (!currentUser || !currentUser.id) {
                    await refreshUser();
                }

                if (!currentUser || !currentUser.id) {
                    throw new Error('Не може да се идентифицира потребителя');
                }

                const response = await fetch(`${window.API_CONFIG.USER}/${currentUser.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Cache-Control': 'no-cache',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                    return;
                }

                if (response.status === 404) {
                    throw new Error('Потребителят не беше намерен');
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Грешка при изтриване на профила');
                }

                localStorage.removeItem('authToken');
                showAlert('Профилът е изтрит успешно!', 'success');
                setTimeout(() => window.location.href = '../HTML/index.html', 2000);

            } catch (error) {
                console.error('Грешка при изтриване на профила:', error);
                showAlert(error.message || 'Грешка при изтриване на профила', 'error');
                deleteBtnText.style.display = 'inline';
                deleteLoader.style.display = 'none';
                confirmDeleteBtn.disabled = false;
                deleteModal?.classList.remove('show');
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) deleteModal?.classList.remove('show');
        const editPostModal = document.getElementById('editPostModal');
        if (e.target === editPostModal) {
            editPostModal.classList.remove('show');
            currentEditPostId = null;
        }
    });

    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = '../HTML/index.html';
        });
    }

    async function init() {
        if (!checkAuthAndRedirect()) return;

        const user = await refreshUser();

        if (user) {
            await loadUserPosts(1, false);
        }
    }

    init();
});