import AsyncStorage from '@react-native-community/async-storage';
import { createContext } from 'react';
import axios from 'axios'

import { API } from '../constants'
import { Models, DEAL_STATUS } from '../types'

export type MessageState = {
    // each room can store 20 max messages in store
    rooms: {
      [key:string]: Models.Room;
    },
    notifications: Models.Notification[],
    dealDetail:{
      sender_avatar: string,
      sender_id: number,
      status: DEAL_STATUS,
      user: number,
      is_public: boolean,
      description: string
    },
    dealRefresh: boolean,
    contactRefresh: boolean,
    messageUnread: number,
  }
  
export type MessageAction = {
    type: MessageTypes, 
    message?:  Models.Message,
    rooms?: string,
    roomId?: string,
    notifications?: string | Models.Notification[],
    notification?: Models.Notification,
    notificationId?: number,
    currentUser?: number,
    dealDetail?: {
      sender_avatar?: string,
      sender_id?: number,
      status?: DEAL_STATUS,
      user?: number,
      is_public?: boolean,
      description:string
    },
    payload?: any,
    messages?:Models.Message[]
  }
  
export type MessageContextProps = {
  updatePnsToken: () => any,
  isWebSocketClosed: () => boolean,
  restartWebSocket: () => any,
  closeWebSocket: () => any,
  fetchUnread: () => any,
  fetchUnreadMessages: () => any,
  fetchUnreadNotifications: () => any,
  sendMessage: (message:any) => any,
  sendNotification: (notification:any) => any,
  fetchContacts: () => any,
  fetchDeals: () => any
}

export const initialMessageState: MessageState = {
    rooms: {},
    notifications:[],
    dealDetail: {
      sender_avatar: '',
      sender_id: 0,
      status: 0,
      user: 0,
      is_public: true,
      description: '',
    },
    dealRefresh: false,
    contactRefresh: false,
    messageUnread: 0,
};
  
