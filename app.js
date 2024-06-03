document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  searchMovies(query);
});

document.getElementById('homeButton').addEventListener('click', () => {
  document.getElementById('searchInput').value = '';
  document.getElementById('results').innerHTML = '';
  document.getElementById('homeContent').style.display = 'block';
  document.getElementById('results').style.display = 'none';
  document.body.classList.add('no-scroll');
});

// Function search for movies using TMDb API
const searchMovies = async (query) => {
  const TMDB_API_KEY = '014f851d9687760c28eb4e1cac87cfaf';
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      displayResults(data.results);
  } catch (error) {
      console.error('Error fetching movie data:', error);
      displayError('Failed to fetch movie data. Please try again later.');
  }
};

// Function display the search results
const displayResults = (movies) => {
  document.getElementById('homeContent').style.display = 'none';
  document.getElementById('results').style.display = 'flex';
  document.body.classList.remove('no-scroll');
  const results = document.getElementById('results');
  results.innerHTML = '';

  movies.forEach(movie => {
      const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'no_image_available.png';
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
          <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
          <h3>${movie.title}</h3>
          <p>${movie.overview}</p>
          <div class="trailer-container" data-movie-id="${movie.id}">
              <button class="play-button" data-movie-id="${movie.id}">Play Trailer</button>
          </div>
      `;
      results.appendChild(movieElement);
  });

  // Add event listeners to play buttons
  document.querySelectorAll('.play-button').forEach(button => {
      button.addEventListener('click', async (event) => {
          const movieId = event.target.getAttribute('data-movie-id');
          const trailerUrl = await fetchTrailer(movieId);
          embedTrailer(event.target.parentElement, trailerUrl);
      });
  });
};

// Function to fetch trailer from TMDb API using TMDb movie ID
const fetchTrailer = async (movieId) => {
  const TMDB_API_KEY = '014f851d9687760c28eb4e1cac87cfaf';
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  } catch (error) {
      console.error('Error fetching trailer data:', error);
      return null;
  }
};

// Function to embed trailer in the result card
const embedTrailer = (container, trailerUrl) => {
  if (!trailerUrl) {
      alert('Trailer not available.');
      return;
  }

  container.innerHTML = `
      <iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
  `;
};

// Function to display error messages
const displayError = (message) => {
  const results = document.getElementById('results');
  results.innerHTML = `<p class="error">${message}</p>`;
};
