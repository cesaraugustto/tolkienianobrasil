import { mapOn, map } from "./modules/mapModule.js";
import { showMarkers, hideMarkers, createMarkers, redIcon, blueIcon, greenIcon, yellowIcon } from "./modules/markerModule.js";

const markers = [];
const searchInput = document.getElementById('search-input');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

mapOn();

//listening changes for typeFilters
filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function (event) {
    const checkbox = event.target;
    const filterType = checkbox.value;

    if (checkbox.checked) {
      showMarkers(markers.filter(marker => marker.options.place.type === filterType));
    } else {
      hideMarkers(markers.filter(marker => marker.options.place.type === filterType));
    }
  });
});

//listening changes for searchInput
function filterMarkers(searchTerm) {
  markers.forEach(marker => {
    const placeName = marker.options.place.name.toLowerCase();
    const shouldShow = placeName.includes(searchTerm);

    if (shouldShow) {
      marker.addTo(map);
    }
  });
}
searchInput.addEventListener('input', function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  hideMarkers(markers);
  if (searchTerm === "") {
    showMarkers(markers);
  } else {
    filterMarkers(searchTerm);
  }
});

// Instashow for makers
fetchJSON()
  .then(places => {
    markers.push(...createMarkers(places));
    showMarkers(markers);
  })
  .catch(error => {
    console.error('Error accessing JSON:', error);
  });