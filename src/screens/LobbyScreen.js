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

  const codeRef = useRef(props.route.params.code);
  //If no code then host
  const hostRef = useRef(!props.route.params.code);

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

    //Host
    if (hostRef.current) {
      //Generate new game
      let gameCode = (Math.random() + 1)
        .toString(36)
        .substring(2, 7)
        .toUpperCase();
      setCode(gameCode);
      codeRef.current = gameCode;
      FirebaseService.generateNewGame(gameCode, props.route.params.name, 0);
    }

    //Host
    else {
      setCode(props.route.params.code);
      codeRef.current = props.route.params.code;
      FirebaseService.joinExistingGame(
        props.route.params.code,
        props.route.params.name
      );
      setupGameStateListener();
      setupHostQuittingGameListener();
    }

    setupRegisteredUsersListener();

    return function cleanUp() {
      removeRegisteredUsersListener();
      removeGameStateListener();
      removeHostQuittingGameListener();
    };
  }, []);

  function quitGame() {
    if (hostRef.current) {
      FirebaseService.quitAndDeleteGame(codeRef.current);
    } else {
      FirebaseService.leaveGame(codeRef.current, props.route.params.name);
    }
    props.navigation.navigate("Home");
  }

  function navigateToQuestions() {
    if (hostRef.current) {
      FirebaseService.setGameState(codeRef.current, 1);
    }
    props.navigation.navigate("Questions", {
      ...(props.route.params && {
        code: codeRef.current,
        host: hostRef.current,
      }),
    });
  }

  ////////////////// Listeners

  function setupHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current).on(
      "value",
      (snapshot) => {
        if (!snapshot.val()) {
          props.navigation.navigate("Home");
          Alert.alert("Spillet er slut", "Spillet blev afsluttet af værten.");
        }
      }
    );
  }

  function removeHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/").off();
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
    ).off();
  }

  function setupGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).on("value", (snapshot) => {
      if (snapshot.val()) {
        navigateToQuestions();
      }
    });
  }

  function removeGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).off();
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
            <PinkButton
              onPress={() => alert(users)}
              text="START SPIL"
              onPress={() => navigateToQuestions()}
            />
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
