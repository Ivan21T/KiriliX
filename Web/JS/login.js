document.addEventListener('DOMContentLoaded', function() {
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
                showAlert(data.message, 'success');
                modeBtns[0].click();
                sessionStorage.setItem("user",data.user)
                this.reset();
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
        
        if (password !== confirmPassword) {
            showAlert('Паролите не съвпадат!', 'error');
            return;
        }
        
        if (password.length < 8) {
            showAlert('Паролата трябва да е поне 8 символа!', 'error');
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
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message || 'Възникна грешка', 'error');
            } else {
                showAlert(data.message, 'success');
                modeBtns[0].click();
                this.reset();
            }

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

        } catch (error) {
            showAlert('Грешка при връзка със сървъра', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = "../HTML/forgot_password.html";
    });
});