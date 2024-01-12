import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDekBURKV5dFnwRx2C-oW9K9hMhqxE4UBU",
    authDomain: "coral-3788d.firebaseapp.com",
    projectId: "coral-3788d",
    storageBucket: "coral-3788d.appspot.com",
    messagingSenderId: "837877489900",
    appId: "1:837877489900:web:814e473002115f92b605c9",
    measurementId: "G-48FXZW7S7N"
  };

  firebase.initializeApp(firebaseConfig);
  export const auth = firebase.auth();
