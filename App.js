import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Roboto_100Thin } from '@expo-google-fonts/roboto';
import AppLoading from 'expo-app-loading';

//Disable annoying warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);


import HomeScreen from './src/screens/HomeScreen.js'
import LobbyScreen from './src/screens/LobbyScreen.js'
import QuestionsScreen from './src/screens/QuestionsScreen.js'
import GameScreen from './src/screens/GameScreen.js'
import JoinGameScreen from './src/screens/JoinGameScreen.js'
import SelectNameScreen from './src/screens/SelectNameScreen.js'


export default function App() {

  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
  });

  const Stack = createStackNavigator();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Velkommen' }}
        />
        <Stack.Screen
          name="Lobby"
          component={LobbyScreen}
          options={{ title: 'Lobby' }}
        />
        <Stack.Screen
          name="Questions"
          component={QuestionsScreen}
          options={{ title: 'Spørgsmål' }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
        />
        <Stack.Screen
          name="JoinGame"
          component={JoinGameScreen}
          options={{ title: 'Join et spil' }}
        />
        <Stack.Screen
          name="SelectName"
          component={SelectNameScreen}
          options={{ title: 'Vælg navn' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


