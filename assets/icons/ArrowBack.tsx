import React from "react";
import Svg, { Mask, Rect, Path, G } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
}

const SvgComponent: React.FC<SvgComponentProps> = ({ width, height }) => (
  <Svg width={width} height={height} viewBox="0 0 22 22">
    <Mask id="mask0_112_2141" x="0" y="0" width="22" height="22">
      <Rect width="22" height="22" fill="#D9D9D9" />
    </Mask>
    <G mask="url(#mask0_112_2141)">
      <Path
        d="M14.6667 20.1668L5.5 11.0002L14.6667 1.8335L16.2938 3.46058L8.75417 11.0002L16.2938 18.5397L14.6667 20.1668Z"
        fill="#E6E6E6"
      />
    </G>
  </Svg>
);

export default SvgComponent;
