import React from "react";
import Svg, { Path } from "react-native-svg";

interface CustomSvgProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  color?: string;
}

const FilterSoundLight: React.FC<CustomSvgProps> = ({
  width = 26,
  height = 30,
  color,
  fill = "#10B4E7",
}) => (
  <Svg width={width} height={height} viewBox="0 0 26 30">
    <Path
      d="M5.91667 23.4997V6.49967H8.75V23.4997H5.91667ZM11.5833 29.1663V0.833008H14.4167V29.1663H11.5833ZM0.25 17.833V12.1663H3.08333V17.833H0.25ZM17.25 23.4997V6.49967H20.0833V23.4997H17.25ZM22.9167 17.833V12.1663H25.75V17.833H22.9167Z"
      fill={color || fill}
    />
  </Svg>
);

export default FilterSoundLight;