export enum MessageTypes {
    SET_STATE = 'SET_STATE',
    NEW_MESSAGE_RECEIVE = 'NEW_MESSAGE_RECEIVE',
    CONTACT_REQUEST = 'CONTACT_REQUEST',
    CONTACT_REQUEST_RESPONSED = 'CONTACT_REQUEST_RESPONSED',
    CONTACT_ADDED = 'CONTACT_ADDED',
    DEAL_REQUEST = 'DEAL_REQUEST',
    DEAL_REQUEST_APPROVED = 'DEAL_REQUEST_APPROVED',
    DEAL_REQUEST_REJECTED = 'DEAL_REQUEST_REJECTED',
    DEAL_REQUEST_RESPONSED = 'DEAL_REQUEST_RESPONSED',
    DEAL_APPROVED = 'DEAL_APPROVED',
    DEAL_CANCELLED = 'DEAL_CANCELLED',
    DEAL_COMMENT = 'DEAL_COMMENT',
    DEAL_LIKE = 'DEAL_LIKE',
    DEAL_PUBLISHED = 'DEAL_PUBLISHED',
    RESTORE_DATA = 'RESTORE_DATA',
    UPDATE_UNREAD_MESSAGE = 'UPDATE_UNREAD_MESSAGE',
    UPDATE_UNREAD_NOTIFICATION = 'UPDATE_UNREAD_NOTIFICATION',
    FETCH_UNREAD = 'FETCH_UNREAD',
    DELETE_NOTIFICATION = 'DELETE_NOTIFICATION'
}
   
  export function messageReducer(state:MessageState, action: MessageAction) {
    let newRooms = {...state.rooms}
    let newNotifications = [...state.notifications]
    switch (action.type) {
      case MessageTypes.CONTACT_REQUEST:
      case MessageTypes.CONTACT_ADDED:
      case MessageTypes.DEAL_REQUEST:
      case MessageTypes.DEAL_REQUEST_APPROVED:
      case MessageTypes.DEAL_REQUEST_REJECTED:
      case MessageTypes.DEAL_APPROVED:
      case MessageTypes.DEAL_CANCELLED:
      case MessageTypes.DEAL_COMMENT:
      case MessageTypes.DEAL_LIKE:
      case MessageTypes.DEAL_PUBLISHED:
        if(!action.notification) return {...state}
        newNotifications.unshift(action.notification)
        AsyncStorage.setItem('notifications', JSON.stringify([...newNotifications]))
        let payload = { 
          ...state, 
          notifications: newNotifications
        }
        if([MessageTypes.DEAL_CANCELLED, MessageTypes.DEAL_APPROVED, MessageTypes.DEAL_REQUEST_APPROVED].includes(action.type)){
          if(action.type === MessageTypes.DEAL_CANCELLED){
            delete newRooms[`room-deal-${action.notification.target_id}`]
          } else if(action.type === MessageTypes.DEAL_APPROVED){
            axios.get(`${API}/deal-details/${action.notification.target_id}/`).then(res =>{
              if(res.data.status === DEAL_STATUS.COMPLETE){
                // @ts-ignore
                delete newRooms[`room-deal-${action.notification.target_id}`]
              }
            })
          }
        }
        AsyncStorage.setItem('rooms', JSON.stringify({...newRooms})) 
        payload.rooms = {...newRooms}
        return payload
      case MessageTypes.CONTACT_REQUEST_RESPONSED:
      case MessageTypes.DEAL_REQUEST_RESPONSED:
      case MessageTypes.DELETE_NOTIFICATION:
        if(!action.notification) return {...state}
        // @ts-ignore
        newNotifications = newNotifications.filter(e=> e.id !== action.notification.id)
        AsyncStorage.setItem('notifications', JSON.stringify([...newNotifications]))
        return { 
          ...state, 
          notifications: newNotifications,
        };
      case MessageTypes.NEW_MESSAGE_RECEIVE:
        if(!action.message) return {...state}
        let newMessage = {...action.message}
        if(!newRooms[`room-deal-${newMessage.deal}`]){
          newRooms[`room-deal-${newMessage.deal}`] = {
            dealId: newMessage.deal,
            title: newMessage.deal_description, 
            unRead: 0, 
            messages: []
          }
        }
        if(newMessage.user !== action.currentUser){
          newRooms[`room-deal-${newMessage.deal}`].unRead ++
          newMessage.is_read = false
        }
        newRooms[`room-deal-${newMessage.deal}`].messages.push(newMessage)
        if(newRooms[`room-deal-${newMessage.deal}`].messages.length > 20){
          newRooms[`room-deal-${newMessage.deal}`].messages.shift()
        }
        AsyncStorage.setItem('rooms', JSON.stringify({...newRooms})) 
        return { 
          ...state, 
          rooms: newRooms,
        };
      case MessageTypes.UPDATE_UNREAD_MESSAGE:
        if(action.roomId) {
          newRooms[action.roomId].unRead = 0
          AsyncStorage.setItem('rooms', JSON.stringify({...newRooms}))
        }
        return { 
          ...state, 
          rooms: newRooms,
        };
      case MessageTypes.UPDATE_UNREAD_NOTIFICATION:
        if(!Number.isInteger(action.notificationId)) return {...state}
        // @ts-ignore
        const targetIndex = newNotifications.findIndex(e => e.id === action.notificationId)
        if(targetIndex>-1){
          newNotifications[targetIndex].is_read = true
        }
        AsyncStorage.setItem('notifications', JSON.stringify([...newNotifications])) 
        return { 
          ...state, 
          notifications: newNotifications,
        };
      case MessageTypes.FETCH_UNREAD:
        action.messages?.forEach(newMessage => {
          if(!newRooms[`room-deal-${newMessage.deal}`]){
            newRooms[`room-deal-${newMessage.deal}`] = {
              dealId: newMessage.deal,
              title: newMessage.deal_description, 
              unRead: 0, 
              messages: []
            }
          }
          if(newRooms[`room-deal-${newMessage.deal}`].messages.find(e=>e.id === newMessage.id) !== undefined) return
          if(newMessage.user !== action.currentUser){
            newRooms[`room-deal-${newMessage.deal}`].unRead ++
            newMessage.is_read = false
          }
          newRooms[`room-deal-${newMessage.deal}`].messages.push(newMessage)
          if(newRooms[`room-deal-${newMessage.deal}`].messages.length > 20){
            newRooms[`room-deal-${newMessage.deal}`].messages.shift()
          }
        })
        // @ts-ignore
        action.notifications?.forEach((newNotification:Models.Notification) => {
          if(newNotifications.findIndex(e => e.id === newNotification.id) < 0){
            newNotifications.unshift(newNotification)
          }
        })
        AsyncStorage.setItem('rooms', JSON.stringify({...newRooms})) 
        AsyncStorage.setItem('notifications', JSON.stringify([...newNotifications])) 
        return { 
          ...state, 
          rooms: newRooms,
          notifications: newNotifications,
        };
      case MessageTypes.RESTORE_DATA:
        let rooms = action.rooms ? JSON.parse(action.rooms) : []
        // @ts-ignore
        let notifications = action.notifications ? JSON.parse(action.notifications) : []
        return { 
          ...state, 
          rooms,
          notifications,
        };
      case MessageTypes.SET_STATE:
        if(action.payload.hasOwnProperty('deleteRoom')){
          delete newRooms[action.payload.deleteRoom]
          AsyncStorage.setItem('rooms', JSON.stringify({...newRooms}))
        }
        return {
          ...state,
          ...action.payload
        }
      default:
        return state;
    }
  }
  
  export const MessageContext = createContext<{
    state: MessageState;
    dispatch: (action: MessageAction) => void;
    context: MessageContextProps
  }>({
    state: initialMessageState,
    dispatch: () => {},
    context: {
      updatePnsToken: () => {},
      isWebSocketClosed: () => false,
      restartWebSocket: async () => {},
      closeWebSocket: async () => {},
      fetchUnread: async () => {},
      fetchUnreadMessages: async () => {},
      fetchUnreadNotifications: async () => {},
      sendMessage: async ({}) => {},
      sendNotification: async ({}) => {},
      fetchContacts: async () => {},
      fetchDeals: async () => {},
    }
  });
  