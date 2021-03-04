import * as React from "react"
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function DealFullfilled(props: IconProps) {
  return (
    <Svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <Circle cx={24} cy={24} r={24} fill="#D1ECDD" />
      <Circle cx={24} cy={24} r={20} fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.045 13.851a2.97 2.97 0 00-.656 3.019h-8.712c-1.545.07-2.742 1.43-2.674 3.037.064 1.506 1.224 2.712 2.674 2.779h5.266a9.397 9.397 0 000 6.498H18.68c-1.545.071-2.742 1.43-2.674 3.037.064 1.506 1.225 2.712 2.674 2.779h8.603C32.096 35 36 30.943 36 25.938a9.273 9.273 0 00-2.153-5.963 2.952 2.952 0 00-.263-.319L28 13.852a2.72 2.72 0 00-3.952-.002l-.002.002v-.001zm6.777 12.087c0 2.031-1.585 3.678-3.539 3.678-1.954 0-3.539-1.647-3.539-3.678 0-2.032 1.585-3.679 3.54-3.679 1.953 0 3.538 1.647 3.538 3.679z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={12}
          y1={35}
          x2={36}
          y2={35}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E8E473" />
          <Stop offset={1} stopColor="#68D1A2" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}
export default DealFullfilled
