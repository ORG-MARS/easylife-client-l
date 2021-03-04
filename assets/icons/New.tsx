import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { IconProps } from "./index"

function New(props: IconProps) {
  return (
    <Svg width={78} height={68} viewBox="0 0 78 68" fill="none" {...props}>
      <Path
        d="M0 14c3.593 0 7.061-1.281 10.032-3.303C16.115 6.558 27.557 0 39 0c11.443 0 22.885 6.558 28.968 10.697C70.938 12.72 74.407 14 78 14v54H0V14z"
        fill="#fff"
      />
      <Path
        d="M0 14c3.593 0 7.061-1.281 10.032-3.303C16.115 6.558 27.557 0 39 0c11.443 0 22.885 6.558 28.968 10.697C70.938 12.72 74.407 14 78 14v54H0V14z"
        stroke="#fff"
      />
      <Circle cx={39} cy={31} r={24} fill="#73C497" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41 20a2 2 0 10-4 0v9h-9a2 2 0 100 4h9v9a2 2 0 104 0v-9h9a2 2 0 100-4h-9v-9z"
        fill="#fff"
      />
    </Svg>
  )
}

export default New
