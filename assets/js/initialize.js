// Initialize Firebase
const config = {
  apiKey: "AIzaSyBLH2YBIZXuUZTOKvK2Go2EzUO0JBL1SnU",
  authDomain: "rps-multiplayer-daefd.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-daefd.firebaseio.com",
  projectId: "rps-multiplayer-daefd",
  storageBucket: "rps-multiplayer-daefd.appspot.com",
  messagingSenderId: "854965808795"
};
firebase.initializeApp(config);
const database = firebase.database();
const msgRef = database.ref("messages");
const plRef = database.ref("players");

// Initialize vars
let usernameBox = $("#username");
let messageBox = $("#message");
let chatList = $("#messages");

let username = "player";