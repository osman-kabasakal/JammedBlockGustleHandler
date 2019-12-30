import React from "react";
import * as SecureStore from "expo-secure-store";
import { AdMobRewarded } from "expo-ads-admob";
import { Alert } from "react-native";
import { uid } from "./Guid";

interface RewardItem {
  getType(): String;

  getAmount(): any;
}

class NewGameClaim {
  AddedDateTime: number;
  Amount: any;

  constructor(amount) {
    this.AddedDateTime = Date.now();
    this.Amount = parseInt(amount + "");
  }
}

class RewardAdMob {
  isSucces: boolean = false;
  amount: any;
  SECURE_KEY = "claim_newGame";
  claimStatus: boolean = true;
  private static _instance: RewardAdMob = undefined;
  private subscribeList: { [key: string]: (val: boolean) => void } = {};
  claimActivateTime = 1000 * 60 * 10;
  claimLockedTime: number = undefined;
  claimListener = undefined;
  private constructor() {
    this.hasClaimNewGame();
    SecureStore.getItemAsync(this.SECURE_KEY)
      .then(val => {
        if (val === null || val === "") {
          this.setClaim();
        }
      })
      .catch(() => {
        this.setClaim();
      });
  }



  static GetInstance() {
    if (typeof this._instance === "undefined") {
      this._instance = new RewardAdMob();
    }

    return this._instance;
  }

  setClaimeStatus(val, claimObj: NewGameClaim) {
    this.claimLockedTime = claimObj.AddedDateTime;
    if (this.claimStatus === val) return;
    this.claimStatus = val;
    this.notifyAllSubscribed();
  }

  subscribeClaimStatus: (func: (val: boolean) => void) => string = func => {
    let id = uid();
    console.log("subsid", id);
    this.subscribeList[id] = func;
    func(this.claimStatus);
    this.hasClaimNewGame();
    return id;
  };

  removeSubscribe: (id: string) => void = id => {
    console.log("subs Siliniyor", id);
    if (Object.keys(this.subscribeList).indexOf(id) > -1)
      delete this.subscribeList[id];
  };

  private notifyAllSubscribed: () => void = () => {
    console.log("all subs count", Object.keys(this.subscribeList).length);
    for (let sub in this.subscribeList) {
      if (sub) {
        this.subscribeList[sub](this.claimStatus);
      }
    }
  };

  hasClaimNewGame = async (): Promise<boolean> => {
    let claim = await SecureStore.getItemAsync(this.SECURE_KEY);
    let claimObj: NewGameClaim = JSON.parse(claim);
    claimObj.AddedDateTime=Date.now();
    await SecureStore.setItemAsync(this.SECURE_KEY,JSON.stringify(claimObj));
    this.setClaimeStatus(claimObj.Amount > 0, claimObj);
    return this.claimStatus;
  };

  setThen = (obj: NewGameClaim) => {
    if (typeof this.claimListener !== "undefined")
      clearInterval(this.claimListener);
    this.claimListener = undefined;
    this.claimLockedTime = undefined;
    this.setClaimeStatus(true, obj);
  };

  setClaim = async () => {
    let obj = new NewGameClaim(2);
    await SecureStore.setItemAsync(this.SECURE_KEY, JSON.stringify(obj));
    this.setThen(obj);
  };

  rewardShow = async (callBack: (val: boolean, amount: number) => any) => {
    await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917");
    await AdMobRewarded.setTestDeviceID("EMULATOR29X3X2X0");
    AdMobRewarded.addEventListener(
      "rewardedVideoDidRewardUser",
      this.onRewarded
    );
    await AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
    await AdMobRewarded.showAdAsync();
    AdMobRewarded.removeAllListeners();
    return { succes: true, amount: this.amount };
  };

  onRewarded = (reward: RewardItem) => {
    console.log("reward", reward);
    this.amount = reward.getAmount();
    SecureStore.setItemAsync(
      this.SECURE_KEY,
      JSON.stringify(new NewGameClaim(reward.getAmount()))
    );
    this.isSucces = true;
  };

  async openNewGame(navigation, attr, elseRedirect: string) {
    if (!(await this.hasClaimNewGame())) {
      Alert.alert(
        "Yeni oyun hakkı",
        "Yeni oyun hakkınız yok!\nYeni oyun oynamak için reklam izlemek ister misiniz?",
        [
          {
            onPress: () => {
              RewardManager.rewardShow((val, amount) => {}).then(rsVal => {
                if (rsVal.succes) {
                  this.setClaim();
                  navigation.navigate("Game", attr);
                } else {
                  navigation.navigate(elseRedirect, attr);
                }
              });
            },
            text: "Evet"
          },
          {
            onPress: () => {},
            text: "Hayır"
          }
        ]
      );
      return;
    }
    this.claimDusur();
    navigation.navigate("Game", attr);
  }

  async claimDusur() {
    let claim = await SecureStore.getItemAsync(this.SECURE_KEY);
    let claimObj: NewGameClaim = JSON.parse(claim);
    claimObj.Amount -= 1;
    SecureStore.setItemAsync(this.SECURE_KEY, JSON.stringify(claimObj));
    this.hasClaimNewGame();
  }
}

var RewardManager = RewardAdMob.GetInstance();

export default RewardManager;
