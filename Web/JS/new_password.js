document.addEventListener("DOMContentLoaded",function(){
    const notificationSystem = new NotificationSystem();

        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
        const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
        const resetForm = document.getElementById('resetForm');
        const successMessage = document.getElementById('successMessage');
        const resetPasswordSubmit = document.getElementById('resetPasswordSubmit');
        const passwordMatchMessage = document.getElementById('passwordMatchMessage');

        function checkPasswordMatch() {
            const password = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword === '') {
                passwordMatchMessage.classList.remove('show', 'success', 'error');
                confirmPasswordInput.classList.remove('error', 'success');
                return false;
            }
            
            if (password === confirmPassword) {
                passwordMatchMessage.innerHTML = '<i class="fas fa-check hint-icon"></i> Паролите съвпадат';
                passwordMatchMessage.className = 'password-match success show';
                confirmPasswordInput.classList.remove('error');
                confirmPasswordInput.classList.add('success');
                return true;
            } else {
                passwordMatchMessage.innerHTML = '<i class="fas fa-times hint-icon"></i> Паролите не съвпадат';
                passwordMatchMessage.className = 'password-match error show';
                confirmPasswordInput.classList.remove('success');
                confirmPasswordInput.classList.add('error');
                return false;
            }
        }

        newPasswordInput.addEventListener('input', function() {
            confirmPasswordInput.classList.remove('error', 'success');
            passwordMatchMessage.classList.remove('show', 'success', 'error');
        });

        confirmPasswordInput.addEventListener('input', checkPasswordMatch);

        toggleNewPasswordBtn.addEventListener('click', function() {
            const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            newPasswordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        toggleConfirmPasswordBtn.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });

        document.getElementById('passwordResetForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (!password || !confirmPassword) {
                notificationSystem.showError('Моля, попълнете и двете полета!', 3000);
                return;
            }
            
            if (password !== confirmPassword) {
                notificationSystem.showError('Паролите не съвпадат! Моля, проверете ги отново.', 4000);
                confirmPasswordInput.focus();
                return;
            }
            
            resetPasswordSubmit.classList.add('loading');
            resetPasswordSubmit.disabled = true;
            
            const loadingNotification = notificationSystem.showLoading('Сменяме вашата парола...');
            
            setTimeout(() => {
                notificationSystem.removeNotification(loadingNotification);
                
                notificationSystem.showSuccess('Паролата ви е успешно сменена!', 3000);
                
                setTimeout(() => {
                    resetForm.classList.add('hide');
                    setTimeout(() => {
                        resetForm.style.display = 'none';
                        successMessage.classList.add('show');
                    }, 500);
                }, 1000);
                
                resetPasswordSubmit.classList.remove('loading');
                resetPasswordSubmit.disabled = false;
                
                console.log('Паролата е сменена успешно');
                
            }, 1500);
        });

        document.getElementById('backToLogin').addEventListener('click', function() {
            successMessage.classList.remove('show');
            resetForm.style.display = 'block';
            resetForm.classList.remove('hide');
            
            console.log('Навигиране към страница за вход');
        });

        document.getElementById('goToLogin').addEventListener('click', function() {
;
            console.log('Навигиране към страница за вход');
        });

        window.addEventListener('DOMContentLoaded', () => {
            newPasswordInput.focus();
            
            setTimeout(() => {
                notificationSystem.showSuccess(
                    'Въведете новата парола и я потвърдете.', 
                    4000
                );
            }, 1000);
        });

        setInterval(() => {
            if (confirmPasswordInput.value) {
                checkPasswordMatch();
            }
        }, 300);
})