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
  iconSize: [24,24], // size of the icon
});
var blueIcon = L.icon({
  iconUrl: './img/iconBlue.png',
  iconSize: [24,24], // size of the icon
});
var greenIcon = L.icon({
  iconUrl: './img/iconGreen.png',
  iconSize: [24,24], // size of the icon
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
    if (place.type === 'Structure' || place.type === 'Mountain' || place.type === 'City') {
      const lat = parseFloat(coords[0].trim());
      const lng = parseFloat(coords[1].trim());

      let marker;

      // Criação do marcador com as coordenadas e o ícone personalizado com base no type
      if (place.type === 'Structure') {
        marker = L.marker([lat, lng], { icon: redIcon });
      } else if (place.type === 'Mountain') {
        marker = L.marker([lat, lng], { icon: blueIcon });
      } else if (place.type === 'City') {
        marker = L.marker([lat, lng], { icon: greenIcon });
      }

      // Definir o tipo do marcador com base no valor do lugar
      marker.type = place.type;

      // Adição de um pop-up com informações adicionais
      marker.bindPopup(`
        <h3>${place.name}</h3>
        <p>${place.description}</p>
      `);

      marker.on('click', function() {
        const originalIconSize = marker.options.icon.options.iconSize;
        const enlargedIconSize = [originalIconSize[0] * 1.2, originalIconSize[1] * 1.2];
      
        const currentIconSize = marker._icon.style;
        currentIconSize.width = enlargedIconSize[0] + 'px';
        currentIconSize.height = enlargedIconSize[1] + 'px';
      
        setTimeout(function() {
          currentIconSize.width = originalIconSize[0] + 'px';
          currentIconSize.height = originalIconSize[1] + 'px';
        }, 300);
      });
      
      

      // Armazena o marcador na lista de marcadores
      markers.push(marker);

      
    } else if (place.type === 'River') {
      const latlngs = [];

      for (let i = 0; i < coords.length; i += 2) {
        const lat = parseFloat(coords[i].trim());
        const lng = parseFloat(coords[i + 1].trim());

        latlngs.push([lat, lng]);
      }

      // Criação do polilinha com as coordenadas
      const polyline = L.polyline(latlngs, { color: 'blue' }).addTo(map);
      polyline.bindPopup(`
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      `);
      // Definir o tipo da polilinha
      polyline.type = place.type;

      // Adição de um pop-up com informações adicionais
      polyline.bindPopup(`
        <h3>${place.name}</h3>
        <p>${place.description}</p>
      `);

      // Armazena a polilinha na lista de marcadores
      markers.push(polyline);
    }
  });

  return markers;
  
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
    document.getElementById('RiverFilter').addEventListener('change', function(event) {
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






/*
// Crie um polígono com base nas coordenadas dos vértices (vertical/horizontal)
var coordenadas = "3800,3700,3000,4100,2000,3500,1900,3000,2300,3000,2700,2100,3800,2400";
var paresCoordenadas = coordenadas.split(","); // Separar as coordenadas em pares
var arrayCoordenadas = [];
for (var i = 0; i < paresCoordenadas.length; i += 2) {
    var x = parseInt(paresCoordenadas[i]);
    var y = parseInt(paresCoordenadas[i + 1]);
    arrayCoordenadas.push([x, y]); // Adicionar o par de coordenadas ao array
}


// Crie um polígono com base nas coordenadas dos vértices
var polygonPoints = arrayCoordenadas;
// Defina a cor de preenchimento do polígono
var polygon = L.polygon(polygonPoints, { fillColor: 'red' }).addTo(map);
/*
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

*/








// Ajustar o mapa para que a imagem ocupe a altura desejada
map.setView([imageHeight / 2, 7680 / 2], minZoom);
// Ajustar o tamanho do mapa para ocupar 100vh
map.invalidateSize();
var mapContainer = document.getElementById('map');
mapContainer.style.height = '100vh';
mapContainer.style.width = '100%';







