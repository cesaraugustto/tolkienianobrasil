import { showDescriptionModal } from "./modalModule.js";
import { map } from "./mapModule.js";
export const markers = [];

//styles for icons
export function createCustomIcon(iconUrl) {
    return L.icon({
        iconUrl: iconUrl,
        iconSize: [26, 26],
        iconAnchor: [13, 26],
        shadowUrl: './img/shadow.png',
        shadowSize: [36, 36],
        shadowAnchor: [13, 26],
    });
}
export var redIcon = createCustomIcon('./img/iconRed.png');
export var blueIcon = createCustomIcon('./img/iconBlue.png');
export var greenIcon = createCustomIcon('./img/iconGreen.png');
export var yellowIcon = createCustomIcon('./img/iconYellow.png');
const iconMap = { Structure: redIcon, Mountain: blueIcon, City: greenIcon, Region: yellowIcon };

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
                const content = `<div> <h2>${place.name}</h2> <p>${place.description}</p> </div> `;
                showDescriptionModal(content);
            });
            markers.push(marker);
        }
    });
    return markers;
}

export function showMarkers(markers) {
    markers.forEach(marker => {
      marker.addTo(map);
    });
}
export function hideMarkers(markers) {
    markers.forEach(marker => {
      marker.removeFrom(map);
    });
}


