import React from "react";
import Svg, { Mask, Rect, Path, G } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
}

const ArrowUp: React.FC<SvgComponentProps> = ({
  width = "24",
  height = "24",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24">
    <Mask id="mask0_161_3340" x="0" y="0" width="24" height="24">
      <Rect width="24" height="24" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_161_3340)">
      <Path
        d="M12 15L7 10H17L12 15Z"
        fill="#7D7D7D" // Puedes cambiar el color aquí si es necesario
      />
    </G>
  </Svg>
);

export default ArrowUp;
