import React, { useState, useContext, useEffect } from 'react';
import { Dimensions, StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { TabView, SceneMap, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { StackScreenProps } from '@react-navigation/stack';

import MessageHeader from './MessageHeader';
import MessageScreen from './MessageScreen';
import ContactScreen from './ContactScreen';
import NotificationScreen from './NotificationScreen';
import { Colors } from '../../constants';
import { BottomTabParamList, RootStackParamList } from '../../types'
import { Badge } from '../../components'
import { MessageContext } from '../../reducers'

type Route = {
  key: string;
  title: string;
};

type State = NavigationState<Route>;

const windowWidth = Dimensions.get('window').width;

export default function MessageTabs({ navigation, route }: StackScreenProps<BottomTabParamList> & StackScreenProps<RootStackParamList>) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'message', title: '对话' },
    { key: 'notification', title: '通知' },
    { key: 'contact', title: '通讯录' },
  ]);

  const renderScene = SceneMap({
    message: () => <MessageScreen navigation={navigation} route={route} />,
    notification: () => <NotificationScreen navigation={navigation} route={route} />,
    contact: () => <ContactScreen navigation={navigation} route={route} />,
  });
  
  return (
    <View style={styles.container}>
      <MessageHeader isCommon navigation={navigation} route={route} />
      <TabView
        style={styles.tabContainer}
        navigationState={{ index, routes }}
        renderTabBar={props => <RenderTabBar {...props} navigation={navigation} />}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </View>
  );
}

function RenderTabBar (props: SceneRendererProps & { navigationState: State, navigation: any}) {
  const { state: messageState } = useContext(MessageContext)
  const [isMessageUnread, setIsMessageUnread] = useState(false)
  const [isNotificationUnread, setIsNotificationUnread] = useState(false)

  useEffect(()=>{
    const messageUnRead = Object.values(messageState.rooms).some(e => e.unRead > 0)
    setIsMessageUnread(messageUnRead)
  },[messageState.rooms])

  useEffect(()=>{
    let notificationUnRead = false
    if(Array.isArray(messageState.notifications)){
      notificationUnRead = messageState.notifications.some(e => !e.is_read)
    }
    setIsNotificationUnread(notificationUnRead)
  },[messageState.notifications])

  const renderItem =({
    navigationState,
    position,
  }: {
    navigationState: State;
    position: Animated.Node<number>;
  }) => ({ route, index }: { route: Route; index: number }) =>{
    const inputRange = navigationState.routes.map((_, i) => i);
  
    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
    });

    let isUnread = false
    switch(route.key){
      case 'message':
        isUnread = isMessageUnread;
        break;
      case 'notification':
        isUnread = isNotificationUnread;
        break;
    }
    
    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
          <Badge number={isUnread}>
            <Text style={[styles.label, styles.inactive]}>
              {route.title}
            </Text>
          </Badge>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >
          <Badge number={isUnread}>
            <Text style={[styles.label, styles.active]}>
              {route.title}
            </Text>
          </Badge>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        <View style={styles.tabBarMenu}>
          {props.navigationState.routes.map((route: Route, index: number) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => props.jumpTo(route.key)}
                key={route.key}
              >
                {renderItem(props)({ route, index })}
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Theme
  },
  tabContainer: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  tabBarWrapper:{
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabBar: {
    flex:1,
    justifyContent:'center', 
    alignItems:'center',
  },
  tabBarMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
    width: windowWidth - 100
  },
  tab: {
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.Theme,
    borderRadius:50,
  },
  active: {
    color: Colors.white,
  },
  inactive: {
    color: Colors.K400,
  },
  label: {
    marginHorizontal: 3,
    paddingLeft: 8,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '600',
  },
});
