let currentPostId = null;
let currentUser = null;
let currentPost = null;

window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    if (!postId || postId.trim() === '') {
        showAlert('Моля, посочете ID на публикацията в URL адреса.<br>Пример: post_details.html?id=123', 'error');
        return;
    }
    
    if (isNaN(postId) || parseInt(postId) <= 0) {
        showAlert('Посоченото ID не е валидно число.<br>Моля, проверете URL адреса.', 'error');
        return;
    }
    
    currentPostId = parseInt(postId);
    
    loadCurrentUser();
    
    loadPostDetails(currentPostId);
});

async function loadCurrentUser() {
    try {
        const sessionUser = sessionStorage.getItem('user');
        
        if (sessionUser) {
            currentUser = JSON.parse(sessionUser);
            console.log('Потребител зареден от sessionStorage:', currentUser.username, 'Роля:', currentUser.role);
            return;
        }
        
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('Няма логнат потребител');
            currentUser = null;
            return;
        }
        
        console.log('Няма потребител в sessionStorage, зареждам от API...');
        const response = await fetch(`${API_CONFIG.USER}/current-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            sessionStorage.setItem('user', JSON.stringify(currentUser));
            console.log('Потребител зареден от API:', currentUser.username, 'Роля:', currentUser.role);
        } else {
            console.log('Неуспешно зареждане на потребител от API');
            currentUser = null;
        }
        
    } catch (error) {
        console.error('Грешка при зареждане на потребител:', error);
        currentUser = null;
    }
}

async function loadPostDetails(postId) {
    try {
        showAlert('Зареждане на публикацията...', 'pending');
        document.getElementById('loader').classList.remove('hidden');
        
        const response = await fetch(`${API_CONFIG.POST}/${postId}?useNavigationalProperties=true`);
        
        if (!response.ok) {
            if (response.status === 404) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Публикацията не е намерена');
            } else if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Невалидна заявка');
            } else {
                throw new Error(`Грешка при зареждане: ${response.status}`);
            }
        }
        
        const post = await response.json();
        currentPost = post;
        
        document.getElementById('loader').classList.add('hidden');
        
        document.title = `KiriliX | ${post.title || 'Без заглавие'}`;
        
        document.getElementById('forumTitle').textContent = post.title || 'Без заглавие';
        
        let authorName = 'Неизвестен автор';
        let authorInitials = '--';
        
        if (post.author) {
            authorName = post.author.username || 'Неизвестен автор';
            authorInitials = getInitials(post.author.username) || getInitials(post.author.email) || '??';
        }
        
        document.getElementById('forumAuthor').textContent = authorName;
        document.getElementById('forumAuthorAvatar').textContent = authorInitials;
        
        let dateText = 'Неизвестна дата';
        if (post.createdAt) {
            try {
                const date = new Date(post.createdAt);
                if (!isNaN(date.getTime())) {
                    dateText = formatDeviceDate(date);
                }
            } catch (e) {
                console.warn('Грешка при форматиране на дата:', e);
            }
        }
        document.getElementById('forumDate').textContent = dateText;
        
        document.getElementById('forumContent').innerHTML = post.content || '<p>Няма съдържание</p>';
        
        displayComments(post.comments || []);
        
        // Премахване на pending съобщението
        const pendingAlert = document.querySelector('.alert-message.pending');
        if (pendingAlert) pendingAlert.remove();
        
    } catch (error) {
        console.error('Грешка при зареждане на публикация:', error);
        document.getElementById('loader').classList.add('hidden');
        showAlert(error.message, 'error');
    }
}

function displayComments(comments) {
    const commentsCount = document.getElementById('commentsCount');
    const commentsList = document.getElementById('commentsList');
    
    if (!comments || comments.length === 0) {
        commentsCount.textContent = '(0)';
        commentsList.innerHTML = '<li class="comment-item" style="text-align: center; list-style: none;">Няма коментари все още. Бъди първият!</li>';
        return;
    }
    
    commentsCount.textContent = `(${comments.length})`;
    
    let commentsHtml = '';
    comments.forEach(comment => {
        let authorInitials = '--';
        let authorName = 'Неизвестен потребител';
        let isAdmin = false;
        let canDelete = false;
        let commentAuthorId = null;
        
        if (comment.author) {
            commentAuthorId = comment.author.id;
            
            if (comment.author.role === 0) {
                authorName = 'Администратор';
                isAdmin = true;
                authorInitials = 'A';
            } else {
                authorName = comment.author.username || 'Неизвестен потребител';
                authorInitials = getInitials(comment.author.username) || getInitials(comment.author.email) || '??';
            }
            
            if (currentUser && (currentUser.id === commentAuthorId || currentUser.role === 0)) {
                canDelete = true;
            }
        }
        
        let dateText = 'Неизвестна дата';
        if (comment.createdAt) {
            try {
                const date = new Date(comment.createdAt);
                if (!isNaN(date.getTime())) {
                    dateText = formatDeviceDate(date);
                }
            } catch (e) {
                console.warn('Грешка при форматиране на дата:', e);
            }
        }
        
        commentsHtml += `
            <li class="comment-item" data-comment-id="${comment.id || ''}" data-comment-author-id="${commentAuthorId || ''}" style="list-style: none;">
                <div class="comment-header">
                    <div class="comment-author">
                        <div class="comment-author-avatar">${authorInitials}</div>
                        <div class="comment-author-info">
                            <h5>${escapeHtml(authorName)} ${isAdmin ? '<span class="admin-badge">Админ</span>' : ''}</h5>
                            <p>${escapeHtml(dateText)}</p>
                        </div>
                    </div>
                    ${canDelete ? `
                    <div class="comment-actions">
                        <button class="delete-comment-btn" onclick="deleteComment(${comment.id})" title="Изтрий коментара">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    ` : ''}
                </div>
                <div class="comment-content">
                    ${escapeHtml(comment.content || 'Няма съдържание')}
                </div>
            </li>
        `;
    });
    
    commentsList.innerHTML = commentsHtml;
}

async function deleteComment(commentId) {
    if (!commentId) {
        showAlert('Невалиден ID на коментар', 'error');
        return;
    }
    
    if (!currentUser) {
        showAlert('Трябва да сте влезли в профила си, за да изтриете коментар', 'warning');
        return;
    }
    
    const confirmDelete = confirm('Сигурни ли сте, че искате да изтриете този коментар?');
    if (!confirmDelete) return;
    
    try {
        const deleteBtn = document.querySelector(`.comment-item[data-comment-id="${commentId}"] .delete-comment-btn`);
        if (deleteBtn) {
            deleteBtn.disabled = true;
            deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_CONFIG.COMMENT}/${commentId}`, {
            method: 'DELETE',
            headers: token ? {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            let errorMessage = `Грешка при изтриване: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {}
            throw new Error(errorMessage);
        }
        
        showAlert('Коментарът беше изтрит успешно!', 'success');
        
        await loadPostDetails(currentPostId);
        
    } catch (error) {
        console.error('Грешка при изтриване на коментар:', error);
        showAlert(error.message || 'Грешка при изтриване на коментар', 'error');
        
        const deleteBtn = document.querySelector(`.comment-item[data-comment-id="${commentId}"] .delete-comment-btn`);
        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        }
    }
}

function formatDeviceDate(date) {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Невалидна дата';
    }
    
    const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    
    try {
        return date.toLocaleDateString('bg-BG', options);
    } catch (e) {
        return date.toLocaleDateString(undefined, options);
    }
}

async function submitComment() {
    const contentInput = document.getElementById('commentContent');
    const content = contentInput.value.trim();
    const submitBtn = document.getElementById('submitCommentBtn');
    
    if (!content) {
        showAlert('Моля, въведете съдържание на коментара', 'warning');
        return;
    }
    
    if (!currentUser) {
        showAlert('Трябва да сте влезли в профила си, за да коментирате', 'warning');
        return;
    }
    
    if (!currentPostId) {
        showAlert('Няма заредена публикация', 'error');
        return;
    }
    
    if (!currentPost) {
        showAlert('Няма информация за публикацията', 'error');
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Изпращане...';
        
        const commentData = {
            content: content,
            author: currentUser,
            post: currentPost
        };
        
        console.log('Изпращам коментар:', commentData);
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(API_CONFIG.COMMENT, {
            method: 'POST',
            headers: token ? {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            } : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Грешка при изпращане на коментар');
        }
        
        showAlert('Коментарът беше добавен успешно!', 'success');
        
        contentInput.value = '';
        
        await loadPostDetails(currentPostId);
        
    } catch (error) {
        console.error('Грешка при изпращане на коментар:', error);
        showAlert(error.message || 'Грешка при изпращане на коментар', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Публикувай';
    }
}

function getInitials(name) {
    if (!name || typeof name !== 'string') return '??';
    
    name = name.trim();
    if (name === '') return '??';
    
    if (name.includes('@')) {
        return name.charAt(0).toUpperCase();
    }
    
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
        return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.disabled) return;
        
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