import React, { Component } from "react";
import { NavigationStackOptions } from "react-navigation-stack";
import { SafeAreaView, ScrollView } from "react-navigation";
import { View, TouchableOpacity, TouchableHighlight } from "react-native";
import MainLayout from "../components/MainLayout";

import { Card, Image, Divider, Text } from "react-native-elements";
import { Seviyeler } from "../lib/datas/SeviyeData";

export default class HomeScreen extends MainLayout {
  static navigationOptions: NavigationStackOptions = {...MainLayout.navigationOptions,
    title: "Sıkışan Blok"
  };

  constructor(props) {
    super(props);
  }

  content = (): JSX.Element | JSX.Element[] => {
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
            {Seviyeler.map((seviye, seviyeIndex) => {
              return (
                <Card
                  key={seviye.id}
                  containerStyle={{
                    margin: 2,
                    width: "45%"
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      let id = seviye.id;
                      this.props.navigation.navigate("Games", { id: id });
                    }}
                  >
                    <Image
                      source={seviye.image}
                      style={{ height: 100, width: "100%" }}
                      resizeMode="stretch"
                    />
                    <Text style={{ color: "#7F7F7F" }} h3>
                      {seviye.title}
                    </Text>
                    <Divider />
                    <Text
                      style={{
                        color: "#CCCCCC",
                        fontSize: 13
                      }}
                    >
                      {seviye.description}
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
}
