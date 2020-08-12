const express = require('express');
const cors = require('cors');
const request = require('superagent');
const app = express();
app.use(cors());
app.use(express.static('public'));
const { getTrails, getLatLong, getWeather } = require('./utils');

app.get('/', (req, res) => {
    try{ 
        res.send(`<h1>This is not the site you are looking for.</h1> `    
        );
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/location', async (req, res) => {
    try{
        const userInput = req.query.search;
        const formattedQuery = await getLatLong(userInput);
        res.json(formattedQuery);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});



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

app.get('/trails', async (req, res) => {
    try{
       const userLat = req.query.latitude;
       const userLon = req.query.longitude;
       const mungedData = await getTrails(userLat, userLon)
       res.json(mungedData)
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
  
});

module.exports = {
    app
};