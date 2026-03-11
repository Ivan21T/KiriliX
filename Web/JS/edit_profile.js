document.addEventListener("DOMContentLoaded", function() {
    const userJson = sessionStorage.getItem('user');
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
        window.location.href = 'login.html';
    }

    let currentUser = null;

    function loadUserData() {
        try {
            currentUser = JSON.parse(userJson);

            if (currentUser.username) {
                document.getElementById('username').value = currentUser.username;
            }
            if (currentUser.email) {
                document.getElementById('email').value = currentUser.email;
            }
            if (currentUser.id) {
                document.getElementById('userId').value = currentUser.id;
            }

        } catch (e) {
            console.error('Грешка при зареждане на потребител:', e);
            showAlert('Грешка при зареждане на профила', 'error');
        }
    }

    document.getElementById('backBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (document.referrer) {
            history.back();
        } else {
            window.location.href = 'profile.html';
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('newPassword');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    document.getElementById('editForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();

        if (!username) {
            showAlert('Моля въведете потребителско име!', 'error');
            return;
        }

        if (!email) {
            showAlert('Моля въведете имейл адрес!', 'error');
            return;
        }

        if (!validateEmail(email)) {
            showAlert('Моля въведете валиден имейл адрес!', 'error');
            return;
        }

        document.getElementById('saveBtnText').style.display = 'none';
        document.getElementById('saveLoader').style.display = 'inline-block';
        document.getElementById('saveBtn').disabled = true;

        try {
            const updates = {};
            
            if (username !== currentUser.username) {
                updates.username = username;
            }
            
            if (email !== currentUser.email) {
                updates.email = email;
            }
            
            if (newPassword) {
                updates.password = newPassword;
            }

            if (Object.keys(updates).length === 0) {
                showAlert('Няма направени промени!', 'info');
                
                document.getElementById('saveBtnText').style.display = 'inline';
                document.getElementById('saveLoader').style.display = 'none';
                document.getElementById('saveBtn').disabled = false;
                return;
            }

            showAlert('Запазване на промените...', 'pending');

            const response = await fetch(`${API_CONFIG.USER}/${currentUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            const result = await response.json();
            
            if (response.ok) {
                showAlert(result.message, 'success');

                // Обновяване на currentUser само ако има промени
                if (updates.username) {
                    currentUser.username = updates.username;
                }
                if (updates.email) {
                    currentUser.email = updates.email;
                }
                
                sessionStorage.setItem('user', JSON.stringify(currentUser));

                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Грешка при обновяване на потребителя', 'error');
                
                document.getElementById('saveBtnText').style.display = 'inline';
                document.getElementById('saveLoader').style.display = 'none';
                document.getElementById('saveBtn').disabled = false;
            }

        } catch (error) {
            console.error('Грешка при запазване:', error);
            showAlert('Възникна грешка при запазване на промените', 'error');
            
            document.getElementById('saveBtnText').style.display = 'inline';
            document.getElementById('saveLoader').style.display = 'none';
            document.getElementById('saveBtn').disabled = false;
        }
    });

    loadUserData();

    // Check session periodically
    setInterval(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser || sessionUser === 'undefined' || sessionUser === 'null') {
            window.location.href = 'login.html';
        }
    }, 1000);
});