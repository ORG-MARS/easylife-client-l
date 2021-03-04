import React, {useContext, useRef, useState, useEffect} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AppState,
  Image
} from 'react-native'
import * as Notifications from 'expo-notifications'
import axios, { AxiosError } from 'axios';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';
import { getTabFooterPadding, scalePx2dp} from '../screens/utility/helper'
import { AuthContext, AuthTypes, MessageContext, MessageTypes } from '../reducers';

function TabBar (props: BottomTabBarProps) {
  const {
    activeTintColor,
    inactiveTintColor,
    navigation,
    state,
    descriptors
  } = props

  const { routes, index: activeRouteIndex } = state
  const { state: AuthState, dispatch: userDispatch } = useContext(AuthContext);
  const { dispatch: messageDispatch, context } = useContext(MessageContext)
  const appState = useRef<string>(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  

  useEffect(()=>{
    if(!AuthState.user?.user_id) return
    const timer = setInterval(() => {
      if(context.isWebSocketClosed()){
        context.restartWebSocket()
        context.fetchUnread()
      }
    }, 30000);

    const myInterceptor = axios.interceptors.response.use(
      res => res,
      (error: AxiosError) => {
          const { response } = error;
          if (
            response?.status === 401
          ) {
            userDispatch({ type: AuthTypes.SIGN_OUT})
            messageDispatch({type: MessageTypes.SET_STATE, payload: { rooms: {}, notifications: []} })
            navigation.navigate("Signin")
            context.closeWebSocket()
            clearInterval(timer);
            return Promise.reject(error);
          }
          return Promise.reject(error);
      }
    )

    Notifications.addNotificationReceivedListener(_handleNotification);
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      axios.interceptors.request.eject(myInterceptor);
      AppState.removeEventListener("change", _handleAppStateChange);
      clearInterval(timer);
    };
  },[AuthState.user?.user_id])
  
  const _handleAppStateChange = async (nextAppState: string) => {
    if (
      appState.current.match(/background/) &&
      nextAppState === "active"
    ) {
      Notifications.dismissAllNotificationsAsync()
      userDispatch({
        type: AuthTypes.SET_STATE,
        payload: {refresh: true},
      });
      context.restartWebSocket()
      context.fetchUnread()
      context.updatePnsToken()
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  async function _handleNotification(notification:any){
    if(context.isWebSocketClosed()){
      context.restartWebSocket()
      context.fetchUnread()
    }
    if(appStateVisible === 'active'){
      await Notifications.dismissNotificationAsync(notification.request.identifier)
    }
  }

  return (
    <View style={Styles.container}>
      <Image
        style={Styles.btmBg}
        source={require('../assets/images/btm.png')}
      />
      {routes.map((route, routeIndex) => {
        
        const isRouteActive = routeIndex === activeRouteIndex
        const tintColor = isRouteActive ? activeTintColor : inactiveTintColor
        const { options } = descriptors[route.key];
        if (options.tabBarVisible === false) {
            return null;
        }
        
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });

          if (!isRouteActive && !event.defaultPrevented) {
            if(route.name == 'AddNew'){
              if(!AuthState.userToken){
                navigation.navigate("Signin")
                return
              }
              navigation.navigate("New");
              return
            }
            if(!AuthState.userToken && route.name == 'Messages'){
              navigation.navigate("Signin")
              return
            }
            navigation.navigate(route.name, {test: "test"});
            if(!AuthState.userToken && ['Profile', 'Social'].includes(route.name)){
              navigation.navigate("Signin")
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return route.name == 'AddNew' ? (
          <TouchableWithoutFeedback
            key={routeIndex}
            style={Styles.tabButton}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityRole="button"
            testID={options.tabBarTestID}
          >
              <View style={Styles.addNewBox}>
              <Image
                style={Styles.addNewIcon}
                source={require('../assets/images/dh_3.png')}
              />
                {/* @ts-ignore */}
                {/* {options.tabBarIcon ? options.tabBarIcon({color:tintColor}) : null} */}
                <Text style={{ ...Styles.iconText, color: isRouteActive ? Colors.K950 : Colors.K400 }}>{label}</Text>
              </View>
              </TouchableWithoutFeedback>
          ):(
          <TouchableOpacity
            key={routeIndex}
            style={Styles.tabButton}
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            accessibilityRole="button"
            testID={options.tabBarTestID}
          >
            <>
              {/* @ts-ignore */}
              {options.tabBarIcon ? options.tabBarIcon({color:tintColor}): null}
              <Text style={{...Styles.iconText, color: isRouteActive ? Colors.K950 : Colors.K400}}>{label}</Text>
            </>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
const paddingBottom = getTabFooterPadding()

const Styles = StyleSheet.create({
  btmBg: {
    width: '100%',
    height: 74 + paddingBottom,
    resizeMode: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1
  },
  container: {
    flexDirection: 'row',
    // 这里应该是 获取底部安全边界高度 后期处理 ~~~~~~~~
    height: 74 + paddingBottom,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: paddingBottom,
    zIndex: 10
  },
  scaler: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scalerOnline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewBox: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: scalePx2dp(60),
    marginBottom: paddingBottom,
    height: 74 + 17,
    marginTop: -17,
    position: 'relative',
    zIndex: 10
  },
  addNewIcon: {
    width: scalePx2dp(55),
    height: scalePx2dp(55),
    marginBottom: 17
  },
  iconText: {
    fontSize: scalePx2dp(12),
    lineHeight: 20,
    textAlign: 'center'
  }
})

export default TabBar
