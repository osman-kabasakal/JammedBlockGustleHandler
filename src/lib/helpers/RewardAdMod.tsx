import React from "react";
import * as SecureStore from "expo-secure-store";
import { AdMobRewarded } from "expo-ads-admob";
import { Alert } from "react-native";
import { uid } from "./Guid";
import Observable from "./Observables";

interface RewardItem {
  amount: number;
  type: string;
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
  get amount(): number {
    return this.CLAIM_COUNT;
  }

  set amount(value) {
    this.CLAIM_COUNT = value;
  }
  SECURE_KEY = "claim_newGame";
  CLAIM_COUNT = 2;
  claimStatus = Observable.create(true);
  private static _instance: RewardAdMob = undefined;
  claimActivateTime = 1000 * 60 * 5;
  claimLockedTime: number = undefined;
  claimListener = undefined;
  private videoIsLoaded: Observable<boolean> = Observable.create(undefined);
  private isVideoClose: Observable<boolean> = Observable.create(undefined);
  rewardIsActive: Observable<boolean> = Observable.create(false);
  private constructor() {
    this.applicationStart();
  }

  applicationStart() {
    SecureStore.getItemAsync(this.SECURE_KEY).then(claim => {
      if (claim === null) {
        this.setClaim();
        SecureStore.getItemAsync(this.SECURE_KEY).then(cl => {
          this.applicationStartTasks(cl);
        });
        return;
      }
      this.applicationStartTasks(claim);
    });
  }

  private applicationStartTasks(claim: string) {
    let claimObj: NewGameClaim = JSON.parse(claim);
    this.claimLockedTime = claimObj.AddedDateTime;
    this.setClaimeStatus();
    this.videoIsLoaded.subscribe(val => {
      if (!val) {
        this.rewardStart();
      }
    });
    this.videoIsLoaded.set(false);
    this.isVideoClose.subscribe(val => {
      if (val) {
        AdMobRewarded.removeAllListeners();
        this.isVideoClose.set(undefined);
      }
    });

    this.claimStatus.subscribe(val => {
      if (val) {
        this.rewardIsActive.set(false);
      }
    });
  }

  static GetInstance() {
    if (typeof this._instance === "undefined") {
      this._instance = new RewardAdMob();
    }

    return this._instance;
  }

  setClaimeStatus() {
    SecureStore.getItemAsync(this.SECURE_KEY).then(claim => {
      let claimObj: NewGameClaim = JSON.parse(claim);
      if (Date.now() - claimObj.AddedDateTime >= this.claimActivateTime) {
        this.setClaim();
        SecureStore.getItemAsync(this.SECURE_KEY).then(cl => {
          claimObj = JSON.parse(claim);
          this.claimLockedTime = claimObj.AddedDateTime;
          this.claimStatus.set(claimObj.Amount > 0);
        });
        return;
      }
      this.claimLockedTime = claimObj.AddedDateTime;
      this.claimStatus.set(claimObj.Amount > 0);
    });
  }

  setThen = () => {
    if (typeof this.claimListener !== "undefined")
      clearInterval(this.claimListener);
    this.claimListener = undefined;
    this.claimLockedTime = undefined;
    this.setClaimeStatus();
  };

  setClaim = () => {
    let am =
      typeof this.amount === "undefined" ? this.CLAIM_COUNT : this.amount;
    let obj = new NewGameClaim(am);
    SecureStore.setItemAsync(this.SECURE_KEY, JSON.stringify(obj)).then(() => {
      this.setThen();
    });
  };

  rewardStart = () => {
    AdMobRewarded.removeAllListeners();

    AdMobRewarded.addEventListener(
      "rewardedVideoDidRewardUser",
      this.onRewarded
    );

    AdMobRewarded.addEventListener("rewardedVideoDidLoad", () => {
      this.videoIsLoaded.set(true);
    });

    AdMobRewarded.addEventListener("rewardedVideoDidOpen", () => {});

    AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {
      this.setClaim();
      AdMobRewarded.removeAllListeners();
      this.isVideoClose.set(true);
      this.videoIsLoaded.set(false);
    });

    AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917").then(
      () => {
        if (!this.videoIsLoaded.get()) {
          AdMobRewarded.requestAdAsync({ servePersonalizedAds: true });
        }
      }
    );
  };

  rewardShow = (callBack: (val: boolean) => any) => {
    // await this.rewardStart();
    this.rewardIsActive.set(true);
    if (!this.videoIsLoaded.get()) {
      this.rewardStart();
    }
    let cbSubber = this.claimStatus.subscribe((val, prevVal) => {
      if (val) {
        callBack(val);
      }
      this.claimStatus.removeSubscribe(cbSubber);
    });

    AdMobRewarded.showAdAsync().then(() => {
      // AdMobRewarded.removeAllListeners();
      // this.claimStatus.removeSubscribe(cbSubber);
    });
  };

  onRewarded = (reward: RewardItem) => {
    this.amount = reward.amount;
    this.isSucces = true;
  };

  openNewGame(navigation, attr, elseRedirect: string) {
    if (!this.claimStatus.get()) {
      Alert.alert(
        "Yeni oyun hakkı",
        "Yeni oyun hakkınız yok!\nYeni oyun oynamak için reklam izlemek ister misiniz?",
        [
          {
            onPress: () => {
              RewardManager.rewardShow(val => {
                if (val) {
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

  claimDusur() {
    SecureStore.getItemAsync(this.SECURE_KEY).then(claim => {
      let claimObj: NewGameClaim = JSON.parse(claim);
      claimObj.Amount -= 1;
      SecureStore.setItemAsync(this.SECURE_KEY, JSON.stringify(claimObj)).then(
        () => {
          this.setClaimeStatus();
        }
      );
    });
  }
}

var RewardManager = RewardAdMob.GetInstance();

export default RewardManager;
