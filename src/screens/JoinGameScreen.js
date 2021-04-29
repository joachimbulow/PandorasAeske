import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput } from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";

import FirebaseService from "../services/FirebaseService.js";

export default function JoinGameScreen(props) {
  const [code, setCode] = useState("");

  const boxSvgMarkup = BOX_SVG;

  async function tryJoinGame() {
    if (await FirebaseService.isGameValid(code)) {
      props.navigation.navigate("SelectName", { code: code });
    } else {
      alert("Der findes ikke et spil med denne kode :i");
    }
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.titleView}>
          <Text style={styles.title}>JOIN SPIL</Text>
        </View>

        <View style={styles.svgIconView}>
          <View style={styles.svgContainer}>
            <SvgXml xml={boxSvgMarkup} />
          </View>
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.codeText}>Kode:</Text>
          <TextInput
            autoCapitalize="characters"
            value={code}
            onChangeText={(text) => setCode(text)}
            style={styles.textInput}
          ></TextInput>
        </View>

        <View style={styles.buttonsView}>
          <PinkButton text="JOIN SPIL" onPress={() => tryJoinGame()} />
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
