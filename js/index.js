export function mapOn() {
  const imageUrl = './img/end.svg';
  const imageHeight = 4384;
  const windowHeight = window.innerHeight;
  const minZoom = Math.log2(windowHeight / imageHeight);
  const imageBounds = [[0, 0], [imageHeight, 7680]];

  const map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: minZoom,
    maxZoom: 2,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    zoomControl: false,
    maxBounds: imageBounds,
    maxBoundsViscosity: 1.0
  });

  L.imageOverlay(imageUrl, imageBounds).addTo(map);

  map.setView([imageHeight / 2, 7680 / 2], minZoom);
  map.invalidateSize();

  const mapContainer = document.getElementById('map');
  mapContainer.style.height = '100vh';
  mapContainer.style.width = '100%';

  fetch('./img/end.svg')
    .then(response => response.text())
    .then(svgData => {
      const parser = new DOMParser();
      const svg = parser.parseFromString(svgData, 'image/svg+xml');
      const layers = svg.querySelectorAll('g');

      layers.forEach(layer => {
        const labelAttribute = layer.getAttribute('inkscape:label');
        if (labelAttribute === 'mountain') {
          const path = layer.querySelector('path');
          if (path) {
            path.style.fill = 'red'; // Altera a cor para vermelho

            // Obtém o HTML do SVG modificado
            const svgString = new XMLSerializer().serializeToString(svg);
            // Define o SVG modificado como a nova imagem overlay do Leaflet
            const updatedOverlay = L.imageOverlay("data:image/svg+xml;base64," + btoa(svgString), imageBounds);
            map.eachLayer(function (layer) {
              if (layer instanceof L.ImageOverlay) {
                map.removeLayer(layer);
              }
            });
            updatedOverlay.addTo(map);
          } else {
            console.log('Elemento path não encontrado dentro da camada "mountain"');
          }
        }
      });
    })
    .catch(error => {
      console.error('Erro ao carregar o SVG:', error);
    });
}
mapOn();
