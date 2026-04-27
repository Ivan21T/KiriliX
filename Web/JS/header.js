class Header extends HTMLElement {
    constructor() {
        super();
        this.isLoggedIn = false;
        this.userData = null;
        this.isAdmin = false;
        this.checkSession();
    }

    async loadCurrentUser() {
        const authToken = localStorage.getItem('authToken');
        
        if (!authToken) {
            return null;
        }
        
        try {
            const apiUrl = window.API_CONFIG?.USER || 'https://localhost:7090/users';
            const response = await fetch(`${apiUrl}/current-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                
                return {
                    id: user.Id || user.id || user.userId,
                    name: user.Username || user.username || user.name,
                    email: user.Email || user.email,
                    role: user.Role || user.role,
                    createdAt: user.CreatedAt || user.createdAt || user.createdAtDate
                };
            } else if (response.status === 401) {
                localStorage.removeItem('authToken');
                return null;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error loading current user:', error);
            return null;
        }
    }

    calculateAccountAge(createdAt) {
        if (!createdAt) return null;
        
        try {
            const creationDate = new Date(createdAt);
            const currentDate = new Date();
            const ageInMilliseconds = currentDate - creationDate;
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
            
            return ageInYears;
        } catch (error) {
            console.error('Error calculating account age:', error);
            return null;
        }
    }
    
    getAvatarImage(createdAt) {
        if (!createdAt) return '../Assets/Images/bronze_logo.png';
        
        const accountAge = this.calculateAccountAge(createdAt);
        
        if (accountAge < 2) {
            return '../Assets/Images/bronze_logo.png';
        } else if (accountAge >= 2 && accountAge < 5) {
            return '../Assets/Images/silver_logo.png';
        } else {
            return '../Assets/Images/gold_logo.png';
        }
    }

    async checkSession() {
        try {
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                await this.clearSession();
                if (this.isConnected) {
                    await this.render();
                    await this.addEventListeners();
                }
                return;
            }
            
            const userData = await this.loadCurrentUser();
            
            if (userData) {
                this.isLoggedIn = true;
                this.userData = userData;
                this.isAdmin = (userData.role == 0);
            } else {
                await this.clearSession();
            }
        } catch (error) {
            console.error('Session check error:', error);
            await this.clearSession();
        }
        
        if (this.isConnected) {
            await this.render();
            await this.addEventListeners();
        }
    }

    async clearSession() {
        this.isLoggedIn = false;
        this.userData = null;
        this.isAdmin = false;
        localStorage.removeItem('authToken');
        return Promise.resolve();
    }

    async connectedCallback() {
        await this.render();
        await this.addEventListeners();
        
        this.sessionInterval = setInterval(async () => {
            await this.checkSession();
        }, 30000);
        
        window.addEventListener('storage', async (e) => {
            if (e.key === 'authToken') {
                await this.checkSession();
            }
        });
    }

    disconnectedCallback() {
        if (this.sessionInterval) {
            clearInterval(this.sessionInterval);
        }
    }

    async render() {
        const avatarUrl = this.userData?.createdAt ? this.getAvatarImage(this.userData.createdAt) : '../images/avatars/default-avatar.svg';
        
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
                
                .admin-link {
                    background: linear-gradient(135deg, var(--neon-green), var(--purple));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 600;
                }
                
                .admin-link::after {
                    background: linear-gradient(90deg, var(--neon-green), var(--purple));
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
                    object-fit: cover;
                    cursor: pointer;
                    position: relative;
                    box-shadow: 
                        0 0 10px var(--neon-green),
                        0 0 20px rgba(255, 0, 60, 0.3);
                    transition: var(--transition);
                    border: 2px solid transparent;
                }
                
                .user-avatar:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 20px var(--neon-green), 0 0 40px var(--neon-red);
                    border-color: var(--neon-green);
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
                
                .btn-danger {
                    background: linear-gradient(135deg, var(--neon-red), var(--red));
                    color: var(--white);
                }
                
                .desktop-logout-btn {
                    display: inline-flex;
                }
                
                .desktop-login-btn,
                .desktop-download-btn {
                    display: inline-flex;
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
                
                .logo.hidden {
                    display: none !important;
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
                
                .mobile-admin-link {
                    background: linear-gradient(135deg, var(--neon-green), var(--purple));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
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
                
                @media (max-width: 768px) {
                    .desktop-logout-btn {
                        display: none !important;
                    }
                    
                    .desktop-login-btn,
                    .desktop-download-btn {
                        display: none !important;
                    }
                    
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
                        margin-right: -15px;
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
                        ${await this.renderNavLinks()}
                    </div>
                    <div class="nav-actions">
                        <div id="user-section">
                            ${this.isLoggedIn && !this.isAdmin ? `<img src="${avatarUrl}" alt="Profile" class="user-avatar" id="user-avatar" title="${this.userData?.name || 'Потребител'}">` : ''}
                            ${!this.isLoggedIn ? await this.renderLoginButton() : ''}
                        </div>
                        ${!this.isLoggedIn ? `<a href="KiriliX.zip" download class="btn btn-primary desktop-download-btn" id="download-btn" style="text-decoration: none;">Изтегли</a>` : ''}
                        ${this.isLoggedIn ? await this.renderLogoutButton() : ''}
                    </div>
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-nav-links">
                        ${await this.renderMobileNavLinks()}
                    </div>
                    <div class="mobile-nav-actions" id="mobileUserSection">
                        ${!this.isLoggedIn ? `
                            <button class="btn btn-outline mobile-login-btn">Вход</button>
                            <a href="KiriliX.zip" download class="btn btn-primary mobile-download-btn" style="text-decoration: none;">Изтегли</a>
                        ` : `
                            ${await this.renderMobileLogoutButton()}
                            <a href="KiriliX.zip" download class="btn btn-primary mobile-download-btn" style="text-decoration: none;">Изтегли</a>
                        `}
                    </div>
                </div>
            </header>
        `;
        return Promise.resolve();
    }

    async renderNavLinks() {
        if (this.isAdmin) {
            return `
                <a href="../HTML/index.html" class="nav-link">Начало</a>
                <a href="../HTML/docs.html" class="nav-link">Документация</a>
                <a href="../HTML/forum.html" class="nav-link">Форум</a>
                <a href="../HTML/news.html" class="nav-link">Новини</a>
                <a href="../HTML/admin.html" class="nav-link admin-link">
                    <i class="fas fa-user-shield"></i> Админ Панел
                </a>
                <a href="../HTML/contact.html" class="nav-link">Контакти</a>
            `;
        } else {
            return `
                <a href="../HTML/index.html" class="nav-link">Начало</a>
                <a href="../HTML/docs.html" class="nav-link">Документация</a>
                <a href="../HTML/forum.html" class="nav-link">Форум</a>
                <a href="../HTML/news.html" class="nav-link">Новини</a>
                <a href="../HTML/contact.html" class="nav-link">Контакти</a>
            `;
        }
    }

    async renderMobileNavLinks() {
        if (this.isAdmin) {
            return `
                <a href="../HTML/index.html" class="mobile-nav-link">Начало</a>
                <a href="../HTML/docs.html" class="mobile-nav-link">Документация</a>
                <a href="../HTML/forum.html" class="mobile-nav-link">Форум</a>
                <a href="../HTML/news.html" class="mobile-nav-link">Новини</a>
                <a href="../HTML/admin.html" class="mobile-nav-link mobile-admin-link">
                    <i class="fas fa-user-shield"></i> Админ Панел
                </a>
                <a href="../HTML/contact.html" class="mobile-nav-link">Контакти</a>
            `;
        } else {
            return `
                <a href="../HTML/index.html" class="mobile-nav-link">Начало</a>
                <a href="../HTML/docs.html" class="mobile-nav-link">Документация</a>
                <a href="../HTML/forum.html" class="mobile-nav-link">Форум</a>
                <a href="../HTML/news.html" class="mobile-nav-link">Новини</a>
                <a href="../HTML/contact.html" class="mobile-nav-link">Контакти</a>
            `;
        }
    }

    async renderLoginButton() {
        return `
            <button id="login-btn" class="btn btn-outline desktop-login-btn">
                Вход
            </button>
        `;
    }

    async renderLogoutButton() {
        return `
            <button id="logout-btn" class="btn btn-outline desktop-logout-btn">
                <i class="fas fa-sign-out-alt"></i> Изход
            </button>
        `;
    }

    async renderMobileLogoutButton() {
        return `
            <button id="mobile-logout-btn" class="btn btn-outline">
                <i class="fas fa-sign-out-alt"></i> Изход
            </button>
        `;
    }

    async logout() {
        try {
            localStorage.removeItem('authToken');
            await this.clearSession();
            await this.render();
            await this.addEventListeners();
            window.location.href = '../HTML/index.html';
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('authToken');
            window.location.href = '../HTML/index.html';
        }
    }

    async addEventListeners() {
        const toggle = this.querySelector('#mobileMenuToggle');
        const mobileMenu = this.querySelector('#mobileMenu');
        
        if (toggle && mobileMenu) {
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);
            
            newToggle.addEventListener('click', () => {
                newToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                const isOpen = mobileMenu.classList.contains('active');
                document.body.style.overflow = isOpen ? 'hidden' : '';
                const logo = this.querySelector('.logo');
                if (logo) logo.classList.toggle('hidden', isOpen);
            });
        }

        const mobileLinks = this.querySelectorAll('.mobile-nav-link, .mobile-login-btn, .mobile-download-btn, #mobile-logout-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                const toggle = this.querySelector('#mobileMenuToggle');
                const mobileMenu = this.querySelector('#mobileMenu');
                if (toggle && mobileMenu) {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                    const logo = this.querySelector('.logo');
                    if (logo) logo.classList.remove('hidden');
                }
            });
        });

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

        const logoutBtn = this.querySelector('#logout-btn');
        const mobileLogoutBtn = this.querySelector('#mobile-logout-btn');
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
        
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
        
        const userAvatar = this.querySelector('#user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = '../HTML/profile.html';
            });
        }
        
        return Promise.resolve();
    }
}

if (!customElements.get('kirilix-header')) {
    customElements.define('kirilix-header', Header);
}

export default Header;