import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function AddCircleOutline(props:IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
        <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11zm0-1.404c5.3 0 9.596-4.296 9.596-9.596S16.3 1.404 11 1.404A9.596 9.596 0 001.404 11c0 5.3 4.296 9.596 9.596 9.596zM11 5a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H6a1 1 0 110-2h4V6a1 1 0 011-1z"
        fill={props.color}
        />
    </Svg>
  )
}
AddCircleOutline.defaultProps={
    color: Colors.K250,
}
export default AddCircleOutline
