import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Place(props:IconProps) {
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
        d="M5 9.265c0-3.87 3.13-7 7-7s7 3.13 7 7c0 4.17-4.42 9.92-6.23 12.11-.4.48-1.13.48-1.53 0C9.42 19.185 5 13.435 5 9.265zm4.5 0a2.5 2.5 0 005 0 2.5 2.5 0 00-5 0z"
        fill={props.color}
      />
    </Svg>
  )
}

Place.defaultProps={
    color: Colors.K250
}
export default Place
