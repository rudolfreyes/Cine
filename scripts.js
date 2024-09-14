// URL base de la API
let apiUrl = 'https://movie.azurewebsites.net/api/cartelera?title=&ubication=';

// Función para obtener películas
async function fetchMovies() {
  try {
    const response = await fetch(apiUrl);
    const movies = await response.json();
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Limpia el contenedor

    // Muestra cada película
    movies.forEach(movie => {
      if (movie.Title) {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie', 'mb-5', 'p-4', 'border', 'shadow', 'rounded', 'bg-light');

        movieDiv.innerHTML = `
          <div class="container">
            <div class="row">
              <div class="col-md-9">
                <h2 class="text-primary">${movie.Title}</h2>
                <p class="text-muted">(${movie.Year})</p>
                <p>${movie.description}</p>
              </div>
              <div class="col-md-3 text-center">
                <img src="${movie.Poster}" class="img-fluid rounded" alt="${movie.Title} poster" style="max-width: 150px; height: auto;" />
              </div>
            </div>
            <div class="row mt-3">
              <div class="col text-center">
                <button class="btn btn-outline-primary mx-2" data-bs-toggle="modal" data-bs-target="#ABC" onclick="visualizar('${movie.imdbID}')">
                  Modificar
                </button>
                <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#BAJA" onclick="recuperaeliminar('${movie.imdbID}')">
                  Eliminar Película
                </button>
              </div>
            </div>
          </div>
        `;
        moviesContainer.appendChild(movieDiv);
      }
    });
  } catch (error) {
    console.error('Error al obtener películas:', error);
  }
}
// Función de búsqueda de películas
function buscarPelicula() {
  let query = document.getElementById('searchInput').value;
  apiUrl = `https://movie.azurewebsites.net/api/cartelera?title=${query}&ubication=`;
  fetchMovies();
}
// Función para actualizar la imagen del póster
function updateImage() {
  const urlInput = document.getElementById('imagenUrl').value;
  const imageElement = document.getElementById('posterImagen');
  imageElement.src = urlInput || 'https://via.placeholder.com/200x300?text=No+Image';
}

// Función para limpiar el formulario
async function limpiarFormulario() {
  document.getElementById('codigo').removeAttribute('disabled');
  document.getElementById('ABCLabel').textContent = "Agregar película";
  document.querySelectorAll('#codigo, #titulo, #anio, #peliculas, #descripcion, #ubicacion, #imagenUrl').forEach(el => el.value = '');
  document.getElementById('posterImagen').src = "https://via.placeholder.com/200x300?text=No+Image";
  document.getElementById('activo').checked = true;
}

// Función para agregar o modificar película
async function accion() {
  const esModificacion = document.getElementById('ABCLabel').textContent === "Modificar película";
  const modalElement = document.getElementById("ABC");
  const modalInstance = bootstrap.Modal.getInstance(modalElement);

  try {
    const pelicula = obtenerDatosFormulario();
    await enviarDatos(pelicula, esModificacion);
    actualizarVista(pelicula, esModificacion);
    alert(`Película ${esModificacion ? 'modificada' : 'guardada'} exitosamente`);
    modalInstance.hide();
    fetchMovies();
  } catch (error) {
    console.error('Error al procesar película:', error);
    alert(`Hubo un error al ${esModificacion ? 'modificar' : 'guardar'} la película.`);
  }
}
// Función para obtener datos del formulario
function obtenerDatosFormulario() {
  return {
    imdbID: document.getElementById('codigo').value,
    Title: document.getElementById('titulo').value,
    Year: document.getElementById('anio').value,
    Type: document.getElementById('peliculas').value.toUpperCase(),
    Poster: document.getElementById('imagenUrl').value,
    Estado: document.querySelector('input[name="estado"]:checked') ? 1 : 0,
    description: document.getElementById('descripcion').value,
    Ubication: document.getElementById('ubicacion').value
  };
}
// Función para enviar datos a la API
async function enviarDatos(pelicula, esModificacion) {
  const url = esModificacion 
    ? `https://movie.azurewebsites.net/api/cartelera?imdbID=${pelicula.imdbID}` 
    : 'https://movie.azurewebsites.net/api/cartelera';

  const method = esModificacion ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula)
  });

  if (!response.ok) throw new Error(`Error: ${response.status} - ${response.statusText}`);
  return await response.json();
}
// Función para actualizar la vista dinámicamente
function actualizarVista(pelicula, esModificacion) {
  const moviesContainer = document.getElementById('movies');
  const movieDiv = document.querySelector(`#movie-${pelicula.imdbID}`);
  if (esModificacion && movieDiv) {
    movieDiv.querySelector('.title').textContent = pelicula.Title;
    movieDiv.querySelector('.year').textContent = pelicula.Year;
    movieDiv.querySelector('.description').textContent = pelicula.description;
    movieDiv.querySelector('.poster').src = pelicula.Poster;
  } else {
    const newMovieDiv = document.createElement('div');
    newMovieDiv.classList.add('movie');
    newMovieDiv.id = `movie-${pelicula.imdbID}`;

    newMovieDiv.innerHTML = `
      <h2 class="title">${pelicula.Title}</h2>
      <p class="year">${pelicula.Year}</p>
      <p class="description">${pelicula.description}</p>
      <img class="poster" src="${pelicula.Poster}" alt="${pelicula.Title} poster" style="width: 150px; height: 200px;" />
    `;
    moviesContainer.appendChild(newMovieDiv);
  }
}

// Función para visualizar los datos de una película
async function visualizar(imdbID) {
  document.getElementById("ABCLabel").textContent = "Modificar película";
  document.getElementById('codigo').disabled = true;
  try {
    const response = await fetch(`https://movie.azurewebsites.net/api/cartelera?imdbID=${imdbID}`);
    const movie = await response.json();
    document.getElementById('codigo').value = movie.imdbID;
    document.getElementById('titulo').value = movie.Title;
    document.getElementById('anio').value = movie.Year;
    document.getElementById('peliculas').value = movie.Type;
    document.getElementById('imagenUrl').value = movie.Poster;
    document.getElementById('descripcion').value = movie.description;
    document.getElementById('ubicacion').value = movie.Ubication;
    document.getElementById('activo').checked = movie.Estado === 1;
    updateImage();
  } catch (error) {
    console.error('Error al visualizar película:', error);
  }
}
