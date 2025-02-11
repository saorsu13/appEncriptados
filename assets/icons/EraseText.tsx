import * as React from "react";
import Svg, { Path } from "react-native-svg";

function EraseText({ width = 30, height = 22, color = "#DCDCDC", ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 30 22"
      fill="none"
      {...props}
    >
      <Path
        d="M28.813 21.625H10.75c-.282 0-.552-.112-.751-.311L.436 11.75a1.063 1.063 0 010-1.502L10 .686c.199-.199.47-.31.751-.311h18.063a1.062 1.062 0 011.062 1.063v19.125a1.062 1.062 0 01-1.063 1.062zM11.19 19.5h16.56v-17H11.19L2.69 11l8.5 8.5z"
        fill={color}
      />
      <Path
        d="M19.69 11l4.872-4.873-1.502-1.502-4.872 4.873-4.873-4.873-1.502 1.502L16.684 11l-4.872 4.873 1.502 1.502 4.873-4.873 4.872 4.873 1.503-1.502L19.69 11z"
        fill={color}
      />
    </Svg>
  );
}

export default EraseText;
