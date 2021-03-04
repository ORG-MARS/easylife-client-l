import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import { Colors } from '../constants';
import { UserTabNavigator } from './UserTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import NewScreen from '../screens/new/index';
import SigninScreen from '../screens/SigninScreen';
import SignupScreen from '../screens/SignupScreen';
import ContactListScreen from '../screens/utility/ContactListScreen'
import RoomScreen from '../screens/message/subScreens/RoomScreen'
import DealDetailScreen from '../screens/dashboard/DealDetailScreen/index'
import ChatHistory from '../screens/dashboard/ChatHistory'
import AddressListScreen from '../screens/utility/AddressListScreen'
import NewAddressScreen from '../screens/utility/NewAddressScreen'
import QuestionnaireScreen from '../screens/utility/QuestionnaireScreen'
import UserProfileScreen from '../screens/profile/UserProfileScreen/index'

import PrivatePolicyScreen from '../screens/profile/settings/PrivatePolicyScreen'


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{
        dark: false,
        colors: {
          primary: 'rgb(0, 122, 255)',
          background: 'rgb(255, 255, 255)',
          card: 'rgb(255, 255, 255)',
          text: 'rgb(28, 28, 30)',
          border: 'rgb(216, 216, 216)',
          notification: 'rgb(255, 59, 48)',
        },
      }}>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const RootStack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <RootStack.Navigator 
    screenOptions={{ headerShown: false }} 
    mode="modal" 
    >
      <RootStack.Screen name="Home" component={HomeNavigator} />
      <RootStack.Screen name="Signin" component={SigninScreen} />
      <RootStack.Screen name="Signup" component={SignupScreen} />
      <RootStack.Screen name="ContactList" component={ContactListScreen} />
      <RootStack.Screen name="AddressList" component={AddressListScreen} />
      <RootStack.Screen name="NewAddress" component={NewAddressScreen} />
      <RootStack.Screen name="PrivatePolicy" component={PrivatePolicyScreen} />
      <RootStack.Screen name="Questionnaire" component={QuestionnaireScreen} />
    </RootStack.Navigator>
  );
}

const HomeStack = createStackNavigator<RootStackParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator  >
      <HomeStack.Screen name="Home" component={UserTabNavigator} options={{ headerShown: false }}/>
      <HomeStack.Screen name="New" component={NewScreen}  options={{ 
          headerTitle: "约定一下",
          headerTintColor: Colors.K950,
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerBackTitleVisible: false
         }}/>
      <HomeStack.Screen name="Room" component={RoomScreen} options={{ 
          headerTitle: "对话框",
          headerTintColor: Colors.K950,
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerBackTitleVisible: false
         }}
      />
      <HomeStack.Screen name="DealDetail" component={DealDetailScreen} options={{ 
          // headerTitle: "约定",
          // headerTintColor: Colors.white,
          // headerStyle: {
          //   backgroundColor: '#77C998',
          //   borderColor: '#77C998'
          // },
          // headerTransparent: true,
            headerShown: false
         }}
      />
      <HomeStack.Screen name="ChatHistory" component={ChatHistory} options={{ 
          headerTitle: "对话记录",
          headerTintColor: Colors.K950,
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerBackTitleVisible: false
         }}
      />
      <HomeStack.Screen name="UserProfile" component={UserProfileScreen} options={{
          headerShown: false
          // headerTitle: "",
          // headerTintColor: Colors.K950,
          // headerStyle: {
          //   backgroundColor: Colors.white,
          // },
          // headerBackTitleVisible: false
        }}
      />
      <HomeStack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!', headerShown: false }} />
    </HomeStack.Navigator>
  );
}
