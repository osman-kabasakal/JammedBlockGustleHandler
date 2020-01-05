import React, { useEffect, Component } from "react";
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
  Image,
  ImageBackground,
  Button,
  ActivityIndicator,
  DrawerLayoutAndroid,
  DrawerLayoutAndroidBase,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { OyunData } from "../../types/DataTypes";
import Block, { BlockProps } from "../lib/helpers/CreateBlock";
import BlockMembers from "../lib/helpers/BlockMembers";
import { Overlay, Text, Icon } from "react-native-elements";
import RewardManager from "../lib/helpers/RewardAdMod";
import Timer from "../components/Timer";
import HamleManager, { IHamleManager } from "../lib/helpers/HamleManager";
import { FlatList } from "react-native-gesture-handler";
import MainStyle from "../lib/contants/styles/Main";
import {  } from "react-navigation";
interface state{
  load:boolean;
  isWorldLoad: boolean;
    isComplete: boolean;
    isRenderAbleBlocks:boolean;
    startingData:OyunData;
    gameCurrentScreen:OyunData;
}
export default class GameScreen extends MainLayout<{}> {
  static navigationOptions: NavigationStackOptions = Object.assign(
    {},
    { ...MainLayout.navigationOptions },
    { title: "Sıkışan Block", headerRight: () => <Timer /> }
  );

  parentRectangle: LayoutRectangle = null;
  position = new Animated.ValueXY();
  _panResponder: PanResponderInstance;
  renderBlockRef: React.RefObject<RenderBlocks> = React.createRef();
  timeout: any;
  buttons = ["hamlaler", "deneme", "deneme2"];
  isblockOnload: boolean = false;
  drawerLayout=React.createRef<DrawerLayoutAndroid>();
  
  state:state = {
    load:false,
    isWorldLoad: false,
    isComplete: false,
    isRenderAbleBlocks:false,
    startingData:(undefined as OyunData),
    gameCurrentScreen:(undefined as OyunData)
  };
  constructor(props) {
    super(props);
    this.bannerActive = false;
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
      var id = this.props.navigation.getParam("id");
    var oyunIndex = this.props.navigation.getParam("index");
    this.state.startingData=Object.assign({},Oyunlar[id][oyunIndex]);
    this.state.gameCurrentScreen=Object.assign({},Oyunlar[id][oyunIndex]);
  }

  content = () => {
    
    return (
      <>
        <SafeAreaView
          style={{
            paddingVertical: "0%",
            flex: 1,
            height: "100%",
            width: "100%"
          }}
        >
          <DrawerLayoutAndroid
          
          ref={this.drawerLayout}
            drawerWidth={300}
            renderNavigationView={this.renderHamleList}
            onDrawerOpen={()=>{this.drawerLayout.current.forceUpdate()}}
            drawerLockMode={"locked-open"}
          >
            <View
            onLayout={()=>{
              this.setState({isRenderAbleBlocks:true});
            }}
              style={{
                position: "relative",
                flex: 9,
                padding: 0,
                margin: 0
              }}
            >
              {this.state.isRenderAbleBlocks&&
              <View
              onLayout={event => {
                this.parentRectangle = event.nativeEvent.layout;
                const { width, height, x, y } = event.nativeEvent.layout;
                if (!this.state.isWorldLoad)
                  this.setState({ isWorldLoad: true });
              }}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "black",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    position: "relative"
                  }}
                >
                  {this.state.isWorldLoad && (
                    this.renderBlocks()
                  )}
                </View>
              }
              
              <Image
                source={require("../../assets/block_screen_blank.jpg")}
                style={{
                  height: "100%",
                  width: "100%",
                  position:"absolute",
                  zIndex:-1,
                  top:0,
                  left:0,
                  margin: 0,
                  padding: 0
                }}
                resizeMode={"stretch"}
              >
                
              </Image>
            </View>

            <View style={{
              // flex:1,
              height:50,
              flexDirection:"row",
              justifyContent:"space-around",
              alignItems:"stretch"
            }}>
              <TouchableHighlight
              style={{
                flex:1,
                justifyContent:"center",
                alignItems:"center"
              }}
              onPress={()=>{
                this.drawerLayout.current.forceUpdate();
                this.drawerLayout.current.openDrawer();
              }}>
                <Icon name="playlist-play">

                </Icon>
              </TouchableHighlight>
              <TouchableHighlight
              style={{
                flex:1,
                justifyContent:"center",
                alignItems:"center"
              }}
              onPress={()=>{
                this.drawerLayout.current.forceUpdate();
                this.drawerLayout.current.openDrawer();
              }}>
                <Icon name="playlist-play">

                </Icon>
              </TouchableHighlight>
              <TouchableHighlight
              style={{
                flex:1,

                justifyContent:"center",
                alignItems:"center"
              }}
              onPress={()=>{
                this.drawerLayout.current.forceUpdate();
                this.drawerLayout.current.openDrawer();
              }}>
                <Icon name="view-list">

                </Icon>
              </TouchableHighlight>
              <TouchableOpacity
              style={{
                flex:1,
                justifyContent:"center",
                alignItems:"center"
              }}
              onPress={()=>{
                this.drawerLayout.current.forceUpdate();
                this.drawerLayout.current.openDrawer();
              }}>
                <Icon name="playlist-play">

