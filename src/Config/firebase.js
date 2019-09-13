import firebase from 'firebase'

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDT80OgJHjY4rv7tR8xb6jKTuB38FBQUSg",
        authDomain: "yu-chat.firebaseapp.com",
        databaseURL: "https://yu-chat.firebaseio.com",
        projectId: "yu-chat",
        storageBucket: "yu-chat.appspot.com",
        messagingSenderId: "641806802242",
        appId: "1:641806802242:web:985b739dd471f6826ffcdb"
      });
    }
  }
}

export default new FirebaseSvc();