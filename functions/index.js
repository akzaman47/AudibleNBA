// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://audiblenba-93f47.firebaseio.com/"
});




process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent! Trey, you connected to a welcome cloud function `);
	
//	var db = admin.database();
//var ref = db.ref("usersbro");
//var usersRef = ref.child("users");
//usersRef.set({
//  alanisawesome: {
//    date_of_birth: "June 23, 1912",
//    full_name: "Alan Turing"
 // },
 // gracehop: {
  //  date_of_birth: "December 9, 1906",
   // full_name: "Grace Hopper"
  //}
//});




// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("usersbro");
var usersRef = ref.child("users");

// Attach an asynchronous callback to read the data at our posts reference
usersRef.on("value", function(snapshot) {
snapshot.forEach(function(childSnap){
  console.log(childSnap.val().full_name+childSnap.key);
	agent.add(childSnap.val().full_name);
});
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
}

  function points(agent) {

    agent.add("Test Code: In Points Cloud Function");

    var dict = {}; // create an empty array
    var player = ""; // best player for sort
    var points= 0; // starting points for sort
  
   // Database Connection Code
    var db = admin.database();
    var reference = db.ref("league").child("top ten").child("points");
    reference.on("value", (snapshot) => {


      snapshot.forEach((playerInt) => {

      dict[playerInt.key] = playerInt.val() //adds key value pair to dictionary

      });
    for(var key in dict) { // loops through dictionary values and chooses best
     
    if (dict[key] > points) {
            player = key;
            points = dict[key];
      }
          }

    //prints to console found out on firebase console-functions-logs/agent to google
   console.log(player);
   agent.add("The Best Scorer is "+player+" with "+points+" points");
   
 }, (errorObject) => {
      console.log("The read failed: heres why " + errorObject.code);
    });

  function freethrows(agent) {

    agent.add("Test Code: In Points Cloud Function");

    var dict = {}; // create an empty array
    var player = ""; // best player for sort
    var points= 0; // starting points for sort
  
   // Database Connection Code
    var db = admin.database();
    var reference = db.ref("league").child("top ten").child("freethrows");
    reference.on("value", (snapshot) => {


      snapshot.forEach((playerInt) => {

      dict[playerInt.key] = playerInt.val() //adds key value pair to dictionary

      });
    for(var key in dict) { // loops through dictionary values and chooses best
     
    if (dict[key] > points) {
            player = key;
            points = dict[key];
      }
          }

  //prints to console found out on firebase console-functions-logs/agent to google
   console.log(player);
   agent.add("The Best Free Throw Shooter is "+player+" with "+points+" points");
   
 }, (errorObject) => {
      console.log("The read failed: heres why " + errorObject.code);
    });

  function assists(agent) {

    agent.add("Test Code: In Points Cloud Function");

    var dict = {}; // create an empty array
    var player = ""; // best player for sort
    var points= 0; // starting points for sort
  
   // Database Connection Code
    var db = admin.database();
    var reference = db.ref("league").child("top ten").child("assists");
    reference.on("value", (snapshot) => {


      snapshot.forEach((playerInt) => {

      dict[playerInt.key] = playerInt.val() //adds key value pair to dictionary

      });
    for(var key in dict) { // loops through dictionary values and chooses best
     
    if (dict[key] > points) {
            player = key;
            points = dict[key];
      }
          }

  //prints to console found out on firebase console-functions-logs/agent to google
   console.log(player);
   agent.add("The Player With the Most Assists is "+player+" with "+assists+" assists");
   
 }, (errorObject) => {
      console.log("The read failed: heres why " + errorObject.code);
    });

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('firstintentt', fallback);
  intentMap.set('points', points);
  intentMap.set('freethrows', freethrows);
  intentMap.set('assists', assists);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
