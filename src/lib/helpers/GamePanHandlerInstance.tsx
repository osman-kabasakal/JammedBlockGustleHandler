import {
  PanResponder,
  PanResponderCallbacks,
  Animated,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutAnimation,
  LayoutRectangle
} from "react-native";
import { BlockPosition } from "../../../types/DataTypes";
import BlockMembers from "./BlockMembers";
interface XYVal {
  x: number;
  y: number;
}
export interface GamePanHandlerInstanceCtorOpt {
  position: Animated.ValueXY;
  moveType: "horizantal" | "vertical";
  realOpt: { x: number; y: number };
  worlOpt: {
    parentRectangle: LayoutRectangle;
    step: {
      x: number;
      y: number;
    };
  };
  objRectangle: {
    width: number;
    height: number;
  };
  obje: BlockPosition;
  isJammed: boolean;
  blockMember: BlockMembers;
  finishCb:()=>void
}

interface Distance {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export default class GamePanHandlerInstance implements PanResponderCallbacks {
  position: Animated.ValueXY;
  _previousLeft: number;
  _previousTop: number;
  _isOut: boolean = false;
  _blockMemebers: BlockMembers;
  _ismove: boolean = false;
  _MaxMinDistance: Distance;
  _WorldMaxMinDistance: Distance;
  _isFinish:boolean=false;
  constructor(public opt: GamePanHandlerInstanceCtorOpt) {
    this.position = opt.position;
    this._previousLeft = opt.realOpt.x;
    this._previousTop = opt.realOpt.y;
    this._blockMemebers = opt.blockMember;
    this._blockMemebers.registerCell(
      {
        x: opt.obje.x * opt.worlOpt.step.x,
        y: opt.obje.y * opt.worlOpt.step.y
      },
      opt.obje
    );
    this.position.addListener(val => {
      this.opt.realOpt = val;
      if(this.opt.isJammed){
        let rightPos=this.opt.realOpt.x+this.opt.objRectangle.width;
        this._isFinish=rightPos>=(this.opt.worlOpt.parentRectangle.x+this.opt.worlOpt.parentRectangle.width-10)
        if(this._isFinish){
          this.opt.finishCb();
          return;
        }
      }
    });
    this._MaxMinDistance = {
      left: this.opt.worlOpt.parentRectangle.x,
      right:
        this.opt.worlOpt.parentRectangle.x +
        this.opt.worlOpt.parentRectangle.width,
      top: this.opt.worlOpt.parentRectangle.y,
      bottom:
        this.opt.worlOpt.parentRectangle.y +
        this.opt.worlOpt.parentRectangle.height
    };
    this._WorldMaxMinDistance = {
      left: this.opt.worlOpt.parentRectangle.x,
      right:
        this.opt.worlOpt.parentRectangle.x +
        this.opt.worlOpt.parentRectangle.width,
      top: this.opt.worlOpt.parentRectangle.y,
      bottom:
        this.opt.worlOpt.parentRectangle.y +
        this.opt.worlOpt.parentRectangle.height
    };
  }
  static create(opt: GamePanHandlerInstanceCtorOpt) {
    return PanResponder.create(new GamePanHandlerInstance(opt));
  }

  onStartShouldSetPanResponder = (evt, gesture) => {
    return !this._isFinish;
  };
  onMoveShouldSetPanResponder = (evt, gesture) => {
    return !this._isFinish;
  };
  onPanResponderStart: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => void = (e, gs) => {
    this._ismove = true;
    this._blockMemebers.emptyCurrentObj(
      { x: this._previousLeft, y: this._previousTop },
      this.opt.obje
    );
  };
  onPanResponderMove: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => void = (evt, gesture) => {
    this._isOut = false;
    let val = this.getMoveLength(gesture);
    let direction = this.getDirection(val);
    if (typeof direction.horDirection !== "undefined") {
      if (direction.horDirection === "left") {
        if (val.x >= this._MaxMinDistance.left) {
          this.position.setValue(val);
        } else {
          this._isOut = true;
          this.position.setValue({ x: this._MaxMinDistance.left, y: val.y });
        }
      } else {
        if (val.x <= this._MaxMinDistance.right) {
          this.position.setValue(val);
        } else {
          this._isOut = true;
          this.position.setValue({ x: this._MaxMinDistance.right, y: val.y });
        }
      }
    } else {
      if (direction.verDirectin === "up") {
        if (val.y >= this._MaxMinDistance.top) {
          this.position.setValue(val);
        } else {
          this._isOut = true;
          this.position.setValue({ x: val.x, y: this._MaxMinDistance.top });
        }
      } else {
        if (val.y <= this._MaxMinDistance.bottom) {
          this.position.setValue(val);
        } else {
          this._isOut = true;
          this.position.setValue({ x: val.x, y: this._MaxMinDistance.bottom });
        }
      }
    }
  };
  getMoveLength: (
    gesture: PanResponderGestureState
  ) => { x: number; y: number } = gesture => {
    let val = {
      x:
        this.opt.moveType === "horizantal"
          ? this._previousLeft + gesture.dx
          : this.opt.realOpt.x,
      y:
        this.opt.moveType === "horizantal"
          ? this.opt.realOpt.y
          : this._previousTop + gesture.dy
    };
    return val;
  };

