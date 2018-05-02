"use strict";

/* Import files */
var tmi = require("tmi.js");
var schedule = require('node-schedule');
var cmd = require("./command.js");
var config = require("./config.json");
var prompt = require("./prompt.json");

/* Configure the client */
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

/* Save variables */
var adventureEnabled = false;
var noNewComers = true;
var totem = []; //TODO change to hashmap
var currentPath = undefined;
var previousPaths = [];
var choice = [];
//!goal | !teatime | !butt | !behead | !F | !rules | !discord | !lurk | !back | !violet | !jamie | !redkat

/* Connect the client to the server */
client.connect();

/* Recieve messages on channel */
client.on("chat", function (channel, user, message, self) {
  if (self) return;   // Don't listen to my own messages...
  if(!message.startsWith("!")) return;// Don't listen to non-commands
  switch(message.trim().split(" ")[0].toLowerCase()){
    case "!adventure":
    if(user.username != config.user_admin && user.username != config.programmer) break;
    client.say(channel, getPath(prompt.story, "adventure").value);
    adventureEnabled = true;
    noNewComers = false;
    totem = [];
    currentPath = "explore";
    previousPaths = [];
    choice = [];
    previousPaths.push("adventure");
    break;


    case "!explore":
    if(!adventureEnabled || noNewComers) break;
    if((user.username == config.user_admin || user.username == config.programmer) && message.trim().split(" ").length > 1) {
      noNewComers = true;
      previousPaths.push("explore");

    }
    else {
      //TODO check if a user has enough key fragments
      client.say(channel, getPath(prompt.story, "explore").value.replace("$user", user["display-name"]));
      totem[user["user-id"]] = undefined ? "null" : totem[user["user-id"]];
    }
    break;


    case "!status":
    console.log("Adventure mode is " + (adventureEnabled ? "enabled": "disabled") + ".");
    console.log((noNewComers ? "Not": "Now") + " accepting new players.");
    console.log("Totem array: " + totem.filter(function( element ) { return element !== undefined}));
    console.log("Current path: " + currentPath);
    console.log("Previous paths: " + previousPaths.toString());
    console.log("Current choices: " + choice.filter(function( element ) { return element !== undefined}));
    break;


    default:
      if(currentPath == "explore"){
        let choices = prompt.story.explore.connected;
      }
    break;
  }
});

function Member(user, message){
  this.type = user["user-type"];
  this.id = user["user-id"];
  this.username = user["username"];
  this.mod = user["mod"];
  this.subscriber = user["subscriber"];
  this.totem = undefined;
  this.choice = undefined;
}

function getPath(array, val){
  for (var i = 0; i < array.length; i++) {
    if(array[i].path == val) return array[i];
  }
}

/* Connected to server */
client.on("connected", function (address, port) {
  console.log("Connecting to " + address + " on port " + port + "!");
});

/* Got disconnected from server */
client.on("disconnected", function (reason) {
  console.log("Diconnected from server because " + reason + ".");
});

/* Trying to reconneect to server */
client.on("reconnect", function () {
  console.log("Attemping to reconnect to server.");
});

/* Recieved a whisper */
client.on("whisper", function (from, userstate, message, self) {
  if (self) return;   // Don't listen to my own messages...
  client.whisper(userstate.username, "Please join my host's channel http://wwww.twitch.tv/thecheshirekat !");
});
