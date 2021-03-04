import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Person(props:IconProps) {
  return (
    <Svg width={22} height={24} viewBox="0 0 22 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.333 0h-6.667a6.666 6.666 0 00-6.667 6.667 6.666 6.666 0 006.667 6.667 6.666 6.666 0 006.667-6.667V0zm-.667 14.668h-12A4.663 4.663 0 000 19.334v.667a4 4 0 004 4h13.333a4 4 0 004-4v-.667a4.666 4.666 0 00-4.667-4.666z"
        fill={props.color}
      />
    </Svg>
  )
}
Person.defaultProps={
  color: Colors.K250
}
export default Person
