import { Dimensions } from 'react-native';

export const deviceWidthDp = Dimensions.get('window').width;
export const deviceHeightDp = Dimensions.get('window').height;
export const deviceScale = Dimensions.get('window').scale;


const uiWidthPx = 375

export const scalePx2dp = (uiElementPx: number) => {
    return uiElementPx * deviceWidthDp / uiWidthPx
}