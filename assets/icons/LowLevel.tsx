import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function LowLevel(props:IconProps) {
  return (
    <Svg width={19} height={20} viewBox="0 0 19 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.272 7.111l1.462-2.86a.34.34 0 00.074-.204.362.362 0 00-.367-.356h-3.175a.358.358 0 00-.348.27l-.98 1.872s2.096.123 3.334 1.278zm-3.63 9.41c2.835 0 5.134-2.229 5.134-4.978 0-2.751-2.3-4.981-5.135-4.981s-5.134 2.23-5.134 4.98c0 2.75 2.299 4.98 5.134 4.98zM4.422 4.048a.34.34 0 00.075.204l1.46 2.86c1.239-1.155 3.334-1.278 3.334-1.278l-.979-1.871a.36.36 0 00-.349-.27H4.79a.362.362 0 00-.367.355zm7.727 7.45a.896.896 0 01.916.202.838.838 0 010 1.21l-1.762 1.71a.897.897 0 01-.096.08 2.799 2.799 0 01-1.81.66c-1.518 0-2.75-1.195-2.75-2.67v-2.633a.87.87 0 01.844-.819c.487-.02.9.346.921.82v.386a2.828 2.828 0 011.972 0V8.83a.87.87 0 01.844-.818c.487-.021.9.345.92.818v2.668zM8.282 12.69c0 .598.5 1.083 1.116 1.083.617 0 1.116-.485 1.116-1.083s-.5-1.083-1.116-1.083c-.616 0-1.116.485-1.116 1.083z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={4.423}
          y1={16.522}
          x2={14.808}
          y2={16.522}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFF6E6" />
          <Stop offset={1} stopColor="#FFD9B9" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default LowLevel
