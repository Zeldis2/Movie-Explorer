const socket = new WebSocket('ws://localhost:8000');

socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);

    console.log('Received message:', message); // Log received message

    if (message.type === 'nowPlayingMovies') {
        updateNowPlayingMovies(message.data);
    } else if (message.message) {
        displayRealTimeUpdate(message);
    }
});

const displayRealTimeUpdate = (data) => {
    const updatesContainer = document.getElementById('realTimeUpdates');
    const updateElement = document.createElement('div');
    updateElement.classList.add('update');
    updateElement.innerHTML = `<p>${data.message}</p><p>${data.timestamp}</p>`;
    updatesContainer.appendChild(updateElement);
};

const updateNowPlayingMovies = (movies) => {
    const nowPlayingMoviesElement = document.getElementById('nowPlayingMovies');
    nowPlayingMoviesElement.innerHTML = movies.map(movie => {
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'no_image_available.png';
        const trailerUrl = movie.trailer_key ? `https://www.youtube.com/embed/${movie.trailer_key}` : null;
        console.log(`Movie: ${movie.title}, Trailer URL: ${trailerUrl}`); // Log trailer URL
        return `
            <div class="movie">
                <img src="${posterUrl}" alt="${movie.title} poster" class="movie-poster">
                <h3>${movie.title}</h3>
                <p>${movie.overview}</p>
                ${trailerUrl ? `<iframe width="560" height="315" src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>` : ''}
            </div>
        `;
    }).join('');
};
