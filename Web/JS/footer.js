
class Footer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentYear = new Date().getFullYear();
    }

    connectedCallback() {
        this.render();
        this.addStyles();
        this.addEventListeners();
        this.animateElements();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-content">
                        <div class="footer-section">
                            <div class="footer-logo">
                                <div class="logo-icon">K</div>
                                KiriliX
                            </div>
                            <p class="footer-description">
                                Първият български език за програмиране, създаден с любов към родния език и технологиите.
                            </p>
                            <div class="social-links">
                                <a href="#" class="social-link" aria-label="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Twitter">
                                    <i class="fab fa-twitter"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Discord">
                                    <i class="fab fa-discord"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="YouTube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                            </div>
                        </div>
                        <div class="footer-section">
                            <h3 class="footer-title">Ресурси</h3>
                            <ul class="footer-links">
                                <li><a href="#"><i class="fas fa-book"></i> Документация</a></li>
                                <li><a href="#"><i class="fas fa-graduation-cap"></i> Уроци</a></li>
                                <li><a href="#"><i class="fas fa-blog"></i> Блог</a></li>
                                <li><a href="#"><i class="fas fa-comments"></i> Форум</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3 class="footer-title">Общност</h3>
                            <ul class="footer-links">
                                <li><a href="#"><i class="fas fa-calendar-alt"></i> Събития</a></li>
                                <li><a href="#"><i class="fas fa-code"></i> Разработчици</a></li>
                                <li><a href="#"><i class="fas fa-handshake"></i> Партньорства</a></li>
                                <li><a href="#"><i class="fas fa-envelope"></i> Контакти</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3 class="footer-title">Компания</h3>
                            <ul class="footer-links">
                                <li><a href="#"><i class="fas fa-info-circle"></i> За нас</a></li>
                                <li><a href="#"><i class="fas fa-briefcase"></i> Кариери</a></li>
                                <li><a href="#"><i class="fas fa-newspaper"></i> Прес</a></li>
                                <li><a href="#"><i class="fas fa-balance-scale"></i> Правна информация</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <div class="footer-copyright">
                            &copy; ${this.currentYear} KiriliX. Всички права запазени.
                        </div>
                        <div class="footer-badge">
                            <i class="fas fa-heart"></i>
                            <span>Създадено с любов в България</span>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
            
            .footer {
                background: rgba(10, 10, 20, 0.95);
                border-top: 1px solid rgba(0, 255, 157, 0.1);
                padding: 5rem 2rem 2rem;
                position: relative;
                backdrop-filter: blur(10px);
                font-family: 'Inter', sans-serif;
                color: #ffffff;
            }

            .footer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: linear-gradient(90deg, #ffffff 33%, #00ff9d 33%, #00ff9d 66%, #ff003c 66%);
                box-shadow: 0 0 15px #00ff9d;
            }

            .footer-container {
                max-width: 1200px;
                margin: 0 auto;
            }

            .footer-content {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 4rem;
                margin-bottom: 4rem;
            }

            @media (max-width: 1024px) {
                .footer-content {
                    grid-template-columns: 1fr 1fr;
                    gap: 3rem;
                }
            }

            @media (max-width: 768px) {
                .footer-content {
                    grid-template-columns: 1fr;
                    text-align: center;
                    gap: 2.5rem;
                }
            }

            .footer-logo {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 2rem;
                font-size: 1.5rem;
                font-weight: 700;
                color: #ffffff;
                text-shadow: 0 0 10px #00ff9d;
            }

            .logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #ffffff 33%, #00ff9d 33%, #00ff9d 66%, #ff003c 66%);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #0a0a14;
                font-weight: 700;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 15px #00ff9d, 0 0 30px #ff003c;
                animation: logoGlow 3s infinite alternate;
            }

            @keyframes logoGlow {
                0% {
                    box-shadow: 0 0 15px #00ff9d, 0 0 30px #ff003c;
                }
                100% {
                    box-shadow: 0 0 25px #00ff9d, 0 0 50px #ff003c, 0 0 75px #8a2be2;
                }
            }

            .footer-description {
                color: #b0b0d0;
                margin-bottom: 2rem;
                line-height: 1.8;
                font-size: 1rem;
            }

            .social-links {
                display: flex;
                gap: 1.2rem;
            }

            @media (max-width: 768px) {
                .social-links {
                    justify-content: center;
                }
            }

            .social-link {
                width: 50px;
                height: 50px;
                border-radius: 12px;
                background: rgba(0, 255, 157, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
                color: #00ff9d;
                text-decoration: none;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                position: relative;
                overflow: hidden;
                border: 1px solid rgba(0, 255, 157, 0.2);
            }

            .social-link::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #ffffff 33%, #00ff9d 33%, #00ff9d 66%, #ff003c 66%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            }

            .social-link:hover::before {
                opacity: 1;
            }

            .social-link:hover {
                transform: translateY(-5px) scale(1.1);
                box-shadow: 0 10px 20px rgba(0, 255, 157, 0.3);
                border-color: #00ff9d;
            }

            .social-link i {
                position: relative;
                z-index: 1;
                font-size: 1.3rem;
            }

            .social-link:hover i {
                color: #0a0a14;
            }

            .footer-title {
                font-size: 1.3rem;
                font-weight: 600;
                margin-bottom: 1.8rem;
                color: #ffffff;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
                position: relative;
                padding-bottom: 10px;
            }

            @media (max-width: 768px) {
                .footer-title {
                    text-align: center;
                }
            }

            .footer-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 40px;
                height: 3px;
                background: linear-gradient(90deg, #ffffff 33%, #00ff9d 33%, #00ff9d 66%, #ff003c 66%);
                border-radius: 2px;
            }

            @media (max-width: 768px) {
                .footer-title::after {
                    left: 50%;
                    transform: translateX(-50%);
                }
            }

            .footer-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .footer-links li {
                margin-bottom: 1.2rem;
            }

            .footer-links a {
                color: #b0b0d0;
                text-decoration: none;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
                padding: 0.3rem 0;
                position: relative;
                display: inline-flex;
                align-items: center;
                gap: 10px;
            }

            .footer-links i {
                width: 20px;
                color: #00ff9d;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            }

            .footer-links a::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 0;
                height: 2px;
                background: linear-gradient(90deg, #ffffff 33%, #00ff9d 33%, #00ff9d 66%, #ff003c 66%);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
            }

            .footer-links a:hover {
                color: #00ff9d;
                transform: translateX(10px);
            }

            .footer-links a:hover i {
                transform: scale(1.2) rotate(5deg);
            }

            .footer-links a:hover::after {
                width: 100%;
            }

            @media (max-width: 768px) {
                .footer-links a {
                    justify-content: center;
                }
            }

            .footer-bottom {
                padding-top: 3rem;
                border-top: 1px solid rgba(0, 255, 157, 0.1);
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #b0b0d0;
                font-size: 0.9rem;
            }

            @media (max-width: 768px) {
                .footer-bottom {
                    flex-direction: column;
                    gap: 1.5rem;
                    text-align: center;
                }
            }

            .footer-badge {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #00ff9d;
                font-weight: 600;
                text-shadow: 0 0 10px #00ff9d;
            }

            .footer-badge i {
                animation: heartbeat 1.5s infinite;
            }

            @keyframes heartbeat {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2);
                }
            }

            .fade-in {
                animation: fadeIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                opacity: 0;
            }

            .delay-1 {
                animation-delay: 0.2s;
            }

            .delay-2 {
                animation-delay: 0.4s;
            }

            .delay-3 {
                animation-delay: 0.6s;
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
        `;
        
        this.shadowRoot.appendChild(style);
    }

    addEventListeners() {
        const links = this.shadowRoot.querySelectorAll('.footer-links a, .social-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.dispatchEvent(new CustomEvent('footer-link-click', {
                    detail: { href },
                    bubbles: true,
                    composed: true
                }));
            });
        });
    }


    updateCopyrightYear(year) {
        this.currentYear = year || new Date().getFullYear();
        const copyrightEl = this.shadowRoot.querySelector('.footer-copyright');
        if (copyrightEl) {
            copyrightEl.textContent = `© ${this.currentYear} KiriliX. Всички права запазени.`;
        }
    }

    animateElements() {
        const sections = this.shadowRoot.querySelectorAll('.footer-section');
        const bottom = this.shadowRoot.querySelector('.footer-bottom');
        
        sections.forEach((section, index) => {
            section.classList.add('fade-in', `delay-${index}`);
        });
        
        if (bottom) {
            bottom.classList.add('fade-in', 'delay-3');
        }
    }

    setTheme(primaryColor = '#00ff9d', secondaryColor = '#ff003c', bgColor = 'rgba(10, 10, 20, 0.95)') {
        const style = this.shadowRoot.querySelector('style');
        let css = style.textContent;
        
        css = css.replace(/#00ff9d/g, primaryColor);
        css = css.replace(/#ff003c/g, secondaryColor);
        css = css.replace(/rgba\(10, 10, 20, 0\.95\)/g, bgColor);
        
        style.textContent = css;
    }

    setSocialLinks(links) {
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        links.forEach((link, index) => {
            if (socialLinks[index]) {
                socialLinks[index].href = link.url;
                socialLinks[index].setAttribute('aria-label', link.label);
                const icon = socialLinks[index].querySelector('i');
                if (icon) {
                    icon.className = link.iconClass;
                }
            }
        });
    }

    updateNavigation(section, links) {
        const sectionEl = this.shadowRoot.querySelector(`.footer-section:nth-child(${section + 1})`);
        if (sectionEl) {
            const linksList = sectionEl.querySelector('.footer-links');
            if (linksList) {
                linksList.innerHTML = links.map(link => 
                    `<li><a href="${link.url}"><i class="${link.icon}"></i> ${link.text}</a></li>`
                ).join('');
                
                this.addEventListeners();
            }
        }
    }
}

if (!customElements.get('kirilix-footer')) {
    customElements.define('kirilix-footer', Footer);
}

export default Footer;