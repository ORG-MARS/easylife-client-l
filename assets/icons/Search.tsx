import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { IconProps } from './index'
import { Colors } from '../../constants'

function Search(props:IconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.187 14.472h.79l4.24 4.26c.41.41.41 1.08 0 1.49-.41.41-1.08.41-1.49 0l-4.25-4.25v-.79l-.27-.28a6.5 6.5 0 01-5.34 1.48c-2.78-.47-5-2.79-5.34-5.59a6.505 6.505 0 017.27-7.27c2.8.34 5.12 2.56 5.59 5.34a6.5 6.5 0 01-1.48 5.34l.28.27zm-9.71-4.5c0 2.49 2.01 4.5 4.5 4.5s4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5-4.5 2.01-4.5 4.5z"
        fill={props.color}
      />
    </Svg>
  )
}

Search.defaultProps={
    color: Colors.K250
}

export default Search
