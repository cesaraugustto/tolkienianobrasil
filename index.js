// Inicialize o mapa
var imageUrl = './map.jpeg';
var imageBounds = [[0, 0], [1128, 1990]];


// Crie um objeto de ícone personalizado
var kingdomIcon = L.icon({
  iconUrl: './kingdomIcon.svg',
  iconSize: [32, 32], // Tamanho da imagem do ícone
});
// Crie um objeto de ícone personalizado
var portsIcon = L.icon({
    iconUrl: './portsIcon.svg',
    iconSize: [32, 32], // Tamanho da imagem do ícone
  });


var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 1,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
  zoomControl: false,
  maxBounds: imageBounds, // Define os limites de visualização
  maxBoundsViscosity: 1.0 // Mantém o fundo cinza sempre invisível
}).setView([564, 995], -3);
var imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);



var markerLorien = L.marker([600, 1050], { icon: kingdomIcon }).addTo(map);
var markerGondor= L.marker([300, 1100], { icon: kingdomIcon }).addTo(map);
var markerMordor= L.marker([430, 1400], { icon: kingdomIcon }).addTo(map);
var markerGreyports= L.marker([830, 600], { icon: portsIcon }).addTo(map);



// Adiciona o texto do popup ao criar o marcador
markerLorien.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Lothlorien</strong>, which the queen is Galadriel, daughter of Finarfin.");
markerGondor.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Gondor</strong>, which the king is Elessar, heir of Isildur.");
markerMordor.bindPopup("<b><b>Dear user!</b><br>I am in the kingdom of <strong>Mordor</strong>, which the king is Sauron, discipule of Morgoth.");
markerGreyports.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>Grey Ports</strong>.");





var coordenadas = "930,1000,1030,800,1000,600,800,600,750,630,600,730,550,950";
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
polygon.bindPopup("<b><b>Dear user!</b><br>I am in the <strong>region of Arnor</strong>.");







// Tratamento dos eventos dos filtros
// Tratamento do filtro
document.getElementById('kingdomsFilter').addEventListener('change', function(event) {
    if (event.target.checked) {
      // Mostrar o marcador de Lothlórien
      markerLorien.addTo(map);
      markerGondor.addTo(map);
      markerMordor.addTo(map);
    } else {
      // Ocultar o marcador de Lothlórien
      markerLorien.removeFrom(map);
      markerGondor.removeFrom(map);
      markerMordor.removeFrom(map);
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
      polygon.addTo(map)
    } else {
      // Ocultar o marcador de Lothlórien
      polygon.removeFrom(map);
    }
  });


  

// Tratamento do evento 'click' no marcador
markerLorien.on('click', function() {
    if (map.tap) {
      if (markerLorien.isPopupOpen()) {
        markerLorien.closePopup();
      } else {
        markerLorien.openPopup();
      }
    }
  });
  markerGondor.on('click', function() {
    if (map.tap) {
      if (markerGondor.isPopupOpen()) {
        markerGondor.closePopup();
      } else {
        markerGondor.openPopup();
      }
    }
});
markerMordor.on('click', function() {
    if (map.tap) {
      if (markerMordor.isPopupOpen()) {
        markerMordor.closePopup();
      } else {
        markerMordor.openPopup();
      }
    }
  });
  markerGreyports.on('click', function() {
    if (map.tap) {
      if (markerGreyports.isPopupOpen()) {
        markerGreyports.closePopup();
      } else {
        markerGreyports.openPopup();
      }
    }
  });
  polygon.on('click', function() {
    if (map.tap) {
        if (polygon.isPopupOpen()) {
            polygon.closePopup();
        } else {
            polygon.openPopup();
        }
    }
});
  
  map.on('popupopen', function() {
    map.tap = true;
  });
  
  map.on('popupclose', function() {
    map.tap = false;
  });

map.fitBounds(imageBounds);
