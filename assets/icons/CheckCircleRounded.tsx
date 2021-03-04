import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function CheckCircleRounded(props:IconProps) {
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
        d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm3.7.7l3.59 3.59c.39.39 1.03.39 1.41 0l7.59-7.59a.996.996 0 10-1.41-1.41L10 14.17l-2.89-2.88A.996.996 0 105.7 12.7z"
        fill={props.color}
      />
    </Svg>
  )
}
CheckCircleRounded.defaultProps={
    color: Colors.K250
  }
export default CheckCircleRounded
