import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";

export default function QuestionsScreen(props) {
  const [question, setQuestion] = useState("");

  const boxSvgMarkup = BOX_SVG;

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
            <Text style={styles.codeText}>Dit spørgsmål:</Text>
            <TextInput
              blurOnSubmit={true}
              multiline={true}
              numberOfLines={4}
              maxLength={145}
              value={question}
              onChangeText={(text) => setQuestion(text)}
              style={styles.textInput}
            ></TextInput>
          </View>

          <View style={styles.buttonsView}>
            <PinkButton text="INDSEND SPØRGSMÅL" />
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
