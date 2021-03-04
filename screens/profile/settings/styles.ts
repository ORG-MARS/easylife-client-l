import { scalePx2dp, deviceWidthDp, deviceHeightDp } from '../../../common/util';
import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';

const touxiang = require('../../../assets/images/profile/touxiang.png')
const edit = require('../../../assets/images/profile/edit.png')
const clear = require('../../../assets/images/profile/clear.png')
const ques = require('../../../assets/images/profile/ques.png')
const guanyu = require('../../../assets/images/profile/guanyu.png')
const logout = require('../../../assets/images/profile/logout.png')


export const IconUrl = {
    touxiang,
    edit,
    clear,
    ques,
    guanyu,
    logout
}

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1
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
    headerTitleStyle: {
        fontSize: scalePx2dp(17),
        color: '#ffff',
        width: scalePx2dp(70),
        textAlign: 'center',
    },
    goback: {
        width: scalePx2dp(70),
    },
    cell: {
        width: 50
    },
    directionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mainBox: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: scalePx2dp(50),
        borderTopRightRadius: scalePx2dp(50),
        position: 'relative',
        zIndex: 2,
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
    shadowBox: {
        backgroundColor: '#ffffff',
        paddingHorizontal: scalePx2dp(12),
        borderRadius: scalePx2dp(20),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
    },
    itemBox: {
        flexDirection: 'row',
        height: scalePx2dp(70),
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.05)'
    },
    itemIcon: {
        marginRight: scalePx2dp(10)
    },
    iTextBox: {
        flex: 1
    },
    iText: {
        fontSize: scalePx2dp(14),
        color: '#6F6F6F',
    },
    arrIcon: {
        width: scalePx2dp(9),
        height: scalePx2dp(14)
    }
});
