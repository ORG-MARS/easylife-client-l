import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function ArrowDownLarge(props:IconProps) {
  return (
    <Svg
      width={40}
      height={14}
      viewBox="0 0 40 14"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.369 14h-.11l-.139-.012-.17-.032-.146-.045-.098-.038-.087-.042L1.379 3.3a1.5 1.5 0 011.5-2.598l17.436 10.066L37.75.702a1.5 1.5 0 011.5 2.598L21.063 13.8l-.07.038-.121.056-.12.042-.126.032-.145.024-.112.008z"
        fill={props.color}
      />
    </Svg>
  )
}
ArrowDownLarge.defaultProps={
    color: Colors.K250
}
export default ArrowDownLarge
