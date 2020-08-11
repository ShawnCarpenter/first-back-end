const express = require('express');
const cors = require('cors');
const request = require('superagent');
const app = express();

app.use(cors());

app.use(express.static('public'));

const {
    GEOCODE_API_KEY,
    WEATHER_API_KEY,
    TRAIL_API_KEY
} = process.env;


app.get('/', (req, res) => {
    try{ 
        res.send(`<h1>This is an API endpoint</h1>
            <p> To see location data use <a href="https://city-explorer-sjc.herokuapp.com/location?search=portland">https://city-explorer-sjc.herokuapp.com/location?search=portland</a></p>
            <p> To see weather data use <a href="https://city-explorer-sjc.herokuapp.com/weather">https://city-explorer-sjc.herokuapp.com/weather</a></p>`);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

async function getLatLong(cityName){

    const response= await request.get(`https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`);

    const city = response.body[0]

    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

app.get('/location', async (req, res) => {
    try{
        const userInput = req.query.search;
        const formattedQuery = await getLatLong(userInput);
        res.json(formattedQuery);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

async function getWeather(lat, lon){
    
    const response = await request.get(`https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`)

    const data = response.body.data;
    return data.map(weatherItem => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000),
        }
    });
}

app.get('/weather', async (req, res) => {
  try{
     const userLat = req.query.latitude;
     const userLon = req.query.longitude;
     const mungedData = await getWeather(userLat, userLon)
     res.json(mungedData)

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
  
});

module.exports = {
    app
};