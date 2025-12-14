 class NotificationSystem {
            constructor() {
                this.container = document.getElementById('notificationContainer');
            }

            showNotification(type, title, message, duration = 5000) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                
                let icon = '';
                switch(type) {
                    case 'success':
                        icon = '<i class="fas fa-check-circle"></i>';
                        break;
                    case 'warning':
                        icon = '<i class="fas fa-exclamation-triangle"></i>';
                        break;
                    case 'error':
                        icon = '<i class="fas fa-times-circle"></i>';
                        break;
                }

                notification.innerHTML = `
                    <div class="notification-icon">
                        ${icon}
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${title}</div>
                        <div class="notification-message">${message}</div>
                    </div>
                    <button class="notification-close">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                this.container.appendChild(notification);

                setTimeout(() => {
                    notification.classList.add('show');
                }, 10);

                if (duration > 0) {
                    setTimeout(() => {
                        this.removeNotification(notification);
                    }, duration);
                }

                const closeBtn = notification.querySelector('.notification-close');
                closeBtn.addEventListener('click', () => {
                    this.removeNotification(notification);
                });

                return notification;
            }

            removeNotification(notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }

            showSuccess(message, duration = 3000) {
                return this.showNotification('success', 'Успех!', message, duration);
            }

            showWarning(message, duration = 4000) {
                return this.showNotification('warning', 'Предупреждение', message, duration);
            }

            showError(message, duration = 5000) {
                return this.showNotification('error', 'Грешка', message, duration);
            }

            showLoading(message) {
                const notification = this.showNotification('warning', 'Моля изчакайте...', message, 0);
                return notification;
            }
        }