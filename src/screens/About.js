import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, KeyboardAvoidingView } from "react-native";
import { SvgXml } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BOX_SVG } from "../assets/svgs/Svgs.js";
import PinkButton from "../components/PinkButton.js";
import FirebaseService from "../services/FirebaseService.js";

export default function AboutScreen(props) {

    const boxSvgMarkup = BOX_SVG;

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.titleView}>
                    <Text style={styles.title}>Om denne app</Text>
                </View>

                <View style={styles.svgIconView}>
                    <View style={styles.svgContainer}>
                        <SvgXml xml={boxSvgMarkup} />
                    </View>
                </View>

                <View style={styles.textView}>
                    <Text style={styles.mainText}>Appen er udviklet af Joachim Bülow i 2021</Text>
                    <Text style={styles.mainText}>Tak til Freepik @ flaticon.com/authors/freepik for artworket</Text>
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

    textView: {
        flex: 5,
        padding: 25

    },
    mainText: {
        fontFamily: "Roboto_100Thin",
        color: "white",
        fontSize: 20,
        marginBottom: 40
    }
});
