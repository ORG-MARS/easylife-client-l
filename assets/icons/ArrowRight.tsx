import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function ArrowRight(props:IconProps) {
  return (
    <Svg
      width={8}
      height={12}
      viewBox="0 0 8 12"
      fill="none"
      {...props}
    >
      <Path
        d="M1 9.875l3.88-3.88L1 2.115A.996.996 0 112.41.705L7 5.295c.39.39.39 1.02 0 1.41l-4.59 4.59a.996.996 0 01-1.41 0c-.38-.39-.39-1.03 0-1.42z"
        fill={props.color}
      />
    </Svg>
  )
}
ArrowRight.defaultProps={
    color: Colors.K250
  }
export default ArrowRight
