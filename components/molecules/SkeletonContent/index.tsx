import { View } from "react-native";

type props = {};

const SkeletonContent = ({ containerStyle, layout = [], boneColor }) => {
  return (
    <View style={{ ...containerStyle }}>
      {layout.map((item, index) => (
        <View
          key={index}
          style={{ ...item, backgroundColor: boneColor }}
        ></View>
      ))}
    </View>
  );
};

export default SkeletonContent;
