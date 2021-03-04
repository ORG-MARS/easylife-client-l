import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Lock(props:IconProps) {
  return (
    <Svg width={19} height={25} viewBox="0 0 19 25" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 8.5h-1.143V6.214A5.716 5.716 0 009.143.5a5.716 5.716 0 00-5.714 5.714V8.5H2.286A2.292 2.292 0 000 10.786v11.428A2.292 2.292 0 002.286 24.5H16a2.292 2.292 0 002.286-2.286V10.786A2.292 2.292 0 0016 8.5zM9.143 18.786A2.292 2.292 0 016.857 16.5a2.292 2.292 0 012.286-2.286 2.292 2.292 0 012.286 2.286 2.292 2.292 0 01-2.286 2.286zM5.714 6.214V8.5h6.857V6.214a3.424 3.424 0 00-3.428-3.428 3.424 3.424 0 00-3.429 3.428z"
        fill={props.color}
      />
    </Svg>
  )
}
Lock.defaultProps={
    color: Colors.K250
}
export default Lock
