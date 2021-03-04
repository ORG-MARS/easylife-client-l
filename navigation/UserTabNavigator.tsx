import React, { useContext, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as Notifications from 'expo-notifications'

import * as Icons from '../assets/icons'
import TabBar from './TabBar'
import { Colors } from '../constants';
import { Badge } from '../components'
import useColorScheme from '../hooks/useColorScheme';
import DashboardScreen1 from '../screens/dashboard/DashboardScreen'
import DashboardScreen from '../screens/dashboard/DashboardScreen/index'

import ProfileScreen from '../screens/profile/index'
import SocialScreen from '../screens/social/SocialScreen'
import MessageScreen from '../screens/message/index';
import NewContactScreen from '../screens/message/subScreens/NewContactScreen'
import { BottomTabParamList, DashboardParamList, MessagesParamList, AddNewParamList, SocialParamList, ProfileParamList } from '../types';
import { MessageContext, MessageTypes } from '../reducers'

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type BottomScreenRouteProp = RouteProp<BottomTabParamList, 'Dashboard'>;

type BottomScreenNavigationProp = StackNavigationProp<
  BottomTabParamList,
  'Dashboard'
>;

type UserTabNavigatorProps = {
  route: BottomScreenRouteProp;
  navigation: BottomScreenNavigationProp;
};

export function UserTabNavigator(props: UserTabNavigatorProps) {
  const { state: messageState, dispatch: messageDispatch } = useContext(MessageContext)
  const colorScheme = useColorScheme();
  const [isUnRead, setIsUnRead] = useState(false)

  useEffect(()=>{
    checkUnread()
  },[messageState.rooms, messageState.notifications])

  async function checkUnread(){
    let notificationUnRead = 0
    let messageUnRead = 0
    if(messageState.rooms && Object.values(messageState.rooms).length > 0){
      Object.values(messageState.rooms).forEach(e => {
        if(e.unRead && e.unRead > 0){
          messageUnRead = messageUnRead + e.unRead
        }
      })
    }
    if(Array.isArray(messageState.notifications)){
      notificationUnRead = messageState.notifications.filter(e => !e.is_read).length
    }
    const total = messageUnRead + notificationUnRead
    Notifications.setBadgeCountAsync(total)
    setIsUnRead(total > 0)
    messageDispatch({
      type: MessageTypes.SET_STATE,
      payload: {messageUnread: messageUnRead}
    })
  }
  return (
    <BottomTab.Navigator
      initialRouteName="Dashboard"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint, showLabel: false  }}
      tabBar={(props)=><TabBar {...props} showLabel={false} />}
      >
      <BottomTab.Screen
        name="Dashboard"
        component={DashboardNavigator}
        options={{
          tabBarLabel: "首页",
          tabBarIcon: ({ color }) => {
            return <Icons.Home color={color} />
        }}}
        
      />
      <BottomTab.Screen
        name="Messages"
        component={MessagesNavigator}
        options={{
          tabBarLabel: "消息",
          tabBarIcon: ({ color }) => {
            return (
              <Badge number={isUnRead} style={{paddingRight:0}} emptyStyle={{top:0, right:-5}}> 
                <Icons.Message color={color} />
              </Badge> 
            )
          },
        }}
      />
      <BottomTab.Screen
        name="AddNew"
        component={AddNewNavigator}
        options={{
          tabBarLabel: "发布",
          tabBarIcon: () => {
            return <Icons.New color={Colors[colorScheme].tint} />
        }}}
      />
      <BottomTab.Screen
        name="Social"
        component={SocialNavigator}
        options={{
          tabBarLabel: "匹配",
          tabBarIcon: ({ color }) => {
            return <Icons.Earth  color={color} />
          }
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: "我的",
          tabBarIcon: ({ color }) => {
            return <Icons.Person color={color} />
          }
        }}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const DashboardStack = createStackNavigator<DashboardParamList>();

function DashboardNavigator() {
  return (
    <DashboardStack.Navigator headerMode="none">
      <DashboardStack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />
    </DashboardStack.Navigator>
  );
}

const MessagesStack = createStackNavigator<MessagesParamList>();

function MessagesNavigator() {
  return (
    <MessagesStack.Navigator headerMode="none">
      <MessagesStack.Screen
        name="Messages"
        component={MessageScreen}
      />
      <MessagesStack.Screen 
        name="NewContact" 
        component={NewContactScreen}
      />
    </MessagesStack.Navigator>
  );
}

const AddNewStack = createStackNavigator<AddNewParamList>();

function AddNewNavigator() {
  return (
    <AddNewStack.Navigator>
      <AddNewStack.Screen
        name="AddNew"
        component={()=>null}
      />
    </AddNewStack.Navigator>
  );
}

const SocialStack = createStackNavigator<SocialParamList>();

function SocialNavigator() {
  return (
    <SocialStack.Navigator>
      <SocialStack.Screen
        name="Social"
        component={SocialScreen}
        options={{ 
          headerTitleAlign: "left",
          headerTitle: "匹配",
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.K950,
          headerBackTitleVisible: false
         }}
      />
    </SocialStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator headerMode="none">
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerTitle: props => null }}
      />
    </ProfileStack.Navigator>
  );
}