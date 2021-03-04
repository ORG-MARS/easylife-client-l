import AsyncStorage from '@react-native-community/async-storage';
import React, { useReducer, useEffect, useContext } from 'react';
import Uri from 'jsuri'
import axios from 'axios';

import { API } from '../../constants'
import { AuthContext } from '../../reducers'
import { MessageContext, initialMessageState, MessageTypes, messageReducer } from '../../reducers/MessageReducer'
import { webSocketInit, webSocketClose, onMessage, sendSockTable, webSocketRestart, websocket } from './webSocket'
import registerForPushNotificationsAsync from './registerForPushNotification';
import { DEAL_STATUS, NOTIFICATION_TYPE, Models } from '../../types'

export default function MessageProvider({children}:{children:any}) {
    const { state: userState } = useContext(AuthContext);
  const [messageState, messageDispatch] = useReducer(messageReducer, initialMessageState)

  useEffect(() => {
    getMessagesAndNotifications();
  }, []);

  useEffect(() => {
    if (userState.user?.user_id) {
      webSocketInit(userState.user?.user_id)
      fetchUnread()
      onMessage(onReceiveMessage)
    }else{
      webSocketClose()
    }
    return () => {
      webSocketClose()
    };
  }, [userState.user?.user_id]);

  const getMessagesAndNotifications = async () => {
    let rooms: string | null = JSON.stringify({});
    let notifications: string | null = JSON.stringify([]);
    try {
      let payload = {type: MessageTypes.RESTORE_DATA, rooms, notifications}
      rooms = await AsyncStorage.getItem('rooms');
      notifications = await AsyncStorage.getItem('notifications');
      if(rooms){
        payload.rooms = rooms
      }
      if(notifications){
        payload.notifications = notifications
      }
      messageDispatch(payload);
    }catch(e){}
  }

  async function updatePnsToken(){
    if(!userState.user?.user_id) return
    const token = await registerForPushNotificationsAsync()
    await axios.patch(`${API}/user-profile/${userState.user?.user_id}/`,{ pns_token:token })
  }

  function isWebSocketClosed(){
    if(!websocket){
      return true
    }
    if(websocket?.readyState !== websocket.OPEN && websocket?.readyState !== websocket.CONNECTING){
      return true
    }
    return false
  }

  async function restartWebSocket(){
    if(userState.user?.user_id){
      webSocketRestart(userState.user?.user_id)
    }
    onMessage(onReceiveMessage)
  }

  async function closeWebSocket(){
    webSocketClose()
  }

  function onReceiveMessage(newMessage:any) {
      switch (newMessage.message.type){
        case MessageTypes.NEW_MESSAGE_RECEIVE:
          messageDispatch({
            type: MessageTypes.NEW_MESSAGE_RECEIVE,
            message: newMessage.message,
            currentUser: userState.user?.user_id
          }); 
          break;
        case MessageTypes.CONTACT_ADDED:
            fetchContacts()
            messageDispatch({
                type: newMessage.message.type,
                notification: newMessage.message,
            });
            break;
        case MessageTypes.DEAL_REQUEST_APPROVED:
        case MessageTypes.DEAL_APPROVED:
        case MessageTypes.DEAL_CANCELLED:
            fetchDeals()
            messageDispatch({
                type: newMessage.message.type,
                notification: newMessage.message,
            });
            break;
        case MessageTypes.CONTACT_REQUEST:
        case MessageTypes.DEAL_REQUEST:
        case MessageTypes.DEAL_REQUEST_REJECTED:
        case MessageTypes.DEAL_COMMENT:
        case MessageTypes.DEAL_LIKE:
        case MessageTypes.DEAL_PUBLISHED:
          messageDispatch({
            type: newMessage.message.type,
            notification: newMessage.message,
          });
          break;
      }
  }

  async function fetchUnreadMessages () {
    if(!userState.user?.user_id) return
    const messagesRes = await axios.get(
      new Uri(`${API}/messages/`)
      .addQueryParam('un_read_receipt', userState.user?.user_id)
      .addQueryParam('order', 'id')
      .toString()
    )
    messageDispatch({type: MessageTypes.FETCH_UNREAD, messages: messagesRes.data.results})
    fetchDeals()
  };

  async function fetchUnreadNotifications () {
    if(!userState.user?.user_id) return
    const notificationRes = await axios.get(
      new Uri(`${API}/notifications/`)
      .addQueryParam('is_read', false)
      .toString()
    )
    const index = notificationRes.data.findIndex((e: Models.Notification) => e.type === NOTIFICATION_TYPE.CONTACT_ADDED)
    if(index > -1){
        fetchContacts()
    }
    messageDispatch({type: MessageTypes.FETCH_UNREAD, notifications: notificationRes.data})
  };

  async function fetchUnread () {
    fetchUnreadMessages()
    fetchUnreadNotifications()
  };

  async function sendMessage(message: any){
    if(isWebSocketClosed()){
        webSocketRestart(userState.user?.user_id)
        onMessage(onReceiveMessage)
    }
    sendSockTable({
      message: {...message, message_type: 'message'}
    })
  }

  async function sendNotification(notification: any){
    if(isWebSocketClosed()){
        webSocketRestart(userState.user?.user_id)
        onMessage(onReceiveMessage)
    }
    sendSockTable({
      message: notification
    })
  }

  async function fetchContacts(){
    const url = new Uri(`${API}/friends/`)
    .addQueryParam('page', 1)
    .addQueryParam('page_size', 20)
    const res = await axios.get(url.toString())
    AsyncStorage.setItem('contacts', JSON.stringify(res.data))
    messageDispatch({
        type: MessageTypes.SET_STATE,
        payload: { contactRefresh: true },
    });
  }

  async function fetchDeals(){
    if(!userState.user?.user_id) return
    const res = await axios.get(new Uri(`${API}/deals/`)
    .addQueryParam('ordering', '-created_time')
    .addQueryParam('user', userState.user?.user_id)
    .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
    .toString())
    AsyncStorage.setItem('deals', JSON.stringify(res.data))
    messageDispatch({
        type: MessageTypes.SET_STATE,
        payload: { dealRefresh: true },
    });
  }

    return (
        <MessageContext.Provider value={{
            state: messageState, 
            dispatch: messageDispatch,
            context: {
                updatePnsToken,
                isWebSocketClosed,
                restartWebSocket,
                closeWebSocket,
                sendMessage,
                sendNotification,
                fetchUnread,
                fetchUnreadMessages,
                fetchUnreadNotifications,
                fetchContacts,
                fetchDeals
            },
            }}>
          {children}
        </MessageContext.Provider>
    );
}