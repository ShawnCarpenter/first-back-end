require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT ||3000
app.use(cors());
const  geoData  = require('./data/geo') 
const weatherData = require('./data/weather')

app.get('/', (req, res) => {
    try{ 
        res.send(`<h1>This is an API endpoint</h1>
            <p> To see location data use <a href="https://city-explorer-sjc.herokuapp.com/location">https://city-explorer-sjc.herokuapp.com/location</a></p>
            <p> To see weather data use <a href="https://city-explorer-sjc.herokuapp.com/weather">https://city-explorer-sjc.herokuapp.com/weather</a></p>`);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

function getLatLong(cityName){
    //TODO: Replace hardcoded data with API call.
    const city= geoData[0];
    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

app.get('/location', (req, res) => {
    const input = req.query.search;
    try{
        const formattedQuery = getLatLong(input);
        res.json(formattedQuery);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

function getWeather(lat, lon){
    //TODO: replace hardcoded data with API call.
    const data = weatherData.data;
    return data.map(weatherItem => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000),
        }
    });
}

app.get('/weather', (req, res) => {
  try{
     const userLat = req.query.latitude;
     const userLon = req.query.longitude;
     const mungedData = getWeather(userLat, userLon)
     res.json(mungedData)

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  
})
