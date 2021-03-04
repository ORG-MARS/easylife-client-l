import AsyncStorage from '@react-native-community/async-storage';
import {createContext } from 'react';
import { Models } from '../types'

export type AvatarState = {
    avatars: {[key:string]:string}
  }
  
export type AvatarAction = {
    type: AvatarTypes, 
    user?: Models.User,
    users?: Models.User[],
    avatars?: string,
    payload?: Partial<AvatarState>,
  }
  
export const initialAvatarState: AvatarState = {
    avatars: {},
};
  
export enum AvatarTypes {
    SET_STATE = "SET_STATE",
    SET_AVATARS = "SET_AVATARS",
    SET_AVATAR = "SET_AVATAR",
    UPDATE_AVATAR = "UPDATE_AVATAR",
    RESTORE_DATA = "RESTORE_DATA"
}
   
  export function avatarReducer(state:AvatarState, action: AvatarAction) {
    let newAvatars = {...state.avatars}
    switch (action.type) {
      case AvatarTypes.SET_STATE:
        return { ...state, ...action.payload };
    case AvatarTypes.SET_AVATARS:
        if(!action?.users) return {...state}
        action.users.forEach(e => newAvatars[e.user_id]=e.avatar)
        AsyncStorage.setItem('avatars', JSON.stringify(newAvatars)) 
        return { ...state, ...action.payload };
      case AvatarTypes.SET_AVATAR:
      case AvatarTypes.UPDATE_AVATAR:
        if(!action.user?.user_id || !action.user?.avatar) return {...state}
        newAvatars[action.user.user_id] = action.user?.avatar
        AsyncStorage.setItem('avatars', JSON.stringify(newAvatars)) 
        return { 
          ...state, 
          avatars: newAvatars
        };
      case AvatarTypes.RESTORE_DATA:
        let avatars = action.avatars ? JSON.parse(action.avatars) : []
        return { 
          ...state, 
          avatars
        };
      default:
        return state;
    }
  }
  
  export const AvatarContext = createContext<{
    state: AvatarState;
    dispatch: (action: AvatarAction) => void;
  }>({
    state: initialAvatarState,
    dispatch: () => {}
  });
  