                </Icon>
                <Text>deneme</Text>
              </TouchableOpacity>
            </View>
          </DrawerLayoutAndroid>
        </SafeAreaView>
        <Overlay
          isVisible={this.state.isComplete}
          onBackdropPress={() => {
            this.setState({ isComplete: false });
          }}
        >
          <Text>Bitirdin</Text>
        </Overlay>
      </>
    );
  };
  completeCb: () => void = () => {
    this.renderBlockRef.current.blocks.forEach(val => {
      val.current._gamePanHandler._isFinish.set(true);
    });
    this.setState({ isComplete: true });
  };
  renderBlocks=()=>{
    this.isblockOnload = false;
return (<RenderBlocks
  onLoad={() => {
    this.isblockOnload = true;
  }}
  ref={this.renderBlockRef}
  data={this.state.gameCurrentScreen}
  parentRectangle={this.parentRectangle}
  completeCb={this.completeCb}
/>);
  }
  renderHamle = () => {
    return <Text>Hamle Olcak</Text>;
  };

  renderHamleList = () => {
    if (this.state.isWorldLoad && this.isblockOnload) {
      let hamObj = this.renderBlockRef.current._hamleManager.hamleler.map(
        (val, i) => {
          return {
            hamleIndexi: i + 1,
            value:val
          };
        }
      );

      return (
        <FlatList
          data={hamObj}
          renderItem={it => {
            return (
            <TouchableOpacity
            onPress={()=>{
              // let yeniOyun=[];
              // let copyOyunData=Object.assign({},this.state.startingData);
              // Object.keys(it.item.value).forEach(val=>{
              //   let oyun=copyOyunData.BlockPositions.find(x=>x.id===val);
              //   if(oyun){
              //     oyun.x=it.item.value[val].x;
              //     oyun.y=it.item.value[val].y;
              //     yeniOyun.push(oyun);
              //   }
              //   if(val===this.state.startingData.gameId+"_jammed"){
              //     copyOyunData.JammedPosition=it.item.value[val].y;
              //   }
              // });
              // copyOyunData.BlockPositions=yeniOyun;
              // this.setState({gameCurrentScreen:copyOyunData});
              // this.drawerLayout.current.closeDrawer();
            }}>
              <Text>{it.item.hamleIndexi}. Hamle</Text>
            </TouchableOpacity>);
          }}
          keyExtractor={(it)=>it.hamleIndexi+"hamle"}
        ></FlatList>
      );
    }
    return <ActivityIndicator></ActivityIndicator>;
  };
}

class RenderBlocks extends Component<{
  data: OyunData;
  parentRectangle: LayoutRectangle;
  completeCb: () => void;
  onLoad: () => void;
}> {
  constructor(props) {
    super(props);
    // let jsx=this.renderBlocks(this.props.data);
    // this.state.blocks=jsx;
  }

  _hamleManager: IHamleManager;
  _blockMember: BlockMembers;
  blocks: React.RefObject<Block>[] = [];
  jammedRef: React.RefObject<Block>;
  state={
    blocks:([] as JSX.Element[]) 
  }
  componentDidMount() {
    // let jsx=this.renderBlocks(this.props.data);
    this._hamleManager = new HamleManager({
      blockMembers: this._blockMember,
      blocks: this.blocks
    });
    // this.setState({blocks:jsx});
    this.props.onLoad();
  }

  componentDidUpdate() {
    // let jsx=this.renderBlocks(this.props.data);
    // this.setState({blocks:jsx});
    this._hamleManager = new HamleManager({
      blockMembers: this._blockMember,
      blocks: this.blocks
    });
    this.props.onLoad();
  }

  componentWillUnmount() {
    this._hamleManager = null;
  }

  render() {
    console.log("renderBlock updated")
    return <>
    {this.renderBlocks(this.props.data)}
    </>
  }

  renderBlocks(oyun: OyunData) {
    this.blocks = [];
    let blocks: JSX.Element[] = [];
    let worldOpt = {
      parentRectangle: this.props.parentRectangle,
      step: {
        x: this.props.parentRectangle.width / 6,
        y: this.props.parentRectangle.height / 6
      }
    };
    this._blockMember = new BlockMembers(worldOpt);
    let staticOpt = {
      worldOpt: worldOpt,
      blockMember: this._blockMember,
      finishCb: this.props.completeCb
    };
    let blockOpt: BlockProps = {
      isJammed: true,
      jammedLength: 2,
      objeOpt: {
        id: oyun.gameId + "_jammed",
        length: 2,
        type: "horizantal",
        x: oyun.JammedPosition,
        y: 2
      },
      ...staticOpt
    };
    this.jammedRef = React.createRef<Block>();
    blocks.push(
      <Block ref={this.jammedRef} key={"kutu_jammed"} {...blockOpt} />
    );
    this.blocks.push(this.jammedRef);
    for (let block in oyun.BlockPositions) {
      blockOpt.isJammed = false;
      (blockOpt.jammedLength = 0),
        (blockOpt.objeOpt = oyun.BlockPositions[block]);
      let rf: React.RefObject<Block> = React.createRef<Block>();
      blocks.push(
        <Block
          ref={rf}
          key={
            "kutu_" + oyun.BlockPositions.indexOf(oyun.BlockPositions[block])
          }
          {...blockOpt}
        />
      );
      this.blocks.push(rf);
    }
    return blocks;
  }
}
