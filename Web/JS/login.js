document.addEventListener('DOMContentLoaded', async function() {
    const modeBtns = document.querySelectorAll('.mode-btn');
    const modeIndicator = document.getElementById('modeIndicator');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    modeBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
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
        toggleBtn.addEventListener('click', async function() {
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

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            showAlert('Моля, попълнете всички полета!', 'error');
            return;
        }
        
        const submitBtn = document.getElementById('loginSubmit');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        showAlert('Влизане в акаунта...', 'pending');
        
        try {
            const response = await fetch(`${API_CONFIG.USER}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();
            if (!response.ok) {
                showAlert(data.message || 'Възникна грешка', 'error');
            } else {
                if(data.user && data.user.role==0){
                    await modeBtns[0].click();
                    await this.reset();
                    try {
                            const loadingAlert = showAlert('Изпращане на линк с код за автентикация ...', 'pending');

                            const offset = -(new Date().getTimezoneOffset());
                            
                            const apiUrl = `${window.API_CONFIG?.ADMIN}/otp-code?email=${encodeURIComponent(email)}&offsetTime=${offset}`;
                            
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

                                sessionStorage.setItem('adminEmail', email);

                                setTimeout(() => {
                                    window.location.href = '../HTML/admin_code.html';
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
                                
                            }
                            
                        } catch (error) {
                            showAlert('Грешка при свързване със сървъра. Моля, опитайте отново.', 'error');
                        }
                }
                else{
                    authToken = data.token;
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showAlert(data.message, 'success');
                    await modeBtns[0].click();
                    await this.reset();
                    window.location.href = "../HTML/index.html";
                }
            }

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            }
        catch(error) {
            showAlert('Грешка при връзка със сървъра', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Моля, попълнете всички полета!', 'error');
        return;
    }
    
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com', 'proton.me'];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
        showAlert('Моля, използвайте имейл адрес от Gmail, Yahoo, Outlook или ProtonMail!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Паролите не съвпадат!', 'error');
        return;
    }
    
    if (!PASSWORD_REGEX.test(password)) {
        showAlert('Паролата трябва да съдържа поне 8 символа, включително малка буква, голяма буква, цифра и специален символ!', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('registerSubmit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    showAlert('Създаване на акаунт...', 'pending');
    
    try {
        const response = await fetch(API_CONFIG.USER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                role: 1
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.message || 'Възникна грешка', 'error');
        } else {
            showAlert(data.message, 'success');
            await modeBtns[0].click();
            await this.reset();
        }

        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

    } catch (error) {
        showAlert('Грешка при връзка със сървъра', 'error');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

    document.querySelector('.forgot-password').addEventListener('click', async function(e) {
        e.preventDefault();
        window.location.href = "../HTML/forgot_password.html";
    });
});

async function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    authToken = null;
    window.location.href = "../HTML/login.html";
}