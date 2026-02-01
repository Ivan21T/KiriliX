document.addEventListener('DOMContentLoaded', function() {
        const notificationSystem = new NotificationSystem();
        const modeBtns = document.querySelectorAll('.mode-btn');
        const modeIndicator = document.getElementById('modeIndicator');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.getAttribute('data-mode');
                
                modeBtns.forEach(b => b.classList.remove('active'));

                btn.classList.add('active');
                

                modeIndicator.classList.toggle('register', mode === 'register');
                

                if (mode === 'login') {
                    loginForm.classList.add('active');
                    registerForm.classList.remove('active');
                } else {
                    loginForm.classList.remove('active');
                    registerForm.classList.add('active');
                }
            });
        });

        document.querySelectorAll('.toggle-password').forEach(toggleBtn => {
            toggleBtn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.innerHTML = '<i class="fas fa-eye-slash"></i>';
                } else {
                    passwordInput.type = 'password';
                    this.innerHTML = '<i class="fas fa-eye"></i>';
                }
            });
        });



        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                notificationSystem.showError('Моля, попълнете всички полета!', 3000);
                return;
            }
            

            const submitBtn = document.getElementById('loginSubmit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            

            const loadingNotification = notificationSystem.showLoading('Влизане в акаунта...');
            

            setTimeout(() => {
                notificationSystem.removeNotification(loadingNotification);
                

                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                

                notificationSystem.showSuccess('Успешно влязохте в акаунта си!', 3000);
                
                
            }, 1500);
        });


        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            

            if (!username || !email || !password || !confirmPassword) {
                notificationSystem.showError('Моля, попълнете всички полета!', 3000);
                return;
            }
            
            if (password !== confirmPassword) {
                notificationSystem.showError('Паролите не съвпадат!', 3000);
                return;
            }
            
            if (password.length < 8) {
                notificationSystem.showError('Паролата трябва да е поне 8 символа!', 3000);
                return;
            }
            

            const submitBtn = document.getElementById('registerSubmit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            

            const loadingNotification = notificationSystem.showLoading('Създаване на акаунт...');
            
             try {
                    const response = await fetch(API_CONFIG.USER, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })
                    });

                    const data = await response.json();

                    notificationSystem.removeNotification(loadingNotification);

                    if (!response.ok) {
                        notificationSystem.showError(data.message || 'Възникна грешка', 3000);
                    } else {
                        notificationSystem.showSuccess(data.message, 3000);

                        modeBtns[0].click();
                        this.reset();
                    }

                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;

                } catch (error) {
                    notificationSystem.removeNotification(loadingNotification);
                    notificationSystem.showError('Грешка при връзка със сървъра');

                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }

        });

        document.querySelector('.forgot-password').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = "../HTML/forgot_password.html";
        });
});