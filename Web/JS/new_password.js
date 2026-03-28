document.addEventListener('DOMContentLoaded', function() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const resetForm = document.getElementById('resetForm');
    const successMessage = document.getElementById('successMessage');
    const resetPasswordSubmit = document.getElementById('resetPasswordSubmit');
    const passwordMatchMessage = document.getElementById('passwordMatchMessage');
    
    const verifiedEmail = localStorage.getItem('verifiedEmail');
    
    if (!verifiedEmail) {
        notificationSystem.showError('Няма верифициран имейл. Моля, започнете процеса отначало.', 3000);
        setTimeout(() => {
            window.location.href = 'forgot_password.html';
        }, 2000);
        return;
    }

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

    document.getElementById('passwordResetForm').addEventListener('submit', async function(e) {
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
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            notificationSystem.showError('Паролата трябва да съдържа поне 8 символа, главна буква, малка буква, цифра и специален символ!', 5000);
            return;
        }
        
        resetPasswordSubmit.classList.add('loading');
        resetPasswordSubmit.disabled = true;
        
        const loadingNotification = notificationSystem.showLoading('Сменяме вашата парола...');
        
        try {
            const apiUrl = `${window.API_CONFIG?.USER || '/api/user'}/reset-password`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: verifiedEmail,
                    newPassword: password
                })
            });
            
            const result = await response.json();
            
            notificationSystem.removeNotification(loadingNotification);
            
            if (response.ok) {
                notificationSystem.showSuccess(result.message || 'Паролата ви е успешно сменена!', 3000);
                
                setTimeout(() => {
                    resetForm.classList.add('hide');
                    setTimeout(() => {
                        resetForm.style.display = 'none';
                        successMessage.classList.add('show');
                        
                        localStorage.removeItem('verifiedEmail');
                    }, 500);
                }, 1000);
                
            } else {
                notificationSystem.showError(result.message || 'Грешка при смяна на паролата. Моля, опитайте отново.', 4000);
            }
            
        } catch (error) {
            console.error('Reset password error:', error);
            notificationSystem.removeNotification(loadingNotification);
            notificationSystem.showError('Грешка при свързване със сървъра. Моля, опитайте отново.', 4000);
        } finally {
            resetPasswordSubmit.classList.remove('loading');
            resetPasswordSubmit.disabled = false;
        }
    });

    document.getElementById('backToLogin').addEventListener('click', function() {
        successMessage.classList.remove('show');
        resetForm.style.display = 'block';
        resetForm.classList.remove('hide');
        
        localStorage.removeItem('verifiedEmail');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 500);
    });

    document.getElementById('goToLogin').addEventListener('click', function() {
        localStorage.removeItem('verifiedEmail');
        window.location.href = 'login.html';
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
});