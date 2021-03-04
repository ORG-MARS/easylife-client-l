import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { IconProps } from './index'

function HighLevel(props:IconProps) {
  return (
    <Svg width={25} height={26} viewBox="0 0 25 26" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.337 9.148l1.949-3.814a.453.453 0 00.098-.271.482.482 0 00-.489-.475h-4.232a.478.478 0 00-.465.361l-1.305 2.495s2.793.164 4.444 1.704zm-4.841 12.548c3.78 0 6.846-2.973 6.846-6.64s-3.065-6.64-6.846-6.64c-3.78 0-6.846 2.973-6.846 6.64s3.065 6.64 6.846 6.64zM5.538 5.063a.454.454 0 00.1.271L7.586 9.15c1.65-1.541 4.444-1.705 4.444-1.705l-1.304-2.495a.479.479 0 00-.466-.36H6.027c-.27 0-.489.212-.489.474zm10.303 9.934a1.194 1.194 0 011.221.268v.001a1.117 1.117 0 010 1.613l-2.349 2.28a1.18 1.18 0 01-.128.107 3.732 3.732 0 01-2.413.88c-2.025 0-3.667-1.594-3.667-3.56v-3.511c.027-.592.515-1.066 1.125-1.092.65-.028 1.2.461 1.228 1.092v.516a3.77 3.77 0 012.63 0v-2.15c.027-.592.515-1.066 1.124-1.092.65-.028 1.2.46 1.229 1.091v3.557zm-5.157 1.59c0 .797.666 1.444 1.488 1.444s1.488-.646 1.488-1.444c0-.798-.666-1.445-1.488-1.445s-1.488.647-1.488 1.445z"
        fill="url(#prefix__paint0_linear)"
      />
      <Defs>
        <LinearGradient
          id="prefix__paint0_linear"
          x1={4.605}
          y1={22.272}
          x2={19.384}
          y2={22.272}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7B7B7B" />
          <Stop offset={1} stopColor="#191919" />
        </LinearGradient>
      </Defs>
    </Svg>
  )
}

export default HighLevel
