// connection.js
function fetchJSON() {
    return fetch('data.json')
      .then(response => response.json())
      .then(data => {
        const places = data.places;
        return places;
      })
      .catch(error => {
        console.error('Erro ao carregar o arquivo JSON:', error);
      });
}

export default fetchJSON;
