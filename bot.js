"use strict";

/* Import files */
var tmi = require("tmi.js");
var schedule = require('node-schedule');
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
var currentPath = undefined;
var previousPaths = [];
var players = [];
//!goal | !teatime | !butt | !behead | !F | !rules | !discord | !lurk | !back | !violet | !jamie | !redkat

/* Connect the client to the server */
client.connect();

/* Recieve messages on channel */
client.on("chat", function (channel, user, message, self) {
  if (self) return;
  switch(message.trim().split(" ")[0].toLowerCase()){
    case "!adventure":
      if(user.username != config.user_admin && user.username != config.programmer) break;
      client.say(channel, getPath(prompt.story, "adventure").value);
      adventureEnabled = true;
      noNewComers = false;
      currentPath = "explore";
      previousPaths = ["adventure"];
      players = [];
    break;


    case "!explore":
      if(!adventureEnabled || noNewComers) break;
      if(user.username == config.user_admin) {
        noNewComers = true;
        travelPath(channel);
      }
      else if(user.username == config.programmer && message.trim().split(" ")[1] == "f"){
        noNewComers = true;
        travelPath(channel);
      }
      else {
        //TODO check if a user has enough key fragments
        client.say(channel, getPath(prompt.story, "explore").value.replace("$user", user["display-name"]));
        players.push(new Player(user));
      }
    break;


    case "!forward":
      if(user.username != config.user_admin && user.username != config.programmer) break;
      if(currentPath == "end") break;
      travelPath(channel);
    break;


    case "!status":
      if(user.username != config.user_admin && user.username != config.programmer) break;
      console.log("Adventure mode is " + (adventureEnabled ? "enabled": "disabled") + ".");
      console.log((noNewComers ? "Not": "Now") + " accepting new players.");
      console.log("Current path: " + currentPath);
      console.log("Previous paths: " + previousPaths.toString());
      console.log("Users playing: ");
      console.log(players.forEach(mem => console.log(JSON.stringify(mem))));
    break;


    default:
      if(currentPath == undefined || currentPath == null) break;
      if(getPlayer(user) == undefined || getPlayer(user) == null) break;
      if(currentPath == "explore" && message.startsWith("!")){
        let totems = getPath(prompt.story, "explore").totems;
        let totem = message.trim().slice(1).split(" ")[0];
        if(totems.includes(totem)){
          getPlayer(user).totem = totem;
          client.whisper(user.username, getPath(prompt.story, totem).value);
        }
      }
      else if(message.startsWith("!") && getPath(prompt.story, currentPath).userPick == true){
        let choices = getPath(prompt.story, currentPath).connected;
        let choice = message.trim().slice(1).split(" ")[0];
        if(choices.includes(choice)){
          getPlayer(user).choice = choice;
          client.whisper(user.username, "You have chosen to vote for " + choice);
        }
      }
    break;
  }
});

/* Player object */
function Player(user){
  this.type = user["user-type"];
  this.id = user["user-id"];
  this.username = user["username"];
  this.mod = user["mod"];
  this.subscriber = user["subscriber"];
  this.totem = undefined;
  this.choice = undefined;
}

/* get path info */
function getPath(array, val){
  for (var i = 0; i < array.length; i++) {
    if(array[i].path == val) return array[i];
  }
}

/* get player object */
function getPlayer(user){
  for (var i = 0; i < players.length; i++) {
    if(players[i].username = user.username) return players[i];
  }
}

/* check if players have the totem */
function hasTotem(totem){
  for (var i = 0; i < players.length; i++) {
    if(players[i].totem == totem) return true;
  }
  return false;
}

/* give or take keys */
function modifyKeys(channel){
  var runnable = getPath(prompt.story, currentPath).runnable
  if(runnable == null) return;
  for(var i = 0; i< players.length; i++) {
    let rand = Math.floor(Math.random() * 50) + 1;
    if(runnable == "giveKeys"){
      //TODO give keys to players (use timeout)
      client.say(channel, rand + " key fragments have been given to " + players[i].username);
      console.log(rand + " key fragments have been given to " + players[i].username);
    }
    else if(runnable == "takeKeys"){
      //TODO take keys from players (use timeout)
      client.say(channel, rand + " key fragments have been taken to " + players[i].username);
      console.log(rand + " key fragments have been taken from " + players[i].username);
    }
  }
}

/* Travel along the path */
function travelPath(channel){
  if(currentPath == "end" || getPath(prompt.story, currentPath).connected.length == 0) return;
  var paths = getPath(prompt.story, currentPath).connected;
  console.log("List of paths: " + paths);
  console.log("Current Path: " + currentPath);
  console.log("Previous Paths: " + previousPaths);
  var wantedPath = null;
  if(getPath(prompt.story, currentPath).userPick){
    let choices = Array(paths.length).fill(0);
    console.log(choices);
    for (var m = 0; m < players.length; m++) {
      let i = paths.indexOf(players[m].choice);
      if(i != -1) choices[i] += 1;
    }
    console.log(choices);
    previousPaths.push(currentPath);
    var index = 0;
    for(var i = 0; i< choices.length; i++){
      if(i == 0) index = 0;
      else if(choices[index] < choices[i]) index = i;
    }
    wantedPath = paths[index];
    if(previousPaths.includes(wantedPath)) return travelPath(channel);
    currentPath = wantedPath;
  }
  else {
    let rand = Math.floor(Math.random() * paths.length);
    wantedPath = paths[rand];
    let wantedTotem = getPath(prompt.story, currentPath).required;
    if(wantedTotem == null || hasTotem(wantedPath)){
      if(previousPaths.includes(wantedPath)) return travelPath(channel);
      previousPaths.push(currentPath);
      currentPath = wantedPath;
    }
    else {
      currentPath = previousPaths[previousPaths.length - 1];
      return travelPath(channel);
    }
  }
  if(currentPath == "end") return adventureEnabled = false;
  if(getPath(prompt.story, currentPath).value != null) client.say(channel, getPath(prompt.story, currentPath).value);
  modifyKeys(channel);
  if(getPath(prompt.story, currentPath).userPick == false){
    return travelPath(channel);
  }
  else{
    //TODO call travelPath after timeout
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
