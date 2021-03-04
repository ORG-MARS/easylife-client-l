import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Money(props:IconProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm11.41 6.67v-.58c1.74-.33 3.11-1.33 3.13-3.16 0-2.52-2.16-3.39-4.18-3.91-2.02-.52-2.67-1.07-2.67-1.91 0-.96.9-1.64 2.4-1.64 1.26 0 1.89.49 2.12 1.25.1.36.4.62.77.62h.26c.59 0 1.01-.58.81-1.13-.38-1.06-1.25-1.92-2.63-2.26v-.62c0-.73-.6-1.33-1.33-1.33h-.01c-.73 0-1.33.6-1.33 1.33v.6c-1.72.37-3.11 1.49-3.11 3.21 0 2.05 1.7 3.07 4.18 3.67 2.23.53 2.67 1.31 2.67 2.14 0 .61-.44 1.59-2.4 1.59-1.46 0-2.22-.52-2.51-1.27-.14-.35-.44-.6-.81-.6h-.24c-.6 0-1.03.61-.8 1.16.5 1.23 1.68 1.96 3.01 2.24v.6c0 .73.6 1.33 1.33 1.33h.01c.73 0 1.33-.6 1.33-1.33z"
        fill={props.color}
      />
    </Svg>
  )
}
Money.defaultProps={
    color: Colors.K250
  }
export default Money
