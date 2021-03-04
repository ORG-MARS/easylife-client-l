import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Publish(props:IconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.69.125a.691.691 0 01.3.712l-2.858 17.141a.71.71 0 01-.97.535l-5.054-2.065-2.703 3.295a.655.655 0 01-.547.255.625.625 0 01-.247-.045.693.693 0 01-.34-.262.7.7 0 01-.13-.408v-3.892l9.641-11.819L4.853 13.896.446 12.09c-.275-.103-.425-.308-.445-.615-.015-.298.103-.518.358-.66L18.927.1a.7.7 0 01.762.025z"
        fill={props.color}
      />
    </Svg>
  )
}
Publish.defaultProps={
  color: Colors.K250
}
export default Publish
