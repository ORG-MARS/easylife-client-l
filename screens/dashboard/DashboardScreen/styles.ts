import { scalePx2dp, deviceWidthDp } from '../../../common/util';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    directionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    barBox: {
        backgroundColor: '#77C998',
        width: '100%',
        height: scalePx2dp(98),
        paddingTop: scalePx2dp(50),
        position: 'absolute',
        paddingHorizontal: scalePx2dp(17),
        zIndex: 10
    },
    barInnerBox: {
        backgroundColor: '#77C998',
        borderBottomWidth: scalePx2dp(2),
        borderBottomColor: 'rgba(255, 255, 255, .5)',
        flex: 1,
    },
    logo: {
        width: scalePx2dp(32),
        height: scalePx2dp(32),
    },
    searchBar: {
        width: scalePx2dp(286),
        height: scalePx2dp(32),
        borderRadius: scalePx2dp(32),
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    shadowLeft: {
        backgroundColor: '#77C998',
        width: scalePx2dp(100),
        height: scalePx2dp(100),
        position: 'absolute',
        left: 0,
        bottom: -50
    },
    searchIcon: {
        width: scalePx2dp(19),
        height: scalePx2dp(19),
        marginHorizontal: scalePx2dp(9),
        marginVertical: scalePx2dp(7)
    },
    input: {
        width: scalePx2dp(190),
        height: scalePx2dp(32),
        fontSize: scalePx2dp(20),
    },
    searchButton: {
        width: scalePx2dp(54),
        height: scalePx2dp(32),
    },
    textStyle: {
        fontSize: scalePx2dp(20),
        color: '#000000'
    },
    bitBox: {
        backgroundColor: '#77C998',
        height: scalePx2dp(190),
        paddingTop: scalePx2dp(110),
        borderBottomLeftRadius: scalePx2dp(50),
        borderBottomRightRadius: scalePx2dp(50),
        position: 'relative',
    },
    numBox: {
        paddingHorizontal: scalePx2dp(17),
        marginBottom: scalePx2dp(15)
    },
    numText: {
        width: scalePx2dp(100),
        fontSize: scalePx2dp(14),
        color: '#ffffff',
        textAlign: 'center',
    },
    cellBox: {
        paddingHorizontal: scalePx2dp(17),
    },
    cell: {
        width: scalePx2dp(100),
        height: scalePx2dp(32),
        borderRadius: scalePx2dp(32),
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: scalePx2dp(5)

    },
    imgCell: {
        width: scalePx2dp(23),
        height: scalePx2dp(23),
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    peNumIcon: {
        width: scalePx2dp(12),
        height: scalePx2dp(12),
    },
    bitebiIcon: {
        width: scalePx2dp(10),
        height: scalePx2dp(14),
    },
    dateIcon: {
        width: scalePx2dp(14),
        height: scalePx2dp(14),
    },
    cellText: {
        width: scalePx2dp(100),
        fontSize: scalePx2dp(9),
        color: '#ffffff',
        lineHeight: scalePx2dp(24),
        flex: 1,
        textAlign: 'center'
    },
    mainBox: {
        backgroundColor: '#ffffff',
        minHeight: scalePx2dp(1000),
        borderTopLeftRadius: scalePx2dp(50),
        borderTopRightRadius: scalePx2dp(50),
        position: 'relative',
        zIndex: 2,
        paddingHorizontal: scalePx2dp(17),
        paddingTop: scalePx2dp(30),
    },

    // list group
    agreeBox: {
        backgroundColor: '#ffffff',
        paddingHorizontal: scalePx2dp(10),
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
        marginTop: -scalePx2dp(16),
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
    agsfBox:{
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
        marginLeft: scalePx2dp(10),
        alignSelf: 'center'
    },
    time: {
        fontSize: scalePx2dp(9),
        color: '#9D9D9D',
        lineHeight: scalePx2dp(17),
        marginLeft: scalePx2dp(10),
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
        marginVertical: scalePx2dp(10),
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
    agPop: {
        marginBottom: scalePx2dp(12),
        height: scalePx2dp(15),
        flexDirection: 'row',
        alignItems: 'center'
    },
    agPopIcon: {
        width: scalePx2dp(15),
        height: scalePx2dp(15),
        resizeMode: 'center',
    },
    l150: {
        marginLeft: scalePx2dp(150),
    },
    l45: {
        marginLeft: scalePx2dp(45),
    },
    agPopNum: {
        fontSize: scalePx2dp(10),
        color: '#343434',
        lineHeight: scalePx2dp(12),
        marginLeft: scalePx2dp(7),
    }
});
