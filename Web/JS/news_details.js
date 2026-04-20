 const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');

        const FIXED_AUTHOR = 'Екип на KiriliX';
        const FIXED_AUTHOR_INITIALS = 'EK';

        function formatDate(utcDateString) {
            const date = new Date(utcDateString);
            return date.toLocaleDateString('bg-BG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        function showError(message) {
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('newsTextContainer').style.display = 'none';
            document.getElementById('errorIndicator').style.display = 'flex';
            document.getElementById('errorMessage').textContent = message;
            document.getElementById('newsDetailTitle').textContent = 'Грешка';
        }

        function displayNews(news) {
            const formattedDate = formatDate(news.publishedAt);
            
            document.title = `${news.title} | KiriliX Новини`;
            document.getElementById('loadingIndicator').style.display = 'none';
            document.getElementById('errorIndicator').style.display = 'none';
            document.getElementById('newsTextContainer').style.display = 'block';
            
            document.getElementById('newsDetailTitle').textContent = news.title;
            document.getElementById('newsAuthorAvatar').textContent = FIXED_AUTHOR_INITIALS;
            document.getElementById('newsAuthorName').textContent = FIXED_AUTHOR;
            document.getElementById('newsPublishDate').textContent = formattedDate;
            document.getElementById('newsContent').innerHTML = news.description || 'Няма съдържание.';
            document.getElementById('newsFullDate').textContent = formattedDate;
            document.getElementById('newsAuthorFull').textContent = FIXED_AUTHOR;
        }

        async function fetchNewsById(id) {
            if (!id || isNaN(parseInt(id))) {
                showError('Невалиден идентификатор на новина.');
                return;
            }

            try {
                document.getElementById('loadingIndicator').style.display = 'flex';
                document.getElementById('errorIndicator').style.display = 'none';
                document.getElementById('newsTextContainer').style.display = 'none';
                
                const url = `${window.API_CONFIG.NEWS}/${id}`;
                const response = await authFetch(url, {
                    method: 'GET'
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Новината не е намерена.');
                    } else if (response.status === 500) {
                        throw new Error('Вътрешна грешка в сървъра. Моля, опитайте по-късно.');
                    } else {
                        throw new Error(`Грешка при зареждане: ${response.status}`);
                    }
                }

                const news = await response.json();
                displayNews(news);
                
            } catch (error) {
                console.error('Грешка при fetch:', error);
                showError(error.message || 'Възникна грешка при зареждането на новината.');
            }
        }

        document.addEventListener('DOMContentLoaded', function() {
            fetchNewsById(newsId);
        });