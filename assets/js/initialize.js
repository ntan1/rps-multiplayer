// Initialize Firebase
const config = {
    apiKey: "AIzaSyBLH2YBIZXuUZTOKvK2Go2EzUO0JBL1SnU",
    authDomain: "rps-multiplayer-daefd-65724.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-daefd-65724.firebaseio.com",
    projectId: "rps-multiplayer-daefd",
    storageBucket: "",
    messagingSenderId: "854965808795"
  };
firebase.initializeApp(config);
const database = firebase.database();

// Initialize vars
let yourChoice = "rock";
let opponentChoice = "scissors";