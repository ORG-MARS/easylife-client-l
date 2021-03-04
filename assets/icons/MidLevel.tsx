import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function MidLevel(props:IconProps) {
  return (
    <Svg width={23} height={23} viewBox="0 0 23 23" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.343 7.63l1.705-3.338a.397.397 0 00.086-.237.422.422 0 00-.428-.415h-3.703a.418.418 0 00-.407.316l-1.142 2.182s2.444.144 3.889 1.492zm-4.236 10.979c3.308 0 5.99-2.601 5.99-5.81 0-3.209-2.682-5.81-5.99-5.81-3.308 0-5.99 2.601-5.99 5.81 0 3.209 2.682 5.81 5.99 5.81zM5.019 4.055c.002.086.033.17.087.237L6.811 7.63C8.255 6.282 10.7 6.138 10.7 6.138L9.558 3.956a.42.42 0 00-.407-.316H5.447a.422.422 0 00-.428.415zm9.015 8.693c.373-.13.789-.039 1.068.234a.978.978 0 010 1.413l-2.055 1.994a1.046 1.046 0 01-.113.094 3.265 3.265 0 01-2.11.769c-1.772 0-3.209-1.394-3.209-3.114v-3.072c.024-.518.45-.933.984-.956.569-.024 1.05.404 1.075.956v.45a3.3 3.3 0 012.3 0v-1.88c.024-.518.451-.933.985-.956.568-.024 1.05.404 1.075.955v3.113zm-4.513 1.39c0 .698.583 1.264 1.302 1.264.72 0 1.303-.566 1.303-1.264 0-.698-.583-1.264-1.303-1.264-.719 0-1.302.566-1.302 1.264z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={5.019}
          y1={18.609}
          x2={17.134}
          y2={18.609}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#EDEDED" />
          <Stop offset={1} stopColor="#E7E7E7" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default MidLevel
