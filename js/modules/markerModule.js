import { showDescriptionModal } from "./modalModule.js";
import { map } from "./mapModule.js";

const markers = [];
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const searchInput = document.getElementById('search-input');
let isLoadingMarkers = false;

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

export const redIcon = createCustomIcon('./img/iconRed.png');
export const blueIcon = createCustomIcon('./img/iconBlue.png');
export const greenIcon = createCustomIcon('./img/iconGreen.png');
export const yellowIcon = createCustomIcon('./img/iconYellow.png');
export const iconMap = { Structure: redIcon, Mountain: blueIcon, City: greenIcon, Region: yellowIcon };

function isVisibleOnMap(marker, bounds) {
    return bounds.contains(marker.getLatLng());
}

export function createMarkers(places) {
    places.forEach(place => {
        const coords = place.coords.split(',');
            const lat = parseFloat(coords[0].trim());
            const lng = parseFloat(coords[1].trim());

            const marker = L.marker([lat, lng], { icon: iconMap[place.type] });
            marker.type = place.type;
            marker.options.place = place;

            marker.on("click", function () {
                var pos = map.latLngToLayerPoint(marker.getLatLng());
                pos.y -= 15;
                var fx = new L.PosAnimation();

                fx.once('end', function () {
                    pos.y += 15;
                    fx.run(marker._icon, pos, 0.8);
                });

                fx.run(marker._icon, pos, 0.3);

                const content = `<div> <h2>${place.name}</h2> <p>${place.description}</p> </div>`;
                showDescriptionModal(content);
            });

            markers.push(marker);
        
    });

    map.on('moveend', handleMoveEnd);
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    searchInput.addEventListener('input', handleFilterChange);
    handleMoveEnd(); // Chamando handleMoveEnd() inicialmente para carregar os marcadores visíveis.

    return markers;
}

export function showMarkers() {
    markers.forEach(marker => {
        if (isVisibleOnMap(marker, map.getBounds()) && filterMatch(marker.type) && searchMatch(marker)) {
            marker.addTo(map);
        }
    });
}

export function hideMarkers() {
    markers.forEach(marker => {
        marker.removeFrom(map);
    });
}

function filterMatch(type) {
    const checkedCheckboxes = Array.from(filterCheckboxes);
    return checkedCheckboxes.length === 0 || checkedCheckboxes.some(checkbox => checkbox.checked && checkbox.value === type);
}


function handleFilterChange() {
    isLoadingMarkers = true;
    hideMarkers();

    setTimeout(() => {
        showMarkers();
        isLoadingMarkers = false;
    }, 100);
}

function handleMoveEnd() {
    markers.forEach(marker => {
        if (isVisibleOnMap(marker, map.getBounds()) && filterMatch(marker.type) && searchMatch(marker)) {
            marker.addTo(map);
        } else {
            marker.removeFrom(map);
        }
    });

    isLoadingMarkers = false;
}

function searchMatch(marker) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    return searchTerm === '' || marker.options.place.name.toLowerCase().includes(searchTerm);
}
