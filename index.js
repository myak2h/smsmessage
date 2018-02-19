const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser());

app.post('/receive', (req, res) => {
  const twiml = new MessagingResponse();
  console.log(req);
  var query = req.body.Body;
  if (query.match(/cw city \*(.*)\*/i)) {
    //twiml.message('Hi!');
  } else if(query.match(/cw zip \*(.*)\*/i)) {
    //twiml.message('Goodbye');
  } else if(query.match(/fw city \*(.*)\*/i)) {
    //twiml.message('Goodbye');
  } else if(query.match(/fw zip \*(.*)\*/i)) {
    //twiml.message('Goodbye');
  }else {
    twiml.message(`Invalid query, please use the following formats as example. \n
                   for current weather:
                   'cw city *london*'
                   'cw zip *94040,us*'
                   for weather forcast :
                   'fw city *london*'
                   'fw zip *94040,us*'
    `);
  }

  console.log(twiml.toString());
  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
// var str = "City *london*"; 
// var res = str.match(/city \*(.*)\*/i)[1];