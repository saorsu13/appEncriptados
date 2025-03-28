import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Unknown(props) {
  return (
    <Svg
      width={84}
      height={53}
      viewBox="0 0 84 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M26.227 52.775c14.427 0 26.123-11.696 26.123-26.123C52.35 12.225 40.654.529 26.227.529 11.8.53.104 12.225.104 26.652c0 14.427 11.696 26.123 26.123 26.123z"
        fill="#D51E12"
      />
      <Path
        d="M57.877 52.775C72.304 52.775 84 41.079 84 26.652 84 12.225 72.304.529 57.877.529 43.45.53 31.755 12.225 31.755 26.652c0 14.427 11.695 26.123 26.122 26.123z"
        fill="#0099DC"
      />
      <Path
        d="M42.052 47.438c5.687 0 10.298-9.302 10.298-20.776 0-11.475-4.61-20.777-10.298-20.777-5.687 0-10.297 9.302-10.297 20.777 0 11.474 4.61 20.776 10.297 20.776z"
        fill="#6D6CBA"
      />
    </Svg>
  );
}

export default Unknown;
