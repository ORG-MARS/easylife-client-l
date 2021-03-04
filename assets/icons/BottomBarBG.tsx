import * as React from "react"
import Svg, { Defs, Path, G, Use } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title, filter */
import { IconProps } from './index'

function SvgComponent(props: IconProps) {
    return (
        <Svg
            width={375}
            height={94}
            viewBox="0 0 375 94"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            {...props}
        >
            <Defs>
                <Path
                    d="M154.153 9.998c-.101.486-.153.987-.153 1.502 0 18.502 14.998 33.5 33.5 33.5 18.502 0 33.5-14.998 33.5-33.5 0-.515-.052-1.016-.153-1.502L336 10c21.54 0 39 17.46 39 39v45H0V49c0-21.54 17.46-39 39-39z"
                    id="prefix__b"
                />
            </Defs>
            <G fill="none" fillRule="evenodd">
                <Use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
                <Use fill="#FFF" xlinkHref="#prefix__b" />
            </G>
        </Svg>
    )
}

export default SvgComponent
