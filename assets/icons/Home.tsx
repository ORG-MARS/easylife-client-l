import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Home(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.667 24h3.984a2.58 2.58 0 002.572-2.59v-7.57h.748c.525 0 1.048-.189 1.42-.563.786-.785.824-2.06.038-2.848l-8.706-9.257a.294.294 0 01-.15-.15 3.762 3.762 0 00-5.306.15L.56 10.43c-.372.377-.56.864-.56 1.388 0 1.124.898 2.025 2.019 2.025h.485v7.57A2.588 2.588 0 005.084 24h4.25v-8.333a1 1 0 011-1h3.333a1 1 0 011 1V24z"
        fill={props.color}
      />
    </Svg>
  )
}
Home.defaultProps={
    color: Colors.K250
}
export default Home
