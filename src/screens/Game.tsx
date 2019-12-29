import React from "react";
import MainLayout from "../components/MainLayout";
import { NavigationStackOptions } from "react-navigation-stack";
import { Oyunlar } from "../lib/datas/SeviyelereGoreOyunlar";
import {
  SafeAreaView,
  View,
  Animated,
  PanResponderInstance,
  LayoutRectangle,
  UIManager,
  ImageBackground
} from "react-native";
import { OyunData } from "../../types/DataTypes";
import Block, { BlockProps } from "../lib/helpers/CreateBlock";
import BlockMembers from "../lib/helpers/BlockMembers";
import { Overlay,Text } from "react-native-elements";
import RewardManager from "../lib/helpers/RewardAdMod";

export default class GameScreen extends MainLayout {
  static navigationOptions: NavigationStackOptions = {
    title: "Sıkışan Block"
  };

  parentRectangle: LayoutRectangle = null;
  position = new Animated.ValueXY();
  _panResponder: PanResponderInstance;
  
  constructor(props) {
    super(props);
    this.bannerActive = false;
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
RewardManager.hasClaimNewGame().then((val)=>{
this.setState({_hasClaim:val});
});
  }

  

  state = {
    isWorldLoad: false,
    isComplete:false,
    _hasClaim:false
  };
  timeout: any;
  content = () => {
    var id = this.props.navigation.getParam("id");
    var oyunIndex = this.props.navigation.getParam("index");
    if (id in Oyunlar) {
      return (
        <SafeAreaView style={{display:this.state._hasClaim?"flex":"none"}}>
          <ImageBackground
            source={require("../../assets/block_screen_blank.jpg")}
            style={{ height: "100%", width: "100%" }}
            resizeMode={"stretch"}
          >
            <View
              onLayout={event => {
                this.parentRectangle = event.nativeEvent.layout;
                const { width, height, x, y } = event.nativeEvent.layout;
                if (!this.state.isWorldLoad)
                  this.setState({ isWorldLoad: true });
              }}
              style={{
                height: "100%",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "black",
                flexDirection: "row",
                flexWrap: "wrap",
                position: "relative"
              }}
            >
              {this.state.isWorldLoad &&
                this.renderBlocks(Oyunlar[id][oyunIndex])}
            </View>
          </ImageBackground>

          <Overlay isVisible={this.state.isComplete}
           onBackdropPress={()=>{this.setState({isComplete:false})}}>
            <Text>Bitirdin</Text>
            </Overlay>
        </SafeAreaView>
      );
    }
    return <></>;
  };
completeCb:()=>void=()=>{
  this.setState({isComplete:true});
}

  renderBlocks(oyun: OyunData) {
    let blocks: JSX.Element[] = [];
    let worldOpt={
      parentRectangle: this.parentRectangle,
      step: {
        x: this.parentRectangle.width / 6,
        y: this.parentRectangle.height / 6
      }
    }
    let blockMember=new BlockMembers(worldOpt);
    let staticOpt = {
      worldOpt: worldOpt,
      blockMember:blockMember,
      finishCb:this.completeCb
    };
    let blockOpt: BlockProps = {
      
      isJammed: true,
      jammedLength: 2,
      objeOpt: {
        length: 2,
        type: "horizantal",
        x: oyun.JammedPosition,
        y: 2
      },
      ...staticOpt
    };
    blocks.push(<Block key={"kutu_jammed"} {...blockOpt} />);

    for (let block in oyun.BlockPositions) {
      blockOpt.isJammed = false;
      (blockOpt.jammedLength = 0),
        (blockOpt.objeOpt = oyun.BlockPositions[block]);
      blocks.push(
        <Block
          key={
            "kutu_" + oyun.BlockPositions.indexOf(oyun.BlockPositions[block])
          }
          {...blockOpt}
        />
      );
    }

    return blocks;
  }
}