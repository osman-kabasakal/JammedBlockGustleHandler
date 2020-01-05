import React from "react";
import { LayoutRectangle } from "react-native";
import { BlockPosition } from "../../../types/DataTypes";
import Observable from "./Observables";

interface BlockMember {
  cells: Observable<Array<Array<boolean>>>;
}

interface WorldOpt {
  parentRectangle: LayoutRectangle;
  step: {
    x: number;
    y: number;
  };
}
interface Direction {
  horDirection: "right" | "left" | undefined;
  verDirectin: "up" | "down" | undefined;
}
export default class BlockMembers implements BlockMember {
  private static _instance: BlockMembers;
  private _opt: WorldOpt;
  constructor(opt: WorldOpt) {
    this._opt = opt;
    this.cells = Observable.create(Array<boolean[]>(6).fill([]).map(xp=>Array<boolean>(6).fill(true).map(x=>Boolean(true))));
  }
  cells: Observable<Array<Array<boolean>>>;

  static getInstance(worldOpt: WorldOpt) {
    if (typeof this._instance ==="undefined") {
        this._instance = new BlockMembers(worldOpt);
    }
    return this._instance;
  }

  isDragable: (
    position: { x: number; y: number },
    obj: BlockPosition,
    direction: Direction
  ) => boolean = (position, obj, direction) => {
    
    if (typeof direction.verDirectin === "undefined") {
      const {x,y}=this.getCellObj(position,obj,direction.horDirection === "left");
      if (direction.horDirection === "left") {
          let verFloor=x-1;
          if(verFloor<0)
            return false;
        return this.cells.get()[y][verFloor];
      }
      let verFloor=x+obj.length
      if(verFloor>5)
      return false;
      return this.cells.get()[y][verFloor];
    }
    const {x,y}=this.getCellObj(position,obj,direction.verDirectin==="up");
    if(direction.verDirectin==="up"){
        let yAxis=y-1;
        if(yAxis<0)
        return false;
        return this.cells.get()[yAxis][x];
    }else{
        let yAxis=y+obj.length;
        if(yAxis>5)
        return false;
        return this.cells.get()[yAxis][x];
    }
  };

  registerCell:(position: { x: number; y: number },
    obj: BlockPosition)=>void=(position,obj)=>{
        this.objeSet(position,obj,false);
  }

  objeSet:(position: { x: number; y: number },
    obj: BlockPosition,setVal:boolean,toCeil?:boolean)=>void=(position,obj,setVal,toCeil=false)=>{
      let cell=this.getCellObj(position,obj,toCeil);
      const {x,y}=cell;
        if(obj.type==="horizantal"){
            for(let i=0;i<obj.length;i++){
                let xStep=x+i>5?5:x+i;
                let yStep=y;
                let arr=Array.from(this.cells.get())
                arr[yStep][xStep]=setVal;
                this.cells.set(arr);
            }
        }else{
            for(let hori=0;hori<obj.length;hori++){
                let xStep=x;
                let yStep=y+hori>5?5:y+hori;
                let arr=Array.from(this.cells.get())
                arr[yStep][xStep]=setVal;
                this.cells.set(arr);
            }
        }
    }

  emptyCurrentObj:(position: { x: number; y: number },
    obj: BlockPosition)=>void=(position,obj)=>{
        this.objeSet(position,obj,true);
  }

  lockedObj:(position: { x: number; y: number },
    obj: BlockPosition)=>void=(position,obj)=>{
        this.objeSet(position,obj,false);
  }

  getCellObj:(position: { x: number; y: number },
    obj: BlockPosition,topOver?:boolean)=>{x:number,y:number}=(position,obj,topOver=false)=>{
    let horStart = this._opt.parentRectangle.x;
    let verStart = this._opt.parentRectangle.y;
    let xStep = topOver?Math.ceil((position.x - horStart) / this._opt.step.x): Math.floor((position.x - horStart) / this._opt.step.x);
    let yStep = topOver?Math.ceil((position.y - verStart) / this._opt.step.y): Math.floor((position.y - verStart) / this._opt.step.y);
    return {x:xStep,y:yStep};
  }

  control:()=>void=()=>{
    
  }
}
