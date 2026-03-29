document.addEventListener("DOMContentLoaded", function() {
    const email = sessionStorage.getItem('adminEmail');
    
    if (!email) {
        showAlert('Няма имейл за продължаване напред. Моля, опитайте отново.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
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
                showAlert('Моля, въведете само цифри!', 'error');
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
                showAlert('Кодът е поставен успешно!', 'success');
            } else {
                showAlert('Моля, поставете валиден 6-цифрен код!', 'error');
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

    resendBtn.addEventListener('click', async function() {
        if (!this.disabled) {
            try {
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Изпращане...';
                
                const offset = -(new Date().getTimezoneOffset());
                const apiUrl = `${window.API_CONFIG?.ADMIN}/resend?email=${encodeURIComponent(email)}&offsetTime=${offset}`;
                
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showAlert('Нов код е изпратен! Проверете вашата имейл поща.', 'success');
                    
                    codeInputs.forEach(input => {
                        input.value = '';
                        input.classList.remove('active');
                    });
                    
                    codeInputs[0].focus();
                    
                    countdownTime = 60;
                    timerElement.textContent = 'Можете да изпратите нов код след: ';
                    timerElement.classList.remove('highlight');
                    resendBtn.disabled = true;
                    resendBtn.innerHTML = 'Изпрати код отново';
                    
                    clearInterval(countdownInterval);
                    countdownInterval = setInterval(updateCountdown, 1000);
                    updateCountdown();
                } else {
                    let errorMessage = 'Грешка при изпращане на нов код.';
                    try {
                        const result = await response.json();
                        errorMessage = result.message || errorMessage;
                    } catch (parseError) {
                        console.error('Error parsing response:', parseError);
                    }
                    showAlert(errorMessage, 'error');
                    this.disabled = false;
                    this.innerHTML = 'Изпрати нов код';
                }
                
            } catch (error) {
                console.error('Resend error:', error);
                showAlert('Грешка при свързване със сървъра. Моля, опитайте отново.', 'error');
                this.disabled = false;
                this.innerHTML = 'Изпрати нов код';
            }
        }
    });

    document.getElementById('activationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const enteredCode = codeInputs.map(input => input.value).join('');
        
        if (enteredCode.length !== 6) {
            showAlert('Моля, въведете всички 6 цифри от кода.', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('activateSubmit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        showAlert('Проверяваме кода...', 'pending');
        
        try {
            const apiUrl = `${window.API_CONFIG?.ADMIN}/verify`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    code: enteredCode
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                authToken = result.token;
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                showAlert(result.message, 'success');
                window.location.href = "../HTML/admin.html";
            } else {
                showAlert(result.message || 'Въведеният код не е правилен. Моля, опитайте отново.', 'error');
                
                codeInputs.forEach(input => {
                    input.style.borderColor = 'var(--neon-red)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                    }, 1000);
                });
                
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
            
        } catch (error) {
            console.error('Verification error:', error);
            showAlert('Грешка при свързване със сървъра. Моля, опитайте отново.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

});