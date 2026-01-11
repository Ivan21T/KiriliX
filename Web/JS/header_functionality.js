document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('kirilix-header');
    
    if (header) {
        header.addEventListener('header-login-click', function() {
            localStorage.setItem('returnUrl', window.location.href);
            window.location.href = "../HTML/login.html";
        });
        
        header.addEventListener('header-download-click', function() {
            console.log('Download clicked!');
        });
        
        const links = [
            { url: '#', text: 'Възможности' },
            { url: '#', text: 'Документация' },
            { url: '../HTML/forum.html', text: 'Блог' },
            { url: '../HTML/contact.html', text: 'Контакти' }
        ];
        header.updateNavigation(links);
        
        header.addEventListener('header-logout-click', function() {
            localStorage.removeItem('userData');
            console.log('User logged out');
        });
    }
});