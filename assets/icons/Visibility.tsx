import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Visibility(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 4C5.818 4 3.1 6.073 2 9c1.1 2.927 3.818 5 7 5s5.9-2.073 7-5c-1.1-2.927-3.818-5-7-5zm0 8.333c-1.756 0-3.182-1.493-3.182-3.333S7.244 5.667 9 5.667 12.182 7.16 12.182 9 10.756 12.333 9 12.333zM7.09 9c0-1.107.854-2 1.91-2s1.909.893 1.909 2-.853 2-1.91 2c-1.055 0-1.908-.893-1.908-2z"
        fill={props.color}
      />
    </Svg>
  )
}
Visibility.defaultProps={
    color: Colors.K250
  }
export default Visibility
