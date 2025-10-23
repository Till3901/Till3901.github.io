// projects.js — initialize Leaflet maps for three projects
(function () {
  function initMap(id, center, zoom, popupHtml) {
    if (!window.L) return;
    // Create map with interactive controls enabled for the small preview
    const map = L.map(id, {
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      keyboard: true
    }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker(center).addTo(map);
    if (popupHtml) marker.bindPopup(popupHtml);

    // improve keyboard accessibility: focus the map container
    const container = document.getElementById(id);
    if (container) container.setAttribute('tabindex', '0');

    // Fix sizing issues for maps inside flex/grid cards
    setTimeout(() => {
      try { map.invalidateSize(); } catch (e) { /* ignore */ }
    }, 300);

    // Also invalidate on window resize
    window.addEventListener('resize', () => { try { map.invalidateSize(); } catch (e) {} });

    return map;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // initialize maps if Leaflet is available, otherwise try to load it
    function initAllMaps() {
      try {
        // Bergen, Norway
        initMap('map-bergen', [60.3913, 5.3221], 12, '<strong>OpenStreetMap-Auswertung Bergen</strong><br>Fahrradwege & Tourismus');
        // London, UK (central) - coordinates approximate
        initMap('map-london', [51.5074, -0.1278], 12, '<strong>Fußverkehrsmodell London</strong><br>Fußgängerzonen & Modellierung');
        // Heidelberg, Germany
        initMap('map-heidelberg', [49.3988, 8.6724], 13, '<strong>Historische Stadtkerne — Heidelberg</strong><br>Digitale Rekonstruktion');
        console.log('projects.js: Karten initialisiert');
      } catch (err) {
        console.error('projects.js: Fehler beim Initialisieren der Karten', err);
        showMapError("Karte konnte nicht geladen werden");
      }
    }

    function showMapError(msg) {
      document.querySelectorAll('.map').forEach(el => {
        if (!el) return;
        el.innerHTML = `<div style="padding:18px;color:#a00;background:rgba(0,0,0,0.03);border-radius:6px;">${msg}</div>`;
      });
    }

    if (window.L) {
      initAllMaps();
      return;
    }

    // Leaflet not present — try to load CSS and script dynamically
    console.warn('Leaflet (L) nicht gefunden. Versuche, Leaflet dynamisch zu laden...');

    // ensure CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // load script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => { console.log('Leaflet geladen (dynamisch).'); initAllMaps(); };
    script.onerror = () => { console.error('Leaflet konnte nicht geladen werden.'); showMapError('Leaflet konnte nicht geladen werden'); };
    document.head.appendChild(script);
  });
})();
