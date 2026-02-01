function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');

        const existingPending = alertContainer.querySelector('.alert-message.pending');
        if (existingPending) existingPending.remove();

        const alert = document.createElement('div');
        alert.className = `alert-message ${type}`;

        const icon = document.createElement('i');
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else if (type === 'pending') {
            icon.className = 'fas fa-spinner fa-spin';
        } else {
            icon.className = 'fas fa-check-circle';
        }

        const text = document.createElement('span');
        text.textContent = message;

        alert.appendChild(icon);
        alert.appendChild(text);
        alertContainer.appendChild(alert);

        setTimeout(() => alert.classList.add('show'), 10);

        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }, type === 'pending' ? 10000 : 5000);
    }