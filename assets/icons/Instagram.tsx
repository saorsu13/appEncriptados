import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Instagram({ color = "#B4B4B4", width = 30, height = 30, ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 30 30"
      fill="none"
      {...props}
    >
      <Path
        d="M9.05.834h11.9c4.533 0 8.217 3.683 8.217 8.217v11.9a8.217 8.217 0 01-8.217 8.216H9.05c-4.533 0-8.217-3.683-8.217-8.216V9.05A8.217 8.217 0 019.05.834zm-.283 2.833a5.1 5.1 0 00-5.1 5.1v12.467c0 2.82 2.28 5.1 5.1 5.1h12.466a5.1 5.1 0 005.1-5.1V8.767c0-2.819-2.28-5.1-5.1-5.1H8.767zm13.67 2.125a1.77 1.77 0 110 3.542 1.77 1.77 0 010-3.542zM15 7.917a7.083 7.083 0 110 14.167 7.083 7.083 0 010-14.167zm0 2.834a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5z"
        fill={color}
      />
    </Svg>
  );
}

export default Instagram;
