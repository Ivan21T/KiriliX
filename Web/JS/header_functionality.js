document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('kirilix-header');
    
    if (header) {
        header.addEventListener('header-login-click', function() {
            localStorage.setItem('returnUrl', window.location.href);
            window.location.href = "login.html";
        });
        
        header.addEventListener('header-download-click', function() {
        });
        
        const links = [
            { url: '#', text: 'Възможности' },
            { url: '#', text: 'Документация' },
            { url: 'forum.html', text: 'Блог' },
            { url: 'contact.html', text: 'Контакти' }
        ];
        header.updateNavigation(links);
        
        header.addEventListener('header-logout-click', function() {
            localStorage.removeItem('userData');
        });
    }
});