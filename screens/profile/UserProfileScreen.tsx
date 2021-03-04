import React, { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Image, FlatList, TouchableWithoutFeedback, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import Uri from 'jsuri';

import { Text, View, ImagePreview, RefreshControl } from '../../components';
import { DrawerTabParamList, RootStackParamList, Models, DEAL_STATUS, NOTIFICATION_TYPE } from '../../types'
import { AuthContext, MessageContext } from '../../reducers' 
import * as Icons from '../../assets/icons'
import { Colors, API } from '../../constants';
import { UserDealCard } from '../../modules'

interface UserProfileScreenProps {
    userId: number,
    route: {params:{userId:number}}
}

const UserProfileScreen = ({ navigation, route }: StackScreenProps<RootStackParamList> & StackScreenProps<DrawerTabParamList> & UserProfileScreenProps) => {
  const { state: userState } = useContext(AuthContext);
  const { context } = useContext(MessageContext);
  const [user, setUser] = useState<Models.User>()
  const [deals, setDeals] = useState<Models.Deal[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [canLoadMore, setCanLoadMore] = useState(false)

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={onAddFriend}>
          <View style={{paddingHorizontal:10, backgroundColor:Colors.white}}>
            <Icons.AddCircleOutline color={Colors.Theme} />
          </View>
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  useEffect(()=>{
    if(!route.params?.userId) return
    getUser()
    getDeals()
  },[route.params])

  async function getUser(){
      try{
        const res = await axios.get(new Uri(`${API}/users/`).addQueryParam('id', route.params.userId).toString())
        setUser(res.data.results[0])
      }catch(err){}
  }

  async function getDeals(){
    if(!route.params?.userId) return
    setIsLoading(true)
    if(page > 1){
      setPage(1)
    }
    try{
        const res = await axios.get(new Uri(`${API}/deal-details/`)
        .addQueryParam('ordering', '-created_time')
        .addQueryParam('user', route.params.userId)
        .addQueryParam('page', 1)
        .addQueryParam('page_size', 8)
        .addQueryParam('is_visible', true)
        .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
        .addQueryParam('status', DEAL_STATUS.COMPLETE)
        .toString())
        setDeals(res.data.results)
        setCanLoadMore(res.data.links.next!==null)
    }catch(err){}
    setIsLoading(false)
  }

  async function getMoreDeals(){
    if(!route.params.userId) return
    if(deals.length < 1) return
    setIsLoadingMore(true)
    const newPage = page + 1
    let url = new Uri(`${API}/deal-details/`)
    .addQueryParam('ordering', '-created_time')
    .addQueryParam('user', route.params.userId)
    .addQueryParam('page', newPage)
    .addQueryParam('page_size', 8)
    .addQueryParam('is_visible', true)
    .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
    .addQueryParam('status', DEAL_STATUS.COMPLETE)
    try{
        const res = await axios.get(url.toString())
        setDeals([ ...deals, ...res.data.results ])
        setPage(newPage)
        setCanLoadMore(res.data.links.next!==null)
    }catch(err){}
    setIsLoadingMore(false)
  }

  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
  }

  function sendNotification(data:{user:number, description:string, title: string, type: NOTIFICATION_TYPE, target_id:number}){
    if(userState.user?.user_id === data.user) return
    const notification =  {
      message_type: 'notification',
      ...data
    }
    context.sendNotification(notification)
  }

  async function onAddFriend(){
    const res = await axios.get(new Uri(`${API}/friends/`).addQueryParam('friend', route.params.userId).toString())
    if (res.data.count > 0){
      Alert.alert(`${user?.nickname || user?.username}已为好友，不能重复添加～`)
      return
    }
    try{
      const notification =  {
        message_type: 'notification',
        type: NOTIFICATION_TYPE.CONTACT_REQUEST,
        user: route.params.userId,
        title: '好友请求',
        description: `“${userState.user?.username}”请求添加你为好友～`,
        target_id: userState.user?.user_id,
      }
      context.sendNotification(notification)
      Alert.alert('好友请求已发送！')
    }catch(err) {
      Alert.alert(JSON.stringify(err.response.data))
    }
  }

  async function updateSelectedDeal(dealId:number){
    if(!dealId) return
    const updated = [...deals]
    const dealUrl = userState.user ? 'deal-details' : 'public/deals'
    const url = new Uri(`${API}/${dealUrl}/${dealId}/`)
    const res = await axios.get(url.toString())
    const index = updated.findIndex(e=>e.id === dealId)
    updated[index] = { ... res.data}
    setDeals(updated)
  }

  return (
    <View style={styles.container}>
      <View style={styles.user}>
          {user?.userprofile?.avatar ? <Image source={{ uri: user.userprofile.avatar }} style={styles.avatar} />:
          <Icons.PersonCircle width={60} height={60} />}
        <View style={styles.userText}>
          <View style={{flexDirection:'row',backgroundColor: Colors.white}}>
          <Text style={{fontWeight:'bold', color:Colors.K950}}>{user?.nickname || user?.username}(约定ID: {user?.username})</Text>
          {/* <TouchableHighlight style={styles.tag} >
            <Text style={styles.tagText}>{`ID: ${userStateuser?.username}`}</Text>
          </TouchableHighlight> */}
          </View>
          <View style={{flexDirection:'row'}}>
          </View>
        </View>
      </View>
      <View style={styles.dealWrapper}>
        <RefreshControl 
          onRefresh={getDeals} 
          style={styles.content} 
          isRefreshing={isLoading} 
          onLoadMore={canLoadMore ? getMoreDeals : undefined} 
          isLoadingMore={isLoadingMore}
        >
          <FlatList
            data={deals}
            keyExtractor={item => `deal-${item.id}`}
            renderItem={({ item }:{ item: Models.Deal }) => (
            <UserDealCard 
              key={`deal-${item.id}`}
              user={userState.user}
              item={item} 
              onViewImage={(uri:string) => {
                setIsFull(true)
                setFullSizeImage(uri || '')
              }}
              onPress={(item: Models.Deal) => {
                navigation.navigate("DealDetail", {dealId:item.id, onGoBack:updateSelectedDeal})    
              }} 
              onSendNotification={sendNotification}
            />
          )}
          />
        </RefreshControl>
        <ImagePreview
            isVisible={isFull}
            closeImage={closeImage}
            uri={fullSizeImage} 
            />
        </View>
      <View style={styles.content}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dealWrapper:{
      padding: 20,
      flex: 1,
  },
  header: {
    paddingTop:40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'center',
    lineHeight:30,
    backgroundColor: Colors.white
  },
  avatar:{
    width: 60, 
    height: 60,
    borderRadius: 50
  },
  setting:{
    paddingHorizontal:10,
    paddingVertical:5,
  },
  user: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    padding: 15
  },
  userText:{
    backgroundColor: Colors.white,
    paddingVertical:10,
    marginLeft: 15,
  },
  tag:{
    padding: 5,
    backgroundColor: Colors.K200,
    borderRadius:50,
  },
  tagText:{
    color: Colors.K600,
  },
  content:{

  }
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.K200,
  },
  optionWrapper: {
    paddingVertical:15,
    borderBottomWidth: 1 ,
    borderBottomColor:Colors.K200,
    backgroundColor: Colors.white,
  },
  optionText: {
    fontSize:18,
    color: Colors.K950,
    textAlign: 'center'
  },
};
export default UserProfileScreen