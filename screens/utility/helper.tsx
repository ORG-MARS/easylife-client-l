import moment from 'moment'
import { Dimensions } from 'react-native'
import 'moment/locale/zh-cn'

export function dateToFromNowDaily( myDate: string ) {

    // get from-now for this date
    // var fromNow = moment( myDate ).fromNow();
    moment.locale('zh-cn')
    // ensure the date is displayed with today and yesterday
    return moment( myDate ).calendar( null, {
        // when the date is closer, specify custom values
        lastWeek: 'MM-DD ',
        lastDay:  '[昨天]',
        sameDay:  '[今天]',
        nextDay:  '[明天]',
        nextWeek: 'dddd',
        sameElse: 'MM-DD ',
        // when the date is further away, use from-now functionality             
        // sameElse: function () {
        //     return "[" + fromNow + "]";
        // }
    });
}

export function getHeaderPadding(){
    const windowHeight = Dimensions.get('window').height;
    switch(true){
        // iPhone 11, 12
        case windowHeight > 843 && windowHeight < 1024:
            return 35;
        // iPad
        case windowHeight > 1024:
        default:
            return 20;
    }
}

export function getFooterPadding(){
    const windowHeight = Dimensions.get('window').height;
    switch(true){
        // iPhone 11, 12
        case windowHeight > 843 && windowHeight < 1024:
            return 30;
        case windowHeight > 1024:
        default:
            return 10;
    }
}

export function getTabFooterPadding(){
    const windowHeight = Dimensions.get('window').height;
    switch(true){
        // iPhone 11, 12
        case windowHeight > 843 && windowHeight < 1024:
            return 20;
        case windowHeight > 1024:
        default:
            return 0;
    }
}

export function getInputHeight(){
    const windowHeight = Dimensions.get('window').height;
    switch(true){
      // android
      case windowHeight < 667:
        return { marginBottom: 80, paddingBottom: 10, height: 60 };
      // iPhone 11, 12
      case windowHeight > 843 && windowHeight < 1024:
          return { marginBottom: 70, paddingBottom: 30, height: 80 };
      case windowHeight > 1024:
      default:
          return { marginBottom: 60, paddingBottom: 10, height: 60 };
    }
  }


/**
 * @author liruinan
 */
export const deviceWidthDp = Dimensions.get('window').width;
const uiWidthPx = 375

export const scalePx2dp = (uiElementPx: number) => {
    return uiElementPx * deviceWidthDp / uiWidthPx
}

export const dateFormat = (ms: number, fmt: string) => {
    /**
     * 时间格式化，将13位时间戳格式化为时间字符串
     * @param {number/string} [ms] 需要转换的毫秒值
     * @param {string} [fmt] 输出格式，不传默认为 {yyyy-MM-dd hh:mm:ss}
     * @return {string} 返回转换后的时间字符串
     */
    const date = new Date(ms);
    fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
    const o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    /*eslint no-unused-vars:0*/
    for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? (o as any)[k] : ('00' + (o as any)[k]).substr(('' + o[k]).length));
    return fmt;
};