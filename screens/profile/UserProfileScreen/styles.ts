import { scalePx2dp, deviceWidthDp, deviceHeightDp } from '../../../common/util';
import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    directionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    barBox: {
        backgroundColor: '#77C998',
        width: '100%',
        flexDirection: 'row',
        height: scalePx2dp(98),
        paddingTop: scalePx2dp(60),
        position: 'absolute',
        paddingHorizontal: scalePx2dp(17),
        zIndex: 10,
        justifyContent: 'space-between',
    },
    mainBox: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scalePx2dp(50),
        borderTopRightRadius: scalePx2dp(50),
        position: 'relative',
        zIndex: 2,
        paddingHorizontal: scalePx2dp(17),
    },
    shadowLeft: {
        backgroundColor: '#77C998',
        width: scalePx2dp(100),
        height: scalePx2dp(100),
        position: 'absolute',
        left: 0,
        bottom: -50
    },
    shadowBottom: {
        backgroundColor: '#ffffff',
        width: '100%',
        height: scalePx2dp(100),
        position: 'absolute',
        left: 0,
        bottom: -scalePx2dp(98),
        borderTopLeftRadius: scalePx2dp(50),
    },
    bitBox: {
        backgroundColor: '#77C998',
        width: '100%',
        height: scalePx2dp(190),
        borderBottomLeftRadius: scalePx2dp(50),
        borderBottomRightRadius: scalePx2dp(50),
    },
    wrapBox: {
        height: 5000,
        marginTop: -scalePx2dp(100),
        backgroundColor: '#ffffff',
        // paddingTop: scalePx2dp(20),
        borderRadius: scalePx2dp(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        position: 'relative'
    },
    avatarBox: {
        width: 88,
        height: 88,
        borderRadius: 88,
        borderWidth: 1,
        borderColor: '#ffffff',
        position: 'absolute',
        top: -44,
        left: '50%',
        marginLeft: -44,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 76,
        marginLeft: 5,
        marginTop: 5,
    },
    userInfoP: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: scalePx2dp(22),
        paddingHorizontal: scalePx2dp(100),
        marginTop: 55,
        marginBottom: 20,
    },
    userName: {
        fontSize: scalePx2dp(16),
        color: '#363636',
    },
    userTag: {
        width: scalePx2dp(80),
        height: scalePx2dp(22),
        borderColor: '#77C998',
        borderWidth: 1,
        borderRadius: scalePx2dp(22),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    super: {
        width: scalePx2dp(14),
        height: scalePx2dp(14),
        marginRight: scalePx2dp(3)
    },
    userTagTxt: {
        fontSize: scalePx2dp(10),
        color: '#77C998',
    },
    userDeal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomColor: '#E5E5E5',
        borderBottomWidth: 1,
        width: scalePx2dp(193),
        marginLeft: scalePx2dp(74),
        paddingBottom: scalePx2dp(8),
        marginBottom: scalePx2dp(15)
    },
    udSpan: {
        flexDirection: 'row',
    },
    udNum: {
        fontSize: scalePx2dp(12),
        color: '#7A7A7A',
    },
    udText: {
        fontSize: scalePx2dp(12),
        color: '#AFAFAF',
    },
    signature: {
        fontSize: scalePx2dp(10),
        color: '#959595',
        textAlign: 'center'
    },
    addBtnBox: {
        backgroundColor: '#77C998',
        width: scalePx2dp(281),
        height: scalePx2dp(46),
        marginLeft: scalePx2dp(30),
        marginTop: scalePx2dp(28),
        marginBottom: scalePx2dp(20),
        borderRadius: scalePx2dp(46),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    addIcon: {
        marginHorizontal: scalePx2dp(6),
        width: scalePx2dp(16),
        height: scalePx2dp(16)
    },
    addText: {
        marginHorizontal: scalePx2dp(6),
        fontSize: scalePx2dp(16),
        color: '#FFFFFF',
    },
    tabViewBox: {
        paddingHorizontal: scalePx2dp(12),
        height: 500
    }
});
