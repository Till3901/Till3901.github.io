(function () {
  const containerId = 'news-list';
  const url = 'assets/news.json';

  function createCard(item) {
    const article = document.createElement('article');
    article.className = 'karte';
    article.setAttribute('aria-labelledby', `title-${item.id}`);

    const img = document.createElement('img');
    img.className = 'news-img';
    img.src = item.image || 'assets/images/news/news1.svg';
    img.alt = item.title || 'News Bild';
    img.loading = 'lazy';
    article.appendChild(img);

    const h3 = document.createElement('h3');
    h3.id = `title-${item.id}`;
    h3.textContent = item.title;
    article.appendChild(h3);

    const date = document.createElement('div');
    date.className = 'news-date';
    date.textContent = new Date(item.date).toLocaleDateString();
    article.appendChild(date);

    const p = document.createElement('p');
    p.textContent = item.summary;
    article.appendChild(p);

    return article;
  }

  function showError(container, msg) {
    container.innerHTML = '';
    const err = document.createElement('div');
    err.className = 'error';
    err.textContent = msg;
    container.appendChild(err);
  }

  async function load() {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p>Lade Neuigkeiten…</p>';
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Netzwerkantwort war nicht ok');
      const data = await res.json();
      container.innerHTML = '';
      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Keine Neuigkeiten vorhanden.</p>';
        return;
      }
      data.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
      });
    } catch (err) {
      showError(container, 'Fehler beim Laden der Neuigkeiten.');
      console.error('news load error', err);
    }
  }

  document.addEventListener('DOMContentLoaded', load);
})();
