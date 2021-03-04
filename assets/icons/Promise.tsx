import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { IconProps } from './index'

function Promise(props: IconProps) {
  return (
    <Svg width={64} height={64} viewBox="0 0 64 64" fill="none" {...props}>
      <Circle cx={32} cy={32} r={32} fill="#EEF8F2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M45.532 32.695a3.85 3.85 0 00-4.025-.91V19.71a3.881 3.881 0 00-7.755 0v7.3a12.083 12.083 0 00-8.664 0v-1.752a3.881 3.881 0 00-7.755 0v11.924-.001c0 6.673 5.41 12.083 12.083 12.083 2.924 0 5.75-1.06 7.95-2.985.15-.11.293-.232.425-.363l7.74-7.74a3.874 3.874 0 00.002-5.478l-.002-.002.001-.001zm-16.116 9.392a4.904 4.904 0 110-9.81 4.904 4.904 0 010 9.81z"
        fill="#6BCA95"
      />
    </Svg>
  )
}

export default Promise
