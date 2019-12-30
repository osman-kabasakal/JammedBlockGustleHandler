import React, { Component, useState, useEffect, useRef } from "react";
import { NavigationStackOptions } from "react-navigation-stack";
import { NavComponentProp } from "../../types/IScreen";
import { View, Text, Button } from "react-native";
import MainStyle from "../lib/contants/styles/Main";
import { AdMobBanner } from "expo-ads-admob";
import RewardManager from "../lib/helpers/RewardAdMod";
import Timer from "./Timer";

function ClaimeRender(props) {
  const [claimStatus, setClaimStatus] = useState(true);
  let sub=useRef("default");
  let registerSub=()=>{
    sub.current=RewardManager.subscribeClaimStatus(val => {
      console.log("subber Calim Sattus");
      setClaimStatus(val);
    })
  }
  let removeSubs=()=>{
    RewardManager.removeSubscribe(sub.current);
  }
  useEffect(() => {
    registerSub();

    return removeSubs;
  }, [claimStatus]);

  return (
    <View>
      {claimStatus ? (
        <Button
          title={"set claim"}
          onPress={() => {
            RewardManager.setClaim();
          }}
        ></Button>
      ) : (
        <Timer timeFinishEvent={()=>{RewardManager.setClaim()}} reverse={true} downVal={RewardManager.claimActivateTime} startVal={RewardManager.claimLockedTime}/>
      )}
    </View>
  );
}

const RenderTime = props => {
  const [TimeText, setTimeText] = useState("");
  let intervalIds=useRef([]);
  let registerInterval=(fn:()=>void,ms:number)=>{
    intervalIds.current.push(setInterval(fn,ms));
  }
  let updateTime= () => {
    let tmx=new Date(Date.now()).toLocaleTimeString();
    setTimeText(tmx);
  };
  let clearIntervals=()=>{
    intervalIds.current.forEach((id)=>clearInterval(id));
  }
  useEffect(() => {
    // const interval = setInterval(
    //   () => {
    //     let tmx=new Date(Date.now()).toLocaleTimeString();
    //     setTimeText(tmx);
    //   },
    //   1000
    // );
    registerInterval(updateTime,1000);
    return clearIntervals;
  }, [registerInterval,clearIntervals]);

  return (
    <Button
      title={TimeText}
      onPress={() => {
        RewardManager.setClaim();
      }}
    ></Button>
  );
};

export default abstract class MainLayout extends Component<NavComponentProp> {
  static navigationOptions: NavigationStackOptions = {
    headerRight: () => <ClaimeRender />
  };
  revardAdMob = RewardManager;
  bannerActive: boolean = true;
  constructor(props) {
    super(props);
    this.revardAdMob.hasClaimNewGame();
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
