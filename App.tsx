import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import * as Notifications from 'expo-notifications';
import React, { useReducer, useEffect } from 'react';
import { MenuProvider } from 'react-native-popup-menu';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { authReducer, initialAuthState, AuthTypes, AuthContext } from './reducers/AuthReducer'
import MessageProvider from './screens/utility/MessageContext'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [userState, userDispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const getUserAuth = async () => {
      let userToken;
      let avatar

      try {
        userToken = await AsyncStorage.getItem('userToken');
        avatar = await AsyncStorage.getItem('avatar');
        if(!userToken){
          userDispatch({ type: AuthTypes.SIGN_OUT });
          return
        }
      } catch (e) {
        // Restoring token failed
        userDispatch({ type: AuthTypes.SIGN_OUT });
        return
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      userDispatch({ type: AuthTypes.RESTORE_TOKEN, token: userToken, avatar });
    };
    getUserAuth();
  }, []);

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <AuthContext.Provider value={{state: userState, dispatch: userDispatch}}>
        <MessageProvider>
          {/* <AvatarContext.Provider value={{state: avatarState, dispatch: avatarDispatch}}> */}
            <MenuProvider>
              <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
              </SafeAreaProvider>
            </MenuProvider>
          {/* </AvatarContext.Provider> */}
        </MessageProvider>
      </AuthContext.Provider>
    );
  }
}