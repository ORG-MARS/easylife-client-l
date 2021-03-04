import * as React from "react"
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function Interact(props:IconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Circle cx={8} cy={8} r={8} fill="#D1ECDD" />
      <Circle cx={8} cy={8} r={6.667} fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.383 8.015a.99.99 0 00-1.006-.219V4.892c-.024-.515-.477-.914-1.012-.891-.503.021-.905.408-.927.891v1.756a3.132 3.132 0 00-2.166 0v-.421c-.024-.515-.477-.914-1.012-.892-.502.022-.904.409-.927.892v2.867C4.333 10.699 5.686 12 7.354 12c.731 0 1.437-.255 1.988-.718a.994.994 0 00.106-.087l1.935-1.862a.907.907 0 000-1.317zm-4.029 2.259c-.677 0-1.226-.528-1.226-1.18 0-.651.549-1.18 1.226-1.18.677 0 1.226.529 1.226 1.18 0 .652-.549 1.18-1.226 1.18z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={4.333}
          y1={4}
          x2={4.333}
          y2={12}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E8E473" />
          <Stop offset={1} stopColor="#68D1A2" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default Interact
