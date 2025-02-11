import React from "react";
import Svg, { Mask, Rect, Path, G } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
}

const ArrowDown: React.FC<SvgComponentProps> = ({
  width = "24",
  height = "24",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Mask id="mask0_161_3321" x="0" y="0" width="24" height="24">
      <Rect
        width="24"
        height="24"
        transform="matrix(1 0 0 -1 0 24)"
        fill="#D9D9D9"
      />
    </Mask>
    <G mask="url(#mask0_161_3321)">
      <Path d="M12 9L7 14H17L12 9Z" fill="#7D7D7D" />
    </G>
  </Svg>
);

export default ArrowDown;
