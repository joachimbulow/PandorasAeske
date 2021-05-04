import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, SafeAreaView, Button, Alert, } from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";
import * as firebase from "firebase";

export default function QuestionsScreen(props) {
  const boxSvgMarkup = BOX_SVG;

  const [question, setQuestion] = useState("Jonas, hvorfor er du såå grim?");
  const [myTurn, setMyTurn] = useState(false);

  console.log(props.route.params)
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
  }, []);

  function quitGame() {
    if (hostRef.current) {
      FirebaseService.quitAndDeleteGame(codeRef.current);
    } else {
      FirebaseService.leaveGame(codeRef.current, props.route.params.name);
    }
    props.navigation.navigate("Home");
  }

  ////// Listeners


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
          {myTurn && <PinkButton text="NÆSTE SPØRGSMÅL" />}
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
