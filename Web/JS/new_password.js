document.addEventListener('DOMContentLoaded', async function() {
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const toggleNewPasswordBtn = document.getElementById('toggleNewPassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const resetForm = document.getElementById('resetForm');
    const successMessage = document.getElementById('successMessage');
    const resetPasswordSubmit = document.getElementById('resetPasswordSubmit');
    
    const verifiedEmail = localStorage.getItem('verifiedEmail');
    
    if (!verifiedEmail) {
        showAlert('Няма верифициран имейл. Моля, започнете процеса отначало.', 'error');
        setTimeout(() => {
            window.location.href = 'forgot_password.html';
        }, 2000);
        return;
    }

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
            showAlert('Моля, попълнете и двете полета!', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('Паролите не съвпадат! Моля, проверете ги отново.', 'error');
            confirmPasswordInput.focus();
            return;
        }
        
        if (!window.Validation.isValidPassword(password)) {
            showAlert('Паролата трябва да съдържа поне 8 символа, главна буква, малка буква, цифра и специален символ!', 'error');
            return;
        }
        
        resetPasswordSubmit.classList.add('loading');
        resetPasswordSubmit.disabled = true;
        
        showAlert('Смяна на вашата парола...', 'pending');
        
        try {
            const apiUrl = `${window.API_CONFIG?.USER}/reset-password`;
            
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
            
            if (response.ok) {
                
                showAlert(result.message || 'Паролата ви е успешно сменена!', 'success');
                
                setTimeout(() => {
                    resetForm.classList.add('hide');
                    setTimeout(() => {
                        resetForm.style.display = 'none';
                        successMessage.classList.add('show');
                        
                        localStorage.removeItem('verifiedEmail');
                    }, 500);
                }, 1000);
                
            } else {
                showAlert(result.message || 'Грешка при смяна на паролата. Моля, опитайте отново.', 'error');
            }
            
        } catch (error) {
            showAlert('Грешка при свързване със сървъра. Моля, опитайте отново.', 'error');
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

    newPasswordInput.focus();
    
    setTimeout(() => {
        showAlert('Въведете новата парола и я потвърдете.', 'info');
    }, 1000);
});