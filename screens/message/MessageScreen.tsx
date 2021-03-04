import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Uri from 'jsuri';
import moment from 'moment'

import { Text, View, RefreshControl, UserAvatar } from '../../components';
import { BottomTabParamList, DEAL_STATUS } from '../../types'
import { MessageContext, AuthContext, MessageTypes } from '../../reducers'
import { Models } from 'models';
import { Colors, API } from '../../constants';
import { dateToFromNowDaily } from '../utility/helper';

const  Badge = ({children, number}:{children:React.ReactNode, number:number | boolean}) =>{
  return(
      <View style={styles.tabContainer}>
      {number === true && <View style={styles.tabBadgeEmpty}>
      </View>}
      {children}
      </View>
  )
}

const MessageCard = ({ deal, user, roomKey, navigation, updateSelectedDeal}: StackScreenProps<BottomTabParamList> & {
  deal: Models.Deal,
  user: Models.User | undefined,
  updateSelectedDeal: (id:number) => void
  roomKey: string
}) => {
  const { state: messageState, dispatch: messageDispatch } = useContext(MessageContext)
  const [time, setTime] = useState('')
  const [lastMessage, setLastMessage] = useState<Models.Message>()
  let room = messageState.rooms?.[roomKey]

  useEffect(()=>{
    const last = room?.messages ? room?.messages[room.messages.length - 1] : undefined
    setLastMessage(last)
    if(last){
      const timeString = dateToFromNowDaily(last.created_time)
      setTime(`${timeString}${moment(last.created_time).format('HH:mm')}`)
    }
  },[messageState.rooms])


  return (
  <TouchableOpacity onPress={() => {
    navigation.navigate("Room", {
      dealId:deal.id, 
      onGoBack: updateSelectedDeal, 
      dealDetail: {
        sender_avatar: deal.sender_avatar,
        sender_id: deal.sender_id,
        status: deal.status,
        is_public: deal.is_public,
        description: deal.description,
        user: user?.user_id,
      },
    })
    }} activeOpacity={0.6}>
      <View style={styles.messageCard}>
        <View style={styles.messageCardHeader}>
        <Badge number={room && room.unRead > 0}>
          <UserAvatar  avatar={deal.sender_avatar} />
        </Badge>
          <View style={styles.messageCardContent}>
            <Text style={styles.messageCardTitle} numberOfLines={1} ellipsizeMode='tail'>{deal.description}</Text>
            {Boolean(lastMessage) && <Text style={styles.messageCardMessage} numberOfLines={1} ellipsizeMode='tail'>{lastMessage?.text}</Text>}
          </View>
        </View>
        {Boolean(time) && (
          <View style={styles.messageCardMessageTimeView}>
            <Text style={styles.messageCardMessageTime}>
              {time}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
)
}

export default function MessageScreen({ navigation, route }: StackScreenProps<BottomTabParamList>) {
  const [deals, setDeals] = useState<Models.Deal[]>([])
  const { state: messageState, dispatch: messageDispatch, context } = useContext(MessageContext);
  const { state: userState } = useContext(AuthContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  
  useEffect(()=>{
    getDeals()
  },[userState.user?.user_id])

  useEffect(()=>{
    if(!messageState.dealRefresh) return
    getDeals()
    messageDispatch({
      type: MessageTypes.SET_STATE,
      payload: {dealRefresh: false},
    });
  },[messageState.dealRefresh])

  async function getDeals(){
    const localDealsString = await AsyncStorage.getItem('deals');
    if(localDealsString){
      getDealsFromLocal(localDealsString)
    }else{
      getDealsFromServer()
    }
  }

  async function getDealsFromLocal(localDealsString:string){
    const localContacts = JSON.parse(localDealsString)
    setDeals(localContacts)
  }

  async function getDealsFromServer(){
    if(!userState.user?.user_id) return
    try{
      const res = await axios.get(new Uri(`${API}/deals/`)
      .addQueryParam('ordering', '-created_time')
      .addQueryParam('user', userState.user?.user_id)
      .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
      .toString())
      setDeals(res.data)
      AsyncStorage.setItem('deals', JSON.stringify(res.data))
    }catch(err){}
  }

  async function updateSelectedDeal(dealId:number){
    if(!dealId) return
    const updated = [...deals]
    const url = new Uri(`${API}/deals/`).addQueryParam('id',dealId)
    const res = await axios.get(url.toString())
    const index = updated.findIndex(e=> e.id === dealId)
    updated[index] = { ... res.data[0]}
    setDeals(updated)
  }

  async function refresh(){
    setIsLoadingMore(true)
    context.restartWebSocket()
    context.fetchUnreadMessages()
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
          data={deals}
          keyExtractor={item => `room-deal-${item.id}`}
          renderItem={({ item }:{ item: Models.Deal }) => {
            const targetKey =  `room-deal-${item.id}`
            return(
              <MessageCard 
                deal={item} 
                user={userState.user} 
                roomKey={targetKey} 
                navigation={navigation} 
                route={route} 
                updateSelectedDeal={updateSelectedDeal} 
              />
            )}}
          ListEmptyComponent={() => (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>请创建约定</Text>
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
    backgroundColor: Colors.white,
  },
  notFound:{
    alignItems:'center',
    backgroundColor: Colors.white
  },
  notFoundText:{
    color: Colors.K400
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderColor: Colors.shadow,
    backgroundColor: Colors.white,
    marginHorizontal:20,
    marginVertical: 10,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 8.30,
    elevation: 3,
  },
  avatar:{
    width: 60, 
    height: 60,
    borderRadius: 50
  },
  messageCardContent:{
    flexDirection: 'column',
    marginLeft: 10,
    marginTop: 2,
    backgroundColor: Colors.white,
  },
  messageCardHeader:{
    flexDirection:'row',
    marginRight: 5,
    backgroundColor: Colors.white,
  },
  messageCardTitle:{
    fontWeight: '500',
    color: Colors.K950,
  },
  messageCardMessage:{
    marginTop: 10,
    fontSize:14,
    color: Colors.K600,
  },
  messageCardMessageTimeView:{
    alignSelf: 'flex-start',
  },
  messageCardMessageTime:{
    fontSize: 12,
    color: Colors.K600,
    backgroundColor: Colors.white,
  },

  tabContainer: {
    paddingRight:10,
    backgroundColor:'transparent'
  },
  tabBadgeEmpty:{
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: Colors.Theme,
    borderRadius: 50,
    width: 10,
    height: 10,
    zIndex: 2,
  }
});
