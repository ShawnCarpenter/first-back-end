const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors());
const  geoData  = require('./data/geo') 
const weatherData = require('./data/weather')

function getLatLong(cityName){
    const city= geoData[0];
    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

function getWeather(lat, lon){
    const data = weatherData.data;
    return data.map(weatherItem => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000),
        }
    })
}

app.get('/location', (req, res) => {
  const input = req.query.search;
  
try{
    const formattedQuery = getLatLong(input);
     res.json(formattedQuery);
} catch(e) {
    res.status(500).json({ error: e.message });
}

})

app.get('/weather', (req, res) => {
    const input = req.query.search;
    
  try{
     const userLat = req.query.latitude;
     const userLon = req.query.longitude;
     const mungedData = getWeather(userLat, userLon)
     res.json(mungedData)

  } catch(e) {
    res.status(500).json({ error: e.message });
  }
  
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  
})

function getPassword(password) {
    let pass= '';
    for(let i= 0; i<password.length; i++){
        pass += "*";
    }
    return pass;
}