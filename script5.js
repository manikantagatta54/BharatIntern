const apiKey = '4e069e01f0e47f64a903a516f2af5c97';

function fetchAndDisplayMovies(url, elementId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const movieSectionElement = document.getElementById(elementId);

            movies.forEach(movie => {
                const movieElement = document.createElement('div');
                movieElement.classList.add('movie');

                const moviePoster = document.createElement('img');
                moviePoster.src = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
                moviePoster.alt = movie.title;

                movieElement.appendChild(moviePoster);
                movieSectionElement.appendChild(movieElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
fetchAndDisplayMovies(trendingUrl, 'trending-movies');

const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
fetchAndDisplayMovies(topRatedUrl, 'top-rated-movies');

const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
fetchAndDisplayMovies(upcomingUrl, 'upcoming-movies');

const heroMovieUrl = `https://api.themoviedb.org/3/movie/550?api_key=${apiKey}`;
fetch(heroMovieUrl)
    .then(response => response.json())
    .then(heroMovie => {
        document.getElementById('hero-image').src = 'https://image.tmdb.org/t/p/original' + heroMovie.backdrop_path;
        document.getElementById('hero-title').textContent = heroMovie.title;

        document.getElementById('hero-button').onclick = () => {
            alert(`Playing ${heroMovie.title}`);
        };
    })
    .catch(error => console.error('Error fetching hero movie:', error));

const loginButton = document.getElementById('login-button');
const loginModal = document.getElementById('login-modal');
const closeButton = document.getElementById('close-button');

loginButton.onclick = function() {
    loginModal.style.display = 'block';
}

closeButton.onclick = function() {
    loginModal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == loginModal) {
        loginModal.style.display = 'none';
    }
}

document.getElementById('login-form').onsubmit = function(event) {
    event.preventDefault();
    document.getElementById('loading-message').style.display = 'block';
    setTimeout(() => {
        document.getElementById('loading-message').style.display = 'none';
        loginModal.style.display = 'none';
    }, 2000);
}