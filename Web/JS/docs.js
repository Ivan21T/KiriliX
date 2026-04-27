function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.classList.contains('active')) {
        section.classList.remove('active');
    } else {
        section.classList.add('active');
    }
}
function downloadEmptyFile(filename) {
    const emptyContent = '';
    const blob = new Blob([emptyContent], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (event && event.target) {
        const btn = event.target.closest('button');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Изтеглен!';
            setTimeout(() => {
                btn.innerHTML = originalHtml;
            }, 1000);
        }
    }
}

document.querySelectorAll('.example-file-btn, .download-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        const filename = this.getAttribute('data-file');
        if (filename) {
            downloadEmptyFile(filename);
        }
    });
});

document.querySelectorAll('.doc-card').forEach(card => {
    card.addEventListener('click', function (e) {

        if (this.closest('a')) {
            return;
        }
        e.stopPropagation();
        let filename = this.getAttribute('data-file');
        if (!filename) {
            const title = this.querySelector('h3')?.innerText || 'documentation';
            if (title.includes('Синтаксис')) filename = 'kirilix_syntax_guide.krx';
            else if (title.includes('Стандартна')) filename = 'kirilix_standard_library.krx';
            else if (title.includes('Модулна')) filename = 'kirilix_modules.krx';
            else if (title.includes('Дебугване')) filename = 'kirilix_debugging.krx';
            else filename = 'kirilix_documentation.krx';
        }
        downloadEmptyFile(filename);
    });
});

const githubBtn = document.getElementById('githubLinkBtn');
if (githubBtn) {
    githubBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        window.open('https://github.com/Ivan21T/KiriliX/tree/main/KiriliX', '_blank');
    });
}