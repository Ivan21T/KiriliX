function showAlert(message, type) {
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        document.body.appendChild(alertContainer);
    }

    const existingPending = alertContainer.querySelector('.alert-message.pending');
    if (existingPending) existingPending.remove();

    const alert = document.createElement('div');
    alert.className = `alert-message ${type}`;

    const icon = document.createElement('i');
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else if (type === 'pending') {
        icon.className = 'fas fa-spinner fa-spin';
    } else if (type === 'info') {
        icon.className = 'fas fa-info-circle';
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
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => {
                if (alert.parentNode) alert.remove();
            }, 300);
        }
    }, type === 'pending' ? 10000 : 5000);

    return alert;
}