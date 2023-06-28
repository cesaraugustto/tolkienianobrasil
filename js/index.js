import fetchJSON from './connection.js';

fetchJSON()
  .then(places => {
    // Aqui você pode fazer a manipulação e exibição dos lugares

    const placeId = 6; // ID do lugar que você deseja exibir

    // Encontra o lugar com o ID específico
    const selectedPlace = places.find(place => place.id === placeId);

    if (selectedPlace) {
      // Exibe o alert com as informações do lugar selecionado
      alert(`Nome do local: ${selectedPlace.name}\nTipo do local: ${selectedPlace.type}\nDescrição: ${selectedPlace.description}`);
    } else {
      alert('Local não encontrado!');
    }
});


// Inicializar o mapa
var imageUrl = './img/map.jpg';
var imageHeight = 4384; // Altura da imagem em pixels
var windowHeight = window.innerHeight; // Altura da janela do navegador

// Calcular o zoom mínimo necessário para que a altura da imagem seja igual a 100vh
var minZoom = Math.log2(windowHeight / imageHeight);
// Calcular o fator de escala para ajustar a altura do mapa para 100vh
var scale = windowHeight / imageHeight;

// Calcular os limites da imagem
var imageBounds = [[0, 0], [imageHeight, 7680]];

// Criar o mapa com os parâmetros definidos
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: minZoom,
    maxZoom: 2,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    zoomControl: false,
    maxBounds: imageBounds, // Impede arrastar além dos limites da imagem
    maxBoundsViscosity: 1.0 // Mantém o fundo cinza sempre invisível
});

// Adicionar a camada de imagem ao mapa
L.imageOverlay(imageUrl, imageBounds).addTo(map);






//Adicionando marcado padrão ao mapa (vertical/horizontal)
var markerLorien = L.marker([7250, 4200]).addTo(map);
var markerGondor= L.marker([1700, 4700]).addTo(map);
var markerMordor= L.marker([1800, 5300]).addTo(map);
var markerGreyports= L.marker([3200, 2300]).addTo(map);
var markerErebor= L.marker([3400, 5150]).addTo(map);
var markerLindon= L.marker([3500, 1800]).addTo(map);

// Crie um polígono com base nas coordenadas dos vértices (vertical/horizontal)
var coordenadas = "3800,3700,3000,4100,2000,3500,1900,3000,2300,3000,2700,2100,3800,2400";
var paresCoordenadas = coordenadas.split(","); // Separar as coordenadas em pares
var arrayCoordenadas = [];
for (var i = 0; i < paresCoordenadas.length; i += 2) {
    var x = parseInt(paresCoordenadas[i]);
    var y = parseInt(paresCoordenadas[i + 1]);
    arrayCoordenadas.push([x, y]); // Adicionar o par de coordenadas ao array
}
// Exibir o array resultante
console.log(arrayCoordenadas);
// Crie um polígono com base nas coordenadas dos vértices
var polygonPoints = arrayCoordenadas;
// Defina a cor de preenchimento do polígono
var polygon = L.polygon(polygonPoints, { fillColor: 'red' }).addTo(map);

// Adiciona o texto do popup ao criar o marcador
markerLorien.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Lothlorien</strong>, which the queen is Galadriel, daughter of Finarfin.");
markerGondor.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Gondor</strong>, which the king is Elessar, heir of Isildur.");
markerMordor.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Mordor</strong>, which the king is Sauron, discipule of Morgoth.");
markerGreyports.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>Grey Ports</strong>.");
markerErebor.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>Erebor</strong>.");
polygon.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>Arnor</strong>.");
markerLindon.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>Lindon</strong>.");

// Tratamento dos eventos dos filtros
// Tratamento do filtro
document.getElementById('kingdomsFilter').addEventListener('change', function(event) {
    if (event.target.checked) {
      // Mostrar o marcador de Lothlórien
      markerLorien.addTo(map);
      markerGondor.addTo(map);
      markerMordor.addTo(map);
      markerErebor.addTo(map);
      markerLindon.addTo(map);
    } else {
      // Ocultar o marcador de Lothlórien
      markerLorien.removeFrom(map);
      markerGondor.removeFrom(map);
      markerMordor.removeFrom(map);
      markerErebor.removeFrom(map);
      markerLindon.removeFrom(map);
    }
  });

// Tratamento dos eventos dos filtros
// Tratamento do filtro
document.getElementById('portsFilter').addEventListener('change', function(event) {
    if (event.target.checked) {
      // Mostrar o marcador de Lothlórien
      markerGreyports.addTo(map);
    } else {
      // Ocultar o marcador de Lothlórien
      markerGreyports.removeFrom(map);
    }
  });
  
  // Repita o mesmo tratamento para os outros filtros (vilas, montanhas, etc.)
document.getElementById('regionsFilter').addEventListener('change', function(event) {
    if (event.target.checked) {
      // Mostrar o marcador de Lothlórien
      polygon.addTo(map);
    } else {
      // Ocultar o marcador de Lothlórien
      polygon.removeFrom(map);
    }
  }); 


  
// Tratamento do evento 'click' no marcador
  map.on('popupopen', function() {
    map.tap = true;
  });
  
  map.on('popupclose', function() {
    map.tap = false;
  });










// Ajustar o mapa para que a imagem ocupe a altura desejada
map.setView([imageHeight / 2, 7680 / 2], minZoom);
// Ajustar o tamanho do mapa para ocupar 100vh
map.invalidateSize();
var mapContainer = document.getElementById('map');
mapContainer.style.height = '100vh';
mapContainer.style.width = '100%';

