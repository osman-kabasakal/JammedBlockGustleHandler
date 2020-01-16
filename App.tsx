import React from "react";
import { enableScreens } from 'react-native-screens';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import HomeScreen from "./src/screens/Home";
import MainStyle from "./src/lib/contants/styles/Main";
import GamesScreen from "./src/screens/GamesScreen";
import GameScreen from "./src/screens/Game";
import * as firebase from 'firebase';
import '@firebase/firestore';
// enableScreens();
// const firebaseConfig = {
//   apiKey: "AIzaSyAQbyiMbJeeersMY0a_5K_Qc5ay6uBn_rw",
//   authDomain: "429313286973-k7in7k669gk53laenck3673m5dmqhmc1.apps.googleusercontent.com",
//   storageBucket:"sikisan-blok.appspot.com",
//   databaseURL:"https://sikisan-blok.firebaseio.com",
//   projectId: "sikisan-blok"
// };

// firebase.initializeApp(firebaseConfig);
// let fireStore=firebase.firestore();
// fireStore.collection("firstCollection").doc("1").get().then((val)=>{
//   console.log("firestore Data",val.data());
// });
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
