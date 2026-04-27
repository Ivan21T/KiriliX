document.addEventListener('DOMContentLoaded', function() {
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

                    showAlert('Изпращаме вашето съобщение...', 'pending');

                    emailjs.send(
                        'service_207wc0d',
                        'template_ehrtg3a',
                        templateParams
                    )
                    .then(() => {
                        showAlert('Съобщението беше изпратено успешно!', 'success');
                        contactForm.reset();
                    })
                    .catch((error) => {
                        showAlert('Възникна проблем при изпращането. Моля, опитайте отново.', 'error');
                    });
                });
            }

            const socialLinks = document.querySelectorAll('.social-link-contact');
            socialLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const platform = this.getAttribute('title') || 'социална мрежа';
                    showAlert(`Пренасочваме ви към нашата ${platform} страница!`, 'info');
                });
            });

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