
import { WebSocketDomain } from '../../constants'
import { Alert } from 'react-native'
export var websocket:any;

function init(userId?:number){
    if(!userId) return
    //ws地址
    var wsuri = `${WebSocketDomain}/message/user-${userId}/`
    try {
        websocket = new WebSocket(wsuri);
    } catch (e) {
        Alert.alert('您的浏览器暂时不支持 webSocket ');
    }
 
    //连接发生错误的回调方法
    websocket.onerror = function () {
        websocket.close();
    }
}
 
/***
 *	webSocket 自动接收数据
 *  给外部预留接口，方便页面实时获取新内容
 *  传递方法（messageCallback）进来，给方法赋返回值（websocket接收到的数据）
 */
export function onMessage(messageCallback:Function) { 
    websocket.onmessage = function (e:{data:string}) {
        if (typeof(messageCallback) === 'function') {
            messageCallback(JSON.parse(e.data));
        }
    }
}
 
// webSocket 发送消息方法
export function sendSockTable(agentData:{}) {
	if (websocket && websocket.readyState === websocket.OPEN) {
        //若是ws开启状态
        webSocketSend(agentData)
    } else if (websocket && websocket?.readyState === websocket.CONNECTING) {
        // 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
            sendSockTable(agentData);
        }, 1000);
    } else {
        // 若未开启 ，则等待1s后重新调用
        setTimeout(function () {
            sendSockTable(agentData);
        }, 1000);
    }
}
 
// 数据发送
export function webSocketSend(agentData:{}) {
    websocket.send(JSON.stringify(agentData));
}
 
// webSocket 关闭
export function webSocketClose() {
    if(!websocket) return
	websocket.close();
}
 
// webSocket 初始化
export function webSocketInit(userId?:number) {
	init(userId);
}
 
// 关闭并重新链接
export function webSocketRestart(userId?:number) {
    if(websocket) {
        websocket.close();
    }
    init(userId);
}
