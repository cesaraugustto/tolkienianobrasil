var imageUrl = './img/map.jpg';
var imageHeight = 4384;
var windowHeight = window.innerHeight; // Height Window Chrome
// Calculate the minimum zoom required the height of the image is equal to 100vh
var minZoom = Math.log2(windowHeight / imageHeight);
// Calculate scale factor to adjust map height to 100vh
var scale = windowHeight / imageHeight;
// Calculate image limit
var imageBounds = [[0, 0], [imageHeight, 7680]];

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

export { map };

export function mapOn() {

    L.imageOverlay(imageUrl, imageBounds).addTo(map);

    // Ajustar o mapa para que a imagem ocupe a altura desejada
    map.setView([imageHeight / 2, 7680 / 2], minZoom);
    // Ajustar o tamanho do mapa para ocupar 100vh
    map.invalidateSize();
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '100vh';
    mapContainer.style.width = '100%';
}


