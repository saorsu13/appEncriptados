import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface CustomSvgProps {
  width?: number | string;
  height?: number | string;
  fillRect?: string;
  fillPath?: string;
}

const FilterSound: React.FC<CustomSvgProps> = ({
  width = 38,
  height = 38,
  fillRect = "#0F4457",
  fillPath = "#E3F8FF",
}) => (
  <Svg width={width} height={height} viewBox="0 0 38 38">
    <Rect width={38} height={38} rx={8} fill={fillRect} />
    <Path
      d="M14 25V13H16V25H14ZM18 29V9H20V29H18ZM10 21V17H12V21H10ZM22 25V13H24V25H22ZM26 21V17H28V21H26Z"
      fill={fillPath}
    />
  </Svg>
);

export default FilterSound;
