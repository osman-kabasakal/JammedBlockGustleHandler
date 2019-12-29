import React, { Component } from "react";
import { NavigationStackOptions } from "react-navigation-stack";
import { NavComponentProp } from "../../types/IScreen";
import { View } from "react-native";
import MainStyle from "../lib/contants/styles/Main";
import { AdMobBanner } from "expo-ads-admob";
import RewardManager from "../lib/helpers/RewardAdMod";
export default abstract class MainLayout extends Component<NavComponentProp> {
  static navigationOptions: NavigationStackOptions={
    headerRight:{

    }
  };
  revardAdMob=RewardManager;
  bannerActive: boolean = true;
  constructor(props) {
    super(props);
    // this.state={...{hasClaim:this.revardAdMob.}}
    // this.bannerActive.addE
  }

  render() {
    return (
      <View style={MainStyle.Container.Main.main}>
        {this.bannerActive && (
          <View style={MainStyle.Container.AdMobContent.top}>
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
              testID="EMULATOR29X3X2X0"
              servePersonalizedAds // true or false
              onDidFailToReceiveAdWithError={val => {
                console.log("banner hata", val);
              }}
            />
          </View>
        )}
        <View style={MainStyle.Container.Main.content}>{this.content()}</View>
        {this.bannerActive && (
          <View style={MainStyle.Container.AdMobContent.buttom}>
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
              testID="EMULATOR29X3X2X0"
              servePersonalizedAds // true or false
              onDidFailToReceiveAdWithError={val => {
                console.log("banner hata", val);
              }}
            />
          </View>
        )}
      </View>
    );
  }

  abstract content: () => JSX.Element | JSX.Element[];
}
