import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function AddCircle(props:IconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Circle cx={8} cy={8} r={8} fill={props.color} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.667 4.333a.667.667 0 00-1.334 0v3h-3a.667.667 0 000 1.334h3v3a.667.667 0 101.334 0v-3h3a.667.667 0 100-1.334h-3v-3z"
        fill={"#fff"}
      />
    </Svg>
  )
}
AddCircle.defaultProps={
    color: Colors.K250,
}
export default AddCircle
