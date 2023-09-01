var imageUrl = './img/map.jpg';
var imageHeight = 4384;
var windowHeight = window.innerHeight; // Height Window Chrome

// Calculate the minimum zoom required the height of the image is equal to 100vh
var minZoom = Math.log2(windowHeight / imageHeight);
// Calculate scale factor to adjust map height to 100vh
var scale = windowHeight / imageHeight;
// Calculate image limit
var imageBounds = [[0, 0], [imageHeight, 7680]];



function createCustomIcon(iconUrl) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    shadowUrl: './img/shadow.png',
    shadowSize: [36, 36],
    shadowAnchor: [13, 26],
  });
}
var redIcon = createCustomIcon('./img/iconRed.png');
var blueIcon = createCustomIcon('./img/iconBlue.png');
var greenIcon = createCustomIcon('./img/iconGreen.png');
var yellowIcon = createCustomIcon('./img/iconYellow.png');



// Create map
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: minZoom,
  maxZoom: 2,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
  zoomControl: false,
  maxBounds: imageBounds, // Prevents dragging beyond image boundaries
  maxBoundsViscosity: 1.0 // Keeps the gray background always invisible
});

// Add an image layer to the map
L.imageOverlay(imageUrl, imageBounds).addTo(map);



const iconMap = {
  Structure: redIcon,
  Mountain: blueIcon,
  City: greenIcon,
  Region: yellowIcon
};

const markers = [];
const searchInput = document.getElementById('search-input');


function createMarkers(places) {


  places.forEach(place => {
    const coords = place.coords.split(',');

    if (place.type !== "River") {
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());

      const marker = L.marker([lat, lng], { icon: iconMap[place.type] });
      marker.type = place.type;
      marker.options.place = place; // Adicione a propriedade place ao marcador

      marker.on("click", function () {
        var pos = map.latLngToLayerPoint(marker.getLatLng());
        pos.y -= 15;
        var fx = new L.PosAnimation();

        fx.once('end', function () {
          pos.y += 15;
          fx.run(marker._icon, pos, 0.8);
        });

        fx.run(marker._icon, pos, 0.3);
      });

      marker.on('click', function () {
        const content = `
          <div>
            <h2>${place.name}</h2>
            <p>${place.description}</p>
          </div>
        `;
        showModal(content);
      });
      markers.push(marker);
    }
  });
  return markers;
}

//I stopped here on the improvements
function showModal(content) {
  const modalId = 'custom-modal';

  // Criação do modal
  const modal = document.createElement('div');
  modal.setAttribute('id', modalId);
  modal.innerHTML = content;
  document.body.appendChild(modal);

  // Configuração e abertura do modal usando a biblioteca IziModal
  $(`#${modalId}`).iziModal({
    headerColor: '#333',
    background: 'rgba(0, 1, 11, 0.7)',
    width: 600,
    padding: 20,
    closeOnEscape: true,
    closeButton: true,
    onClosed: function (modal) {
      // Remover o modal do HTML ao fechar
      modal.destroy();
      $(`#${modalId}`).remove();
    }
  });
  // Aplicar estilos personalizados ao modal
  $(`#${modalId}`).css({
    color: '#fff',    // Definir a cor do texto como branca
    'box-shadow': '0 0 2px rgba(255, 155, 5, 0.7)',   // Simular borda de 0.5px com sombra
    'border-radius': '10px'   // Definir o raio dos cantos arredondados
  });
  $(`#${modalId}`).iziModal('open');
}


// Função para mostrar os marcadores no mapa
function showMarkers(markers) {
  markers.forEach(marker => {
    marker.addTo(map); // Adiciona o marcador ao mapa
  });
}


// Função para ocultar todos os marcadores do mapa
function hideMarkers(markers) {
  markers.forEach(marker => {
    marker.removeFrom(map); // Remove o marcador do mapa
  });
}

// Função para filtrar marcadores com base no nome
function filterMarkers(searchTerm) {
  markers.forEach(marker => {
    const placeName = marker.options.place.name.toLowerCase();
    const shouldShow = placeName.includes(searchTerm);

    if (shouldShow) {
      marker.addTo(map); // Mostra o marcador
    }
  });
}



// Adicionar evento de input para a pesquisa
searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value.trim().toLowerCase();

  // Ocultar todos os marcadores antes de filtrar
  hideMarkers(markers);

  if (searchTerm === "") {
    // Mostrar todos os marcadores se a pesquisa estiver vazia
    showMarkers(markers);
  } else {
    // Filtrar marcadores com base na pesquisa
    filterMarkers(searchTerm);
  }
});


const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function (event) {
    const checkbox = event.target;

    const filterType = checkbox.value;
    if (checkbox.checked) {
      // Mostrar marcadores do tipo selecionado
      showMarkers(markers.filter(marker => marker.options.place.type === filterType));
    } else {
      // Ocultar marcadores do tipo desmarcado
      hideMarkers(markers.filter(marker => marker.options.place.type === filterType));
    }
  });
});













// Carregar e exibir os marcadores ao abrir a página
fetchJSON()
  .then(places => {
    markers.push(...createMarkers(places)); // Adicionar marcadores à variável global
    showMarkers(markers);
  })
  .catch(error => {
    console.error('Erro ao carregar o arquivo JSON:', error);
  });

// Ajustar o mapa para que a imagem ocupe a altura desejada
map.setView([imageHeight / 2, 7680 / 2], minZoom);
// Ajustar o tamanho do mapa para ocupar 100vh
map.invalidateSize();
var mapContainer = document.getElementById('map');
mapContainer.style.height = '100vh';
mapContainer.style.width = '100%';