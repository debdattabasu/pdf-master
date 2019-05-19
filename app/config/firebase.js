import * as firebase from 'firebase';
import firebaseCred from '../../firebase';

const firebaseConfig = process.env.NODE_ENV === 'production' ? firebaseCred.prod : firebaseCred.config;

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

const databaseRef = firebase.database().ref();
export const database = firebase.database();
export const ordersRef = databaseRef.child('orders');
export const employeesRef = databaseRef.child('employees');
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export const fireStore = db;
