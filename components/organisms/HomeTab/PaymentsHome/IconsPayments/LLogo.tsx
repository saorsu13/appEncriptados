import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Llogo(props) {
  return (
    <Svg
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M32.052 63.193c17.346 0 31.408-14.062 31.408-31.408C63.46 14.439 49.398.377 32.052.377 14.706.377.644 14.439.644 31.785c0 17.346 14.062 31.408 31.408 31.408z"
        fill="#BEBEBE"
      />
      <Path
        d="M29.657 42.871l2.314-9.883 7.357-2.94v-5.285l-5.992 2.384 3.95-16.926H26.06l-5.114 21.878-5.618 2.233v5.285l4.254-1.687-3.022 12.905h30.368l1.859-7.964h-19.13z"
        fill="#fff"
      />
    </Svg>
  );
}

export default Llogo;
