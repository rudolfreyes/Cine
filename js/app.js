$(document).ready(function () {
    // URL base de la API
    const apiUrl = 'https://movie.azurewebsites.net/api/cartelera';

    // Obtener cartelera (GET)
    function fetchMovies() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (data) {
                $('#movies-list').empty();
                data.forEach(function (movie) {
                    let template = $('#movie-template').html();
                    template = template.replace('{{Poster}}', movie.Poster)
                                       .replace('{{Title}}', movie.Title)
                                       .replace('{{Year}}', movie.Year)
                                       .replace('{{Type}}', movie.Type)
                                       .replace('{{description}}', movie.description)
                                       .replace('{{imdbID}}', movie.imdbID);
                    $('#movies-list').append(template);
                });
            },
            error: function (error) {
                console.log('Error fetching movies', error);
            }
        });
    }

    // Agregar nueva película (POST)
    function addMovie(movie) {
        $.ajax({
            url: apiUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(movie),
            success: function () {
                fetchMovies();  // Actualizar lista de películas
            },
            error: function (error) {
                console.log('Error adding movie', error);
            }
        });
    }

    // Editar película (PUT)
    function editMovie(imdbID) {
        let updatedMovie = {
            imdbID: imdbID,
            Title: 'Nuevo Título',
            Year: '2023',
            Type: 'DRAMA',
            Poster: 'https://example.com/poster.jpg',
            description: 'Descripción actualizada',
            Ubication: 'New York',
            Estado: 1
        };

        $.ajax({
            url: `${apiUrl}?imdbID=${imdbID}`,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedMovie),
            success: function () {
                fetchMovies();  // Actualizar lista de películas
            },
            error: function (error) {
                console.log('Error editing movie', error);
            }
        });
    }

    // Eliminar película (DELETE)
    function deleteMovie(imdbID) {
        $.ajax({
            url: `${apiUrl}?imdbID=${imdbID}`,
            method: 'DELETE',
            success: function () {
                fetchMovies();  // Actualizar lista de películas
            },
            error: function (error) {
                console.log('Error deleting movie', error);
            }
        });
    }

    // Llamada inicial para obtener las películas
    fetchMovies();
});