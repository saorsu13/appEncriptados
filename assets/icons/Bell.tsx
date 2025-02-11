import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

function Bell({
  width = 18,
  height = 21,
  color = "#E8E8E8",
  ...props
}: SvgComponentProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      {...props}
    >
      <Path
        d="M8.632 20.912c-.55 0-1.02-.196-1.412-.587a1.926 1.926 0 01-.588-1.413h4c0 .55-.196 1.02-.587 1.413a1.926 1.926 0 01-1.413.587zm-8-3v-2h2v-7c0-1.383.417-2.612 1.25-3.687.833-1.075 1.917-1.78 3.25-2.113v-.7c0-.417.146-.77.438-1.062A1.447 1.447 0 018.632.912c.417 0 .77.146 1.063.438.291.291.437.645.437 1.062v.325a4.606 4.606 0 00-.5 2.3c-.167-.033-.33-.062-.487-.087a3.29 3.29 0 00-.513-.038c-1.1 0-2.042.392-2.825 1.175-.783.783-1.175 1.725-1.175 2.825v7h8V9.487a5.005 5.005 0 002 .425v6h2v2h-16z"
        fill={color}
      />
      <Path
        d="M12.507 7.037a2.893 2.893 0 002.125.875c.833 0 1.542-.292 2.125-.875a2.893 2.893 0 00.875-2.125c0-.833-.292-1.542-.875-2.125a2.893 2.893 0 00-2.125-.875c-.833 0-1.542.292-2.125.875a2.893 2.893 0 00-.875 2.125c0 .833.292 1.542.875 2.125z"
        fill="#D4A11F"
      />
    </Svg>
  );
}

export default Bell;
