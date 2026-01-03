// Header custom web component
class Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addStyles();
        this.addEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
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
                        <a href="#" class="nav-link">Общност</a>
                        <a href="#" class="nav-link">Блог</a>
                    </div>
                    <div class="nav-actions">
                        <button id="login-btn" class="btn btn-outline">
                            Вход
                        </button>
                        <button class="btn btn-primary">
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
                        <a href="#" class="mobile-nav-link">Общност</a>
                        <a href="#" class="mobile-nav-link">Блог</a>
                    </div>
                    <div class="mobile-nav-actions">
                        <button class="btn btn-outline">
                            Вход
                        </button>
                        <button class="btn btn-primary">
                            Изтегли
                        </button>
                    </div>
                </div>
            </header>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
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
                max-width: 250px;
            }
            
            .mobile-nav-actions .btn {
                width: 100%;
                justify-content: center;
                padding: 1rem;
                font-size: 1.1rem;
            }
            
            /* Responsive styles */
            @media (max-width: 768px) {
                .nav-links, .nav-actions {
                    display: none;
                }
                
                .mobile-menu-toggle {
                    display: flex;
                }
                
                .nav-container {
                    padding: 1rem 1.5rem;
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
            }
            
            @media (max-width: 360px) {
                .logo {
                    font-size: 1.2rem;
                }
                
                .logo-icon {
                    width: 30px;
                    height: 30px;
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
        `;
        
        this.shadowRoot.appendChild(style);
    }

    addEventListeners() {
        const toggle = this.shadowRoot.getElementById('mobileMenuToggle');
        const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
        
        if (toggle && mobileMenu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
        }

        // Close menu when clicking on links
        const mobileLinks = this.shadowRoot.querySelectorAll('.mobile-nav-link, .mobile-nav-actions .btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (toggle && mobileMenu) {
                    toggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Dispatch events for buttons
        const loginBtn = this.shadowRoot.getElementById('login-btn');
        const downloadBtn = this.shadowRoot.querySelector('.btn-primary');
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link, .mobile-nav-link');

        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-login-click', {
                    bubbles: true,
                    composed: true
                }));
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.dispatchEvent(new CustomEvent('header-download-click', {
                    bubbles: true,
                    composed: true
                }));
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = link.textContent;
                this.dispatchEvent(new CustomEvent('header-nav-click', {
                    detail: { section: text },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }

    // Public methods for external control
    openMobileMenu() {
        const toggle = this.shadowRoot.getElementById('mobileMenuToggle');
        const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
        if (toggle && mobileMenu) {
            toggle.classList.add('active');
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeMobileMenu() {
        const toggle = this.shadowRoot.getElementById('mobileMenuToggle');
        const mobileMenu = this.shadowRoot.getElementById('mobileMenu');
        if (toggle && mobileMenu) {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    setTheme(primaryColor = '#00ff9d', secondaryColor = '#ff003c', bgColor = 'rgba(10, 10, 20, 0.9)') {
        const style = this.shadowRoot.querySelector('style');
        let css = style.textContent;
        
        css = css.replace(/#00ff9d/g, primaryColor);
        css = css.replace(/#ff003c/g, secondaryColor);
        css = css.replace(/rgba\(10, 10, 20, 0\.9\)/g, bgColor);
        
        style.textContent = css;
    }

    updateNavigation(links) {
        const navLinksContainer = this.shadowRoot.querySelector('.nav-links');
        const mobileNavLinksContainer = this.shadowRoot.querySelector('.mobile-nav-links');
        
        if (navLinksContainer) {
            navLinksContainer.innerHTML = links.map(link => 
                `<a href="${link.url}" class="nav-link">${link.text}</a>`
            ).join('');
        }
        
        if (mobileNavLinksContainer) {
            mobileNavLinksContainer.innerHTML = links.map(link => 
                `<a href="${link.url}" class="mobile-nav-link">${link.text}</a>`
            ).join('');
        }
        
        this.addEventListeners(); // Re-add event listeners
    }
}

// Register the component
if (!customElements.get('kirilix-header')) {
    customElements.define('kirilix-header', Header);
}

export default Header;