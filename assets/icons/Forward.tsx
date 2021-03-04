import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Forward(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M14.742 7.99L9.737 4.11a.534.534 0 00-.544-.063.486.486 0 00-.293.441v1.84c-3.041.535-5.435 3.05-5.897 6.008a.321.321 0 00.187.335c.132.062.29.037.394-.062 1.16-1.137 2.697-1.687 5.316-1.806v1.709c0 .188.113.36.293.44.179.082.388.057.544-.062l5.005-3.882A.638.638 0 0015 8.499a.638.638 0 00-.258-.508z"
        fill={props.color}
      />
    </Svg>
  )
}
Forward.defaultProps={
    color: Colors.K250
  }
export default Forward
