const WebSocket = require('ws');
const fetch = require('node-fetch'); 
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    console.log('New client connected');

    // Send a message to the client every 5 seconds
    const interval = setInterval(() => {
        ws.send(JSON.stringify({ message: 'Real-time update', timestamp: new Date() }));
    }, 5000);

    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });

    ws.on('message', message => {
        console.log('Received:', message);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', async (socket) => {
    console.log('Client connected');

    // Function to fetch now-playing movies from TMDb
    const fetchNowPlayingMovies = async () => {
        const TMDB_API_KEY = '014f851d9687760c28eb4e1cac87cfaf'; 
        const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results.slice(0, 5).map(movie => ({
            title: movie.title,
            overview: movie.overview,
            poster_path: movie.poster_path
        })); 
    };

    // Send initial movies
    const nowPlayingMovies = await fetchNowPlayingMovies();
    socket.send(JSON.stringify({ type: 'nowPlayingMovies', data: nowPlayingMovies }));

    // Simulate real-time updates every 30 seconds
    setInterval(async () => {
        const newNowPlayingMovies = await fetchNowPlayingMovies();
        socket.send(JSON.stringify({ type: 'nowPlayingMovies', data: newNowPlayingMovies }));
    }, 30000);

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});
