import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Delete(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.998 4.925H7.002c-.288 0-.521-.207-.521-.463 0-.255.233-.462.521-.462h3.996c.288 0 .521.208.521.463s-.233.462-.521.462zm-7.477.484H14.48c.288 0 .521.207.521.46 0 .256-.233.463-.521.463h-1.21v5.677c0 1.098-1.008 1.991-2.247 1.991H6.978c-1.239 0-2.247-.893-2.247-1.99V6.332h-1.21C3.233 6.333 3 6.126 3 5.87c0-.256.233-.462.521-.462zm4.298 6.13c.288 0 .522-.207.522-.463V8.174c0-.256-.234-.463-.522-.463-.288 0-.522.207-.522.463v2.903c0 .255.234.461.522.461zm2.882-.463c0 .255-.233.462-.521.462-.288 0-.522-.207-.522-.461V8.174c0-.256.233-.463.522-.463.288 0 .521.207.521.463v2.902z"
        fill={props.color}
      />
    </Svg>
  )
}
Delete.defaultProps={
    color: Colors.K250
  }
export default Delete
