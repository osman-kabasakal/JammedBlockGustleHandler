import React, { Component } from "react";
import {
  LayoutRectangle,
  Animated,
  PanResponderInstance,
  PanResponder,
  UIManager,
  LayoutAnimation,
  View
} from "react-native";
import { BlockPosition } from "../../../types/DataTypes";
import GamePanHandlerInstance, {
  GamePanHandlerInstanceCtorOpt
} from "./GamePanHandlerInstance";
import BlockMembers from "./BlockMembers";

export interface BlockProps {
  objeOpt: BlockPosition;
  worldOpt: {
    parentRectangle: LayoutRectangle;
    step: {
      x: number;
      y: number;
    };
  };
  isJammed: boolean;
  jammedLength: number;
  blockMember:BlockMembers;
  finishCb:()=>void
}

export default class Block extends Component<BlockProps> {
  position: Animated.ValueXY;
  _panResponder: PanResponderInstance;
  _panOpt: GamePanHandlerInstanceCtorOpt;
  _listener: string;
  _objeRectangle: {
    width: number;
    height: number;
  };
  constructor(props) {
    super(props);

    const {
      worldOpt: { step },
      worldOpt,
      objeOpt
    } = this.props;
    this.position = new Animated.ValueXY();
    let val = {
      x: objeOpt.x * step.x,
      y: objeOpt.y * step.y
    };
    this.position.setValue(val);
    this._objeRectangle = {
      height: objeOpt.type === "vertical" ? step.y * objeOpt.length : step.y,
      width: objeOpt.type === "horizantal" ? step.x * objeOpt.length : step.x
    };
    this._panOpt = {
      position: this.position,
      moveType: objeOpt.type,
      realOpt: val,
      worlOpt: worldOpt,
      objRectangle: this._objeRectangle,
      obje:this.props.objeOpt,
      isJammed:this.props.isJammed,
      blockMember:this.props.blockMember,
      finishCb:this.props.finishCb
    };
    this._panResponder = GamePanHandlerInstance.create(this._panOpt);
    
  }

  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUnmount() {}

  render() {
    const {
      worldOpt: { step },
      objeOpt
    } = this.props;
    const { left, top } = this.position.getLayout();
    return (
      <Animated.View
        style={[
          { ...{ transform: this.position.getTranslateTransform() } },
          {
            ...{
              width: this._objeRectangle.width,
              height: this._objeRectangle.height,
              backgroundColor: this.props.isJammed ? "#FF690F" : "#37FF3D",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "black",
              position: "absolute"
            }
          }
        ]}
        {...this._panResponder.panHandlers}

      
      ></Animated.View>
    );
  }
}
