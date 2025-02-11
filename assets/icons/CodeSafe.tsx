import React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const CodeSafe: React.FC<SvgComponentProps> = ({
  width = 36,
  height = 36,
  color = "#10B4E7",
}) => (
  <Svg width={width} height={height} viewBox="0 0 36 36" fill="none">
    <Path
      d="M34.25 24.598V21.75a5 5 0 10-10 0v2.848A2.493 2.493 0 0023 26.75V33a2.504 2.504 0 002.5 2.5H33a2.504 2.504 0 002.5-2.5v-6.25a2.492 2.492 0 00-1.25-2.152zm-5-5.348a2.504 2.504 0 012.5 2.5v2.5h-5v-2.5a2.504 2.504 0 012.5-2.5zM25.5 33v-6.25H33V33h-7.5zM.5.5H3v5H.5v-5zm15 0H18v5h-2.5v-5zm5 0H23v5h-2.5v-5zM.5 8H3v10H.5V8zm0 12.5H3v10H.5v-10zm15 0H18v10h-2.5v-10zM5.5 8H8v10H5.5V8zm15 0H23v7.5h-2.5V8zm-10 22.5H8A2.503 2.503 0 015.5 28v-5A2.503 2.503 0 018 20.5h2.5A2.503 2.503 0 0113 23v5a2.503 2.503 0 01-2.5 2.5zM8 23v5h2.5v-5H8zm7.5-5H13a2.503 2.503 0 01-2.5-2.5v-5A2.503 2.503 0 0113 8h2.5a2.503 2.503 0 012.5 2.5v5a2.503 2.503 0 01-2.5 2.5zM13 10.5v5h2.5v-5H13zm-2.5-5H8A2.503 2.503 0 015.5 3V.5H8V3h2.5V.5H13V3a2.503 2.503 0 01-2.5 2.5z"
      fill={color}
    />
  </Svg>
);

export default CodeSafe;
