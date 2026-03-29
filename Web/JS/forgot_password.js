document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordSubmit = document.getElementById('forgotPasswordSubmit');
    const forgotEmailInput = document.getElementById('forgot-email');


    forgotPasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const email = forgotEmailInput.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            showAlert('Моля, въведете имейл адрес.', 'error');
            forgotEmailInput.focus();
            return;
        }
        
        if (!emailRegex.test(email)) {
            showAlert('Моля, въведете валиден имейл адрес.', 'error');
            forgotEmailInput.focus();
            return;
        }
        

        forgotPasswordSubmit.disabled = true;
        forgotPasswordSubmit.classList.add('loading');
        forgotPasswordSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Изпращане...';

        try {
            const loadingAlert = showAlert('Изпращане на линк за възстановяване...', 'pending');

            const offset = -(new Date().getTimezoneOffset());
            
            const apiUrl = `${window.API_CONFIG?.USER}/otp-code?email=${encodeURIComponent(email)}&offsetTime=${offset}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            await new Promise(resolve => setTimeout(resolve, 1500));

            if (loadingAlert && loadingAlert.parentNode) {
                loadingAlert.classList.remove('show');
                setTimeout(() => loadingAlert.remove(), 300);
            }

            if (response.ok) {
                showAlert(
                    `Код за възстановяване на паролата е изпратен на ${email}. Проверете пощата си.`,
                    'success'
                );

                sessionStorage.setItem('resetEmail', email);

                setTimeout(() => {
                    window.location.href = '../HTML/one_time_password.html';
                }, 5000);
                
            } else {
                let errorMessage = 'Грешка при изпращане на линк за възстановяване.';
                
                try {
                    const result = await response.json();
                    errorMessage = result.message || errorMessage;
                } catch (parseError) {
                    console.error('Error parsing response:', parseError);
                }
                
                showAlert(errorMessage, 'error');
                
                forgotPasswordSubmit.disabled = false;
                forgotPasswordSubmit.classList.remove('loading');
                forgotPasswordSubmit.textContent = 'Изпрати линк за възстановяване';
            }
            
        } catch (error) {
            showAlert('Грешка при свързване със сървъра. Моля, опитайте отново.', 'error');
            
            forgotPasswordSubmit.disabled = false;
            forgotPasswordSubmit.classList.remove('loading');
            forgotPasswordSubmit.textContent = 'Изпрати линк за възстановяване';
        }
    });

    forgotEmailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.style.borderColor = '#ff4757';
        } else if (email) {
            this.style.borderColor = '#2ed573';
        } else {
            this.style.borderColor = '';
        }
    });
});