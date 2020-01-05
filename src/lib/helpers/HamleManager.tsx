import React from "react";
import Block from "./CreateBlock";
import BlockMembers from "./BlockMembers";
import { RefObject } from "react";
import { AnimatedValue } from "react-navigation";
import Observable from "./Observables";
import GamePanHandlerInstance, { GamePanHandlerInstanceCtorOpt } from "./GamePanHandlerInstance";

export interface Hamle {
  [key: string]: { x: number; y: number };
}

export interface IHamleManager {
  blocks: Array<React.RefObject<Block>>;
  blockMembers: BlockMembers;
  hamleler: Array<Hamle>;
  blocksOfStarterPosition: Hamle;
}

export interface HamleManagerCtorOpt {
  blocks: Array<React.RefObject<Block>>;
  blockMembers: BlockMembers;
}

class PanListener {
  relasePosition: Observable<{ x: number; y: number }>;
  panStartPosition: { x: number; y: number };
  panEndPosition: { x: number; y: number };
  lastHamle: Observable<Hamle>;
  _panOpt:GamePanHandlerInstanceCtorOpt;
  _gamePanHandler:GamePanHandlerInstance;
  constructor(public block: React.RefObject<Block>) {
      this._panOpt=block.current._panOpt;
      this._gamePanHandler=block.current._gamePanHandler;
    let members = this._panOpt.blockMember;
    let pos = {
      x: this._panOpt.obje.x*this._panOpt.worlOpt.step.x,
      y: this._panOpt.obje.y*this._panOpt.worlOpt.step.y
    };
    let cellCoordinate = members.getCellObj(
      pos,
      this._panOpt.obje,
      this._panOpt.obje.type==="horizantal"
    );
    this.relasePosition=Observable.create(cellCoordinate);
    this.relasePosition.subscribe(this.panHamleSetter);
    let hamle:Hamle={}
    hamle[this._panOpt.obje.id]=this.relasePosition.get()
    this.lastHamle=Observable.create({});
    this._gamePanHandler._panStart.subscribe(this.panStart);
    this._gamePanHandler._panEnd.subscribe(this.panEnd);
    /**
     * block nesnesinde panhandler propertiesinde
     * kayıt olunacak
     * release position blockdan set edilecek cell koordinatı şeklinde
     */
  }

  panHamleSetter=(newval:{x:number,y:number},olVal:{x:number,y:number})=>{
      let hamle=this.lastHamle.get();
      hamle[this._panOpt.obje.id]=newval;
      this.lastHamle.set(hamle);
  }

  panStart = (newVal: boolean, oldVal: boolean) => {
    let members = this._panOpt.blockMember;
    let pos = {
      x: this._gamePanHandler._previousLeft,
      y: this._gamePanHandler._previousTop
    };
    let cellCoordinate = members.getCellObj(
      pos,
      this._panOpt.obje,
      false
    );
    this.panStartPosition=cellCoordinate;
  };

  panEnd = (newVal: boolean, oldVal: boolean) => {
    let members = this._panOpt.blockMember;
    let pos = {
      x: this._gamePanHandler._previousLeft,
      y: this._gamePanHandler._previousTop
    };
    let cellCoordinate = members.getCellObj(
      pos,
      this._panOpt.obje,
      false
    );
    this.panEndPosition=cellCoordinate;
    if(JSON.stringify(this.panStartPosition)!==JSON.stringify(this.panEndPosition)){
        this.relasePosition.set(this.panEndPosition);
    }
  };
}

export default class HamleManager implements IHamleManager {
  blocks: React.RefObject<Block>[];
  blockMembers: BlockMembers;
  hamleler: Hamle[] = [];
  panListeners: PanListener[] = [];
  constructor(opt: HamleManagerCtorOpt) {
    this.blocks = opt.blocks;
    this.blockMembers = opt.blockMembers;
    this.hamleler = [];
    let startPos: Hamle = {};
    opt.blocks.forEach(val => {
      let l = new PanListener(val);
      l.lastHamle.subscribe(this.panRelaseSubscribe);
      startPos[val.current.props.objeOpt.id] = l.relasePosition.get();
      this.panListeners.push(l);
    });
    this.hamleler.push(startPos);
    this.blocksOfStarterPosition=startPos;
    /**
     * her block için pan listener newlenecek
     * newlenen pan listenerların panrelase propuna abona olunacak.
     * ve başlangıç hamleleri panrelasinden alınacak.
     */
  }
  blocksOfStarterPosition: Hamle;

  panRelaseSubscribe = (newVal: Hamle, oldVal: Hamle) => {
    let hamleler = JSON.parse(JSON.stringify(Object.assign(
      {},
      this.hamleler[this.hamleler.length - 1],
      newVal
    )));
    this.hamleler.push(hamleler);
    /**
     * blockların panlistenerından gelen hamleler işlenecek
     */
  };
}
