        const allThreads = [
            { 
                id: 1, 
                title: "Проблем с инсталацията на Windows 11", 
                preview: "При опит за инсталация получавам грешка 'DLL missing'. Опитах всичко според документацията...",
                author: "Мария Георгиева", 
                authorInitials: "МГ", 
                replies: 15, 
                views: 324, 
                date: "Преди 2 часа", 
                pinned: true,
                status: "open",
                tags: ["инсталация", "windows", "проблем"]
            },
            { 
                id: 2, 
                title: "Грешка при компилация: 'undefined reference to main'", 
                preview: "Когато се опитвам да компилирам прост Hello World програма, получавам тази грешка...",
                author: "Иван Петров", 
                authorInitials: "ИП", 
                replies: 42, 
                views: 1247, 
                date: "Преди 5 часа", 
                pinned: false,
                status: "solved",
                tags: ["компилация", "грешка", "основно"]
            },
            { 
                id: 3, 
                title: "Проблем с работа на библиотека за мрежова комуникация", 
                preview: "Библиотеката network не работи правилно при опит за свързване към отдалечен сървър...",
                author: "Димитър Стоянов", 
                authorInitials: "ДС", 
                replies: 28, 
                views: 587, 
                date: "Преди 1 ден", 
                pinned: false,
                status: "open",
                tags: ["библиотека", "мрежа", "проблем"]
            },
            { 
                id: 4, 
                title: "Как да дебъгна memory leak в KiriliX?", 
                preview: "Имам програма, която бавно увеличава използваната памет. Какви инструменти има за дебъгване...",
                author: "Александър Василев", 
                authorInitials: "АВ", 
                replies: 9, 
                views: 412, 
                date: "Преди 2 дни", 
                pinned: false,
                status: "solved",
                tags: ["дебъгване", "памет", "оптимизация"]
            },
            { 
                id: 5, 
                title: "Проблем с кирилица в конзолата на Linux", 
                preview: "Когато извеждам текст на кирилица в терминала на Ubuntu, се появяват странни символи...",
                author: "Пламен Иванов", 
                authorInitials: "ПИ", 
                replies: 7, 
                views: 198, 
                date: "Преди 3 дни", 
                pinned: false,
                status: "new",
                tags: ["кирилица", "linux", "конзола", "проблем"]
            },
            { 
                id: 6, 
                title: "Грешка 'segmentation fault' при работа с масиви", 
                preview: "Получавам segmentation fault при опит за достъп до елемент извън границите на масив...",
                author: "Георги Димитров", 
                authorInitials: "ГД", 
                replies: 12, 
                views: 256, 
                date: "Преди 4 дни", 
                pinned: false,
                status: "solved",
                tags: ["масиви", "грешка", "памет"]
            },
            { 
                id: 7, 
                title: "Проблем със синхронизация между нишки", 
                preview: "Имам race condition при многопоточно програмиране. Какви механизми за синхронизация предлага KiriliX...",
                author: "Стефан Петров", 
                authorInitials: "СП", 
                replies: 34, 
                views: 789, 
                date: "Преди 5 дни", 
                pinned: false,
                status: "popular",
                tags: ["нишки", "синхронизация", "многопоточност"]
            },
            { 
                id: 8, 
                title: "Проблем с връзка към база данни PostgreSQL", 
                preview: "Не мога да се свържа към моя PostgreSQL база данни. Драйверът изглежда не работи правилно...",
                author: "Теодора Николова", 
                authorInitials: "ТН", 
                replies: 18, 
                views: 345, 
                date: "Преди 1 седмица", 
                pinned: false,
                status: "open",
                tags: ["база данни", "postgresql", "връзка"]
            },
            { 
                id: 9, 
                title: "Грешка при работа с JSON файлове", 
                preview: "Когато се опитвам да прочета JSON файл с нестандартна структура, получавам parsing error...",
                author: "Калин Антонов", 
                authorInitials: "КА", 
                replies: 22, 
                views: 467, 
                date: "Преди 1 седмица", 
                pinned: false,
                status: "solved",
                tags: ["json", "файлове", "парсване"]
            },
            { 
                id: 10, 
                title: "Проблем с performance на алгоритъм за сортиране", 
                preview: "Моята имплементация на quicksort е много по-бавна от очакваното. Как да оптимизирам...",
                author: "Радослав Георгиев", 
                authorInitials: "РГ", 
                replies: 31, 
                views: 512, 
                date: "Преди 2 седмици", 
                pinned: false,
                status: "popular",
                tags: ["производителност", "алгоритми", "оптимизация"]
            },
            { 
                id: 11, 
                title: "Грешка при използване на външни C библиотеки", 
                preview: "Опитвам се да използвам библиотека, написана на C, но получавам linking errors...",
                author: "Мартин Стоянов", 
                authorInitials: "МС", 
                replies: 14, 
                views: 289, 
                date: "Преди 2 седмици", 
                pinned: false,
                status: "open",
                tags: ["c", "библиотеки", "линкване"]
            },
            { 
                id: 12, 
                title: "Проблем с графичната библиотека на KiriliX", 
                preview: "Когато се опитвам да изобразя сложна графика, програмата се затваря неочаквано...",
                author: "Даниел Иванов", 
                authorInitials: "ДИ", 
                replies: 8, 
                views: 176, 
                date: "Преди 3 седмици", 
                pinned: false,
                status: "new",
                tags: ["графика", "библиотека", "проблем"]
            },
            { 
                id: 13, 
                title: "Грешка 'out of memory' при големи datasets", 
                preview: "Работя с много големи данни и програмата ми дава out of memory след известно време...",
                author: "Елена Димитрова", 
                authorInitials: "ЕД", 
                replies: 19, 
                views: 398, 
                date: "Преди 3 седмици", 
                pinned: false,
                status: "solved",
                tags: ["памет", "големи данни", "оптимизация"]
            },
            { 
                id: 14, 
                title: "Проблем с кодировка при четене от файл", 
                preview: "Когато чета текстов файл, написана на кирилица, символите са объркани...",
                author: "Васил Петков", 
                authorInitials: "ВП", 
                replies: 25, 
                views: 521, 
                date: "Преди 1 месец", 
                pinned: false,
                status: "solved",
                tags: ["кодировка", "файлове", "кирилица"]
            },
            { 
                id: 15, 
                title: "Грешка при компилация за различни платформи", 
                preview: "Програмата ми се компилира добре на Windows, но на Linux получавам грешки...",
                author: "Николай Стоянов", 
                authorInitials: "НС", 
                replies: 16, 
                views: 432, 
                date: "Преди 1 месец", 
                pinned: false,
                status: "open",
                tags: ["кръс-платформа", "компилация", "проблем"]
            },
            { 
                id: 16, 
                title: "Проблем с unit тестове и мокирането", 
                preview: "Не мога да направя правилно мокинг на външни зависимости за моите unit тестове...",
                author: "Петър Георгиев", 
                authorInitials: "ПГ", 
                replies: 13, 
                views: 298, 
                date: "Преди 2 месеца", 
                pinned: false,
                status: "solved",
                tags: ["тестове", "unit тестване", "моки"]
            },
            { 
                id: 17, 
                title: "Грешка при използване на регулярни изрази", 
                preview: "Моят регулярен израз не работи както очаквам. Може ли някой да помогне с синтаксиса...",
                author: "Иван Петров", 
                authorInitials: "ИП", 
                replies: 21, 
                views: 387, 
                date: "Преди 2 месеца", 
                pinned: false,
                status: "popular",
                tags: ["регулярни изрази", "синтаксис", "проблем"]
            },
            { 
                id: 18, 
                title: "Проблем с dependency management", 
                preview: "Имам проблем със зависимости между различни модули в моя проект. Как се управляват...",
                author: "Администратор", 
                authorInitials: "АД", 
                replies: 45, 
                views: 987, 
                date: "Преди 3 месеца", 
                pinned: true,
                status: "solved",
                tags: ["зависимости", "модули", "проект"]
            },
            { 
                id: 19, 
                title: "Грешка при сериализация на обекти", 
                preview: "Когато се опитвам да сериализирам сложен обект, получавам stack overflow error...",
                author: "Мария Георгиева", 
                authorInitials: "МГ", 
                replies: 11, 
                views: 234, 
                date: "Преди 3 месеца", 
                pinned: false,
                status: "open",
                tags: ["сериализация", "обекти", "грешка"]
            },
            { 
                id: 20, 
                title: "Проблем с cache invalidation в уеб приложение", 
                preview: "Имам проблем с кеширането в моето уеб приложение. Кешът не се инвалидира правилно...",
                author: "Димитър Стоянов", 
                authorInitials: "ДС", 
                replies: 29, 
                views: 543, 
                date: "Преди 4 месеца", 
                pinned: false,
                status: "solved",
                tags: ["кеширане", "уеб", "приложение"]
            }
        ];

        // Настройки за пагинация
        const threadsPerPage = 8;
        let currentPage = 1;
        let filteredThreads = [...allThreads];
        let currentSort = "newest";

        // Модален прозорец
        const newThreadModal = document.getElementById('newThreadModal');
        const modalClose = document.getElementById('modalClose');
        const cancelThreadBtn = document.getElementById('cancelThreadBtn');
        const desktopNewThreadBtn = document.getElementById('desktopNewThreadBtn');
        const mobileNewThreadBtn = document.getElementById('mobileNewThreadBtn');
        const newThreadForm = document.getElementById('newThreadForm');
        const submitThreadBtn = document.getElementById('submitThreadBtn');
        const threadTitle = document.getElementById('threadTitle');
        const threadQuestion = document.getElementById('threadQuestion');
        const titleCounter = document.getElementById('titleCounter');
        const questionCounter = document.getElementById('questionCounter');

        // Loader functionality
        window.addEventListener('load', function() {
            const loader = document.getElementById('loader');
            setTimeout(() => {
                loader.classList.add('hidden');
                renderThreads();
                renderPagination();
                initModal();
            }, 1000);
        });

        // Инициализация на модалния прозорец
        function initModal() {
            // Събития за брояча на символи
            threadTitle.addEventListener('input', function() {
                titleCounter.textContent = this.value.length + '/120';
            });
            
            threadQuestion.addEventListener('input', function() {
                questionCounter.textContent = this.value.length;
            });
        }

        // Показване на модалния прозорец
        function showModal() {
            newThreadModal.classList.add('active');
            document.body.classList.add('modal-open');
            threadTitle.focus();
        }

        // Скриване на модалния прозорец
        function hideModal() {
            newThreadModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            
            // Ресет на формата
            newThreadForm.reset();
            titleCounter.textContent = '0/120';
            questionCounter.textContent = '0';
        }

        // Функция за показване на toast съобщение
        function showToast(message, type = 'info') {
            // Премахване на старите toast съобщения
            const oldToast = document.querySelector('.toast-message');
            if (oldToast) oldToast.remove();
            
            // Създаване на новото съобщение
            const toast = document.createElement('div');
            toast.className = `toast-message toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Добавяне на стилове
            toast.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'rgba(0, 255, 157, 0.2)' : 
                            type === 'error' ? 'rgba(255, 0, 60, 0.2)' : 
                            type === 'warning' ? 'rgba(255, 204, 0, 0.2)' : 
                            'rgba(0, 243, 255, 0.2)'};
                border: 1px solid ${type === 'success' ? 'var(--neon-green)' : 
                                type === 'error' ? 'var(--neon-red)' : 
                                type === 'warning' ? 'var(--yellow)' : 
                                'var(--cyan)'};
                border-radius: 12px;
                padding: 1rem 1.5rem;
                color: var(--white);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
                min-width: 300px;
                max-width: 400px;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                transform: translateX(150%);
                transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                z-index: 1200;
            `;
            
            // Адаптация за мобилни
            if (window.innerWidth <= 768) {
                toast.style.cssText += `
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                `;
            }
            
            document.body.appendChild(toast);
            
            // Анимация за показване
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
            }, 100);
            
            // Автоматично скриване след 5 секунди
            setTimeout(() => {
                toast.style.transform = 'translateX(150%)';
                setTimeout(() => toast.remove(), 400);
            }, 5000);
            
            // Бутон за затваряне
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => {
                toast.style.transform = 'translateX(150%)';
                setTimeout(() => toast.remove(), 400);
            });
        }

        // Събития за модалния прозорец
        desktopNewThreadBtn.addEventListener('click', showModal);
        mobileNewThreadBtn.addEventListener('click', showModal);
        modalClose.addEventListener('click', hideModal);
        cancelThreadBtn.addEventListener('click', hideModal);

        // Затваряне на модалния прозорец при клик извън него
        newThreadModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal();
            }
        });

        // Затваряне на модалния прозорец с клавиша Esc
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && newThreadModal.classList.contains('active')) {
                hideModal();
            }
        });

        // Обработка на формата
        submitThreadBtn.addEventListener('click', function() {
            // Валидация
            if (!threadTitle.value.trim()) {
                showToast('Моля, въведете заглавие на темата', 'error');
                threadTitle.focus();
                return;
            }
            
            if (!threadQuestion.value.trim()) {
                showToast('Моля, въведете въпрос/съдържание', 'error');
                threadQuestion.focus();
                return;
            }
            
            // Симулиране на създаване на нова тема
            const newThread = {
                id: allThreads.length + 1,
                title: threadTitle.value,
                preview: threadQuestion.value.substring(0, 150) + (threadQuestion.value.length > 150 ? '...' : ''),
                author: "Нов Потребител",
                authorInitials: "НП",
                replies: 0,
                views: 0,
                date: "Току-що",
                pinned: false,
                status: "new",
                tags: ["нова тема"]
            };
            
            // Добавяне на новата тема в началото на списъка
            allThreads.unshift(newThread);
            filteredThreads.unshift(newThread);
            
            // Обновяване на брояча на темите
            document.querySelector('.stat-number:nth-child(2)').textContent = (parseInt(document.querySelector('.stat-number:nth-child(2)').textContent) + 1).toString();
            
            // Скриване на модалния прозорец
            hideModal();
            
            // Показване на съобщение за успех
            showToast('Темата е успешно създадена!', 'success');
            
            // Презареждане на темите
            currentPage = 1;
            renderThreads();
            renderPagination();
            
            // Скролване до началото на темите
            window.scrollTo({ top: document.querySelector('.latest-threads').offsetTop - 100, behavior: 'smooth' });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Функция за получаване на статус таг
        function getStatusTag(status) {
            const statusMap = {
                "new": { text: "Нов", class: "status-new" },
                "popular": { text: "Популярен", class: "status-popular" },
                "solved": { text: "Решен", class: "status-solved" },
                "open": { text: "Отворен", class: "status-open" }
            };
            
            return statusMap[status] || { text: "", class: "" };
        }

        // Функция за сортиране на темите
        function sortThreads(threads, sortType) {
            const sortedThreads = [...threads];
            
            switch(sortType) {
                case "newest":
                    // За най-новите - темите са вече в правилния ред в нашия масив (добавени са най-новите първи)
                    return sortedThreads;
                case "oldest":
                    // За най-старите - обръщаме реда
                    return sortedThreads.reverse();
                case "popular":
                    // За най-популярните - сортираме по брой прегледи
                    return sortedThreads.sort((a, b) => b.views - a.views);
                case "commented":
                    // За най-коментираните - сортираме по брой отговори
                    return sortedThreads.sort((a, b) => b.replies - a.replies);
                default:
                    return sortedThreads;
            }
        }

        // Функция за рендиране на темите
        function renderThreads() {
            const container = document.getElementById('threadsContainer');
            const startIndex = (currentPage - 1) * threadsPerPage;
            const endIndex = startIndex + threadsPerPage;
            
            // Сортираме темите според текущия избор
            const sortedThreads = sortThreads(filteredThreads, currentSort);
            const threadsToShow = sortedThreads.slice(startIndex, endIndex);
            
            let html = `<div class="thread-header">Всички теми (${filteredThreads.length})</div>`;
            
            if (threadsToShow.length === 0) {
                html += `
                    <div class="thread-item" style="text-align: center; padding: 3rem 2rem;">
                        <i class="fas fa-search" style="font-size: 3rem; color: var(--neon-green); margin-bottom: 1rem;"></i>
                        <h3 style="color: var(--white); margin-bottom: 0.5rem;">Няма намерени теми</h3>
                        <p style="color: #b0b0d0;">Променете критериите за търсене</p>
                    </div>
                `;
            } else {
                threadsToShow.forEach(thread => {
                    const statusTag = getStatusTag(thread.status);
                    
                    html += `
                        <div class="thread-item">
                            <h3 class="thread-title">
                                ${thread.pinned ? '<span class="pinned"><i class="fas fa-thumbtack"></i></span>' : ''}
                                <a href="#">${thread.title}</a>
                                ${statusTag.text ? `<span class="thread-status-tag ${statusTag.class}"><i class="fas fa-circle"></i> ${statusTag.text}</span>` : ''}
                            </h3>
                            <p class="thread-preview">${thread.preview}</p>
                            <div class="thread-meta">
                                <div class="thread-author">
                                    <div class="author-avatar">${thread.authorInitials}</div>
                                    <span>${thread.author}</span>
                                </div>
                                <div class="thread-info">
                                    <span><i class="far fa-comment"></i> ${thread.replies} отговора</span>
                                    <span><i class="far fa-eye"></i> ${thread.views} прегледа</span>
                                    <span><i class="far fa-clock"></i> ${thread.date}</span>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            
            container.innerHTML = html;
            
            // Анимиране на новите елементи
            document.querySelectorAll('.thread-item').forEach(el => {
                el.classList.add('fade-in');
            });
            
            // Обновяване на информацията за пагинацията
            updatePaginationInfo();
        }

        // Функция за рендиране на пагинацията
        function renderPagination() {
            const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);
            const pagination = document.getElementById('pagination');
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }
            
            let html = '';
            
            // Бутон "Назад"
            html += `
                <li class="page-item">
                    <a class="page-link prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
                        <i class="fas fa-chevron-left"></i> Назад
                    </a>
                </li>
            `;
            
            // Номера на страниците
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    html += `
                        <li class="page-item">
                            <a class="page-link ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</a>
                        </li>
                    `;
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    html += `
                        <li class="page-item">
                            <a class="page-link disabled">...</a>
                        </li>
                    `;
                }
            }
            
            // Бутон "Напред"
            html += `
                <li class="page-item">
                    <a class="page-link next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
                        Напред <i class="fas fa-chevron-right"></i>
                    </a>
                </li>
            `;
            
            pagination.innerHTML = html;
            
            // Добавяне на събития за кликване
            document.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (!this.classList.contains('disabled')) {
                        const page = parseInt(this.getAttribute('data-page'));
                        if (page) {
                            currentPage = page;
                            renderThreads();
                            renderPagination();
                            window.scrollTo({ top: document.querySelector('.latest-threads').offsetTop - 100, behavior: 'smooth' });
                        }
                    }
                });
            });
        }

        // Функция за обновяване на информацията за пагинацията
        function updatePaginationInfo() {
            const totalPages = Math.ceil(filteredThreads.length / threadsPerPage);
            const startThread = (currentPage - 1) * threadsPerPage + 1;
            const endThread = Math.min(currentPage * threadsPerPage, filteredThreads.length);
            
            document.getElementById('paginationInfo').innerHTML = 
                `Показване на теми ${startThread} - ${endThread} от общо ${filteredThreads.length}`;
        }

        // Обща функция за търсене
        function performSearch(searchTerm) {
            if (searchTerm === '') {
                filteredThreads = [...allThreads];
            } else {
                // Филтриране по заглавие, преглед и тагове
                filteredThreads = allThreads.filter(thread => 
                    thread.title.toLowerCase().includes(searchTerm) ||
                    thread.preview.toLowerCase().includes(searchTerm) ||
                    thread.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                    thread.author.toLowerCase().includes(searchTerm)
                );
            }
            
            currentPage = 1;
            renderThreads();
            renderPagination();
        }

        // Търсене на проблеми (за десктоп)
        const desktopSearchInput = document.getElementById('desktopProblemSearch');
        desktopSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            performSearch(searchTerm);
        });

        // Търсене на проблеми (за мобилни)
        const mobileSearchInput = document.getElementById('mobileProblemSearch');
        mobileSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            performSearch(searchTerm);
        });

        // Добавяне на hover ефекти
        const forumItems = document.querySelectorAll('.thread-item, .quick-link');
        forumItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 10px 20px rgba(0, 255, 157, 0.1)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });

        // Fade in animation on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        document.querySelectorAll('.thread-item, .sidebar-widget').forEach(el => {
            observer.observe(el);
        });

        // Add click effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add some CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);