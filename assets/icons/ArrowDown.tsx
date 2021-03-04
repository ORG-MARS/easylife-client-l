import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function ArrowDown(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M8.125 9l3.88 3.88L15.885 9a.996.996 0 111.41 1.41L12.705 15a.996.996 0 01-1.41 0l-4.59-4.59a.996.996 0 010-1.41c.39-.38 1.03-.39 1.42 0z"
        fill={props.color}
      />
    </Svg>
  )
}
ArrowDown.defaultProps={
    color: Colors.K250
}
export default ArrowDown
