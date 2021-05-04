import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function PinkButton(props) {
  return (
    <>
    <View style={[props.disabled && styles.disabled, !props.disabled && styles.enabled]}>
      <TouchableOpacity
        onPress={() => props.onPress()}
        style={[styles.button]}
        disabled={props.disabled}
      >
        <Text style={styles.buttonText}>{props.text}</Text>
      </TouchableOpacity>

    </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 50,
    margin: 10,
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
  disabled: {
    opacity: 0.5,
  },
  enabled: {
    opacity: 1,
  },
});
