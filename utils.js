// Function to fetch weather data using OpenWeatherMap API
export const fetchWeather = async (location) => {
  const WEATHER_API_KEY = '699f3ba75a32c95352154bfcf349d22d';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`;

  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
  }
};
