import { showDescriptionModal } from "./modalModule.js";
import { map } from "./mapModule.js";

const markers = [];
const loadedMarkers = [];
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const searchInput = document.getElementById('search-input');
let activeFilters = [];

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

function handleMoveEnd() {
    const visibleBounds = map.getBounds();
  
    markers.forEach(marker => {
      if (isVisibleOnMap(marker, visibleBounds)) {
        const typeMatch = activeFilters.includes(marker.type);
        const searchMatch = searchInput.value.trim() === '' || marker.options.place.name.toLowerCase().includes(searchInput.value.trim().toLowerCase());
        const shouldShow = typeMatch && searchMatch;
  
        if (shouldShow) {
          if (!loadedMarkers.includes(marker)) {
            marker.addTo(map);
            loadedMarkers.push(marker);
          }
        } else {
          if (loadedMarkers.includes(marker)) {
            marker.removeFrom(map);
            loadedMarkers.splice(loadedMarkers.indexOf(marker), 1);
          }
        }
      } else {
        if (loadedMarkers.includes(marker)) {
          marker.removeFrom(map);
          loadedMarkers.splice(loadedMarkers.indexOf(marker), 1);
        }
      }
    });
  }
  

function isVisibleOnMap(marker, bounds) {
    return bounds.contains(marker.getLatLng());
}

export function createMarkers(places) {
    places.forEach(place => {
        const coords = place.coords.split(',');

        if (place.type !== "River") {
            const lat = parseFloat(coords[0].trim());
            const lng = parseFloat(coords[1].trim());

            const marker = L.marker([lat, lng], { icon: iconMap[place.type] });
            marker.type = place.type;
            marker.options.place = place;

            marker.on("click", function () {
                var pos = map.latLatLngToLayerPoint(marker.getLatLng());
                pos.y -= 15;
                var fx = new L.PosAnimation();

                fx.once('end', function () {
                    pos.y += 15;
                    fx.run(marker._icon, pos, 0.8);
                });

                fx.run(marker._icon, pos, 0.3);
            });

            marker.on('click', function () {
                const content = `<div> <h2>${place.name}</h2> <p>${place.description}</p> </div> `;
                showDescriptionModal(content);
            });
            markers.push(marker);
        }
    });

    // Registre o ouvinte de evento para o movimento do mapa
    map.on('moveend', handleMoveEnd);

    // Registre os ouvintes de eventos para os filtros de tipo
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            handleFilterChange();
        });
    });

    // Registre o ouvinte de evento para a pesquisa por texto
    searchInput.addEventListener('input', function () {
        handleFilterChange();
    });

    handleFilterChange();

    return markers;
}

export function showMarkers(markers) {
    markers.forEach(marker => {
        if (isVisibleOnMap(marker, map.getBounds()) && activeFilters.includes(marker.type)) {
            marker.addTo(map);
            loadedMarkers.push(marker);
        }
    });
}

export function hideMarkers(markers) {
    markers.forEach(marker => {
        if (loadedMarkers.includes(marker)) {
            marker.removeFrom(map);
            loadedMarkers.splice(loadedMarkers.indexOf(marker), 1);
        }
    });
}

function handleFilterChange() {
    activeFilters = Array.from(filterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    const searchTerm = searchInput.value.trim().toLowerCase();

    markers.forEach(marker => {
        const typeMatch = activeFilters.includes(marker.type);
        const searchMatch = searchTerm === "" || marker.options.place.name.toLowerCase().includes(searchTerm);
        const shouldShow = typeMatch && searchMatch;

        if (shouldShow && !loadedMarkers.includes(marker)) {
            marker.addTo(map);
            loadedMarkers.push(marker);
        } else if (!shouldShow && loadedMarkers.includes(marker)) {
            marker.removeFrom(map);
            loadedMarkers.splice(loadedMarkers.indexOf(marker), 1);
        }
    });
}
