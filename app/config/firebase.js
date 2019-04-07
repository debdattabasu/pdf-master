import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyBeHsGmFw33ShXSHp504u1D4cqDbI3t1uo',
  authDomain: 'pdfmaster-89a19.firebaseapp.com',
  databaseURL: 'https://pdfmaster-89a19.firebaseio.com',
  projectId: 'pdfmaster-89a19',
  storageBucket: 'pdfmaster-89a19.appspot.com',
  messagingSenderId: '734550661265'
};

const prod = {
  apiKey: 'AIzaSyBb4oI1FQ650GcnitFwsiCjkfwlcVe61is',
  authDomain: 'pressco-prod.firebaseapp.com',
  databaseURL: 'https://pressco-prod.firebaseio.com',
  projectId: 'pressco-prod',
  storageBucket: 'pressco-prod.appspot.com',
  messagingSenderId: '252058127955'
};

firebase.initializeApp(config);

var db = firebase.firestore();

const databaseRef = firebase.database().ref();
export const database = firebase.database();
export const ordersRef = databaseRef.child('orders');
export const employeesRef = databaseRef.child('employees');
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export const fireStore = db;
