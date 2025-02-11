import React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  strokeColor?: string;
  color?: string;
}

const Copy: React.FC<SvgComponentProps> = ({
  width = 20,
  height = 20,
  color,
}) => (
  <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
    <Path
      d="M6.6665 3.33317V13.3332C6.6665 13.7752 6.8421 14.1991 7.15466 14.5117C7.46722 14.8242 7.89114 14.9998 8.33317 14.9998H14.9998C15.4419 14.9998 15.8658 14.8242 16.1783 14.5117C16.4909 14.1991 16.6665 13.7752 16.6665 13.3332V6.03484C16.6665 5.8128 16.6221 5.59301 16.5359 5.38837C16.4498 5.18374 16.3236 4.99837 16.1648 4.84317L13.4023 2.1415C13.091 1.83705 12.6728 1.66656 12.2373 1.6665H8.33317C7.89114 1.6665 7.46722 1.8421 7.15466 2.15466C6.8421 2.46722 6.6665 2.89114 6.6665 3.33317Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.3333 14.9997V16.6663C13.3333 17.1084 13.1577 17.5323 12.8451 17.8449C12.5325 18.1574 12.1086 18.333 11.6666 18.333H4.99992C4.55789 18.333 4.13397 18.1574 3.82141 17.8449C3.50885 17.5323 3.33325 17.1084 3.33325 16.6663V7.49967C3.33325 7.05765 3.50885 6.63372 3.82141 6.32116C4.13397 6.0086 4.55789 5.83301 4.99992 5.83301H6.66659"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Copy;
