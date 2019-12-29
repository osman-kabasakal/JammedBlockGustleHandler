import { StyleSheet } from "react-native";

const MainStyle = {
  Navigation: StyleSheet.create({
    headerStyle: {
      backgroundColor: "#2699FB",
      textAlign: "center"
    }
  }),
  Container: {
    AdMobContent: StyleSheet.create({
      top: {
        // flex: 1,
        // width: "100%",
        height: 50,
        padding: 0,
        margin: 0,
        backgroundColor: "black"
      },
      buttom: {
        // flex: 1,
        // width: "100%",
        height: 50,
        padding: 0,
        margin: 0,
        backgroundColor: "#6B6868",
        // bottom:0
      }
    }),
    Main: StyleSheet.create({
      main: {
        // display: "flex",
        flexDirection: "column",
        flex:1,
        justifyContent:"space-between",
        alignItems:"stretch"
      },
      content: {
        flex:1,
        // display: "flex",
        // flexWrap:"wrap",
        // height:"100%",
        padding:"3%",
        alignSelf: "stretch",
        justifyContent: "space-evenly",
        alignItems: "stretch",
        color:"white"
      }
    })
  }
};

export default MainStyle;
