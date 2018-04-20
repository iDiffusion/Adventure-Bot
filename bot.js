"use strict";

var tmi = require("timi.js");
var config = require("./config.json");

var options = {
  options: {
    clientId: config.client_id
    deubg = true
  },
  connections: {
    reconnect: true
  },
  identity: {
    username: config.client_name
    password: config.client_oauth
  },
  channels: []
}
var client = new tmi.client(options);

// Connect the client to the server
client.connect();

// Username has been banned on a channel
client.on("ban", function (channel, username, reason) {
  // Do your stuff.
});

// Username has cheeered to a channel
client.on("cheer", function (channel, userstate, message) {
  // Do your stuff.
});

// Recieve messages on channel
client.on("chat", function (channel, userstate, message, self) {
  // Don't listen to my own messages..
  if (self) return;

  // Do your stuff.
});

// Connected to server
client.on("connected", function (address, port) {
  // Do your stuff.
});

// Got disconnected from server
client.on("disconnected", function (reason) {
  // Do your stuff.
});

// Trying to reconneect to server
client.on("reconnect", function () {
  // Do your stuff.
});

//Username has resubbed on a channel
client.on("resub", function (channel, username, months, message, userstate, methods) {
  // Do your stuff.
});

// Username has subscribed to a channels
client.on("subscription", function (channel, username, method, message, userstate) {
  // Do your stuff.
});

// Username has been timed out on a channels
client.on("timeout", function (channel, username, reason, duration) {
    // Do your stuff.
});

// Recieved a whisper
client.on("whisper", function (from, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
});
