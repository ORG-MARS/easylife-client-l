import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"
import { IconProps } from './index'

function Upload(props: IconProps) {
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48" fill="none" {...props}>
      <Circle cx={24} cy={24} r={24} fill="#EEF8F2" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.171 15h-18.98c-1.21 0-2.19.98-2.191 2.19v14.6c0 1.21.98 2.19 2.19 2.19h18.981c1.21 0 2.19-.98 2.19-2.19v-14.6a2.192 2.192 0 00-2.19-2.19zm.365 14.556l-4.582-6.11s-.267-.494-1.201-.494c-1.062 0-1.38.479-1.38.479l-4.014 6.195s-.218.415-.754.415c-.56 0-.828-.415-.828-.415l-2.11-2.412s-.542-.717-1.244-.717c-.7 0-1.281.793-1.281.793l-2.317 2.885V17.581c0-.402.327-.73.73-.73h18.251c.404 0 .73.328.73.73v11.975zM22.583 21.57a2.585 2.585 0 11-5.17.002 2.585 2.585 0 015.17-.002z"
        fill="#6BCA95"
      />
    </Svg>
  )
}

export default Upload
