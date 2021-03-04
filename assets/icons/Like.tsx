import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Like(props:IconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.872 7.962h3.299s.829-.07.829.792c0 0 0 1.24-1.226 5.41 0 0-.38 1.223-.847 1.223H7.97c-.345 0-1.226-.232-1.226-.879V7.962s2.452-1.81 2.452-4.118c.014-.025.018-.075.022-.14.016-.248.046-.704.773-.704 0 0 2.16.241.88 4.962zm-7.458.002H5.39s.502-.006.502.5v6.646s.003.278-.353.278h-1.71s-.421 0-.421-.42L3 8.364s.006-.401.414-.401z"
        fill={props.color}
      />
    </Svg>
  )
}
Like.defaultProps={
    color: Colors.K250
}
export default Like
