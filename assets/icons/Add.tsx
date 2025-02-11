import React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
}

const Add: React.FC<SvgComponentProps> = ({ width = "14", height = "14" }) => (
  <Svg width={width} height={height} viewBox="0 0 14 14">
    <Path
      d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z"
      fill="#FFFFFF" // Cambia el color aquí si es necesario
    />
  </Svg>
);

export default Add;
