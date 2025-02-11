import * as React from "react";
import Svg, { Path } from "react-native-svg";

interface SvgComponentProps {
  width?: number | string;
  height?: number | string;
  color?: string;
}

const Bag: React.FC<SvgComponentProps> = ({
  width = 17,
  height = 20,
  color = "#E3F8FF",
}) => (
  <Svg width={width} height={height} viewBox="0 0 17 20" fill="none">
    <Path
      d="M2.5 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 01.5 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 012.5 4h2c0-1.1.392-2.042 1.175-2.825C6.458.392 7.4 0 8.5 0s2.042.392 2.825 1.175C12.108 1.958 12.5 2.9 12.5 4h2c.55 0 1.02.196 1.412.588.392.391.588.862.588 1.412v12c0 .55-.196 1.02-.588 1.413A1.926 1.926 0 0114.5 20h-12zm0-2h12V6h-2v2c0 .283-.096.52-.287.713A.968.968 0 0111.5 9a.968.968 0 01-.713-.287A.967.967 0 0110.5 8V6h-4v2c0 .283-.096.52-.287.713A.968.968 0 015.5 9a.968.968 0 01-.713-.287A.968.968 0 014.5 8V6h-2v12zm4-14h4c0-.55-.196-1.02-.588-1.413A1.926 1.926 0 008.5 2c-.55 0-1.02.196-1.412.587A1.926 1.926 0 006.5 4z"
      fill={color}
    />
  </Svg>
);

export default Bag;
