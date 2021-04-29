import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";

import PinkButton from "../components/PinkButton.js";

export default function HomeScreen(props) {
  const boxSvgMarkup = BOX_SVG;

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

        <View style={styles.buttonsView}>
          <PinkButton
            text="Host et spil"
            onPress={() => props.navigation.navigate("SelectName")}
          />
          <PinkButton
            text="Join et spil"
            onPress={() => props.navigation.navigate("JoinGame")}
          />
          <PinkButton text="Om denne app" />
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
  buttonsView: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
