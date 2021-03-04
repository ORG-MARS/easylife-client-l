import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function ArrowLeft(props:IconProps) {
  return (
    <Svg width={16} height={26} viewBox="0 0 16 26" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.624 13.011l9.196 9.196a1.2 1.2 0 010 1.697l-1.055 1.055a1.2 1.2 0 01-1.697 0L1.301 14.193a1.2 1.2 0 01-.304-1.182A1.2 1.2 0 011.3 11.83L12.068 1.063a1.2 1.2 0 011.697 0l1.055 1.055a1.2 1.2 0 010 1.697l-9.196 9.196z"
        fill={props.color}
      />
    </Svg>
  )
}
ArrowLeft.defaultProps={
    color: Colors.K250
  }
export default ArrowLeft