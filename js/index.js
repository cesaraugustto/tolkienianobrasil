function findElementsInSVG(svgData) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgData, 'image/svg+xml');

  const mountainsGroup = svg.querySelector('#Mountains');
  
  if (mountainsGroup) {
    const ironHillsElement = mountainsGroup.querySelector('#IronHills');
    if (ironHillsElement) {
      console.log("Elemento 'IronHills' encontrado");
      // Faça algo com o elemento encontrado, se necessário
    } else {
      console.log('Elemento "IronHills" não encontrado dentro do grupo "Mountains"');
    }
  } else {
    console.log('Grupo "Mountains" não encontrado no SVG');
  }
}



export function mapOn() {
  const imageUrl = './img/resized_Full.svg';
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

  // Este seria o ponto em que você busca o arquivo SVG (substitua pelo seu fetch)
  fetch('./img/Final_Map.svg')
    .then(response => response.text())
    .then(svgData => {
      //console.log(svgData); // Corrigindo a posição do console.log
      findElementsInSVG(svgData);
    })
    .catch(error => {
      console.error('Erro ao carregar o SVG:', error);
    });
}

mapOn();
