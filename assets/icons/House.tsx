import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { IconProps } from './index'

function House(props: IconProps) {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none" {...props}>
      <Circle cx={24} cy={24} r={24} fill="#EEF8F2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.81 20.213l2.654 2.178a1.466 1.466 0 01-1.86 2.266l-7.678-6.303-7.542 6.056a1.466 1.466 0 01-1.836-2.285l8.47-6.802a1.465 1.465 0 011.848.01l2.109 1.731v-.055c0-.77.624-1.395 1.395-1.395h1.055c.77 0 1.394.625 1.394 1.395v3.04c0 .055-.003.11-.009.164zm-14 12.326v-7.67l7.07-5.446 7.07 5.61v7.506c0 .77-.625 1.395-1.395 1.395h-1.619c.02-.088.03-.18.03-.273v-5.644c0-.77-.72-1.395-1.611-1.395H24.99c-.891 0-1.613.625-1.613 1.395v5.644c0 .093.01.185.031.273h-5.204c-.77 0-1.394-.624-1.394-1.395z"
        fill="#6BCA95"
      />
    </Svg>
  )
}

export default House
