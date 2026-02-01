document.addEventListener("DOMContentLoaded",function(){

        const email = sessionStorage.getItem('resetEmail');
        document.getElementById('emailDisplay').textContent = `Кодът е изпратен на: ${email}`;

        const codeInputs = [
            document.getElementById('code1'),
            document.getElementById('code2'),
            document.getElementById('code3'),
            document.getElementById('code4'),
            document.getElementById('code5'),
            document.getElementById('code6')
        ];

        codeInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value && !/^\d$/.test(e.target.value)) {
                    e.target.value = '';
                    notificationSystem.showError('Моля, въведете само цифри!', 2000);
                    return;
                }
                
                if (e.target.value && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                if (e.target.value) {
                    e.target.classList.add('active');
                } else {
                    e.target.classList.remove('active');
                }
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    codeInputs[index - 1].focus();
                }
                
                if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                if (e.key === 'ArrowLeft' && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
            
            input.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = e.clipboardData.getData('text').trim();
                
                if (/^\d{6}$/.test(pasteData)) {
                    for (let i = 0; i < 6; i++) {
                        codeInputs[i].value = pasteData[i];
                        codeInputs[i].classList.add('active');
                    }
                    codeInputs[5].focus();
                    notificationSystem.showSuccess('Кодът е поставен успешно!', 2000);
                } else {
                    notificationSystem.showError('Моля, поставете валиден 6-цифрен код!', 3000);
                }
            });
        });

        let countdownTime = 60; 
        const countdownElement = document.getElementById('countdown');
        const resendBtn = document.getElementById('resendCodeBtn');
        const timerElement = document.getElementById('timer');

        function updateCountdown() {
            const minutes = Math.floor(countdownTime / 60);
            const seconds = countdownTime % 60;
            
            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (countdownTime <= 30) {
                timerElement.classList.add('highlight');
            }
            
            if (countdownTime <= 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = "00:00";
                resendBtn.disabled = false;
                resendBtn.textContent = "Изпрати нов код";
                timerElement.textContent = "Можете да изпратите нов код";
                timerElement.classList.remove('highlight');
            } else {
                countdownTime--;
            }
        }

        let countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown(); 

        resendBtn.addEventListener('click', function() {
            if (!this.disabled) {
                notificationSystem.showSuccess('Нов код е изпратен! Проверете вашата имейл поща.', 4000);
                
                codeInputs.forEach(input => {
                    input.value = '';
                    input.classList.remove('active');
                });
                
                codeInputs[0].focus();
                
                // Променете и тук на 60 секунди
                countdownTime = 60;
                timerElement.textContent = 'Можете да изпратите нов код след: ';
                timerElement.classList.remove('highlight');
                resendBtn.disabled = true;
                resendBtn.textContent = 'Изпрати код отново';
                
                clearInterval(countdownInterval);
                countdownInterval = setInterval(updateCountdown, 1000);
                updateCountdown();
            }
        });

        document.getElementById('activationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const enteredCode = codeInputs.map(input => input.value).join('');
            
            if (enteredCode.length !== 6) {
                notificationSystem.showError('Моля, въведете всички 6 цифри от кода.', 3000);
                return;
            }
            
            const submitBtn = document.getElementById('activateSubmit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            const loadingNotification = notificationSystem.showLoading('Проверяваме кода...');
            
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                
                notificationSystem.removeNotification(loadingNotification);
                
                if (enteredCode === '123456') {
                    notificationSystem.showSuccess('Кодът е валиден! Пренасочваме към страницата за нова парола...', 3000);
                    
                    const verifiedEmail = sessionStorage.getItem('resetEmail');
                    localStorage.setItem('verifiedEmail', verifiedEmail);
                    
                    setTimeout(() => {
                        window.location.href = 'reset_password.html';
                    }, 2000);
                } else {
                    notificationSystem.showError('Въведеният код не е правилен. Моля, опитайте отново.', 4000);
                    
                    codeInputs.forEach(input => {
                        input.style.borderColor = 'var(--neon-red)';
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 1000);
                    });
                }
            }, 1500);
        });

        document.getElementById('backToForgotPassword').addEventListener('click', function() {
            window.location.href = 'forgot_password.html';
        });

        window.addEventListener('load', () => {
            codeInputs[0].focus();
            
            setTimeout(() => {
                notificationSystem.showSuccess('Кодът е изпратен на вашия имейл. Моля, проверете пощата си.', 5000);
            }, 1000);
        });

        function generateRandomCode() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }
        
        const demoCode = generateRandomCode();
        localStorage.setItem('demoActivationCode', demoCode);
});