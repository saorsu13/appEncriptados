import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Edit({ height = 16, width = 16, color = "#0F4457", ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      {...props}
    >
      <Path
        d="M1.75 15.75c-.413 0-.766-.147-1.06-.44a1.445 1.445 0 01-.44-1.06V3.75c0-.412.147-.765.44-1.06.294-.293.647-.44 1.06-.44h6.694l-1.5 1.5H1.75v10.5h10.5V9.038l1.5-1.5v6.712c0 .413-.147.766-.44 1.06-.294.293-.648.44-1.06.44H1.75zm3-4.5V8.063l6.881-6.882c.15-.15.319-.262.506-.337a1.481 1.481 0 011.631.338l1.05 1.068c.138.15.245.316.32.497.075.181.112.366.112.553 0 .188-.034.372-.103.553a1.406 1.406 0 01-.328.497l-6.882 6.9H4.75zm1.5-1.5H7.3l4.35-4.35-.525-.525-.544-.525L6.25 8.681v1.07z"
        fill={color}
      />
    </Svg>
  );
}

export default Edit;
