let currentPostId = null;
let currentUser = null;
let currentPost = null;

window.addEventListener('load', function () {
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

async function loadCurrentUser() {
    try {
        const token = localStorage.getItem('authToken');

        if (!token) {
            currentUser = null;
            return;
        }

        const response = await fetch(`${window.API_CONFIG.USER}/current-user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            currentUser = await response.json();
        } else if (response.status === 401) {
            localStorage.removeItem('authToken');
            currentUser = null;
        } else {
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



        document.getElementById('forumTitle').textContent = post.title || 'Без заглавие';

        let authorName = 'Неизвестен автор';
        let authorAvatarUrl = '../Assets/Images/bronze_logo.png';
        let isAdmin = false;

        if (post.author) {
            if (post.author.role === 0) {
                authorName = 'Администратор';
                isAdmin = true;
                authorAvatarUrl = '../Assets/Images/gold_logo.png';
            } else {
                authorName = post.author.username || 'Неизвестен автор';
                authorAvatarUrl = getAvatarImage(post.author.createdAt);
            }
        }

        document.getElementById('forumAuthor').textContent = authorName;

        const authorBadgeSpan = document.getElementById('forumAuthorBadge');
        if (authorBadgeSpan) {
            if (isAdmin) {
                authorBadgeSpan.innerHTML = ' <span class="admin-badge">Админ</span>';
                authorBadgeSpan.style.display = 'inline';
            } else {
                authorBadgeSpan.innerHTML = '';
                authorBadgeSpan.style.display = 'none';
            }
        }

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
                flex-wrap: wrap;
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
            
            @media (max-width: 768px) {
                .custom-confirm-modal {
                    padding: 30px 20px;
                    width: 85%;
                }
                
                .custom-confirm-title {
                    font-size: 1.5rem;
                }
                
                .custom-confirm-message {
                    font-size: 1rem;
                }
                
                .custom-confirm-btn {
                    padding: 10px 20px;
                    font-size: 0.9rem;
                }
            }
            
            @media (max-width: 480px) {
                .custom-confirm-modal {
                    padding: 25px 15px;
                    width: 90%;
                }
                
                .custom-confirm-icon {
                    font-size: 3rem;
                }
                
                .custom-confirm-title {
                    font-size: 1.3rem;
                }
                
                .custom-confirm-message {
                    font-size: 0.9rem;
                }
                
                .custom-confirm-actions {
                    gap: 10px;
                }
                
                .custom-confirm-btn {
                    padding: 8px 16px;
                    font-size: 0.85rem;
                }
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

async function deleteComment(commentId) {
    if (!commentId) {
        showAlert('Невалиден ID на коментар', 'error');
        return;
    }

    if (!currentUser) {
        showAlert('Трябва да сте влезли в профила си, за да изтриете коментар', 'warning');
        return;
    }

    customConfirm('Сигурни ли сте, че искате да изтриете този коментар?', async () => {
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
                } catch (e) { }
                throw new Error(errorMessage);
            }

            showAlert('Коментарът беше изтрит успешно!', 'success');

            await loadPostDetails(currentPostId);

        } catch (error) {
            showAlert(error.message || 'Грешка при изтриване на коментар', 'error');

            const deleteBtn = document.querySelector(`.comment-item[data-comment-id="${commentId}"] .delete-comment-btn`);
            if (deleteBtn) {
                deleteBtn.disabled = false;
                deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            }
        }
    });
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

    if (!content || content.length < window.Validation.CONTENT_MIN_LENGTH) {
        showAlert(`Моля, въведете съдържание на коментара (поне ${window.Validation.CONTENT_MIN_LENGTH} символа)`, 'error');
        return;
    }

    if (!currentUser) {
        showAlert('Трябва да сте влезли в профила си, за да коментирате', 'error');
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
    button.addEventListener('click', function (e) {
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