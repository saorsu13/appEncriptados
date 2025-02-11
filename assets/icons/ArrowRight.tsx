import React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  color?: string; // Agregamos un prop opcional para el color
}

const ArrowRight: React.FC<SvgComponentProps> = ({
  width = 7,
  height = 11,
  color = "#10B4E7", // Color por defecto
}) => (
  <Svg width={width} height={height} viewBox="0 0 7 11" fill="none">
    <Path
      d="M1.51238 10.502L0.624878 9.61445L4.73738 5.50195L0.624878 1.38945L1.51238 0.501953L6.51238 5.50195L1.51238 10.502Z"
      fill={color} // Usamos el color pasado como prop
    />
  </Svg>
);

export default ArrowRight;
