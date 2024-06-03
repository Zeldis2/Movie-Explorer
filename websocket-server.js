(async () => {
    const { WebSocketServer } = await import('ws');
    const fetch = (await import('node-fetch')).default;

    const wss = new WebSocketServer({ port: 8000 });

    wss.on('connection', async ws => {
        console.log('New client connected');

        // Function to fetch now-playing movies and their trailers from TMDb
        const fetchNowPlayingMoviesWithTrailers = async () => {
            const TMDB_API_KEY = '014f851d9687760c28eb4e1cac87cfaf'; // Replace with your TMDb API key
            const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
            const response = await fetch(nowPlayingUrl);
            const data = await response.json();
            const movies = data.results.slice(0, 5);

            const moviesWithTrailers = await Promise.all(movies.map(async movie => {
                const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`;
                const trailerResponse = await fetch(trailerUrl);
                const trailerData = await trailerResponse.json();
                const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                const trailer_key = trailer ? trailer.key : null;
                console.log(`Movie: ${movie.title}, Trailer Key: ${trailer_key}`); // Log trailer key
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    poster_path: movie.poster_path,
                    trailer_key: trailer_key
                };
            }));

            console.log('Fetched Movies with Trailers:', moviesWithTrailers);
            return moviesWithTrailers;
        };

        // Send initial movies with trailers
        const nowPlayingMoviesWithTrailers = await fetchNowPlayingMoviesWithTrailers();
        ws.send(JSON.stringify({ type: 'nowPlayingMovies', data: nowPlayingMoviesWithTrailers }));

        // Send a real-time update message every 5 seconds
        const interval = setInterval(() => {
            ws.send(JSON.stringify({ message: 'Real-time update', timestamp: new Date() }));
        }, 5000);

        // Simulate real-time updates every 30 seconds
        const movieInterval = setInterval(async () => {
            const newNowPlayingMoviesWithTrailers = await fetchNowPlayingMoviesWithTrailers();
            ws.send(JSON.stringify({ type: 'nowPlayingMovies', data: newNowPlayingMoviesWithTrailers }));
        }, 30000);

        ws.on('close', () => {
            clearInterval(interval);
            clearInterval(movieInterval);
            console.log('Client disconnected');
        });

        ws.on('message', message => {
            console.log('Received:', message);
        });
    });

    console.log('WebSocket server is running on ws://localhost:8000');
})();
