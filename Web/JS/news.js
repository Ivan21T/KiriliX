 const newsPerPage = 5;
        
        let allNews = [];
        let filteredNews = [];
        let currentPage = 1;
        let searchTerm = '';
        let isLoading = false;
        let error = null;

        const newsListEl = document.getElementById('newsList');
        const paginationEl = document.getElementById('pagination');
        const paginationInfoEl = document.getElementById('paginationInfo');
        const searchInput = document.getElementById('newsSearch');
        const totalNewsCountEl = document.getElementById('totalNewsCount');
        const loader = document.getElementById('loader');

        function normalizeNews(data) {
            let newsArray = [];
            
            if (Array.isArray(data)) {
                newsArray = data;
            } else if (data.$values && Array.isArray(data.$values)) {
                newsArray = data.$values;
            } else if (data.data && Array.isArray(data.data)) {
                newsArray = data.data;
            } else {
                console.error('Неочакван формат:', data);
                return [];
            }
            
            return newsArray.map(item => ({
                id: item.id,
                title: item.title || 'Без заглавие',
                excerpt: item.description || item.content || 'Няма съдържание',
                fullContent: item.content || item.description || 'Няма съдържание',
                date: formatDate(item.publishedAt),
                author: 'Екип на KiriliX',
                authorId: 1
            }));
        }

        function formatDate(dateString) {
            if (!dateString) return 'Невалидна дата';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Невалидна дата';
            return date.toLocaleDateString('bg-BG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function updateStats() {
            totalNewsCountEl.textContent = allNews.length;
        }

        async function loadNews() {
            isLoading = true;
            error = null;
            renderNews();
            
            try {
                const token = localStorage.getItem('authToken');
                const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch(window.API_CONFIG.NEWS, {
                    method: 'GET',
                    headers: headers
                });
                
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = 'HTML/login.html';
                    return;
                }
                
                if (!response.ok) {
                    throw new Error(`Грешка ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                allNews = normalizeNews(data);
                filteredNews = [...allNews];
                updateStats();
                
            } catch (err) {
                console.error('Грешка при зареждане:', err);
                error = err.message;
                allNews = [];
                filteredNews = [];
            } finally {
                isLoading = false;
                renderNews();
                renderPagination();
            }
        }

        function filterNews() {
            const term = searchTerm.toLowerCase().trim();
            
            if (term === '') {
                filteredNews = [...allNews];
            } else {
                filteredNews = allNews.filter(news => 
                    news.title.toLowerCase().includes(term) ||
                    news.excerpt.toLowerCase().includes(term)
                );
            }
            
            currentPage = 1;
            renderNews();
            renderPagination();
        }

        window.goToNewsDetail = function(newsId) {
            window.location.href = `news_details.html?id=${newsId}`;
        };

        function renderNews() {
            if (isLoading) {
                newsListEl.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-spinner fa-spin"></i>
                        <h3>Зареждане на новините...</h3>
                    </div>
                `;
                return;
            }

            if (error) {
                newsListEl.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Грешка при зареждане</h3>
                        <p>${error}</p>
                        <button class="retry-btn" onclick="location.reload()">
                            <i class="fas fa-redo"></i> Опитай отново
                        </button>
                    </div>
                `;
                return;
            }

            const start = (currentPage - 1) * newsPerPage;
            const end = start + newsPerPage;
            const newsToShow = filteredNews.slice(start, end);

            if (newsToShow.length === 0) {
                newsListEl.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>Няма намерени новини</h3>
                        <p>Пробвайте с друго търсене</p>
                    </div>
                `;
                paginationEl.innerHTML = '';
                paginationInfoEl.innerHTML = '';
                return;
            }

            let html = '';
            newsToShow.forEach((news, index) => {
                const maxExcerptLength = 200;
                const excerpt = news.excerpt.length > maxExcerptLength 
                    ? news.excerpt.substring(0, maxExcerptLength) + '...' 
                    : news.excerpt;
                
                html += `
                    <div class="news-item fade-in" style="animation-delay: ${index * 0.1}s">
                        <h2 class="news-title" onclick="goToNewsDetail(${news.id})">${escapeHtml(news.title)}</h2>
                        <div class="news-meta">
                            <span><i class="far fa-calendar-alt"></i> ${escapeHtml(news.date)}</span>
                            <span><i class="far fa-user"></i> ${escapeHtml(news.author)}</span>
                        </div>
                        <div class="news-excerpt">
                            ${escapeHtml(excerpt)}
                            ${news.excerpt.length > maxExcerptLength ? 
                                `<span class="read-more" onclick="goToNewsDetail(${news.id})">Виж повече...</span>` 
                                : ''}
                        </div>
                    </div>
                `;
            });

            newsListEl.innerHTML = html;
            updatePaginationInfo();
        }

        function escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function renderPagination() {
            if (isLoading || error || filteredNews.length === 0) {
                paginationEl.innerHTML = '';
                return;
            }

            const totalPages = Math.ceil(filteredNews.length / newsPerPage);
            
            if (totalPages <= 1) {
                paginationEl.innerHTML = '';
                return;
            }

            let html = '';

            html += `
                <div class="page-link prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i> Назад
                </div>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
                    html += `
                        <div class="page-link ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</div>
                    `;
                } else if (i === currentPage - 3 || i === currentPage + 3) {
                    html += `<div class="page-link disabled">...</div>`;
                }
            }

            html += `
                <div class="page-link next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}">
                    Напред <i class="fas fa-chevron-right"></i>
                </div>
            `;

            paginationEl.innerHTML = html;

            document.querySelectorAll('.page-link[data-page]').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (!this.classList.contains('disabled')) {
                        currentPage = parseInt(this.dataset.page);
                        renderNews();
                        renderPagination();
                        window.scrollTo({ 
                            top: document.querySelector('.news-content').offsetTop - 100, 
                            behavior: 'smooth' 
                        });
                    }
                });
            });
        }

        function updatePaginationInfo() {
            const total = filteredNews.length;
            if (total === 0 || isLoading || error) {
                paginationInfoEl.textContent = '';
                return;
            }
            
            const start = (currentPage - 1) * newsPerPage + 1;
            const end = Math.min(currentPage * newsPerPage, total);
            paginationInfoEl.textContent = `Показване на ${start} - ${end} от ${total} новини`;
        }

        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTerm = this.value;
            searchTimeout = setTimeout(filterNews, 300);
        });

        window.addEventListener('load', async function() {
            await loadNews();
            if (loader) {
                setTimeout(() => loader.classList.add('hidden'), 500);
            }
        });

        window.loadNews = loadNews;