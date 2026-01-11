// Header custom web component WITHOUT Shadow DOM
class Header extends HTMLElement {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.userData = null;
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
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
                
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    padding: 8px 16px;
                    border-radius: 12px;
                    transition: var(--transition);
                    background: rgba(0, 255, 157, 0.1);
                    border: 1px solid rgba(0, 255, 157, 0.2);
                }
                
                .user-menu:hover {
                    background: rgba(0, 255, 157, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 255, 157, 0.3);
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
                    position: relative;
                    box-shadow: 
                        0 0 10px var(--neon-green),
                        0 0 20px rgba(255, 0, 60, 0.3);
                    transition: var(--transition);
                }
                
                .online-indicator {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 10px;
                    height: 10px;
                    background-color: var(--neon-green);
                    border-radius: 50%;
                    border: 2px solid var(--dark);
                    box-shadow: 0 0 5px var(--neon-green);
                }
                
                .user-name-desktop {
                    color: var(--white);
                    font-weight: 600;
                    font-size: 14px;
                    max-width: 120px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-shadow: 0 0 5px rgba(0, 255, 157, 0.5);
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
                
                /* Dropdown Menu */
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    width: 280px;
                    background: var(--dark);
                    border: 1px solid rgba(0, 255, 157, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 
                        0 10px 40px rgba(0, 0, 0, 0.7),
                        0 0 20px rgba(0, 255, 157, 0.2);
                    display: none;
                    z-index: 1002;
                    backdrop-filter: blur(20px);
                    margin-top: 10px;
                    animation: dropdownFadeIn 0.3s ease;
                }
                
                @keyframes dropdownFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .user-dropdown.show {
                    display: block;
                }
                
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .user-avatar-small {
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--dark);
                    font-weight: 700;
                    font-size: 18px;
                    box-shadow: 0 0 15px rgba(0, 255, 157, 0.5);
                }
                
                .user-details {
                    flex: 1;
                }
                
                .user-name {
                    color: var(--white);
                    font-weight: 600;
                    font-size: 16px;
                    margin-bottom: 4px;
                }
                
                .user-email {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 12px;
                    word-break: break-all;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: rgba(0, 255, 157, 0.2);
                    margin: 15px 0;
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    color: var(--white);
                    text-decoration: none;
                    border-radius: 8px;
                    transition: var(--transition);
                    margin-bottom: 5px;
                }
                
                .dropdown-item:hover {
                    background: rgba(0, 255, 157, 0.1);
                    transform: translateX(5px);
                }
                
                .dropdown-item.logout {
                    color: var(--neon-red);
                }
                
                .dropdown-item.logout:hover {
                    background: rgba(255, 0, 60, 0.1);
                }
                
                .dropdown-icon {
                    width: 24px;
                    text-align: center;
                    font-size: 16px;
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
                
                .mobile-user-info {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 25px;
                    padding: 15px;
                    background: rgba(0, 255, 157, 0.1);
                    border-radius: 12px;
                    width: 100%;
                }
                
                .mobile-user-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--white) 33%, var(--neon-green) 33%, var(--neon-green) 66%, var(--neon-red) 66%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--dark);
                    font-weight: 700;
                    font-size: 20px;
                    box-shadow: 0 0 20px rgba(0, 255, 157, 0.5);
                }
                
                .mobile-user-details {
                    flex: 1;
                }
                
                .mobile-user-name {
                    color: var(--white);
                    font-weight: 600;
                    font-size: 18px;
                    margin-bottom: 5px;
                }
                
                .mobile-user-email {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    word-break: break-all;
                }
                
                .mobile-user-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    width: 100%;
                    margin-bottom: 25px;
                }
                
                .mobile-user-action {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    color: var(--white);
                    text-decoration: none;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    transition: var(--transition);
                    font-size: 16px;
                }
                
                .mobile-user-action:hover {
                    background: rgba(0, 255, 157, 0.1);
                    transform: translateX(10px);
                }
                
                .mobile-user-action.logout {
                    color: var(--neon-red);
                }
                
                .action-icon {
                    width: 30px;
                    text-align: center;
                    font-size: 18px;
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
                    .nav-links, .nav-actions .btn-outline:not(#login-btn) {
                        display: none;
                    }
                    
                    .mobile-menu-toggle {
                        display: flex;
                    }
                    
                    .nav-container {
                        padding: 1rem 1.5rem;
                    }
                    
                    .nav-actions .btn-outline {
                        display: ${this.isLoggedIn ? 'none' : 'inline-flex'};
                    }
                    
                    .user-menu {
                        padding: 6px 12px;
                    }
                    
                    .user-avatar {
                        width: 35px;
                        height: 35px;
                        font-size: 14px;
                    }
                    
                    .user-name-desktop {
                        font-size: 12px;
                        max-width: 80px;
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
                    
                    .user-menu {
                        padding: 4px 8px;
                        gap: 8px;
                    }
                    
                    .user-avatar {
                        width: 30px;
                        height: 30px;
                        font-size: 12px;
                    }
                    
                    .user-name-desktop {
                        font-size: 11px;
                        max-width: 60px;
                    }
                    
                    .mobile-user-info {
                        flex-direction: column;
                        text-align: center;
                        padding: 20px;
                    }
                    
                    .mobile-user-details {
                        text-align: center;
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
                    
                    .user-menu {
                        min-width: auto;
                    }
                    
                    .user-name-desktop {
                        display: none;
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
                    <a href="#" class="logo">
                        <div class="logo-icon">K</div>
                        KiriliX
                    </a>
                    <div class="nav-links">
                        <a href="#" class="nav-link">Възможности</a>
                        <a href="#" class="nav-link">Документация</a>
                        <a href="../HTML/forum.html" class="nav-link">Блог</a>
                        <a href="../HTML/contact.html" class="nav-link">Контакти</a>
                    </div>
                    <div class="nav-actions">
                        <div id="user-section">
                            ${this.isLoggedIn ? this.renderUserIcon() : this.renderLoginButton()}
                        </div>
                        <button class="btn btn-primary" id="download-btn">
                            Изтегли
                        </button>
                    </div>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-nav-links">
                        <a href="#" class="mobile-nav-link">Възможности</a>
                        <a href="#" class="mobile-nav-link">Документация</a>
                        <a href="../HTML/forum.html" class="mobile-nav-link">Блог</a>
                        <a href="../HTML/contact.html" class="mobile-nav-link">Контакти</a>
                    </div>
                    <div class="mobile-nav-actions" id="mobileUserSection">
                        ${this.isLoggedIn ? this.renderMobileUserMenu() : this.renderMobileLoginButton()}
                    </div>
                </div>

                <!-- Dropdown Menu for Desktop -->
                ${this.isLoggedIn ? `
                <div class="user-dropdown" id="userDropdown">
                    <div class="user-info">
                        <div class="user-avatar-small">${this.userData?.initials || 'U'}</div>
                        <div class="user-details">
                            <div class="user-name">${this.userData?.name || 'Потребител'}</div>
                            <div class="user-email">${this.userData?.email || 'user@example.com'}</div>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item">
                        <div class="dropdown-icon">👤</div>
                        Профил
                    </a>
                    <a href="#" class="dropdown-item">
                        <div class="dropdown-icon">⚙️</div>
                        Настройки
                    </a>
                    <a href="#" class="dropdown-item">
                        <div class="dropdown-icon">📋</div>
                        Моите проекти
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout">
                        <div class="dropdown-icon">🚪</div>
                        Изход
                    </a>
                </div>
                ` : ''}
            </header>
        `;
    }

    renderLoginButton() {
        return `
            <button id="login-btn" class="btn btn-outline">
                Вход
            </button>
        `;
    }

    renderUserIcon() {
        const initials = this.userData?.initials || 'U';
        const name = this.userData?.name || 'Потребител';
        
        return `
            <div class="user-menu" id="desktopUserMenu">
                <div class="user-avatar" title="${name}">
                    ${initials}
                    <div class="online-indicator"></div>
                </div>
                <div class="user-name-desktop">${name}</div>
            </div>
        `;
    }

    renderMobileLoginButton() {
        return `
            <button class="btn btn-outline mobile-login-btn">
                Вход
            </button>
            <button class="btn btn-primary mobile-download-btn">
                Изтегли
            </button>
        `;
    }

    renderMobileUserMenu() {
        const initials = this.userData?.initials || 'U';
        const name = this.userData?.name || 'Потребител';
        
        return `
            <div class="mobile-user-info">
                <div class="mobile-user-avatar">
                    ${initials}
                </div>
                <div class="mobile-user-details">
                    <div class="mobile-user-name">${name}</div>
                    <div class="mobile-user-email">${this.userData?.email || 'user@example.com'}</div>
                </div>
            </div>
            <div class="mobile-user-actions">
                <a href="#" class="mobile-user-action">
                    <div class="action-icon">👤</div>
                    Профил
                </a>
                <a href="#" class="mobile-user-action">
                    <div class="action-icon">⚙️</div>
                    Настройки
                </a>
                <a href="#" class="mobile-user-action">
                    <div class="action-icon">📋</div>
                    Моите проекти
                </a>
                <a href="#" class="mobile-user-action logout">
                    <div class="action-icon">🚪</div>
                    Изход
                </a>
            </div>
            <button class="btn btn-primary mobile-download-btn">
                Изтегли
            </button>
        `;
    }

    setUserLoggedIn(isLoggedIn, userData = null) {
        this.isLoggedIn = isLoggedIn;
        this.userData = userData;
        
        if (userData && userData.name) {
            const names = userData.name.split(' ');
            userData.initials = names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }
        
        this.render();
        this.addEventListeners();
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
        const mobileLinks = this.querySelectorAll('.mobile-nav-link, .mobile-user-action, .mobile-login-btn, .mobile-download-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (toggle && mobileMenu) {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Dispatch events for buttons (buttons outside will catch these)
        const loginBtn = this.querySelector('#login-btn');
        const mobileLoginBtn = this.querySelector('.mobile-login-btn');
        const downloadBtn = this.querySelector('#download-btn');
        const mobileDownloadBtn = this.querySelector('.mobile-download-btn');
        
        // LOGIN button
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-login-click'));
            });
        }
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-login-click'));
            });
        }
        
        // DOWNLOAD button
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-download-click'));
            });
        }
        
        if (mobileDownloadBtn) {
            mobileDownloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-download-click'));
            });
        }
        
        // User dropdown for desktop
        const userMenu = this.querySelector('#desktopUserMenu');
        const dropdown = this.querySelector('#userDropdown');
        
        if (userMenu && dropdown) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            document.addEventListener('click', () => {
                dropdown.classList.remove('show');
            });
        }
        
        // Logout buttons
        const logoutButtons = this.querySelectorAll('.logout');
        logoutButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setUserLoggedIn(false, null);
                this.dispatchEvent(new CustomEvent('header-logout-click'));
            });
        });
    }
}

if (!customElements.get('kirilix-header')) {
    customElements.define('kirilix-header', Header);
}

export default Header;