import React, { useState, useEffect, useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, FlatList, TouchableOpacity, View, SafeAreaView, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import moment from 'moment'
import axios from 'axios'
import Uri from 'jsuri'
import { debounce } from 'lodash'

import { Text, Badge, RefreshControl, UserAvatar } from '../../components'
import { BottomTabParamList, RootStackParamList, Models, NOTIFICATION_TYPE } from '../../types'
import { Colors, API } from '../../constants'
import { MessageContext, MessageTypes } from "../../reducers"
import { dateToFromNowDaily } from '../utility/helper'
import NotificationDealModal from './subScreens/NotificationDealModal'
import * as Icons from '../../assets/icons'

const SwipeDelete = ({ item, children }: {
  item: Models.Notification,
  children: any
}) => {
  const { dispatch: messageDispatch } = useContext(MessageContext);

  async function deleteNotification(){
    if(!item.is_read){
      await axios.patch(new Uri(`${API}/notifications/${item.id}/`).toString(), {is_read:true})
    }
    messageDispatch({
      type: MessageTypes.DELETE_NOTIFICATION,
      notification: item
    })
  }

  const rightSwipe = (progress:Animated.AnimatedInterpolation) =>{
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={deleteNotification}>
      <View style={{
        backgroundColor:'red', 
        justifyContent: 'center', 
        width: 60, 
        height:71, 
        alignItems:"center", 
        marginLeft:-20,
        marginRight:20,
        marginTop:10,
        borderBottomRightRadius:8,
        borderTopRightRadius:8
      }}>
        <Animated.Text style={[
            {
              transform: [{ translateX: trans }],
            },
          ]}><Icons.Delete width={38} height={38} color={Colors.white} /></Animated.Text>
      </View>
      </TouchableOpacity>
    )
  }

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={rightSwipe}
      childrenContainerStyle={[{paddingHorizontal:20, paddingVertical:10},styles.childrenContainerStyle]}
    >
    {children}
    </Swipeable>
  )
}
const NotificationCard = ({ item, style, navigation, route}: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList> & {
  item: Models.Notification,
  style?: {}
}) => {
  const { dispatch: messageDispatch } = useContext(MessageContext);
  const [time, setTime] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isRead, setIsread] = useState(item.is_read)
  const [headerWidth, setHeaderWidth] = useState<number |string>('100%')

  useEffect(()=>{
    const timeString = dateToFromNowDaily(item.created_time)
    setTime(`${timeString}${moment(item.created_time).format('HH:mm')}`)
  },[item])

  const onRead = debounce(async()=>{
    await axios.patch(new Uri(`${API}/notifications/${item.id}/`).toString(), {is_read:true})
      messageDispatch({
        type: MessageTypes.UPDATE_UNREAD_NOTIFICATION,
        notificationId: item.id
      })
  }, 200)

  return (
    <>
    <TouchableOpacity 
      onPress={() => {
        setIsVisible(true)
        setIsread(true)
      }} 
      activeOpacity={0.6}
    >
      <View style={[styles.notificationCard, style]}>
        <View style={styles.notificationCardHeader}>
          <UserAvatar avatar={item.avatar}  />
          <View style={styles.notificationCardContent}>
            <Badge number={!isRead}>
              <Text
                style={[
                  styles.notificationCardTitle,
                  {maxWidth: headerWidth}
                ]}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.title}
              </Text>
            </Badge>
            {Boolean(item.description) && (
              <Text
                style={styles.notificationCardMessage}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {item.description}
              </Text>
            )}
          </View>
        </View>
        {Boolean(time) && (
          <View
            style={styles.notificationCardMessageTimeView}
          >
            <Text style={styles.notificationCardMessageTime}>
              {time}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
    <NotificationDealModal 
      route={route} 
      navigation={navigation} 
      notification={item} 
      messageDispatch={messageDispatch} 
      isVisible={isVisible} 
      onClose={()=>{
        setIsVisible(false)
        if(!item.is_read){
          onRead()
        }
      }} />
    </>
  )
}

export default function NotificationScreen({ navigation, route }: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList>) {
  const { state: messageState, context } = useContext(MessageContext);
  const [notifications, setNotifications] = useState<Models.Notification[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(()=>{
    if(!messageState.notifications) return
    setNotifications([...messageState.notifications])
  },[messageState.notifications])

  async function refresh(){
    setIsLoadingMore(true)
    context.restartWebSocket()
    context.fetchUnreadNotifications()
    setIsLoadingMore(false)
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
      <RefreshControl 
        onRefresh={refresh}
        isLoadingMore={isLoadingMore}
      >
      <FlatList
          data={notifications}
          keyExtractor={item => `notification-${item.id}`}
          renderItem={({ item }:{ item: Models.Notification }) => {
            if([NOTIFICATION_TYPE.CONTACT_REQUEST, NOTIFICATION_TYPE.DEAL_REQUEST].includes(item.type)){
              return (
                <NotificationCard 
                  item={item} 
                  navigation={navigation} 
                  route={route} 
                  style={styles.notificationCardShadow} 
                />
              )
            }
            return (
              <SwipeDelete item={item}>
                <NotificationCard item={item} navigation={navigation} route={route} />
              </SwipeDelete>
            )}}
          ListEmptyComponent={() => (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>没有通知～</Text>
            </View>
          )}  
        />
        </RefreshControl>
        </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notFound:{
    alignItems:'center',
  },
  notFoundText:{
    color: Colors.K400
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.white,
    shadowColor: Colors.shadow,
  },
  notificationCardShadow:{
    marginHorizontal:20, 
    marginVertical:10,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.18,
    shadowRadius: 5.30,
    elevation: 3,
  },
  childrenContainerStyle:{
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.08,
    shadowRadius: 5.30,
    elevation: 3,
  },
  notificationCardHeader:{
    flexDirection:'row',
    marginRight: 5
  },
  notificationCardContent: {
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 2
  },
  notificationCardTitle:{
    fontWeight: '500',
    color: Colors.K950,
  },
  notificationCardMessage:{
    marginTop: 10,
    fontSize:14,
    color: Colors.K600,
  },
  notificationCardMessageTimeView:{
    alignSelf: 'flex-start',
  },
  notificationCardMessageTime:{
    fontSize: 12,
    color: Colors.K600,
  },
  unRead: {
    backgroundColor: Colors.R500,
    borderRadius: 50,
    width: 5,
    height: 5
  }
});
