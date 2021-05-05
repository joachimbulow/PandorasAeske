import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, KeyboardAvoidingView } from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";
import FirebaseService from "../services/FirebaseService.js";

export default function SelectNameScreen(props) {
  const [name, setName] = useState("");
  const boxSvgMarkup = BOX_SVG;

  async function tryJoinGame() {
    if (props.route.params && props.route.params.code) {
      if (
        await FirebaseService.isNameValidForGame(props.route.params.code, name)
      ) {
        navigateNext();
      } else {
        alert("Dette navn er optaget :i");
      }
    } else {
      navigateNext();
    }
  }

  function navigateNext() {
    props.navigation.navigate("Lobby", {
      ...props.route.params, ...{ name: name }
    })
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView

          style={styles.keyboardAvoidingView}
        >
              <View style={styles.titleView}>
                <Text style={styles.title}>Vælg dit navn</Text>
              </View>

              <View style={styles.svgIconView}>
                <View style={styles.svgContainer}>
                  <SvgXml xml={boxSvgMarkup} />
                </View>
              </View>
              <View style={styles.textInputView}>
                <Text style={styles.codeText}>Navn:</Text>
                <TextInput
                  value={name}
                  onChangeText={(text) =>
                    name.length < 16 ? setName(text) : undefined
                  }
                  style={styles.textInput}
                ></TextInput>
              </View>

              <View style={styles.buttonsView}>
                <PinkButton
                  text={
                    props.route.params && props.route.params.code
                      ? "JOIN SPIL"
                      : "Opret spil"
                  }
                  onPress={() => tryJoinGame()}
                  disabled={name == ""}
                />
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

    fontSize: 30,
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
    height: 40,
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
