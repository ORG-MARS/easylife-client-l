import * as React from "react"
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function Timer(props:IconProps) {
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
        d="M22.17 24.274c-.438-.586-1.17-1.171-1.755-1.61-1.903-1.611-3.659-3.222-3.952-7.907h-.585c-.439 0-.878-.44-.878-.879s.439-.878.878-.878h16.244c.439 0 .878.44.878.878 0 .44-.439.879-.878.879h-.585c-.146 4.685-2.049 6.15-3.952 7.906-.585.44-1.17 1.025-1.756 1.611.586.586 1.171 1.171 1.756 1.61 1.903 1.611 3.805 3.222 3.952 7.907h.585c.439 0 .878.44.878.879 0 .44-.439.878-.878.878H15.878c-.439 0-.878-.439-.878-.878 0-.44.439-.879.878-.879h.585c.146-4.685 2.049-6.15 3.952-7.906.585-.44 1.317-1.025 1.756-1.611zm-3.95 9.517h.731l4.683-4.685c.146-.146.585-.146.732 0l4.683 4.685h.732c-.147-3.953-1.757-5.125-3.366-6.588-.732-.733-1.61-1.318-2.342-2.343-.878 1.025-1.61 1.61-2.488 2.343-1.61 1.463-3.22 2.635-3.366 6.588zm1.463-14.495h8.927c.732-1.025 1.317-2.343 1.317-4.54H18.22c.147 2.197.586 3.515 1.464 4.54z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={15}
          y1={13}
          x2={15}
          y2={35.548}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E8E473" />
          <Stop offset={1} stopColor="#68D1A2" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default Timer
