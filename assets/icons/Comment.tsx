import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Comment(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 9a6 6 0 10-2.457 4.843l1.476.294a.665.665 0 00.785-.784l-.364-1.82C14.8 10.765 15 9.907 15 9zM5 9a1 1 0 112 0 1 1 0 01-2 0zm3 0a1 1 0 112 0 1 1 0 01-2 0zm4-1a1 1 0 100 2 1 1 0 000-2z"
        fill={props.color}
      />
    </Svg>
  )
}
Comment.defaultProps={
  color: Colors.K250
}
export default Comment
