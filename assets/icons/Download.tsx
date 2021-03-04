import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Download(props:IconProps) {
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
        d="M15 9.5h1.59c.89 0 1.33 1.08.7 1.71L12.7 15.8a.996.996 0 01-1.41 0L6.7 11.21c-.63-.63-.18-1.71.71-1.71H9v-5c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v5zm-9 11c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1H6z"
        fill={props.color}
      />
    </Svg>
  )
}
Download.defaultProps={
    color: Colors.K250
  }
export default Download
