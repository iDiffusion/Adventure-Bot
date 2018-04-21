"use strict";

// Import files
var tmi = require("tmi.js");
var config = require("./config.json");

// Configure the client
var options = {
  options: {
    debug: true
  },
  connections: {
    reconnect: true
  },
  identity: {
    username: config.client_name,
    password: config.client_oauth
  },
  channels: config.channels
}
var client = new tmi.client(options);

//Save varibbles
var adventureEnabled = false;

// Connect the client to the server
client.connect();

// Recieve messages on channel
client.on("chat", function (channel, userstate, message, self) {
  if (self) return;   // Don't listen to my own messages...
  let args = message.split(" ");
  switch(args[0].toLowerCase()){
    case "!adventure":
      client.say(channel, "TheCheshireKat appears to you and asks if you'd like to go on an adventure, type `!explore` to see where she'll lead you");
      adventureEnabled = true;
    break;
    case "!explore":
      if(!adventureEnabled) break;
      client.whisper(userstate.username, "Lets explore");
    break;
  }
});

// Connected to server
client.on("connected", function (address, port) {
 console.log("Connecting to " + address + " on port " + port);
});

// Got disconnected from server
client.on("disconnected", function (reason) {
  console.log("Diconnected from server because " + reason);
});

// Trying to reconneect to server
client.on("reconnect", function () {
  console.log("Attemping to reconnect to server");
});

// Recieved a whisper
client.on("whisper", function (from, userstate, message, self) {
  if (self) return;   // Don't listen to my own messages...
  // Handle interation.
});
