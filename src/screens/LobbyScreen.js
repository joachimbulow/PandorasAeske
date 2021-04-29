import firebase from "firebase";
import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Alert,
} from "react-native";
import PinkButton from "../components/PinkButton.js";

import FirebaseService from "../services/FirebaseService.js";

export default function LobbyScreen(props) {
  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);

  const codeRef = useRef("");
  const hostRef = useRef(false);

  useEffect(() => {
    //Configurations
    props.navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            Alert.alert(
              "Afslut spil",
              "Er du sikker på at du vil afslutte spillet?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Quit", onPress: () => quitGame() },
              ],
              { cancelable: false }
            );
          }}
          title="Quit"
          color="black"
        ></Button>
      ),
    });

    //Not host
    if (props.route.params.code) {
      setCode(props.route.params.code);
      codeRef.current = props.route.params.code;
      FirebaseService.joinExistingGame(
        props.route.params.code,
        props.route.params.name
      );
      setupGameStateListener();
      setupHostQuittingGameListener();
    }

    //Host
    else {
      //Generate new game
      let gameCode = (Math.random() + 1)
        .toString(36)
        .substring(2, 7)
        .toUpperCase();
      setCode(gameCode);
      codeRef.current = gameCode;
      hostRef.current = true;
      FirebaseService.generateNewGame(gameCode, props.route.params.name, 0);
    }

    //TODO: Unsubscribe
    setupRegisteredUsersListener();

    return function cleanUp() {
      removeRegisteredUsersListener();

      if (!hostRef.current) {
        removeGameStateListener();
        removeHostQuittingGameListener();
      }
    };
  }, []);

  //Sync code with ref to access in cleanup
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  function quitGame() {
    if (hostRef) {
      FirebaseService.quitAndDeleteGame(codeRef.current);
    } else {
      FirebaseService.leaveGame(codeRef.current, props.route.params.name);
    }
    props.navigation.navigate("Home");
  }

  ////////////////// Listeners

  function setupHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/").on("value", (snapshot) => {
      if (!snapshot.val()) {
        props.navigation.navigate("Home");
        alert("Game was ended by the host.");
      }
    });
  }

  function removeHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/").off("value", (snapshot) => {
      if (!snapshot.val()) {
        props.navigation.navigate("Home");
        alert("Game was ended by the host.");
      }
    });
  }

  function setupRegisteredUsersListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/participants"
    ).on("value", (snapshot) => {
      if (snapshot.val()) {
        setUsers(Object.values(snapshot.val()));
      }
    });
  }

  function removeRegisteredUsersListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/participants"
    ).off("value", (snapshot) => {
      if (snapshot.val()) {
        setUsers(Object.values(snapshot.val()));
      }
    });
  }

  function setupGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).on("value", (snapshot) => {
      if (snapshot.val()) {
        props.navigation.navigate("Questions");
      }
    });
  }

  function removeGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).off("value", (snapshot) => {
      if (snapshot.val()) {
        props.navigation.navigate("Questions");
      }
    });
  }

  ///////////// <! -- Listeners -- >

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.inviteFriendsTextView}>
          <Text style={styles.inviteFriendsText}>INVITER DINE VENNER</Text>
        </View>
        <View style={styles.codeTextView}>
          <Text style={styles.codeText}>KODE: {code}</Text>
        </View>

        <View style={styles.peopleJoinedView}>
          {users.map((user, index) => {
            return (
              <View style={styles.personJoinedView} key={index}>
                <Text style={styles.personJoinedText}>{user}</Text>
              </View>
            );
          })}
        </View>
        {hostRef.current && (
          <View style={styles.startGameButtonView}>
            <PinkButton onPress={() => alert(users)} text="START SPIL" />
          </View>
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#D56C7A",
  },

  inviteFriendsTextView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  inviteFriendsText: {
    fontFamily: "Roboto_100Thin",
    color: "white",
    fontSize: 20,
  },

  codeTextView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  codeText: {
    fontFamily: "Roboto_100Thin",
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },

  peopleJoinedView: {
    flex: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
  },

  personJoinedView: {
    width: "32%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },

  personJoinedText: {
    color: "white",
  },

  startGameButtonView: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
});
