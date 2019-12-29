import React, { Component } from "react";
import {
  NavigationStackProp,
  NavigationStackOptions
} from "react-navigation-stack";
import { NavComponentProp } from "../../types/IScreen";
import { SafeAreaView, View, Text } from "react-native";
import MainStyle from "../lib/contants/styles/Main";
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded
} from 'expo-ads-admob';
export default abstract class MainLayout extends Component<NavComponentProp> {
  static navigationOptions: NavigationStackOptions;
  bannerActive:boolean=true;
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={MainStyle.Container.Main.main}>
        {this.bannerActive&&(<View style={MainStyle.Container.AdMobContent.top}>
          <AdMobBanner
  bannerSize="smartBannerPortrait"
  adUnitID="ca-app-pub-7033389954637971/3460097584" // Test ID, Replace with your-admob-unit-id
  servePersonalizedAds // true or false
  onDidFailToReceiveAdWithError={(val)=>{console.log("banner hata",val);}} />
        </View>)}
        <View style={MainStyle.Container.Main.content}>{this.content()}</View>
        {this.bannerActive&&
        (<View style={MainStyle.Container.AdMobContent.buttom}>
        <AdMobBanner
  bannerSize="smartBannerPortrait"
  adUnitID="ca-app-pub-7033389954637971/3839371539" // Test ID, Replace with your-admob-unit-id
  servePersonalizedAds // true or false
  onDidFailToReceiveAdWithError={(val)=>{console.log("banner hata",val);}} />
        </View>)}
      </View>
    );
  }

  abstract content: () => JSX.Element | JSX.Element[];
}
