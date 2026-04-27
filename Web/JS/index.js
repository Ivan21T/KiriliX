window.copyCode = function() {
    const codeBody = document.querySelector('.code-body');
    if (!codeBody) return;
    
    let codeText = '';
    const lines = codeBody.querySelectorAll('.code-line');
    
    if (lines.length > 0) {
        lines.forEach(line => {
            let lineText = line.textContent || line.innerText;
            lineText = lineText.replace(/\u00A0/g, ' ');
            codeText += lineText + '\n';
        });
    } else {
        let lineText = codeBody.textContent || codeBody.innerText;
        codeText = lineText.replace(/\u00A0/g, ' ');
    }
    
    navigator.clipboard.writeText(codeText).then(() => {
        const btn = document.getElementById('copyBtn');
        if (btn) {
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                btn.innerHTML = originalHtml;
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

document.addEventListener("DOMContentLoaded", function() {
});