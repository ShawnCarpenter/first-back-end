const request = require('superagent');
const {
    GEOCODE_API_KEY,
    WEATHER_API_KEY,
    TRAIL_API_KEY
} = process.env;

async function getTrails(lat, lon) {
    const queryString = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${TRAIL_API_KEY}`;

    const response = await request.get(queryString);

    trails = response.body.trails;
    return trails.map(trail => {
        return {
            name: trail.name,
            location: trail.location,
            length: trail.length,
            stars: trail.stars,
            star_votes: trail.starVotes,
            summary: trail.summary,
            trail_url: trail.url,
            conditions: `${trail.conditionStatus}: ${trail.conditionDetails}`,
            condition_date: trail.conditionDate.split(' ')[0],
            condition_time: trail.conditionDate.split(' ')[1]
        };
    });
}

async function getLatLong(cityName){

    const queryString = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityName}&format=json`;

    const response= await request.get(queryString);

    const city = response.body[0]

    return {
        formatted_query: city.display_name,
        latitude: city.lat,
        longitude: city.lon,
    };
}

async function getWeather(lat, lon){

    const queryString = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

    const response = await request.get(queryString)

    const data = response.body.data;
    return data.map(weatherItem => {
        return {
            forecast: weatherItem.weather.description,
            time: new Date(weatherItem.ts * 1000),
        }
    });
}
module.exports = {
    getTrails,
    getLatLong,
    getWeather

}
// exports.getTrails = getTrails;