import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyBeHsGmFw33ShXSHp504u1D4cqDbI3t1uo",
  authDomain: "pdfmaster-89a19.firebaseapp.com",
  databaseURL: "https://pdfmaster-89a19.firebaseio.com",
  projectId: "pdfmaster-89a19",
  storageBucket: "pdfmaster-89a19.appspot.com",
  messagingSenderId: "734550661265"
};

firebase.initializeApp(config);

const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("todos");
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();