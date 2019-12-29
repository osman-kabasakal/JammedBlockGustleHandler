import React from "react";
import * as SecureStore from "expo-secure-store";
import { AdMobRewarded } from "expo-ads-admob";
import { Alert } from "react-native";

interface RewardItem{
    getType():String;

    getAmount():any;
}

class NewGameClaim{
    AddedDateTime:string;
    Amount:any;

    constructor(amount){
        this.AddedDateTime=Date.now().toLocaleString();
        this.Amount=parseInt(amount+"");
    }
}
 class RewardAdMob{
    rewardCb:(val:boolean,amount:number)=>any;
    isSucces:boolean=false;
    amount:any;
    SECURE_KEY="claim_newGame";
    constructor(){
        SecureStore.getItemAsync(this.SECURE_KEY).then((val)=>{
            if(val===null || val===""){
                this.setClaim();
            }
        }).catch(()=>{
            this.setClaim();
        });
    }

    claimListener=undefined;

    hasClaimNewGame=async():Promise<boolean>=>{
        let claim="";
        try {
            claim=await SecureStore.getItemAsync(this.SECURE_KEY);
            console.log("claim",claim);
        } catch (error) {
            console.log("error",error);
            await this.setClaim();
            claim=await SecureStore.getItemAsync(this.SECURE_KEY);
        }
        if(typeof claim !==null&& claim!==""){
            let claimObj:NewGameClaim=JSON.parse(claim);
            return claimObj.Amount>0;
        }else{
            await this.setClaim();
            claim=await SecureStore.getItemAsync(this.SECURE_KEY);
        }
        let claimObj:NewGameClaim=JSON.parse(claim);
        return claimObj.Amount>0&&(new Date(claimObj.AddedDateTime).getMinutes())-new Date(Date.now()).getMinutes()<=0.1;
    }

    setClaim=async()=>{
        await SecureStore.setItemAsync(this.SECURE_KEY,JSON.stringify(new NewGameClaim(2)));
        if(typeof this.claimListener !=="undefined")
            clearInterval(this.claimListener);
            this.claimListener=undefined;
    }

    rewardShow= async(callBack:(val:boolean,amount:number)=>any)=>{
        await AdMobRewarded.setAdUnitID("ca-app-pub-3940256099942544/5224354917");
        await AdMobRewarded.setTestDeviceID("EMULATOR29X3X2X0");
         AdMobRewarded.addEventListener("rewardedVideoDidRewardUser",this.onRewarded);
        //  AdMobRewarded.addEventListener("",this.onRewarded);
        await AdMobRewarded.requestAdAsync({servePersonalizedAds:true});
        await AdMobRewarded.showAdAsync();
        AdMobRewarded.removeAllListeners();
        return {succes:true,amount:this.amount}
    }

    onRewarded=(reward:RewardItem)=>{
        console.log("reward",reward);
        this.amount=reward.getAmount();
        SecureStore.setItemAsync(this.SECURE_KEY,JSON.stringify(new NewGameClaim(reward.getAmount())));
        this.isSucces=true;
        // this.rewardCb(true,parseInt(reward.getAmount()+""));
    }

    async openNewGame(navigation,attr,elseRedirect:string){
        if (!await this.hasClaimNewGame()) {
            if(typeof this.claimListener==="undefined"){
                this.claimListener=setInterval(()=>{
                    this.setClaim();
                },1000*10);
            }
                Alert.alert(
                  "Yeni oyun hakkı",
                  "Yeni oyun hakkınız yok!\nYeni oyun oynamak için reklam izlemek ister misiniz?",
                  [
                    {
                      onPress: () => {
                        RewardManager.rewardShow((val, amount) => {
                          
                        }).then((rsVal)=>{
                            if(rsVal.succes){
                                this.setClaim();
                                navigation.navigate("Game",attr);
                            }else{
                                navigation.navigate(elseRedirect,attr);
                            }
                        });
                      },
                      text: "Evet"
                    },
                    {
                        onPress:()=>{
                            // navigation.navigate(elseRedirect,attr);
                        },
                        text:"Hayır"
                    }
                  ]
                );
                return;
              }
              this.claimDusur();
              navigation.navigate("Game",attr);
        
    }

    async claimDusur(){
        let claim=await SecureStore.getItemAsync(this.SECURE_KEY);
        let claimObj:NewGameClaim=JSON.parse(claim);
        claimObj.Amount-=1;
        SecureStore.setItemAsync(this.SECURE_KEY,JSON.stringify(claimObj));
    }
}

let RewardManager=new RewardAdMob();

export default RewardManager;