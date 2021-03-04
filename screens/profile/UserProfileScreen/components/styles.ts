import { scalePx2dp, deviceWidthDp, deviceHeightDp } from '../../../../common/util';
import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export const styles = StyleSheet.create({
    scene: {
        flex: 1,
        height: 222,
    },
    tabBar: {
        backgroundColor: '#ffffff',
        marginBottom: scalePx2dp(30)
    },
    indicatorStyle: {
        backgroundColor: '#77C998',
        height: scalePx2dp(4),
    },
    labelStyle: {
        fontSize: scalePx2dp(14),
    },
    // item 单元
    itemBox: {
        flexDirection: 'row',
        paddingBottom: scalePx2dp(20),
        borderBottomColor: 'rgba(0,0,0,.05)',
        borderBottomWidth: 1,
        marginBottom: scalePx2dp(20)
    },
    ipic: {
        width: scalePx2dp(72),
        height: scalePx2dp(72),
        marginRight: scalePx2dp(15),
        borderRadius: scalePx2dp(5)
    },
    irightBox: {
        flex: 1,
        justifyContent: 'space-between'
    },
    iTxt: {
        fontSize: scalePx2dp(12),
        color: '#343434',
        lineHeight: scalePx2dp(17)
    },
    iDateBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    iDatePic: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    idAvatar: {
        width: scalePx2dp(17),
        height: scalePx2dp(17),
        marginRight: scalePx2dp(5),
        borderRadius: 17
    },
    idIcon: {
        width: scalePx2dp(10),
        height: scalePx2dp(10),
        marginRight: scalePx2dp(5),
    },
    idTime: {
        fontSize: scalePx2dp(10),
        color: '#B5B5B5',
        alignSelf: 'flex-end'
    },
});