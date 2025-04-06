import React from "react";
import LottieView from "lottie-react-native";
import { View } from "react-native";
import { DarkModeColors, DefaultModeColors } from "../../constants";

const SplashScreenComponent = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: DefaultModeColors.background }}>
      <LottieView
        source={require("../../../assets/animation.json")}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

export default SplashScreenComponent;
