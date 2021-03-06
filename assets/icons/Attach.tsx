import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Attach(props: IconProps) {
  return (
    <Svg width={58} height={58} viewBox="0 0 58 58" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52.524 2.295a.5.5 0 01-.548.836A9.95 9.95 0 0046.5 1.5a.5.5 0 010-1c2.17 0 4.248.63 6.024 1.795zM57.5 13.11a.5.5 0 01-1 0V11.5a9.965 9.965 0 00-.834-4.005.5.5 0 11.916-.4c.603 1.377.918 2.87.918 4.405v1.61zm0 12a.5.5 0 01-1 0v-6a.5.5 0 111 0v6zm0 12a.5.5 0 01-1 0v-6a.5.5 0 111 0v6zm-.337 12.103a.5.5 0 11-.97-.246c.203-.8.307-1.626.307-2.467v-3.39a.5.5 0 111 0v3.39c0 .924-.114 1.833-.337 2.713zm-8.85 8.138a.5.5 0 11-.164-.986 9.965 9.965 0 005.131-2.514.5.5 0 01.678.735 10.965 10.965 0 01-5.645 2.765zm-12.034.149a.5.5 0 010-1h6a.5.5 0 110 1h-6zm-12 0a.5.5 0 010-1h6a.5.5 0 110 1h-6zm-12 0a.5.5 0 010-1h6a.5.5 0 110 1h-6zM1.787 51.668a.5.5 0 01.883-.47 10.048 10.048 0 004.014 4.068.5.5 0 01-.483.876 11.049 11.049 0 01-4.414-4.474zm-1.287-12a.5.5 0 011 0v6a.5.5 0 11-1 0v-6zm0-12a.5.5 0 011 0v6a.5.5 0 11-1 0v-6zm0-12a.5.5 0 011 0v6a.5.5 0 11-1 0v-6zM3.482 3.97a.5.5 0 01.729.685 9.968 9.968 0 00-2.56 5.107.5.5 0 01-.985-.172 10.968 10.968 0 012.816-5.62zM14.942.5a.5.5 0 010 1h-3.476c-.824.003-1.634.105-2.418.303a.5.5 0 11-.245-.97C9.666.616 10.557.503 11.464.5h3.478zm12 0a.5.5 0 010 1h-6a.5.5 0 110-1h6zm12 0a.5.5 0 010 1h-6a.5.5 0 110-1h6zM46.5.5a.5.5 0 010 1h-1.558a.5.5 0 110-1H46.5zM30.5 19.5a1.5 1.5 0 00-3 0v8h-8a1.5 1.5 0 000 3h8v8a1.5 1.5 0 003 0v-8h8a1.5 1.5 0 000-3h-8v-8z"
        fill={props.color}
      />
    </Svg>
  )
}
Attach.defaultProps={
    color: Colors.K250
  }
export default Attach
