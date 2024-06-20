
const apiKey = 'a6b908e1';

function fetchMovies(searchTerm) {
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
        .then(response => response.json())
        .then(data => displaySearchResults(data.Search))
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(movies) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('card', 'mb-3', 'movie');
        movieDiv.setAttribute('data-id', movie.imdbID);
        movieDiv.innerHTML = `
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${movie.Title} (${movie.Year})</h5>
              <p class="card-text">${movie.Plot}</p>
              <button class="btn btn-primary addToFavorites">Add to Favorites</button>
              <button class="btn btn-info viewDetails">View Details</button>
            </div>
          </div>
        </div>
      `;
        searchResults.appendChild(movieDiv);
    });
}

function addToFavorites(movieId) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    if (!favoriteMovies.includes(movieId)) {
        favoriteMovies.push(movieId);
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
        displayFavoriteMovies();
    }
}

function displayFavoriteMovies() {
    const favoriteMovies = document.getElementById('favoriteMovies');
    favoriteMovies.innerHTML = '';
    let favoriteMoviesIds = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMoviesIds.forEach(movieId => {
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
            .then(response => response.json())
            .then(data => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('card', 'mb-3', 'movie');
                movieDiv.setAttribute('data-id', data.imdbID);
                movieDiv.innerHTML = `
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${data.Poster}" class="img-fluid" alt="${data.Title}">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${data.Title} (${data.Year})</h5>
                  <p class="card-text">${data.Plot}</p>
                  <button class="btn btn-danger removeFromFavorites">Remove from Favorites</button>
                  <button class="btn btn-info viewDetails">View Details</button>
                </div>
              </div>
            </div>
          `;
                favoriteMovies.appendChild(movieDiv);
            })
            .catch(error => console.error('Error:', error));
    });
}

function removeFromFavorites(movieId) {
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    favoriteMovies = favoriteMovies.filter(id => id !== movieId);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    displayFavoriteMovies();
}

document.getElementById('searchInput').addEventListener('input', (event) => {
    fetchMovies(event.target.value);
});

document.getElementById('searchResults').addEventListener('click', (event) => {
    if (event.target.classList.contains('addToFavorites')) {
        const movieId = event.target.closest('.movie').getAttribute('data-id');
        addToFavorites(movieId);
    }
});

document.getElementById('favoriteMovies').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeFromFavorites')) {
        const movieId = event.target.closest('.movie').getAttribute('data-id');
        removeFromFavorites(movieId);
    }
});

function displayMovieDetails(movieId) {
    const movieDiv = document.querySelector(`.movie[data-id="${movieId}"]`);
    const cardBody = movieDiv.querySelector('.card-body');
    const existingDetails = cardBody.querySelector('.movie-details');

    if (existingDetails) {
        // Details already displayed, remove them
        existingDetails.remove();
    } else {
        // Details not displayed, fetch and display them
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
            .then(response => response.json())
            .then(data => {
                const detailsDiv = document.createElement('div');
                detailsDiv.classList.add('movie-details');
                detailsDiv.innerHTML = `
            <h5 class="card-title">${data.Title} (${data.Year})</h5>
            <p class="card-text">${data.Plot}</p>
            <p class="card-text"><strong>Director:</strong> ${data.Director}</p>
            <p class="card-text"><strong>Actors:</strong> ${data.Actors}</p>
            <p class="card-text"><strong>Genre:</strong> ${data.Genre}</p>
            <p class="card-text"><strong>Runtime:</strong> ${data.Runtime}</p>
          `;
                cardBody.appendChild(detailsDiv);
            })
            .catch(error => console.error('Error:', error));
    }
}


document.body.addEventListener('click', event => {
    if (event.target.classList.contains('viewDetails')) {
        const movieId = event.target.closest('.movie').getAttribute('data-id');
        displayMovieDetails(movieId);
    }
});
displayFavoriteMovies();
