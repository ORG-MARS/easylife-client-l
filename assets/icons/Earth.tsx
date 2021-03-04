import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Earth(props:IconProps) {
  return (
    <Svg width={33} height={24} viewBox="0 0 33 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.477 15.867c-.864 0-1.678-.035-2.421-.105a15.62 15.62 0 01-1.279-.171A11.904 11.904 0 014.223 12c0-6.627 5.394-12 12.048-12 6.316 0 11.493 4.841 12.003 11.001-.539.363-1.297.797-2.344 1.272-1.78.81-4.852 1.95-9.383 2.787-2.853.528-5.644.807-8.07.807zM21.97 6a.794.794 0 00-1.118.046.787.787 0 00.045 1.114 6.847 6.847 0 012.066 3.57.791.791 0 001.546-.34A8.412 8.412 0 0021.97 6zm-5.469-1.482a.79.79 0 01.893-.672c.733.1 1.449.297 2.13.584a.788.788 0 01-.308 1.515.788.788 0 01-.308-.063 6.875 6.875 0 00-1.731-.474.789.789 0 01-.676-.89zm13.393 3.049c1.334.507 2.098 1.236 2.272 2.168.305 1.635-1.37 3.242-4.086 4.634C26.977 19.86 22.11 24 16.271 24a12.046 12.046 0 01-10.057-5.398l-.06-.004c-.122-.01-.244-.018-.363-.03C2.317 18.24.328 17.241.036 15.68c-.18-.964.308-1.951 1.448-2.933a.793.793 0 011.117.08.786.786 0 01-.081 1.113c-.656.564-.994 1.094-.927 1.452.113.606 1.5 1.338 4.348 1.607 2.968.28 6.814.026 10.828-.716 8.857-1.639 14.114-4.802 13.842-6.26-.064-.34-.53-.698-1.28-.983a.787.787 0 01-.458-1.018.793.793 0 011.022-.455z"
        fill={props.color}
      />
    </Svg>
  )
}
Earth.defaultProps={
  color: Colors.K250
}
export default Earth