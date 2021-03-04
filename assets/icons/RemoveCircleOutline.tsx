import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function RemoveCircleOutline(props:IconProps) {
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
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 12c0 .55.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1H8c-.55 0-1 .45-1 1zm-3 0c0 4.41 3.59 8 8 8s8-3.59 8-8-3.59-8-8-8-8 3.59-8 8z"
        fill={props.color}
      />
    </Svg>
  )
}
RemoveCircleOutline.defaultProps={
    color: Colors.K250
  }
export default RemoveCircleOutline
