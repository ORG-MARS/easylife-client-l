import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Emoji(props:IconProps) {
  return (
    <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.13 9.596a1.638 1.638 0 110-3.277 1.638 1.638 0 010 3.277zm7.77 0a1.638 1.638 0 010-3.277 1.638 1.638 0 010 3.277zm-10.678 2.92l-.13-.814h13.817l-.13.813c-.526 3.29-3.393 5.74-6.779 5.74s-6.253-2.45-6.778-5.74zM11 16.85a5.46 5.46 0 005.196-3.745H5.804A5.46 5.46 0 0011 16.851zM11 22C4.925 22 0 17.075 0 11S4.925 0 11 0s11 4.925 11 11-4.925 11-11 11zm0-1.404c5.3 0 9.596-4.296 9.596-9.596S16.3 1.404 11 1.404A9.596 9.596 0 001.404 11c0 5.3 4.296 9.596 9.596 9.596z"
        fill={props.color}
      />
    </Svg>
  )
}
Emoji.defaultProps={
    color: Colors.K250
  }
export default Emoji
