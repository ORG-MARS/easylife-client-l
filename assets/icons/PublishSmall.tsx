import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function PublishSmall(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M3.215 7.751l11.298-4.723a.35.35 0 01.476.411l-2.815 11.294a.35.35 0 01-.565.185l-2.444-2.042a.35.35 0 00-.473.023l-1.253 1.256a.35.35 0 01-.6-.248V11.25c0-.095.038-.184.104-.25l5.096-5.114-6.017 4.528a.35.35 0 01-.435-.011L3.126 8.347a.353.353 0 01.09-.596z"
        fill={props.color}
      />
    </Svg>
  )
}

PublishSmall.defaultProps={
  color: Colors.K250
}
export default PublishSmall
