import React from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { DefaultModeColors, DarkModeColors } from "../../constants";

interface CustomSliderProps {
  label: string;
  value: number;
  minimumValue: number;
  maximumValue: number;
  step: number;
  onValueChange: (value: number) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  label,
  value,
  minimumValue,
  maximumValue,
  step,
  onValueChange,
}) => {
  return (
    <View>
      <Text style={{ color: DefaultModeColors.text }}>{label}</Text>
      <Slider
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={DefaultModeColors.accent}
        maximumTrackTintColor={DefaultModeColors.border}
        thumbTintColor={DefaultModeColors.accent}
      />
    </View>
  );
};

export default CustomSlider;