  leftRightMaxDistance: (
    gesture: PanResponderGestureState
  ) => void = gesture => {
    Object.keys(this._WorldMaxMinDistance).forEach(key => {
      let eklenenDistance = 0;
      let control: boolean = false;
      this.yuvarla("floor");
      switch (key) {
        case "left":
          if (this.opt.obje.type === "vertical") break;
          do {
            let distanceLeftCtrl = this._previousLeft - eklenenDistance - 1;
            if (distanceLeftCtrl < 0) {
              control = false;
              break;
            }
            control = this._blockMemebers.isDragable(
              { x: distanceLeftCtrl, y: this._previousTop },
              this.opt.obje,
              { verDirectin: undefined, horDirection: "left" }
            );
            eklenenDistance += control ? this.opt.worlOpt.step.x : 0;
          } while (control);
          this._MaxMinDistance.left = this._previousLeft - eklenenDistance;
          break;
        case "right":
          if (this.opt.obje.type === "vertical") break;
          do {
            let distanceRightCtrl = this._previousLeft + eklenenDistance + 1;
            if (distanceRightCtrl > this._WorldMaxMinDistance.right) {
              control = false;
              break;
            }
            control = this._blockMemebers.isDragable(
              { x: distanceRightCtrl, y: this._previousTop },
              this.opt.obje,
              { verDirectin: undefined, horDirection: "right" }
            );
            eklenenDistance += control ? this.opt.worlOpt.step.x : 0;
          } while (control);
          this._MaxMinDistance.right = this._previousLeft + eklenenDistance;
          break;
        case "top":
          if (this.opt.obje.type === "horizantal") break;
          do {
            let distanceTopCtrl = this._previousTop - eklenenDistance - 1;
            if (distanceTopCtrl < 0) {
              control = false;
              break;
            }
            control = this._blockMemebers.isDragable(
              { x: this._previousLeft, y: distanceTopCtrl },
              this.opt.obje,
              { verDirectin: "up", horDirection: undefined }
            );
            eklenenDistance += control ? this.opt.worlOpt.step.x : 0;
          } while (control);
          this._MaxMinDistance.top = this._previousTop - eklenenDistance;
          this._MaxMinDistance.top = this.verticalYuvarla(
            this._MaxMinDistance.top,
            "ceil"
          );
          break;
        case "bottom":
          if (this.opt.obje.type === "horizantal") break;
          do {
            let distanceBotoomCtrl = this._previousTop + eklenenDistance + 1;
            if (distanceBotoomCtrl > this._WorldMaxMinDistance.bottom) {
              control = false;
              break;
            }
            control = this._blockMemebers.isDragable(
              { x: this._previousLeft, y: distanceBotoomCtrl },
              this.opt.obje,
              { verDirectin: "down", horDirection: undefined }
            );
            eklenenDistance += control ? this.opt.worlOpt.step.x : 0;
          } while (control);
          this._MaxMinDistance.bottom = this._previousTop + eklenenDistance;
          this._MaxMinDistance.bottom = this.verticalYuvarla(
            this._MaxMinDistance.bottom,
            "floor"
          );
          break;
      }
    });
  };

  getDirection: (val: {
    x: number;
    y: number;
  }) => {
    horDirection: "right" | "left";
    verDirectin: "up" | "down";
  } = val => {
    let horDirection: "right" | "left" =
      this._previousLeft < val.x
        ? "right"
        : this._previousLeft == val.x
        ? this.opt.moveType === "horizantal"
          ? "left"
          : undefined
        : "left";
    let verDirection: "up" | "down" =
      this._previousTop < val.y
        ? "down"
        : this._previousTop === val.y
        ? this.opt.moveType !== "horizantal"
          ? "up"
          : undefined
        : "up";

    return { horDirection: horDirection, verDirectin: verDirection };
  };
  onPanResponderGrant: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => void = (e, gs) => {
    this.leftRightMaxDistance(gs);
  };

  responderEnd = (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState
  ) => {
    if (!this._ismove) return;
    this._previousLeft = this.opt.realOpt.x;
    this._previousTop = this.opt.realOpt.y;
    this._isOut = this._isOut ? !this._isOut : this._isOut;
    this.yuvarla("round");
    this._blockMemebers.lockedObj(
      { x: this._previousLeft, y: this._previousTop },
      this.opt.obje
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.position.setValue({ x: this._previousLeft, y: this._previousTop });
  };
  onPanResponderRelease = this.responderEnd;
  onPanResponderTerminate = this.responderEnd;

  yuvarla: (type: "round" | "ceil" | "floor") => void = type => {
    if (this.opt.moveType === "horizantal") {
      this._previousLeft = this.horizantalYuvarla(this._previousLeft, type);
    } else {
      this._previousTop = this.verticalYuvarla(this._previousTop, type);
    }
  };

  horizantalYuvarla: (
    yuvarlanacakSayi: number,
    type: "round" | "ceil" | "floor"
  ) => number = (yuvarlanacakSayi, type) => {
    let yuvarlaFn =
      type === "ceil" ? Math.ceil : type === "floor" ? Math.floor : Math.round;
    let horStart = this.opt.worlOpt.parentRectangle.x;
    let round = yuvarlaFn(
      (yuvarlanacakSayi - horStart) / this.opt.worlOpt.step.x
    );
    yuvarlanacakSayi = round * this.opt.worlOpt.step.x;
    return yuvarlanacakSayi;
  };

  verticalYuvarla: (
    yuvarlanacakSayi: number,
    type: "round" | "ceil" | "floor"
  ) => number = (yuvarlanacakSayi, type) => {
    let yuvarlaFn =
      type === "ceil" ? Math.ceil : type === "floor" ? Math.floor : Math.round;
    let verStart = this.opt.worlOpt.parentRectangle.y;
    let round = yuvarlaFn(
      (yuvarlanacakSayi - verStart) / this.opt.worlOpt.step.y
    );
    yuvarlanacakSayi = round * this.opt.worlOpt.step.y;

    return yuvarlanacakSayi;
  };
}
