import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Status(props:IconProps) {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.797 3.481l.982.982v-.001a.762.762 0 010 1.074l-.982.982v1.519a.762.762 0 01-.76.76H6.518l-.981.981a.762.762 0 01-1.074 0l-.982-.982H1.963a.762.762 0 01-.76-.76V6.519l-.982-.981a.762.762 0 010-1.074l.982-.982V1.963a.762.762 0 01.76-.76H3.48l.982-.982a.762.762 0 011.074 0l.98.982h1.52c.42.002.758.34.76.76V3.48zm-6.075 0l2.279 4.177 2.277-4.176H6.14L5 5.759 3.861 3.481H2.722z"
        fill={props.color}
      />
    </Svg>
  )
}
Status.defaultProps={
    color: Colors.K250
  }
export default Status
