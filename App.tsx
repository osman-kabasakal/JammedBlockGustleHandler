import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import HomeScreen from "./src/screens/Home";
import MainStyle from "./src/lib/contants/styles/Main";
import GamesScreen from "./src/screens/GamesScreen";
import GameScreen from "./src/screens/Game";

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Games: {
      screen: GamesScreen
    },
    Game:{
      screen:GameScreen
    }
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      headerTintColor: "white",
      headerTitleStyle: {
        textAlign: "center"
      },
      headerStyle: MainStyle.Navigation.headerStyle
    }
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
