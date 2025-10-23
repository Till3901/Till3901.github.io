(() => {
  // Open Gmail compose in a new tab with pre-filled fields. Fallback to mailto: if needed.
  function openGmailCompose(email, subject = '', body = '') {
    // Gmail compose URL parameters: to, su (subject), body
    const params = new URLSearchParams();
    if (email) params.set('to', email);
    if (subject) params.set('su', subject);
    if (body) params.set('body', body);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&${params.toString()}`;
    const mailtoUrl = `mailto:${encodeURIComponent(email)}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `${subject ? '&' : '?'}body=${encodeURIComponent(body)}` : ''}`;

    // Try to open Gmail in a new tab/window. If popup blocked or external client preferred, fallback to mailto by navigating the current window.
    try {
      const win = window.open(gmailUrl, '_blank');
      if (!win) {
        // Popup blocked — fall back to mailto in the current window
        window.location.href = mailtoUrl;
      }
    } catch (e) {
      // If anything goes wrong, fallback to mailto
      window.location.href = mailtoUrl;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a.open-outlook').forEach(a => {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        const email = this.dataset.email || (this.getAttribute('href') || '').replace(/^mailto:/i, '');
        const subject = this.dataset.subject || '';
        const body = this.dataset.body || '';
        if (!email) return; // nothing to do
        openGmailCompose(email, subject, body);
      });
    });
  });
})();
