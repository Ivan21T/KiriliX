document.addEventListener("DOMContentLoaded", async function () {

    function checkAuthAndRedirect() {
        const token = localStorage.getItem('authToken');

        if (!token) {
            showAlert('Моля, влезте в профила си', 'error');
            setTimeout(() => {
                window.location.href = '../HTML/login.html';
            }, 1000);
            return false;
        }
        return true;
    }

    let currentUser = null;

    async function loadCurrentUser() {
        try {
            const token = localStorage.getItem('authToken');

            if (!token) {
                window.location.href = '../HTML/login.html';
                return false;
            }

            const response = await authFetch(`${window.API_CONFIG.USER}/current-user`);

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => {
                    window.location.href = '../HTML/login.html';
                }, 1500);
                return false;
            }

            if (!response.ok) {
                throw new Error('Грешка при зареждане на потребител');
            }

            currentUser = await response.json();

            if (currentUser.username) {
                document.getElementById('username').value = currentUser.username;
            }
            if (currentUser.email) {
                document.getElementById('email').value = currentUser.email;
            }
            if (currentUser.id) {
                document.getElementById('userId').value = currentUser.id;
            }

            return true;
        } catch (error) {
            console.error('Грешка при зареждане на потребител:', error);
            showAlert('Грешка при зареждане на профила', 'error');
            return false;
        }
    }

    if (!checkAuthAndRedirect()) {
        return;
    }

    document.getElementById('backBtn')?.addEventListener('click', function (e) {
        e.preventDefault();
        if (document.referrer) {
            history.back();
        } else {
            window.location.href = 'profile.html';
        }
    });

    document.getElementById('cancelBtn')?.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    document.getElementById('togglePassword')?.addEventListener('click', function () {
        const passwordInput = document.getElementById('newPassword');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    const userLoaded = await loadCurrentUser();

    if (!userLoaded || !currentUser) {
        showAlert('Неуспешно зареждане на профила', 'error');
        setTimeout(() => {
            window.location.href = '../HTML/login.html';
        }, 1500);
        return;
    }

    document.getElementById('editForm')?.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();

        if (!username || username.length < window.Validation.USERNAME_MIN_LENGTH) {
            showAlert(`Потребителското име трябва да е поне ${window.Validation.USERNAME_MIN_LENGTH} символа!`, 'error');
            return;
        }

        if (!email) {
            showAlert('Моля въведете имейл адрес!', 'error');
            return;
        }

        if (!window.Validation.isValidEmailDomain(email)) {
            showAlert('Моля, използвайте имейл адрес от Gmail, Yahoo, Outlook или ProtonMail!', 'error');
            return;
        }

        if (newPassword && !window.Validation.isValidPassword(newPassword)) {
            showAlert('Паролата трябва да съдържа поне 8 символа, главна буква, малка буква, цифра и специален символ!', 'error');
            return;
        }

        const saveBtn = document.getElementById('saveBtn');
        const saveBtnText = document.getElementById('saveBtnText');
        const saveLoader = document.getElementById('saveLoader');

        saveBtnText.style.display = 'none';
        saveLoader.style.display = 'inline-block';
        saveBtn.disabled = true;

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

                saveBtnText.style.display = 'inline';
                saveLoader.style.display = 'none';
                saveBtn.disabled = false;
                return;
            }

            showAlert('Запазване на промените...', 'pending');

            const response = await authFetch(`${window.API_CONFIG.USER}/${currentUser.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates)
            });

            if (response.status === 401) {
                localStorage.removeItem('authToken');
                showAlert('Сесията ви е изтекла. Моля, влезте отново.', 'error');
                setTimeout(() => {
                    window.location.href = '../HTML/login.html';
                }, 1500);
                return;
            }

            const result = await response.json();

            if (response.ok) {
                showAlert(result.message || 'Профилът беше обновен успешно!', 'success');

                if (updates.username) {
                    currentUser.username = updates.username;
                }
                if (updates.email) {
                    currentUser.email = updates.email;
                }

                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                showAlert(result.message || 'Грешка при обновяване на потребителя', 'error');

                saveBtnText.style.display = 'inline';
                saveLoader.style.display = 'none';
                saveBtn.disabled = false;
            }

        } catch (error) {
            console.error('Грешка при запазване:', error);
            showAlert('Възникна грешка при запазване на промените', 'error');

            saveBtnText.style.display = 'inline';
            saveLoader.style.display = 'none';
            saveBtn.disabled = false;
        }
    });

    setInterval(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '../HTML/login.html';
        }
    }, 5000);
});