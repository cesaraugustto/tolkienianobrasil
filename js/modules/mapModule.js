var imageUrl = './img/final-map.png';
var imageHeight = 4384;
var windowHeight = window.innerHeight; // Height Window Chrome
var minZoom = Math.log2(windowHeight / imageHeight);
var imageBounds = [[0, 0], [imageHeight, 7680]];

var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: minZoom,
    maxZoom: 2,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    zoomControl: false,
    maxBounds: imageBounds, // limit
    maxBoundsViscosity: 1.0 // background invisible
});

export { map };

export function mapOn() {
    L.imageOverlay(imageUrl, imageBounds).addTo(map);
    // adjust for height of image
    map.setView([imageHeight / 2, 7680 / 2], minZoom);
    // adjust for 100vh
    map.invalidateSize();
    var mapContainer = document.getElementById('map');
    mapContainer.style.height = '100vh';
    mapContainer.style.width = '100%';
}


