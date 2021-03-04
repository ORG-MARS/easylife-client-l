import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function CloseCircle(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm4.696-13.231l-3.229 3.224 3.229 3.224.027.028a1.035 1.035 0 01-.761 1.74c-.275 0-.54-.109-.733-.303l-3.23-3.224-3.228 3.224a1.039 1.039 0 01-1.495-.028 1.034 1.034 0 01.028-1.437l3.23-3.224-3.23-3.224a1.035 1.035 0 010-1.465 1.038 1.038 0 011.468 0L12 10.527l3.229-3.223a1.038 1.038 0 011.467 1.465z"
        fill={props.color}
      />
    </Svg>
  )
}

CloseCircle.defaultProps={
    color: Colors.K250
  }
export default CloseCircle
