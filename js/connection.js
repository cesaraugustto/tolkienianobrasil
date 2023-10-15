async function fetchJSON() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    const places = data.places;
    return places;
  } catch (error) {
    console.error('Erro ao carregar o arquivo JSON:', error);
  }
}

//dont need to import
window.fetchJSON = fetchJSON;
