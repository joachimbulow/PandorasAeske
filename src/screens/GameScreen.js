import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, } from "react-native";
import { SvgXml } from "react-native-svg";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";
import FirebaseService from "../services/FirebaseService.js";

export default function QuestionsScreen(props) {
  const boxSvgMarkup = BOX_SVG;

  const [question, setQuestion] = useState("");
  const [myTurn, setMyTurn] = useState(false);

  const participantsRef = useRef([]);
  const questionsRef = useRef(props.route.params.questions.sort(() => Math.random() - 0.5))
  const codeRef = useRef(props.route.params.code);
  const hostRef = useRef(props.route.params.host);

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

    if (hostRef.current) {
      setupRegisteredUsersListener();
    }
    if (!hostRef.current) {
      setupHostQuittingGameListener();
    }

    setupCurrentTurnListener();
    setupCurrentQuestionListener();

    return function cleanUp() {
      removeHostQuittingGameListener();
      removeRegisteredUsersListener();
      removeCurrentTurnListener();
      removeCurrentQuestionListener();
    }
  }, []);

  function quitGame() {
    if (hostRef.current) {
      FirebaseService.quitAndDeleteGame(codeRef.current);
    } else {
      FirebaseService.leaveGame(codeRef.current, props.route.params.name);
    }
    props.navigation.navigate("Home");
  }

  function proceedToNextQuestion() {
    if (questionsRef.current.length < 1) {
      quitGame();
      Alert.alert("Spillet er slut", "I er færdige med spillet. Tak for denne gang.");
    }
    else {
      FirebaseService.setCurrentQuestion(codeRef.current, questionsRef.current.pop())
      //Select a random participant
      FirebaseService.setCurrentTurn(codeRef.current, participantsRef.current[Math.floor(Math.random() * participantsRef.current.length)])

    }
  }

  ////// Listeners
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

  function setupRegisteredUsersListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/participants"
    ).on("value", (snapshot) => {
      if (snapshot.val()) {
        participantsRef.current = Object.values(snapshot.val());
      }
    });
  }

  function removeRegisteredUsersListener() {
    FirebaseService.getDatabaseReference(
      "/" + codeRef.current + "/participants"
    ).off();
  }

  function setupCurrentTurnListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/" + "currentTurn").on("value", (snapshot) => {
      if (snapshot.val() == props.route.params.name) {
        setMyTurn(true);
      }
      else {
        setMyTurn(false)
      }
    })
  }

  function removeCurrentTurnListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/" + "currentTurn").off()
  }

  function setupCurrentQuestionListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/" + "currentQuestion").on("value", (snapshot) => {
      setQuestion(snapshot.val());
    })
  }

  function removeCurrentQuestionListener() {
    FirebaseService.getDatabaseReference("/" + codeRef.current + "/" + "currentQuestion").off()
  }

  ////// ! Listeners

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>PANDORAS ÆSKE</Text>
        </View>

        <View style={styles.svgIconView}>
          <View style={styles.svgContainer}>
            <SvgXml xml={boxSvgMarkup} />
          </View>
        </View>

        <View style={styles.questionView}>
          {myTurn && (
            <>
              <Text style={styles.turnToReadText}>
                Det er din tur til at læse op:
              </Text>
              <View style={styles.questionTextView}>
                <Text style={styles.questionText}>{question}</Text>
              </View>
            </>
          )}
          {!myTurn && (
            <>
              <Text style={styles.turnToReadText}>
                Det er en af de andre spilleres
              </Text>
              <Text style={styles.turnToReadText}>tur til at læse op</Text>
            </>
          )}
        </View>

        <View style={styles.buttonsView}>
          {hostRef.current && <PinkButton onPress={() => proceedToNextQuestion()} text={questionsRef.current.length < 1 ? "AFSLUT SPIL" : "NÆSTE SPØRGSMÅL"} />}
        </View>
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
  questionView: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  questionTextView: {
    height: "80%",
    minWidth: "60%",
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
  },
  turnToReadText: {
    fontFamily: "Roboto_100Thin",
    color: "white",
    fontSize: 18,
  },
  questionText: {
    fontFamily: "Roboto_100Thin",
    color: "black",
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
