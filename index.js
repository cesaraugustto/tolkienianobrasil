// Inicialize o mapa
var imageUrl = './map.jpeg';
var imageBounds = [[0, 0], [1128, 1990]];

var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -2,
  maxZoom: 1,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
  zoomControl: false
}).setView([0, 0], 0);

var imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

map.fitBounds(imageBounds);


/*
var marker = L.marker([51.5, -0.09]).addTo(map);
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 200
}).addTo(map);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

var popup = L.popup()
.setLatLng([51.513, -0.09])
.setContent("I am a standalone popup.")
.openOn(map)

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}
map.on('click', onMapClick);*/