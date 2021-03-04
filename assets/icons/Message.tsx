import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Message(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.727 24h9.274a12 12 0 007.027-2.274c5.371-3.881 6.579-11.382 2.698-16.754C17.843-.399 10.343-1.607 4.971 2.275-.4 6.156-1.607 13.657 2.274 19.029c.527.728.678 2.386.453 4.971zM3.79 12c0 1.046.848 1.895 1.895 1.895v-.003A1.894 1.894 0 103.79 12zM12 13.895a1.895 1.895 0 110-3.785 1.895 1.895 0 010 3.782v.003zM16.422 12c0 1.046.849 1.895 1.895 1.895v-.003A1.894 1.894 0 1016.421 12z"
        fill={props.color}
      />
    </Svg>
  )
}
Message.defaultProps={
    color: Colors.K250
}
export default Message
