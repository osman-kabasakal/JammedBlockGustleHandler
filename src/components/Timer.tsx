import React, { Component, useEffect } from "react";
import RewardManager from "../lib/helpers/RewardAdMod";
import { Button, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import { Directions } from "react-native-gesture-handler";

interface TimerProp {
  icon?: JSX.Element;
  reverse?: boolean;
  downVal?: number;
  startVal?: number;
  timeUpEvent?: () => void;
  timeFinishEvent?: () => void;
  evryTimeIncrementEvent?: (val: Date) => void;
  stop?: boolean;
  pause?: boolean;
  reset?: boolean;
  start?:boolean;
}

export default class Timer extends Component<TimerProp> {
  state = {
    text: ""
  };
  starterTime = new Date();
  intervalMem:number;

  interval = () => {
    let now = new Date();
    let gecenSure = now.getTime() - this.starterTime.getTime();
    if(this.props.evryTimeIncrementEvent){
        this.props.evryTimeIncrementEvent(new Date(gecenSure));
    }
    this.setState({ text: new Date(gecenSure).toLocaleTimeString() });
  };
private reverseCount:number=0;
reverseInterval=()=>{
    let time=new Date(this.starterTime.getTime()+this.props.downVal);
    let gecenSure=time.getTime() - Date.now();
    if(this.props.evryTimeIncrementEvent){
        this.props.evryTimeIncrementEvent(new Date(gecenSure));
    }
    this.setState({ text: new Date(gecenSure).toLocaleTimeString() });
    if(gecenSure<=0){
        clearInterval(this.intervalMem);
        this.finished();
        return;
    }
    this.reverseCount+=1;
}

private finished=()=>{
if(this.props.timeFinishEvent)
this.props.timeFinishEvent();
}

  constructor(props) {
    super(props);
    this.starterTime=new Date(this.props.startVal??Date.now());
  }

  componentDidMount() {
    this.intervalMem = setInterval(this.props.reverse&&this.props.downVal?this.reverseInterval:this.interval, 1000);
  }

  componentDidUpdate(){
      if(typeof this.intervalMem !=="undefined"){
        if(this.props.pause){
            clearInterval(this.intervalMem);
            this.intervalMem=undefined;
            return;
        }
        if(this.props.stop){
            clearInterval(this.intervalMem);
            this.intervalMem=undefined;
            this.finished();
            return;
        }
        if(this.props.reset){
            this.starterTime=new Date(this.props.startVal??Date.now());
            this.reverseCount=0;
        }
      }else{
          if(this.props.start){
              if(this.props.reset){
                this.starterTime=new Date(this.props.startVal??Date.now());
                this.reverseCount=0;
              }
              this.intervalMem = setInterval(this.props.reverse&&this.props.downVal?this.reverseInterval:this.interval, 1000);
          }
      }
      
  }

  componentWillUnmount() {
    console.log("clear time");
    clearInterval(this.intervalMem);
    this.intervalMem=undefined;
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignContent: "stretch"
        }}
      >
        <Text>{this.state.text}</Text>
        {this.props.icon ? (
          this.props.icon
        ) : (
          <Icon size={16} color="white" name="timer" />
        )}
      </View>
    );
  }
}
