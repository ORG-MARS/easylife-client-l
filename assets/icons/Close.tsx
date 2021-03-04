import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Close(props:IconProps) {
  return (
    <Svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.643 6.73a1 1 0 000 1.413l4.543 4.543-4.543 4.543a1 1 0 000 1.414l.086.086a1 1 0 001.414 0l4.543-4.543 4.543 4.543a1 1 0 001.414 0l.086-.086a1 1 0 000-1.414l-4.543-4.543 4.543-4.543a1 1 0 000-1.414l-.086-.086a1 1 0 00-1.414 0l-4.543 4.543-4.543-4.543a1 1 0 00-1.414 0l-.086.086z"
        fill={props.color}
      />
    </Svg>
  )
}
Close.defaultProps={
    color: Colors.K250
  }

export default Close