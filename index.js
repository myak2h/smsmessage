const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const axios = require('axios');
var config = require('./config');
var api_key = config.api_key;
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser());

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/receive', (req, res) => {
  const twiml = new MessagingResponse();
  //var query = req.param("query");
  var query = req.body.Body
  console.log(query);
  if (query.match(/cw city \*(.*)\*/i)) {
    var q = query.match(/city \*(.*)\*/i)[1];
    console.log(`http://api.openweathermap.org/data/2.5/find?q=${q}&units=metric&appid=${api_key}`);
    axios.get(`http://api.openweathermap.org/data/2.5/find?q=${q}&units=metric&appid=${api_key}`)
      .then(response => {
        console.log(response.data);
        var data = response.data.list[0];
        var weather = '';
        for (var i in data.weather) {
          weather = weather + data.weather[i].description + ", "
        }

        var date = new Date(data.dt * 1000);
        twiml.message(`
          
          Place: ${data.name}
          Cordinate(lon, lat): ${data.coord.lon}, ${data.coord.lat}

          Date Time: ${date}
          Weather: ${weather}
          Tempreture: ${data.main.temp} C,  min: ${data.main.temp_min} C,  max: ${data.main.temp_max} C
          Pressure: ${data.main.temp} hPa
          Humidity: ${data.main.humidity} %
          Wind: ${data.wind.speed} m/s, ${data.wind.deg} deg
          Clouds: ${data.clouds.all}%
      ` );
        console.log(twiml.toString());
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    twiml.message(`Invalid query, 
                   please use the following format 
                   cw city *{city name}*
                   cw city *{city name},{country code}*
                   as example.
                   cw city *tartu*
                   cw city *tartu,ee*'
    `);
    console.log(twiml.toString());
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
  }

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
