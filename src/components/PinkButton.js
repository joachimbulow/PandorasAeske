import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function PinkButton(props) {
  return (
    <>
      <TouchableOpacity onPress={() => props.onPress()} style={styles.button}>
        <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 50,
    margin: 15,
    borderRadius: 10,
    backgroundColor: "#E173E9",
    borderWidth: 1,
    borderColor: "#FFF",
  },
  buttonText: {
    fontFamily: "Roboto_100Thin",
    color: "#FFF",
    fontWeight: "bold",
  },
});
