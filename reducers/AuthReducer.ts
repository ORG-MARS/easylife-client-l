import AsyncStorage from '@react-native-community/async-storage';
import {createContext } from 'react';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { Models } from '../types'

export type AuthState = {
    isLoading: boolean,
    isSignout: boolean,
    userToken: string | null | undefined,
    user: Models.User | undefined,
    refresh?:boolean
  }
  
export type AuthAction = {
    type: AuthTypes, 
    token?: string | null | undefined,
    user?: Models.User,
    payload?: Partial<AuthState>,
    avatar?: string | null,
    refresh?:boolean
  }
  
export const initialAuthState: AuthState = {
    isLoading: true,
    isSignout: false,
    userToken: "",
    user: undefined,
    refresh:false,
};
  
export enum AuthTypes {
    SET_STATE = "SET_STATE",
    SIGN_IN = "SIGN_IN",
    SIGN_OUT = "SIGN_OUT",
    RESTORE_TOKEN = "RESTORE_TOKEN"
}
   
  export function authReducer(state:AuthState, action: AuthAction): any {
    switch (action.type) {
      case AuthTypes.SET_STATE:
        if(action.payload?.user){
          AsyncStorage.setItem('avatar', action.payload.user.avatar) 
        }
        return { ...state, ...action.payload };
      case AuthTypes.SIGN_IN:
      case AuthTypes.RESTORE_TOKEN:
        AsyncStorage.setItem('userToken', action.token || "") 
        AsyncStorage.setItem('avatar', action.avatar || "") 
        axios.defaults.headers.common.Authorization = `JWT ${action.token}`
        const userInfo:Models.User | undefined  = action.token ? jwtDecode(action.token) : undefined;
        return { 
          ...state, 
          isSignout: false,
          userToken: action.token,
          user: userInfo ? {...userInfo, avatar: action.avatar } : undefined
        };
      case AuthTypes.SIGN_OUT:
        AsyncStorage.removeItem('userToken') 
        AsyncStorage.removeItem('avatar') 
        AsyncStorage.removeItem('rooms') 
        AsyncStorage.removeItem('norifications') 
        delete axios.defaults.headers.common.Authorization
        return { 
          ...state, 
          isSignout: true,
          user: undefined,
          userToken: ""
        };
      default:
        return state;
    }
  }
  
  export const AuthContext = createContext<{
    state: AuthState;
    dispatch: (action: AuthAction) => void;
  }>({
    state: initialAuthState,
    dispatch: () => {}
  });
  