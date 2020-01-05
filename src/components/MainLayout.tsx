import React, { Component, useState, useEffect, useRef } from "react";
import { NavigationStackOptions } from "react-navigation-stack";
import { NavComponentProp } from "../../types/IScreen";
import { View, Text, Button, ActivityIndicator } from "react-native";
import MainStyle from "../lib/contants/styles/Main";
import { AdMobBanner } from "expo-ads-admob";
import RewardManager from "../lib/helpers/RewardAdMod";
import Timer from "./Timer";
import { Icon,Overlay } from "react-native-elements";
import { SafeAreaView } from "react-navigation";

function ClaimeRender(props) {
  const [claimStatus, setClaimStatus] = useState(true);
  let sub=useRef("default");
  let registerSub=()=>{
    sub.current=RewardManager.claimStatus.subscribe(val => {
      setClaimStatus(val);
    })
  }
  let removeSubs=()=>{
    RewardManager.claimStatus.removeSubscribe(sub.current);
  }
  useEffect(() => {
    registerSub();

    return removeSubs;
  }, [claimStatus]);

  return (
    <View>
      {!claimStatus && (
        // <Timer timeFinishEvent={()=>{RewardManager.setClaim()}} reverse={true} downVal={RewardManager.claimActivateTime} startVal={RewardManager.claimLockedTime}/>
        <Icon onPress={()=>{

        }} name="lock" type="material" reverse color="red" backgroundColor="red"></Icon>
      )}
    </View>
  );
}
interface mainState{
load:boolean
}
export default abstract class MainLayout<TProp={[key:string]:any},TState={[key:string]:any}> extends Component<NavComponentProp&TProp> {
  static navigationOptions: NavigationStackOptions = {
    headerRight: () => <ClaimeRender />
  };
  revardAdMob = RewardManager;
  bannerActive: boolean = true;
  state={
    load:false
  }
  constructor(props) {
    super(props);
    this.props.navigation.isFocused();
  }
  private rewardActiveSubscribeId:string;

  componentDidMount(){
    this.rewardActiveSubscribeId= RewardManager.rewardIsActive.subscribe((val)=>{
      this.setState({load:val});
    })
  }

  componentDidUpdate(){
  }

  componentWillUnmount(){
    RewardManager.rewardIsActive.removeSubscribe(this.rewardActiveSubscribeId);
  }

  render() {
    return (
      <SafeAreaView style={MainStyle.Container.Main.main}>
        {/* {this.bannerActive && (
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
        )} */}
        <View style={MainStyle.Container.Main.content}>{this.content()}</View>
        {/* {this.bannerActive && (
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
        )} */}
        <Overlay isVisible={this.state.load&&this.props.navigation.isFocused()} animated={false} width="auto" height="auto">
          <ActivityIndicator ></ActivityIndicator>
        </Overlay>
      </SafeAreaView>
    );
  }

  abstract content: () => JSX.Element | JSX.Element[];
}
