import React from "react";
import Svg, { Defs, ClipPath, Rect, G, Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  color?: string
}

const Close: React.FC<SvgComponentProps> = ({
  width = "22",
  height = "22",
  color = "#DDDDDD"
}) => (
  <Svg width={width} height={height} viewBox="0 0 22 22">
    <Defs>
      <ClipPath id="clip0_41_10649">
        <Rect width="22" height="22" fill="white" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip0_41_10649)">
      <Path
        d="M17.7712 5.2713L16.7295 4.22958C16.6369 4.13698 16.5443 4.13698 16.4517 4.22958L11 9.68125L5.82653 4.50778C5.73393 4.41518 5.64134 4.41518 5.54874 4.50778L4.50702 5.5495C4.41442 5.6421 4.41442 5.7347 4.50702 5.82729L9.68049 11.0008L4.22882 16.4524C4.13622 16.545 4.13622 16.6376 4.22882 16.7302L5.27054 17.7719C5.36314 17.8645 5.45573 17.8645 5.54833 17.7719L11 12.3203L16.1743 17.4946C16.2669 17.5872 16.3595 17.5872 16.4521 17.4946L17.4938 16.4528C17.5864 16.3602 17.5864 16.2676 17.4938 16.175L12.3195 11.0008L17.7712 5.54909C17.8638 5.4565 17.8638 5.3639 17.7712 5.2713Z"
        fill={color} // Puedes cambiar el color aquí si es necesario
      />
    </G>
  </Svg>
);

export default Close;
