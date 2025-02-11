import * as React from "react";
import Svg, { Path } from "react-native-svg";

function X({ color = "#B4B4B4", width = 30, height = 26, ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 30 26"
      fill="none"
      {...props}
    >
      <Path
        d="M23.147.25h4.345L18 11.052 29.167 25.75h-8.744l-6.847-8.915-7.835 8.915H1.39l10.154-11.553L.833.25h8.965l6.19 8.149L23.149.25zm-1.524 22.91h2.408L8.49 2.704H5.905L21.623 23.16z"
        fill={color}
      />
    </Svg>
  );
}

export default X;
