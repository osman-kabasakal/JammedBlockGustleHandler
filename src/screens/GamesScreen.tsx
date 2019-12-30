import React from "react";
import MainLayout from "../components/MainLayout";
import { NavigationStackOptions } from "react-navigation-stack";
import { Oyunlar } from "../lib/datas/SeviyelereGoreOyunlar";
import { Text, Card, Image } from "react-native-elements";
import { SafeAreaView, ScrollView } from "react-navigation";
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  GestureResponderEvent,
  Alert
} from "react-native";
import { OyunData } from "../../types/DataTypes";

export default class GamesScreen extends MainLayout {
  static navigationOptions: NavigationStackOptions = {...MainLayout.navigationOptions,
    title: "Oynun Seçimi"
  };
  content: () => JSX.Element | JSX.Element[] = () => {
    const { navigation } = this.props;
    var id = navigation.getParam("id", "id yok");
    if (id in Oyunlar) {
      return (
        <SafeAreaView>
          <ScrollView
            style={{
              height: "100%"
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-around",
                flexWrap: "wrap"
              }}
            >
              {this.renderOyun(Oyunlar[id] as OyunData[], id)}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
    return (
      <>
        <Text>Oyun yok {id}</Text>
      </>
    );
  };
  renderOyun(oyunlar: OyunData[], id: string): JSX.Element | JSX.Element[] {
    var oyunlarElem: JSX.Element[] = [];
    for (let oyun of oyunlar) {
      oyunlarElem.push(
        <Card
          key={id + oyunlar.indexOf(oyun)}
          containerStyle={{
            margin: 2,
            width: "45%"
          }}
        >
          <TouchableOpacity
            onPress={(event: GestureResponderEvent) => {
              this.revardAdMob.openNewGame(
                   this.props.navigation, {
                      id: id,
                      index: oyunlar.indexOf(oyun)
                  },"Games");
            }}
          >
            <Image
              source={oyun.screen}
              style={{ height: 100 }}
              PlaceholderContent={<ActivityIndicator />}
            />
          </TouchableOpacity>
        </Card>
      );
    }
    return oyunlarElem;
  }
}
