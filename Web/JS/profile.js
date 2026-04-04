document.addEventListener("DOMContentLoaded", function() {
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

    async function loadCurrentUser() {
        try {
            const response = await authFetch(`${window.API_CONFIG.USER}/current-user`);
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                return false;
            }
            if (!response.ok) throw new Error('Грешка при зареждане на потребител');
            
            const user = await response.json();
            currentUser = user;
            
            document.getElementById('profileName').textContent = currentUser.username || 'Потребител';
            document.getElementById('profileEmail').textContent = currentUser.email || 'user@example.com';
            const firstLetter = currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U';
            document.getElementById('profileAvatar').textContent = firstLetter;
            
            if (currentUser.createdAt) {
                const joinYear = new Date(currentUser.createdAt).getFullYear();
                document.getElementById('memberSince').textContent = joinYear;
            }
            return true;
        } catch (error) {
            console.error('Грешка:', error);
            showAlert('Грешка при зареждане на профила', 'error');
            return false;
        }
    }

    function loadUserPostsFromStorage(page = 1) {
        const postsContainer = document.getElementById('postsContainer');
        const paginationContainer = document.getElementById('pagination');
        currentPage = page;
        
        async function fetchAndDisplayPosts() {
            try {
                let allPosts = [];
                
                // Първо проверка за forum_posts в sessionStorage
                const forumPostsJson = sessionStorage.getItem('forum_posts');
                
                if (forumPostsJson) {
                    // Ако има forum_posts, използваме тях
                    allPosts = JSON.parse(forumPostsJson);
                    console.log('Заредени постове от sessionStorage (forum_posts):', allPosts.length);
                    
                    // Филтрираме постовете за текущия потребител
                    userPosts = allPosts.filter(post => {
                        return post.author && post.author.id === currentUser.id;
                    });
                    
                    // Запазваме user_posts отделно в sessionStorage
                    sessionStorage.setItem('user_posts', JSON.stringify(userPosts));
                    console.log(`Запазени ${userPosts.length} потребителски поста в user_posts`);
                    
                } else {
                    // Ако няма forum_posts, проверяваме за user_posts
                    const userPostsJson = sessionStorage.getItem('user_posts');
                    
                    if (userPostsJson) {
                        // Ако има user_posts, използваме тях
                        userPosts = JSON.parse(userPostsJson);
                        console.log('Заредени постове от sessionStorage (user_posts):', userPosts.length);
                        
                        // Възстановяваме allPosts за потенциална употреба
                        allPosts = userPosts;
                    } else {
                        // Ако няма никакви кеширани данни, правим API заявка
                        console.log('Няма кеширани данни, извличане от API...');
                        showLoadingState(postsContainer);
                        
                        // API заявка за постовете на потребителя
                        const response = await authFetch(
                        `${window.API_CONFIG.POST}/author/${currentUser.id}?useNavigationalProperties=true&isReadOnly=false`
                        );
                        
                        if (response.status === 401) {
                            localStorage.removeItem('authToken');
                            showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                            setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                            return;
                        }
                        
                        if (!response.ok) throw new Error('Грешка при зареждане на публикации');
                        
                        userPosts = await response.json();
                        console.log('Заредени постове от API:', userPosts.length);
                        
                        // Запазваме в sessionStorage
                        sessionStorage.setItem('user_posts', JSON.stringify(userPosts));
                        
                        // Също така, ако имаме достъп до всички постове, можем да обновим и forum_posts
                        try {
                            const allPostsResponse = await authFetch(`${window.API_CONFIG.POST}/all`);
                            if (allPostsResponse.ok) {
                                const allPostsData = await allPostsResponse.json();
                                sessionStorage.setItem('forum_posts', JSON.stringify(allPostsData));
                            }
                        } catch (err) {
                            console.log('Не може да се заредят всички постове:', err);
                        }
                    }
                }
                
                // Актуализираме статистиката
                document.getElementById('postsCount').textContent = userPosts.length;
                
                const totalComments = userPosts.reduce((total, post) => {
                    return total + (post.comments ? post.comments.length : 0);
                }, 0);
                document.getElementById('commentsCount').textContent = totalComments;
                
                totalPages = Math.ceil(userPosts.length / postsPerPage);
                
                if (userPosts.length === 0) {
                    postsContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-newspaper"></i>
                            <h3>Нямате публикации</h3>
                            <p>Започнете да споделяте вашето знание с общността!</p>
                            <button class="btn btn-primary" onclick="window.location.href='new-post.html'">
                                <i class="fas fa-plus"></i>
                                Създай публикация
                            </button>
                        </div>
                    `;
                    paginationContainer.style.display = 'none';
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
                        <p class="post-excerpt">${escapeHtml(post.content || post.excerpt || '')}</p>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span class="post-stat">
                                    <i class="far fa-comment"></i> ${post.comments ? post.comments.length : 0}
                                </span>
                            </div>
                            <div class="post-actions">
                                <button class="post-action-btn" onclick="openEditModal(${post.id})" title="Редактирай">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="post-action-btn delete" onclick="deletePost(${post.id})" title="Изтрий">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                if (totalPages > 1) {
                    generatePagination();
                    paginationContainer.style.display = 'flex';
                } else {
                    paginationContainer.style.display = 'none';
                }
                
            } catch (error) {
                console.error('Грешка при зареждане на публикации:', error);
                postsContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Грешка при зареждане</h3>
                        <p>Неуспешно зареждане на вашите публикации.</p>
                        <button class="btn btn-primary" onclick="refreshPosts()">
                            <i class="fas fa-sync-alt"></i>
                            Опитай отново
                        </button>
                    </div>
                `;
                paginationContainer.style.display = 'none';
            }
        }
        
        function showLoadingState(container) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Зареждане на вашите публикации...</p>
                </div>
            `;
        }
        
        fetchAndDisplayPosts();
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    window.refreshPosts = function() {
        // Изчистваме кешираните данни за потребителските постове
        sessionStorage.removeItem('user_posts');
        sessionStorage.removeItem('forum_posts');
        // Презареждаме от API
        loadUserPostsFromStorage(1);
        showAlert('Публикациите са обновени', 'success');
    };
    
    function generatePagination() {
        const paginationContainer = document.getElementById('pagination');
        let paginationHTML = '';
        
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
            if (startPage > 2) paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHTML += `<span class="pagination-dots">...</span>`;
            paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
        }
        
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
        
        paginationContainer.innerHTML = paginationHTML;
    }
    
    window.changePage = function(page) {
        if (page < 1 || page > totalPages) return;
        loadUserPostsFromStorage(page);
        document.querySelector('.section-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    window.openEditModal = function(postId) {
        const post = userPosts.find(p => p.id === postId);
        if (post) {
            currentEditPostId = postId;
            document.getElementById('editPostTitle').value = post.title || '';
            document.getElementById('editPostContent').value = post.content || '';
            document.getElementById('editPostModal').classList.add('show');
        }
    };
    
    async function updateCacheAfterPostChange() {
        try {
            // Обновяваме user_posts
            const userResponse = await authFetch(
            `${window.API_CONFIG.POST}/author/${currentUser.id}?useNavigationalProperties=true&isReadOnly=false`
            );
            if (userResponse.ok) {
                const userPostsData = await userResponse.json();
                sessionStorage.setItem('user_posts', JSON.stringify(userPostsData));
            }
            
            // Обновяваме forum_posts
            const allResponse = await authFetch(`${window.API_CONFIG.POST}/all`);
            if (allResponse.ok) {
                const allPostsData = await allResponse.json();
                sessionStorage.setItem('forum_posts', JSON.stringify(allPostsData));
            }
            
            console.log('Кешът е обновен успешно');
        } catch (error) {
            console.error('Грешка при обновяване на кеша:', error);
        }
    }
    
    async function saveEditPost() {
        const title = document.getElementById('editPostTitle').value.trim();
        const content = document.getElementById('editPostContent').value.trim();
        
        if (!title) { showAlert('Моля, въведете заглавие', 'error'); return; }
        if (!content) { showAlert('Моля, въведете съдържание', 'error'); return; }
        
        const saveBtnText = document.getElementById('saveEditText');
        const saveBtnLoader = document.getElementById('saveEditLoader');
        const saveBtn = document.getElementById('saveEditBtn');
        
        saveBtnText.style.display = 'none';
        saveBtnLoader.style.display = 'inline-block';
        saveBtn.disabled = true;
        
        try {
            const response = await authFetch(`${window.API_CONFIG.POST}/${currentEditPostId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content })
            });
            
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                return;
            }
            
            if (!response.ok) throw new Error('Грешка при редактиране');
            
            showAlert('Публикацията е обновена успешно!', 'success');
            
            // Обновяваме кеша
            await updateCacheAfterPostChange();
            
            document.getElementById('editPostModal').classList.remove('show');
            loadUserPostsFromStorage(currentPage);
            
        } catch (error) {
            console.error('Грешка при редактиране:', error);
            showAlert('Грешка при редактиране на публикацията', 'error');
        } finally {
            saveBtnText.style.display = 'inline';
            saveBtnLoader.style.display = 'none';
            saveBtn.disabled = false;
        }
    }
    
    window.deletePost = async function(postId) {
        if (confirm('Сигурни ли сте, че искате да изтриете тази публикация?')) {
            try {
                const response = await authFetch(`${window.API_CONFIG.POST}/${postId}`, { method: 'DELETE' });
                
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                    setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                    return;
                }
                
                if (!response.ok) throw new Error('Грешка при изтриване');
                
                showAlert('Публикацията е изтрита успешно!', 'success');
                
                // Обновяваме кеша
                await updateCacheAfterPostChange();
                
                loadUserPostsFromStorage(1);
                
            } catch (error) {
                console.error('Грешка при изтриване:', error);
                showAlert('Грешка при изтриване на публикацията', 'error');
            }
        }
    };
    
    // Event Listeners
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        showAlert('Успешен изход!', 'success');
        setTimeout(() => window.location.href = '../HTML/index.html', 1500);
    });
    
    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
        window.location.href = 'edit_profile.html';
    });
    
    document.getElementById('cancelEditBtn')?.addEventListener('click', () => {
        document.getElementById('editPostModal').classList.remove('show');
        currentEditPostId = null;
    });
    
    document.getElementById('saveEditBtn')?.addEventListener('click', saveEditPost);
    
    // Delete Account Modal
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
                const response = await authFetch(`${window.API_CONFIG.USER}/current-user`, { method: 'DELETE' });
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                    setTimeout(() => window.location.href = '../HTML/login.html', 1500);
                    return;
                }
                if (!response.ok) throw new Error('Грешка при изтриване');
                
                localStorage.removeItem('authToken');
                sessionStorage.clear(); // Изчистваме целия sessionStorage
                showAlert('Профилът е изтрит успешно!', 'success');
                setTimeout(() => window.location.href = '../HTML/index.html', 1500);
                
            } catch (error) {
                showAlert('Грешка при изтриване на профила', 'error');
                deleteBtnText.style.display = 'inline';
                deleteLoader.style.display = 'none';
                confirmDeleteBtn.disabled = false;
                deleteModal?.classList.remove('show');
            }
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) deleteModal?.classList.remove('show');
        if (e.target === document.getElementById('editPostModal')) {
            document.getElementById('editPostModal').classList.remove('show');
            currentEditPostId = null;
        }
    });
    
    // Back button functionality
    document.getElementById('backBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (document.referrer) history.back();
        else window.location.href = '../HTML/index.html';
    });
    
    // Initialize profile
    async function init() {
        if (!checkAuthAndRedirect()) return;
        const userLoaded = await loadCurrentUser();
        if (userLoaded && currentUser) {
            loadUserPostsFromStorage(1);
        }
    }
    
    init();
});