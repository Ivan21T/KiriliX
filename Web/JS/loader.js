class KirilixLoader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        // Configuration
        this.letters = ['К', 'И', 'Р', 'И', 'Л', 'И', 'X'];
        this.currentIndex = 0;
        this.text = this.getAttribute('text') || 'Зареждане на KiriliX';
    }

    connectedCallback() {
        this.render();
        this.startAnimation();

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hide();
            }, 1000);
        });

        setTimeout(() => {
            this.hide();
        }, 3000);
    }

    disconnectedCallback() {
        if (this.interval) clearInterval(this.interval);
    }

    hide() {
        const loader = this.shadowRoot.querySelector('.loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                this.style.display = 'none';

                // Trigger global fade-ins after loader hides
                const fadeElements = document.querySelectorAll('.fade-in');
                fadeElements.forEach(element => {
                    element.style.opacity = '1';
                });
            }, 500); /
        }
    }

    startAnimation() {
        const loaderLetter = this.shadowRoot.querySelector('.loader-letter');
        if (loaderLetter) {
            this.interval = setInterval(() => {
                loaderLetter.textContent = this.letters[this.currentIndex];
                this.currentIndex = (this.currentIndex + 1) % this.letters.length;
            }, 200);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    --neon-green: #00ff9d;
                    --neon-red: #ff003c;
                    --dark: #0a0a14;
                    --white: #ffffff;
                }
                
                .loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--dark);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    transition: opacity 0.5s ease, visibility 0.5s ease;
                    font-family: 'Inter', sans-serif;
                }
                
                .loader.hidden {
                    opacity: 0;
                    visibility: hidden;
                }
                
                .loader-container {
                    position: relative;
                    width: 180px;
                    height: 180px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .loader-circle {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    position: relative;
                    overflow: hidden;
                    animation: rotate 2s linear infinite;
                    box-shadow: 
                        0 0 30px var(--neon-green),
                        0 0 60px var(--neon-red),
                        inset 0 0 20px rgba(0, 0, 0, 0.5);
                }
                
                .loader-circle::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: conic-gradient(
                        var(--white) 0deg 120deg,
                        var(--neon-green) 120deg 240deg,
                        var(--neon-red) 240deg 360deg
                    );
                    border-radius: 50%;
                    filter: brightness(1.2);
                }
                
                .loader-circle::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100px;
                    height: 100px;
                    background: var(--dark);
                    border-radius: 50%;
                    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8);
                }
                
                .loader-letter {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    font-weight: 700;
                    color: var(--neon-green);
                    z-index: 10;
                    text-shadow: 
                        0 0 10px var(--neon-green),
                        0 0 20px var(--neon-green),
                        0 0 40px var(--neon-green);
                    animation: letterPulse 1.5s ease-in-out infinite;
                }
                
                @keyframes rotate {
                    0% { transform: rotate(0deg); filter: hue-rotate(0deg); }
                    100% { transform: rotate(360deg); filter: hue-rotate(360deg); }
                }
                
                @keyframes letterPulse {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                        text-shadow: 
                            0 0 10px var(--neon-green),
                            0 0 20px var(--neon-green),
                            0 0 40px var(--neon-green);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.1);
                        opacity: 0.9;
                        text-shadow: 
                            0 0 15px var(--neon-green),
                            0 0 30px var(--neon-green),
                            0 0 60px var(--neon-green);
                    }
                }
                
                .loader-text {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: var(--neon-green);
                    text-align: center;
                    margin-top: 2rem;
                    text-shadow: 0 0 10px var(--neon-green);
                    letter-spacing: 2px;
                }
                
                .loader-text::after {
                    content: '';
                    animation: loading 1.5s infinite;
                }
                
                @keyframes loading {
                    0% { content: '.'; }
                    33% { content: '..'; }
                    66% { content: '...'; }
                    100% { content: '.'; }
                }
            </style>
            <div class="loader">
                <div class="loader-container">
                    <div class="loader-circle"></div>
                    <div class="loader-letter">К</div>
                </div>
                <div class="loader-text">\${this.text}</div>
            </div>
        `;
    }
}

if (!customElements.get('kirilix-loader')) {
    customElements.define('kirilix-loader', KirilixLoader);
}

// Fade-in logic
document.addEventListener('DOMContentLoaded', function () {
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeInOnScroll = function () {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };

    fadeElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    fadeInOnScroll();
    window.addEventListener('scroll', fadeInOnScroll);
});