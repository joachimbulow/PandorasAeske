import * as firebase from "firebase";
import "firebase/database";

// Initialize Firebase
firebaseConfig = {
  apiKey: "AIzaSyBCwxnqRQim2YHcOEWrSd_tr1opY7sWb0c",
  authDomain: "pandorasaeske-app.firebaseapp.com",
  databaseURL: "https://pandorasaeske-app-default-rtdb.firebaseio.com",
  projectId: "pandorasaeske-app",
  storageBucket: "pandorasaeske-app.appspot.com",
  messagingSenderId: "342820109577",
  appId: "1:342820109577:web:d3ab3efd7daacef3cd27d8",
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

class FirebaseService {
  database = firebase.database();

  getDatabaseReference(url) {
    return this.database.ref(url);
  }

  isGameValid(code) {
    return this.database
      .ref()
      .once("value")
      .then((snapshot) => {
        return Object.keys(snapshot.val()).includes(code);
      });
  }

  isNameValidForGame(code, name) {
    return this.database
      .ref("/" + code)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) {
          console.log(Object.values(snapshot.val().participants));
          return !Object.values(snapshot.val().participants).includes(name);
        } else {
          return false;
        }
      });
  }

  generateNewGame(code, name) {
    //Game states: 0: lobby, 1: questions, 2: livegame
    this.database.ref().update({
      [code]: { participants: [name], gameState: 0 },
    });
  }

  quitAndDeleteGame(code) {
    this.database.ref("/" + code).remove();
  }

  joinExistingGame(code, name) {
    this.database
      .ref("/" + code)
      .once("value")
      .then((snapshot) => {
        let users = snapshot.val().participants;
        users.push(name);
        this.database.ref("/" + code).update({ participants: users });
      });
  }

  leaveGame(code, name) {
    this.database
      .ref("/" + code)
      .once("value")
      .then((snapshot) => {
        let users = snapshot.val().participants;
        users.splice(users.indexOf(name), 1);
        this.database.ref("/" + code).update({ participants: users });
      });
  }
}

export default new FirebaseService();
