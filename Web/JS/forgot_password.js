        document.addEventListener('DOMContentLoaded', function() {
            const notifications = new NotificationSystem();
            emailjs.init('zmbWVx3i_C-gZPbpL');
            
            const forgotPasswordForm = document.getElementById('forgotPasswordForm');
            const forgotPasswordSubmit = document.getElementById('forgotPasswordSubmit');
            
            if (forgotPasswordForm) {
                forgotPasswordForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const email = document.getElementById('forgot-email').value;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (!email) {
                        notifications.showError('Моля, въведете имейл адрес.', 4000);
                        return;
                    }
                    
                    if (!emailRegex.test(email)) {
                        notifications.showError('Моля, въведете валиден имейл адрес.', 4000);
                        return;
                    }
                    
                    forgotPasswordSubmit.disabled = true;
                    forgotPasswordSubmit.classList.add('loading');
                    
                    const loadingNotification = notifications.showLoading('Изпращане на линк за възстановяване...');
                    
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    
                    notifications.removeNotification(loadingNotification);
                    
                    notifications.showSuccess(`Линк за възстановяване на паролата е изпратен на ${email}. Проверете пощата си.`, 5000);
                    
                    setTimeout(() => {
                        document.getElementById('forgot-email').value = '';
                        forgotPasswordSubmit.disabled = false;
                        forgotPasswordSubmit.classList.remove('loading');
                    }, 1000);
                });
            }
            
            window.addEventListener('resize', function() {
                const container = document.querySelector('.notification-container');
                if (window.innerWidth <= 768) {
                    container.style.flexDirection = 'column-reverse';
                } else {
                    container.style.flexDirection = 'column';
                }
            });
        });