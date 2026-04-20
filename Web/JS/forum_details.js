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

// Функция за изчисляване на възрастта на профила в години
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

// Функция която директно връща URL на снимка според възрастта на профила
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

async function loadCurrentUser() {
    try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            console.log('Няма логнат потребител');
            currentUser = null;
            return;
        }
        
        console.log('Зареждам потребител от API...');
        const response = await fetch(`${window.API_CONFIG.USER}/current-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            console.log('Потребител зареден от API:', currentUser.username, 'Роля:', currentUser.role);
        } else if (response.status === 401) {
            console.log('Токенът е изтекъл или е невалиден');
            localStorage.removeItem('authToken');
            currentUser = null;
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
        
        const response = await fetch(`${window.API_CONFIG.POST}/${postId}?useNavigationalProperties=true`);
        
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
        let authorAvatarUrl = '../Assets/Images/bronze_logo.png';
        
        if (post.author) {
            authorName = post.author.username || 'Неизвестен автор';
            authorAvatarUrl = getAvatarImage(post.author.createdAt);
        }
        
        document.getElementById('forumAuthor').textContent = authorName;
        
        const authorAvatarImg = document.getElementById('forumAuthorAvatar');
        if (authorAvatarImg) {
            authorAvatarImg.src = authorAvatarUrl;
            authorAvatarImg.alt = authorName;
            authorAvatarImg.style.display = 'block';
        }
        
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
        let authorAvatarUrl = '../Assets/Images/bronze_logo.png';
        let authorName = 'Неизвестен потребител';
        let isAdmin = false;
        let canDelete = false;
        let commentAuthorId = null;
        
        if (comment.author) {
            commentAuthorId = comment.author.id;
            
            if (comment.author.role === 0) {
                authorName = 'Администратор';
                isAdmin = true;
                authorAvatarUrl = '../Assets/Images/gold_logo.png';
            } else {
                authorName = comment.author.username || 'Неизвестен потребител';
                authorAvatarUrl = getAvatarImage(comment.author.createdAt);
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
                        <img class="comment-author-avatar" src="${authorAvatarUrl}" alt="${escapeHtml(authorName)}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
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
        const response = await fetch(`${window.API_CONFIG.COMMENT}/${commentId}`, {
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
        year: 'numeric'
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
            postId: currentPost.id
        };
        
        console.log('Изпращам коментар:', commentData);
        
        const token = localStorage.getItem('authToken');
        const response = await fetch(window.API_CONFIG.COMMENT, {
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