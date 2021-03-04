import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import axios from "axios"

import { AuthContext, AuthTypes, MessageContext, MessageTypes } from '../../reducers'
import { DrawerTabParamList, SettingsStackParamList } from '../../types'
import { Button } from '../../components'
import { API } from '../../constants'
import ProfileScreen from './ProfileScreen'
import QRScreen from './screens/QRScreen'
import AddressListScreen from './screens/AddressListScreen'
import NicknameScreen from './settings/NicknameScreen'

import SettingScreen from './settings/index'
import AboutScreen from './settings/AboutScreen'

const Drawer = createDrawerNavigator();

const ProfileMenu = ({ navigation }: StackScreenProps<DrawerTabParamList>) => {
  return (
        <Drawer.Navigator 
            initialRouteName="Profile" 
            drawerPosition="right"
            drawerContent={(props:DrawerContentComponentProps) => <DrawerContent {...props} />}
        >
            <Drawer.Screen name="Profile" component={ProfileScreen} options={{title: "个人中心"}} />
            <Drawer.Screen name="QrCode" component={QRScreen} options={{title: "收付款码"}}/>
            <Drawer.Screen name="Address" component={AddressListScreen} options={{title: "地址"}}/>
            <Drawer.Screen name="Settings" component={SettingNavigator} options={{title: "设置"}}/>
        </Drawer.Navigator>
  );
}

const DrawerContent = (props:DrawerContentComponentProps) => {
    const { dispatch: userDispatch, state: userState } = useContext(AuthContext);
    const { dispatch: messageDispatch } = useContext(MessageContext);
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            {/* {userState.user && <DrawerItemList {...props} />} */}
            <Button
                title={userState.userToken ? "退出登录" : "登录"}
                onPress={() => {
                    if(userState.userToken){
                        axios.get(`${API}/logout/`)
                        userDispatch({ type: AuthTypes.SIGN_OUT})
                        messageDispatch({type: MessageTypes.SET_STATE, payload: { rooms: {}, notifications: []} })
                        AsyncStorage.removeItem("contacts")
                        AsyncStorage.removeItem("deals")
                        //@ts-ignore
                        props.navigation.closeDrawer()
                        props.navigation.navigate("Signin")
                        return
                    }
                    props.navigation.navigate("Signin")
                    //@ts-ignore
                    props.navigation.closeDrawer()
                }}
                style={styles.login}
            />
        </DrawerContentScrollView>
    )
}

const SettingsStack = createStackNavigator<SettingsStackParamList>();

function SettingNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{title: "设置"}} >
      <SettingsStack.Screen name="Setting" component={SettingScreen} options={{headerShown: false}}/>
      <SettingsStack.Screen name="Nickname" component={NicknameScreen} options={{title: "修改昵称"}}/>
      <SettingsStack.Screen name="About" component={AboutScreen} options={{title: "关于约定"}}/>
    </SettingsStack.Navigator>
  );
}

const styles = StyleSheet.create({
  login: {
    width:'50%',
    marginTop: 50,
    marginHorizontal: '25%',
  },
});

export default ProfileMenu