import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { IconProps } from './index'

function Camera(props: IconProps) {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none" {...props}>
      <Circle cx={24} cy={24} r={24} fill="#EEF8F2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 20.5a3.666 3.666 0 00-3.667 3.667A3.666 3.666 0 0024 27.833a3.666 3.666 0 003.667-3.666A3.666 3.666 0 0024 20.5zm8.9-1.833h-2.648c-.367 0-.761-.706-.88-1.054l-.789-1.696c-.119-.348-.55-.917-.916-.917h-7.334c-.366 0-.806.569-.916.917l-.678 1.769c-.12.339-.505.98-.872.98H15.21c-1.21 0-2.209.367-2.209 1.587v9.954c0 1.21 1 2.21 2.209 2.21H32.9c1.219 0 2.099-1 2.099-2.21v-9.954c0-1.22-.88-1.586-2.1-1.586zm-8.9 11a5.504 5.504 0 01-5.5-5.5c0-3.035 2.466-5.5 5.5-5.5s5.5 2.465 5.5 5.5c0 3.034-2.466 5.5-5.5 5.5z"
        fill="#6BCA95"
      />
    </Svg>
  )
}

export default Camera
