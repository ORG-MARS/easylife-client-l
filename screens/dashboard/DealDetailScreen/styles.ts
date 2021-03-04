import { scalePx2dp, deviceWidthDp , deviceHeightDp} from '../../../common/util';
import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1
    },
    headerTitleStyle:{
        fontSize: scalePx2dp(17),
        color: '#ffff',
        width: scalePx2dp(70),
        textAlign: 'center',
    },
    goback: {
        width: scalePx2dp(70),
    },
    checkHistory:{
        borderRadius: scalePx2dp(25),
        backgroundColor: '#ffffff',
    },
    checkHistoryText: {
        color: '#5C5C5C',
        fontSize: scalePx2dp(12),
        paddingVertical: scalePx2dp(5),
        paddingHorizontal: scalePx2dp(10),
    },
    directionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    barBox: {
        backgroundColor: '#77C998',
        width: '100%',
        flexDirection: 'row',
        paddingTop: scalePx2dp(50),
        paddingBottom: scalePx2dp(12),
        position: 'absolute',
        paddingHorizontal: scalePx2dp(17),
        zIndex: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainBox: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scalePx2dp(50),
        borderTopRightRadius: scalePx2dp(50),
        position: 'relative',
        zIndex: 2,
        paddingTop: scalePx2dp(10),
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
        paddingHorizontal: scalePx2dp(17),
        marginTop: -scalePx2dp(100)
    },
    // list group
    agreeBox: {
        backgroundColor: '#ffffff',
        paddingHorizontal: scalePx2dp(12),
        paddingTop: scalePx2dp(20),
        borderRadius: scalePx2dp(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    },
    agBrief: {
        position: 'relative',
        height: scalePx2dp(32),
    },
    ags: {
        width: scalePx2dp(32),
        height: scalePx2dp(32),
        position: 'absolute',
        left: '50%',
        top: 0,
        marginLeft: -scalePx2dp(16),
    },
    agPicBox: {
        width: '50%',
        position: 'relative'
    },
    agpic: {
        width: scalePx2dp(32),
        height: scalePx2dp(32),
        borderRadius: 50,
        borderColor: 'rgba(21, 8, 205, .2)',
        borderWidth: 1,
        position: 'absolute',
        zIndex: 2
    },
    agpicLeft: {
        left: 0,
    },
    agpicRight: {
        right: 0,
    },
    agsfBox: {
        height: scalePx2dp(20),
        marginTop: scalePx2dp(6),
        justifyContent: 'center'
    },
    agsf: {
        color: '#343434',
        fontSize: scalePx2dp(11),
        textAlign: 'center'
    },
    agTextLeft: {
        backgroundColor: 'rgba(21, 8, 205, .1)',
    },
    agTextRight: {
        backgroundColor: 'rgba(255, 198, 2, .1)'
    },
    agBit: {
        marginTop: scalePx2dp(12),
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    agBitPic: {
        width: scalePx2dp(25),
        height: scalePx2dp(25),
        borderRadius: 50,
        borderColor: 'rgba(21, 8, 205, .2)',
        borderWidth: 1,
    },
    agBitTxt: {
        width: scalePx2dp(225),
        fontSize: scalePx2dp(12),
        color: '#6C6C6C',
        lineHeight: scalePx2dp(17),
        marginLeft: scalePx2dp(12),
        alignSelf: 'center'
    },
    time: {
        fontSize: scalePx2dp(9),
        color: '#9D9D9D',
        lineHeight: scalePx2dp(17),
        marginLeft: scalePx2dp(12),
        alignSelf: 'center'
    },
    check: {
        width: scalePx2dp(14),
        height: scalePx2dp(14),
        marginLeft: scalePx2dp(5),
        marginTop: scalePx2dp(5),
    },
    agText: {
        fontSize: scalePx2dp(14),
        color: '#343434',
        lineHeight: scalePx2dp(20),
        marginVertical: scalePx2dp(12),
        textAlign: 'justify'
    },
    agImgBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: scalePx2dp(15),
    },
    agShowPic: {
        width: scalePx2dp(97),
        height: scalePx2dp(97),
        marginRight: scalePx2dp(14),
    },
    hr2: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(0,0,0,.05)',
        marginBottom: scalePx2dp(15),
    },
    agPop: {
        marginBottom: scalePx2dp(15),
        height: scalePx2dp(22),
        flexDirection: 'row',
        borderBottomColor: 'rgba(151, 151, 151, .1)',
        borderBottomWidth: 1,
        paddingBottom: scalePx2dp(7)
    },
    agPopNum: {
        fontSize: scalePx2dp(12),
        color: '#343434',
        lineHeight: scalePx2dp(12),
        marginRight: scalePx2dp(35),
    },
    agPopPl: {
        color: '#77C998'
    },
    comLi: {
        flexDirection: 'row',
        marginBottom: scalePx2dp(10)
    },
    clPic: {
        width: scalePx2dp(31),
        height: scalePx2dp(31),
        borderRadius: scalePx2dp(50),
        marginRight: scalePx2dp(10)
    },
    clRightBox: {
        flex: 1,
        paddingBottom: scalePx2dp(12),
        borderBottomColor: 'rgba(151, 151, 151, .1)',
        borderBottomWidth: 1,
    },
    clBit: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    clName: {
        fontSize: scalePx2dp(14),
        color: '#A6A6A6',
    },
    clTime: {
        fontSize: scalePx2dp(9),
        color: '#A6A6A6',
        lineHeight: scalePx2dp(17)
    },
    clText: {
        fontSize: scalePx2dp(12),
        color: '#A6A6A6',
        lineHeight: scalePx2dp(15),
        textAlign: 'justify'
    },
    btmBtn: {
        // height: scalePx2dp(60),
        width: deviceWidthDp - scalePx2dp(40),
        left: scalePx2dp(20),
        position: 'absolute',
        top: deviceHeightDp - scalePx2dp(70),
        zIndex: 111
    }
});
