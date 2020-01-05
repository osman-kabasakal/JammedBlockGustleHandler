import React from "react";
import { uid } from "./Guid";

export default class  Observable<T> {
  private constructor(val:T=undefined) {
    this.propVal=val;
    this.PrevVal=val;
  }
  private propVal: T = undefined;
  private PrevVal: T = undefined;
  private PropId = uid();
  private subscriberList: { [key: string]: (val: T, prevVal: T) => void } = {};

  get(){
      return this.propVal;
  }

  set(val:T){
      this[this.PropId]=val;
      this.notifySubscriber();
  }

  static create<T>(val: T): Observable<T> {
      let _this=new Observable(val);
      return Object.defineProperty(_this, _this.PropId, {
        get(): T {
          return _this.propVal;
        },
        set(val: T) {
          _this.PrevVal = this.propVal;
          _this.propVal = val;
        }
      });
     
  }

  notifySubscriber() {
    for (let sub in this.subscriberList) {
        if (sub) {
          this.subscriberList[sub](this.propVal,this.PrevVal);
        }
      }
  }

  subscribe(cb: (val: T, prevVal: T) => void) {
    let subscribeId = uid();
    this.subscriberList[subscribeId] = cb;
    // this.subscriberList[subscribeId](this.propVal,this.PrevVal);
    return subscribeId;
  }

  removeSubscribe(id: string) {
    delete this.subscriberList[id];
  }

  removeAllSubscribe() {
    this.subscriberList = {};
  }

  subscribeCount() {
    return Object.keys(this.subscriberList).length;
  }
}
