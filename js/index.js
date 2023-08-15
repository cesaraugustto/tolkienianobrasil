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




var redIcon = L.icon({
  iconUrl: './img/iconRed.png',
  iconSize: [26, 26], // tamanho do ícone
  iconAnchor: [13, 26], // ponto de ancoragem do ícone (relativo ao tamanho)
  shadowUrl: './img/shadow.png', // caminho para a imagem de sombra personalizada com fundo transparente
  shadowSize: [36, 36], // tamanho da sombra (largura x altura) para corresponder ao tamanho do ícone
  shadowAnchor: [13, 26], // ponto de ancoragem da sombra (relativo ao tamanho da sombra)
});

var blueIcon = L.icon({
  iconUrl: './img/iconBlue.png',
  iconSize: [26, 26], // tamanho do ícone
  iconAnchor: [13, 26], // ponto de ancoragem do ícone (relativo ao tamanho)
  shadowUrl: './img/shadow.png', // caminho para a imagem de sombra personalizada com fundo transparente
  shadowSize: [36, 36], // tamanho da sombra (largura x altura) para corresponder ao tamanho do ícone
  shadowAnchor: [13, 26], // ponto de ancoragem da sombra (relativo ao tamanho da sombra)
});

var greenIcon = L.icon({
  iconUrl: './img/iconGreen.png',
  iconSize: [26, 26], // tamanho do ícone
  iconAnchor: [13, 26], // ponto de ancoragem do ícone (relativo ao tamanho)
  shadowUrl: './img/shadow.png', // caminho para a imagem de sombra personalizada com fundo transparente
  shadowSize: [36, 36], // tamanho da sombra (largura x altura) para corresponder ao tamanho do ícone
  shadowAnchor: [13, 26], // ponto de ancoragem da sombra (relativo ao tamanho da sombra)
});

var yellowIcon = L.icon({
  iconUrl: './img/iconYellow.png',
  iconSize: [26, 26], // tamanho do ícone
  iconAnchor: [13, 26], // ponto de ancoragem do ícone (relativo ao tamanho)
  shadowUrl: './img/shadow.png', // caminho para a imagem de sombra personalizada com fundo transparente
  shadowSize: [36,36], // tamanho da sombra (largura x altura) para corresponder ao tamanho do ícone
  shadowAnchor: [13, 26], // ponto de ancoragem da sombra (relativo ao tamanho da sombra)
});




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


function createMarkers(places) {
  const markers = [];

  places.forEach(place => {
    const coords = place.coords.split(',');

    // Verificar se o lugar é um marcador ou uma polilinha
    if (place.type !== "River") {
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());

      let marker;
      // Criação do marcador com as coordenadas e o ícone personalizado com base no type
      if (place.type === 'Structure') {
        marker = L.marker([lat, lng], { icon: redIcon});       
      } else if (place.type === 'Mountain') {
        marker = L.marker([lat, lng], { icon: blueIcon });
      } else if (place.type === 'City') {
        marker = L.marker([lat, lng], { icon: greenIcon });
      } else if (place.type === 'Region') {
        marker = L.marker([lat, lng], { icon: yellowIcon });
      }

      // Definir o tipo do marcador com base no valor do lugar
      marker.type = place.type;

      
    marker.on("click", function() {
    var pos = map.latLngToLayerPoint(marker.getLatLng());
    pos.y -= 15;
    var fx = new L.PosAnimation();

    fx.once('end',function() {
        pos.y += 15;
        fx.run(marker._icon, pos, 0.8);
    });

    fx.run(marker._icon, pos, 0.3);
})
marker.on('click', function() {
  const content = `
  <div>
    <h2>${place.name}</h2>
    <p>${place.description}</p>
  </div>
`;

showModal(content);

});
      

      // Armazena o marcador na lista de marcadores
      markers.push(marker);

      
    } 
  });

  return markers;
  
}

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
    onClosed: function(modal) {
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

// Carregar e exibir os marcadores ao abrir a página
fetchJSON()
  .then(places => {
    const markers = createMarkers(places);
    showMarkers(markers);

      // Tratamento do evento de mudança no filtro
      document.getElementById('CityFilter').addEventListener('change', function(event) {
        const checkbox = event.target;
    
        if (checkbox.checked) {
          showMarkers(markers.filter(marker => marker.type === checkbox.value));
        } else {
          hideMarkers(markers.filter(marker => marker.type === checkbox.value));
        }
      });
    // Tratamento do evento de mudança no filtro
    document.getElementById('StructureFilter').addEventListener('change', function(event) {
      const checkbox = event.target;
  
      if (checkbox.checked) {
        showMarkers(markers.filter(marker => marker.type === checkbox.value));
      } else {
        hideMarkers(markers.filter(marker => marker.type === checkbox.value));
      }
    });
    // Tratamento do evento de mudança no filtro
    document.getElementById('MountainFilter').addEventListener('change', function(event) {
      const checkbox = event.target;
  
      if (checkbox.checked) {
        showMarkers(markers.filter(marker => marker.type === checkbox.value));
      } else {
        hideMarkers(markers.filter(marker => marker.type === checkbox.value));
      }
    });
    // Tratamento do evento de mudança no filtro
    document.getElementById('RegionFilter').addEventListener('change', function(event) {
      const checkbox = event.target;
  
      if (checkbox.checked) {
        showMarkers(markers.filter(marker => marker.type === checkbox.value));
      } else {
        hideMarkers(markers.filter(marker => marker.type === checkbox.value));
      }
    });


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







