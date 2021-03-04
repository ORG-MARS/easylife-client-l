import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function VisibilityOff(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.087 5.245l-1.45-1.44.81-.805 11.277 11.198-.81.802-1.855-1.844-.27-.269a7.508 7.508 0 01-2.79.534A7.524 7.524 0 012 8.684a7.486 7.486 0 012.376-3.151l-.29-.288zm8.093 3.44c0-1.744-1.426-3.159-3.182-3.159-.41 0-.801.086-1.16.225L6.462 4.389A7.528 7.528 0 0116 8.684a7.503 7.503 0 01-2.185 3l-1.861-1.847c.143-.357.226-.745.226-1.153zm-6.025-1.39l.982.976a1.987 1.987 0 00-.047.413 1.903 1.903 0 002.322 1.848l.983.975a3.148 3.148 0 01-1.397.335c-1.756 0-3.18-1.415-3.18-3.158 0-.499.127-.966.337-1.39zm4.743 1.493l-2.005-1.99.105-.009c1.053 0 1.91.85 1.91 1.895l-.01.104z"
        fill={props.color}
      />
    </Svg>
  )
}
VisibilityOff.defaultProps={
    color: Colors.K250
  }
export default VisibilityOff
