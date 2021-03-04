import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Clock(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.28-13h.06c.4 0 .72.32.72.72v4.54l3.87 2.3c.35.2.46.65.25.99-.2.34-.64.44-.98.24l-4.15-2.49a.99.99 0 01-.49-.86V7.72c0-.4.32-.72.72-.72z"
        fill={props.color}
      />
    </Svg>
  )
}
Clock.defaultProps={
  color: Colors.K250
}
export default Clock
