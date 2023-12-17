export function mapOn() {
    const imageUrl = './img/final_inkscape_resized.svg';
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

    const imageOverlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);

    imageOverlay.getElement().addEventListener('load', function() {
        accessAllSVGObjects(imageOverlay.getElement());
    });

    map.setView([imageHeight / 2, 7680 / 2], minZoom);
    map.invalidateSize();

    const mapContainer = document.getElementById('map');
    mapContainer.style.height = '100vh';
    mapContainer.style.width = '100%';
}

export function accessAllSVGObjects(svgDoc) {
    if (svgDoc) {
        const svgObjects = svgDoc.querySelectorAll('*');

        svgObjects.forEach(element => {
            console.log(element); // Exibe cada elemento no console
        });
    } else {
        console.log('SVG não encontrado na camada de imagem do Leaflet');
    }
}
mapOn();