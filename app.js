const feathers = require('feathers');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');
const handler = require('feathers-errors/handler');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongooseService = require('feathers-mongoose');

// Require your models
const Message = require('./models/message');

// Tell mongoose to use native promises
// See http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

// MongoDB Host
const mongoHost = process.env.MONGO_HOST
const mongoName = process.env.MONGO_NAME

// Connect to your MongoDB instance(s)
mongoose.connect(`mongodb://${mongoHost}:${mongoName}/microservice`);

// Create a feathers instance.
const app = feathers()
  // Enable Socket.io
  .configure(socketio())
  // Enable REST services
  .configure(rest())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({extended: true}));

// API Base URL
const baseUrl = 'api/v0';

// TODO: Add base path output with project name, version, and list of models

// Connect to the db, create and register a Feathers service.
app.use(`${baseUrl}/messages`, mongooseService({
  name: 'message',
  Model: Message,
  paginate: {
    default: 10,
    max: 0
  }
}));

// A basic error handler, just like Express
app.use(handler());

// Start the server if we're not being required in a test
if (!module.parent) {
  app.listen(3030);
  console.log('Feathers Mongoose API Microservice running on 127.0.0.1:3030');
}

module.exports = app;