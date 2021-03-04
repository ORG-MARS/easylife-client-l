import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Key(props:IconProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.77 6.121a5.998 5.998 0 016.88 3.88H21c1.1 0 2 .9 2 2s-.9 2-2 2v2c0 1.1-.9 2-2 2s-2-.9-2-2v-2h-4.35a5.99 5.99 0 01-5.65 4c-3.74 0-6.68-3.43-5.86-7.3.48-2.29 2.34-4.12 4.63-4.58zM5 12.001c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"
        fill={props.color}
      />
    </Svg>
  )
}
Key.defaultProps={
    color: Colors.K250
}
export default Key
