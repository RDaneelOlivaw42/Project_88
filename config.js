import firebase from 'firebase'
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyDPdskGos9pdLs4VlehOOhZVK9FVTwxYMI",
  authDomain: "project-86-bb54b.firebaseapp.com",
  projectId: "project-86-bb54b",
  storageBucket: "project-86-bb54b.appspot.com",
  messagingSenderId: "435220095815",
  appId: "1:435220095815:web:725c217948a4e5e66ce262"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();