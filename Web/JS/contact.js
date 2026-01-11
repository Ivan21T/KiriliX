document.addEventListener('DOMContentLoaded', function() {
            const notifications = new NotificationSystem();
            emailjs.init('zmbWVx3i_C-gZPbpL');

            const contactForm = document.getElementById('contactForm');

            if (contactForm) {
                contactForm.addEventListener('submit', function (e) {
                    e.preventDefault();

                   const templateParams = {
                        title: document.getElementById("title").value,
                        name: document.getElementById("name").value,
                        email: document.getElementById("email").value,
                        message: document.getElementById("message").value,
                        time: new Date().toLocaleString('bg-BG', {
                            dateStyle: 'short',
                            timeStyle: 'medium'
                        })
                    };


                    const loadingNotification = notifications.showLoading(
                        'Изпращаме вашето съобщение...'
                    );

                    emailjs.send(
                        'service_207wc0d',
                        'template_ehrtg3a',
                        templateParams
                    )
                    .then(() => {
                        notifications.removeNotification(loadingNotification);

                        notifications.showSuccess(
                            'Съобщението беше изпратено успешно!'
                        );

                        contactForm.reset();
                    })
                    .catch((error) => {
                        notifications.removeNotification(loadingNotification);

                        notifications.showError(
                            'Възникна проблем при изпращането. Моля, опитайте отново.'
                        );
                    });
                });
            }

            
            // Add click effect to social links
            const socialLinks = document.querySelectorAll('.social-link-contact');
            socialLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const platform = this.getAttribute('title') || 'социална мрежа';
                    alert(`🚀 Пренасочваме ви към нашата ${platform} страница!`);
                });
            });
            
            // Add hover effect to contact details
            const contactDetails = document.querySelectorAll('.contact-detail');
            contactDetails.forEach(detail => {
                detail.addEventListener('mouseenter', function() {
                    const icon = this.querySelector('.detail-icon');
                    icon.style.transform = 'scale(1.1)';
                });
                
                detail.addEventListener('mouseleave', function() {
                    const icon = this.querySelector('.detail-icon');
                    icon.style.transform = 'scale(1)';
                });
            });
        });