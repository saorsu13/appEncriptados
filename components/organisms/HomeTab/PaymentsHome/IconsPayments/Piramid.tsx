import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Piramid(props) {
  return (
    <Svg
      width={39}
      height={64}
      viewBox="0 0 39 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.488 36.775l18.574 26.416V48.033L.488 36.775zM19.062.336L.034 30.996h19.028V.336z"
        fill="#BFBFC5"
      />
      <Path d="M19.062 42.587v-11.59H.013l19.05 11.59z" fill="#C7C7CC" />
      <Path
        d="M37.626 36.775L19.062 63.191V48.033l18.564-11.258zM19.062.336l19.019 30.66H19.062V.336z"
        fill="#5F5E6D"
      />
      <Path d="M19.062 42.587v-11.59h19.09l-19.09 11.59z" fill="#6C6C7A" />
    </Svg>
  );
}

export default Piramid;
