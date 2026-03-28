// Header custom web component WITHOUT Shadow DOM
class Header extends HTMLElement {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.userData = null;
        this.checkSession();
    }

    async checkSession() {
        try {
            // Проверяваме сесията от сървъра
            const response = await fetch('https://localhost:7090/users/current-user', {
                credentials: 'include' // Важно за сесиите!
            });
            
            if (response.ok) {
                const user = await response.json();
                this.isLoggedIn = true;
                this.userData = {
                    id: user.Id,
                    name: user.Username,
                    email: user.Email,
                    role: user.Role,
                    firstLetter: user.Username ? user.Username.charAt(0).toUpperCase() : 'U'
                };
            } else {
                this.isLoggedIn = false;
                this.userData = null;
            }
        } catch (error) {
            console.log('Не е логнат или грешка:', error);
            this.isLoggedIn = false;
            this.userData = null;
        }
        
        // Ако компонентът вече е рендериран, обновяваме UI
        if (this.isConnected) {
            this.render();
            this.addEventListeners();
        }
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        
        // Проверяваме сесията на всеки 30 секунди
        this.sessionInterval = setInterval(() => {
            this.checkSession();
        }, 30000);
    }

    disconnectedCallback() {
        // Почистваме интервала при премахване на компонента
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
        }
    }

    render() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    --white: #ffffff;
                    --neon-green: #00ff9d;
                    --neon-red: #ff003c;
                    --green: #00cc7a;
                    --red: #e60033;
                    --dark: #0a0a14;
                    --dark-secondary: #151522;
                    --purple: #8a2be2;
                    --cyan: #00f3ff;
                    --shadow: 0 0 20px rgba(0, 255, 157, 0.3);
                    --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                    font-family: 'Inter', sans-serif;
                }
                
                .bulgarian-border {
                    height: 4px;
                    background: linear-gradient(90deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    box-shadow: 0 0 10px var(--neon-green), 0 0 20px var(--neon-red);
                }
                
                header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    z-index: 1000;
                    background: rgba(10, 10, 20, 0.9);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(0, 255, 157, 0.1);
                    box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
                }
                
                .nav-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1.2rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--white);
                    text-decoration: none;
                    z-index: 1001;
                    text-shadow: 0 0 10px var(--neon-green);
                }
                
                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--dark);
                    font-weight: 700;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 
                        0 0 15px var(--neon-green),
                        0 0 30px var(--neon-red);
                    animation: logoGlow 3s infinite alternate;
                }
                
                @keyframes logoGlow {
                    0% {
                        box-shadow: 
                            0 0 15px var(--neon-green),
                            0 0 30px var(--neon-red);
                    }
                    100% {
                        box-shadow: 
                            0 0 25px var(--neon-green),
                            0 0 50px var(--neon-red),
                            0 0 75px var(--purple);
                    }
                }
                
                .nav-links {
                    display: flex;
                    gap: 2.5rem;
                }
                
                .nav-link {
                    color: var(--white);
                    text-decoration: none;
                    font-weight: 500;
                    position: relative;
                    transition: var(--transition);
                    padding: 0.5rem 0;
                    text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
                }
                
                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    transition: var(--transition);
                    box-shadow: 0 0 10px var(--neon-green);
                }
                
                .nav-link:hover {
                    color: var(--neon-green);
                    text-shadow: 0 0 10px var(--neon-green);
                }
                
                .nav-link:hover::after {
                    width: 100%;
                }
                
                .nav-actions {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                
                #user-section {
                    position: relative;
                }
                
                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--dark);
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    position: relative;
                    box-shadow: 
                        0 0 10px var(--neon-green),
                        0 0 20px rgba(255, 0, 60, 0.3);
                    transition: var(--transition);
                    text-decoration: none;
                }
                
                .user-avatar:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 20px var(--neon-green), 0 0 40px var(--neon-red);
                }
                
                .btn {
                    padding: 0.8rem 1.8rem;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    position: relative;
                    overflow: hidden;
                    border: none;
                    outline: none;
                    font-family: 'Inter', sans-serif;
                    letter-spacing: 0.5px;
                }
                
                .btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: var(--transition);
                }
                
                .btn:hover::before {
                    left: 100%;
                }
                
                .btn-outline {
                    border: 2px solid var(--neon-green);
                    color: var(--neon-green);
                    background: transparent;
                    text-shadow: 0 0 5px var(--neon-green);
                    box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
                }
                
                .btn-outline:hover {
                    color: var(--dark);
                    background: var(--neon-green);
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(0, 255, 157, 0.5);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, var(--neon-green), var(--green));
                    color: var(--dark);
                    border: none;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                    box-shadow: 0 0 20px rgba(0, 255, 157, 0.4);
                }
                
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(0, 255, 157, 0.6);
                    background: linear-gradient(135deg, var(--neon-green), #00ff9d);
                }
                
                .mobile-menu-toggle {
                    display: none;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 35px;
                    height: 25px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    z-index: 1001;
                }
                
                .mobile-menu-toggle span {
                    display: block;
                    height: 3px;
                    width: 100%;
                    background-color: var(--neon-green);
                    border-radius: 3px;
                    transition: var(--transition);
                    box-shadow: 0 0 5px var(--neon-green);
                }
                
                .mobile-menu-toggle.active span:nth-child(1) {
                    transform: translateY(11px) rotate(45deg);
                    background: var(--neon-red);
                }
                
                .mobile-menu-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active span:nth-child(3) {
                    transform: translateY(-11px) rotate(-45deg);
                    background: var(--neon-red);
                }
                
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(10, 10, 20, 0.98);
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    transform: translateX(-100%);
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 999;
                    padding: 2rem;
                    backdrop-filter: blur(20px);
                }
                
                .mobile-menu.active {
                    transform: translateX(0);
                    display: flex;
                }
                
                .mobile-nav-links {
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                    margin-bottom: 4rem;
                    text-align: center;
                    width: 100%;
                    max-width: 300px;
                }
                
                .mobile-nav-link {
                    color: var(--white);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.8rem;
                    padding: 0.8rem 0;
                    transition: var(--transition);
                    text-shadow: 0 0 10px var(--neon-green);
                    border-bottom: 1px solid rgba(0, 255, 157, 0.1);
                }
                
                .mobile-nav-link:hover {
                    color: var(--neon-green);
                    transform: translateX(10px);
                    border-bottom-color: var(--neon-green);
                }
                
                .mobile-nav-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 300px;
                }
                
                .mobile-download-btn {
                    width: 100%;
                    margin-top: 10px;
                }
                
                .mobile-nav-actions .btn {
                    width: 100%;
                    justify-content: center;
                    padding: 1rem;
                    font-size: 1.1rem;
                }
                
                /* Responsive styles */
                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                    
                    .nav-container {
                        padding: 1rem 1.5rem;
                    }
                    
                    .mobile-menu-toggle {
                        display: flex;
                    }
                    
                    .nav-actions {
                        margin-right: -10px;
                        gap: 0;
                    }
                    
                    .user-avatar {
                        width: 35px;
                        height: 35px;
                        font-size: 16px;
                        margin-right: -15px;
                    }
                    
                    .btn-outline, .btn-primary {
                        padding: 0.6rem 1.2rem;
                        font-size: 0.9rem;
                    }
                }
                
                @media (max-width: 600px) {
                    .nav-actions {
                        margin-right: -15px;
                    }
                    
                    .user-avatar {
                        margin-right: -20px;
                    }
                }
                
                @media (max-width: 480px) {
                    .nav-container {
                        padding: 0.8rem 1rem;
                    }
                    
                    .logo {
                        font-size: 1.3rem;
                    }
                    
                    .logo-icon {
                        width: 35px;
                        height: 35px;
                    }
                    
                    .nav-actions {
                        margin-right: -18px;
                    }
                    
                    .user-avatar {
                        width: 34px;
                        height: 34px;
                        font-size: 18px;
                        margin-right: -22px;
                    }
                }
                
                @media (max-width: 400px) {
                    .nav-actions {
                        margin-right: -22px;
                    }
                    
                    .user-avatar {
                        margin-right: -25px;
                    }
                }
                
                @media (max-width: 360px) {
                    .logo {
                        font-size: 1.2rem;
                    }
                    
                    .logo-icon {
                        width: 30px;
                        height: 30px;
                    }
                    
                    .nav-actions {
                        margin-right: -25px;
                    }
                    
                    .user-avatar {
                        width: 32px;
                        height: 32px;
                        font-size: 16px;
                        margin-right: -28px;
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .fade-in {
                    animation: fadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                    opacity: 0;
                }
            </style>
            
            <header>
                <div class="bulgarian-border"></div>
                <div class="nav-container">
                    <a href="../HTML/index.html" class="logo">
                        <div class="logo-icon">K</div>
                        KiriliX
                    </a>
                    <div class="nav-links">
                        <a href="../HTML/docs.html" class="nav-link">Документация</a>
                        <a href="../HTML/news.html" class="nav-link">Новини</a>
                        <a href="../HTML/forum.html" class="nav-link">Форум</a>
                        <a href="../HTML/contact.html" class="nav-link">Контакти</a>
                    </div>
                    <div class="nav-actions">
                        <div id="user-section">
                            ${this.isLoggedIn ? this.renderUserIcon() : this.renderLoginButton()}
                        </div>
                        ${!this.isLoggedIn ? `<button class="btn btn-primary" id="download-btn">Изтегли</button>` : ''}
                    </div>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-nav-links">
                        <a href="../HTML/features.html" class="mobile-nav-link">Възможности</a>
                        <a href="../HTML/docs.html" class="mobile-nav-link">Документация</a>
                        <a href="../HTML/forum.html" class="mobile-nav-link">Блог</a>
                        <a href="../HTML/contact.html" class="mobile-nav-link">Контакти</a>
                    </div>
                    <div class="mobile-nav-actions" id="mobileUserSection">
                        ${!this.isLoggedIn ? `
                            <button class="btn btn-outline mobile-login-btn">Вход</button>
                            <button class="btn btn-primary mobile-download-btn">Изтегли</button>
                        ` : `
                            <button class="btn btn-primary mobile-download-btn">Изтегли</button>
                        `}
                    </div>
                </div>
            </header>
        `;
    }

    getFirstLetter() {
        if (this.userData?.name) {
            return this.userData.name.charAt(0).toUpperCase();
        }
        return 'U';
    }

    renderLoginButton() {
        return `
            <button id="login-btn" class="btn btn-outline">
                Вход
            </button>
        `;
    }

    renderUserIcon() {
        const firstLetter = this.getFirstLetter();
        const name = this.userData?.name || 'Потребител';
        
        return `
            <a href="../HTML/profile.html" class="user-avatar" title="${name}">
                ${firstLetter}
            </a>
        `;
    }

    addEventListeners() {
        // Mobile menu toggle
        const toggle = this.querySelector('#mobileMenuToggle');
        const mobileMenu = this.querySelector('#mobileMenu');
        
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close mobile menu when clicking links
        const mobileLinks = this.querySelectorAll('.mobile-nav-link, .mobile-login-btn, .mobile-download-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (toggle && mobileMenu) {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Login buttons
        const loginBtn = this.querySelector('#login-btn');
        const mobileLoginBtn = this.querySelector('.mobile-login-btn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../HTML/login.html';
            });
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../HTML/login.html';
            });
        }
        
        // Download buttons
        const downloadBtn = this.querySelector('#download-btn');
        const mobileDownloadBtn = this.querySelector('.mobile-download-btn');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../HTML/download.html';
            });
        }
        
        if (mobileDownloadBtn) {
            mobileDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../HTML/download.html';
            });
        }

        // Logout button (ако имаш такъв)
        const logoutBtn = this.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                try {
                    await fetch('https://localhost:7090/users/logout', {
                        method: 'POST',
                        credentials: 'include'
                    });
                    window.location.href = '../HTML/index.html';
                } catch (error) {
                    console.error('Грешка при изход:', error);
                }
            });
        }
    }
}

// Register the custom element
if (!customElements.get('kirilix-header')) {
    customElements.define('kirilix-header', Header);
}

export default Header;