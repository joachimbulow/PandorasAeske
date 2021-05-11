import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Alert,
  Platform
} from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";

import FirebaseService from "../services/FirebaseService.js";

export default function QuestionsScreen(props) {
  const [question, setQuestion] = useState("");

  const [allQuestions, setAllQuestions] = useState([])

  const codeRef = useRef(props.route.params.code);
  //If no code then host
  const hostRef = useRef(props.route.params.host);


  const boxSvgMarkup = BOX_SVG;

  useEffect(() => {
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

    setupQuestionsUpdatedListener();

    if (!hostRef.current) {
      setupHostQuittingGameListener();
      setupGameStateListener();
    }

    return function cleanUp() {
      removeHostQuittingGameListener();
      removeQuestionsUpdatedListener();
      removeGameStateListener();
    }
  }, [])


  function quitGame() {
    if (hostRef.current) {
      FirebaseService.quitAndDeleteGame(codeRef.current);
    } else {
      FirebaseService.leaveGame(codeRef.current, props.route.params.name);
    }
    props.navigation.navigate("Home");
  }

  function addQuestion() {
    FirebaseService.addQuestion(question, codeRef.current);
    setQuestion("")
  }

  function navigateToGame() {
    if (hostRef.current) {
      FirebaseService.setGameState(codeRef.current, 2);
    }
    props.navigation.navigate("Game", {
      ...props.route.params, ...{ questions: allQuestions }
    });
  }

  /// Listeners
  function setupHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current).on("value", (snapshot) => {
      if (!snapshot.val()) {
        props.navigation.navigate("Home");
        Alert.alert("Spillet er slut", "Spillet blev afsluttet af værten.");
      }
    });
  }

  function removeHostQuittingGameListener() {
    FirebaseService.getDatabaseReference("/").off();
  }

  function setupQuestionsUpdatedListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/questions").on("value", (snapshot) => {
      if (snapshot.val()) {
        setAllQuestions(snapshot.val())
      }
    })
  }

  function removeQuestionsUpdatedListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/questions").off()
  }

  function setupGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).on("value", (snapshot) => {
      if (snapshot.val() == 2) {
        navigateToGame();
      }
    });
  }

  function removeGameStateListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/gameState"
    ).off();
  }

  /// ! Listeners

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.titleView}>
            <Text style={styles.title}>SKRIV DINE</Text>
            <Text style={styles.title}>SPØRGSMÅL</Text>
          </View>

          <View style={styles.svgIconView}>
            <View style={styles.svgContainer}>
              <SvgXml xml={boxSvgMarkup} />
            </View>
          </View>
          <View style={styles.textInputView}>
            <Text style={styles.codeText}>Antal spørgsmål: {allQuestions.length}</Text>
            <Text style={styles.codeText}>Dit spørgsmål:</Text>
            <TextInput
              blurOnSubmit={true}
              multiline={true}
              numberOfLines={4}
              maxLength={145}
              value={question}
              onChangeText={(text) => question.length < 95 ? setQuestion(text) : undefined}
              style={styles.textInput}
            ></TextInput>
          </View>

          <View style={styles.buttonsView}>
            <PinkButton text="INDSEND SPØRGSMÅL" onPress={(() => { addQuestion() })} disabled={question == ""} />
            {hostRef.current && <PinkButton onPress={() => navigateToGame()} text="START SPILLET" disabled={allQuestions.length == 0} />}
          </View>
        </KeyboardAvoidingView>
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

  keyboardAvoidingView: {
    flex: 1,
  },

  titleView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },

  title: {
    fontFamily: "Roboto_100Thin",
    color: "white",

    fontSize: 26,
  },
  svgIconView: {
    flex: 2,
    justifyContent: "center",
  },

  svgContainer: {
    flex: 0.9,
  },
  textInputView: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  codeText: {
    fontFamily: "Roboto_100Thin",
    color: "white",
    fontSize: 18,
  },
  textInput: {
    height: "75%",
    width: "50%",
    margin: 12,
    borderWidth: 1,
    backgroundColor: "#FFF",
  },

  buttonsView: {
    flex: 1.5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
