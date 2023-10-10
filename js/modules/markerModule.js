import { showModal } from "./modalModule.js";
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
const iconMap = {
    Structure: redIcon,
    Mountain: blueIcon,
    City: greenIcon,
    Region: yellowIcon
};



//Daí não precisa de carregar todos ao mesmo tmepo....
// Use a função fetchJSON para buscar a descrição completa com base no ID
function fetchDescription(placeId) {
    fetchJSON()
        .then(places => {
            const description = places.find(place => place.id === placeId)?.description;
            if (description) {
                // Exiba a descrição completa em um modal ou onde for apropriado
                showModal(description);
            } else {
                console.error('Descrição não encontrada para o ID:', placeId);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar a descrição:', error);
        });
}


export function createMarkers(places) {
    places.forEach(place => {
        const coords = place.coords.split(',');

        if (place.type !== "River") {
            const lat = parseFloat(coords[0].trim());
            const lng = parseFloat(coords[1].trim());

            const marker = L.marker([lat, lng], { icon: iconMap[place.type] });
            marker.type = place.type;
            marker.options.place = place; // Adicione a propriedade place ao marcador

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
                const placeId = place.id; // Obtém o ID do lugar
                fetchDescription(placeId); // Chama a função para buscar a descrição com base no ID
            });
            markers.push(marker);
        }
    });
    return markers;
}





