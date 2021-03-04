import React, { useState, useEffect, useContext  } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import Uri from 'jsuri'

import { View, Text,  Modal, RefreshControl, ImagePreview } from '../../../components';
import { DealCard, DealCommentList, PostCommentModal } from '../../../modules';
import { Colors, API } from '../../../constants';
import { DrawerTabParamList, RootStackParamList, Models, DEAL_STATUS, NOTIFICATION_TYPE } from '../../../types';
import { AuthContext, MessageContext } from '../../../reducers'; 

const LikeScreen = ({ navigation, activeIndex }: StackScreenProps<RootStackParamList> & StackScreenProps<DrawerTabParamList> & {activeIndex: number}) => {
  const { state: userState } = useContext(AuthContext);
  const { context } = useContext(MessageContext)
  const [deals, setDeals] = useState<Models.Deal[]>([])
  const [selected, setSelected] = useState<Models.Deal>()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const [isPostCommentVisible, setIsPostCommentVisible] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [page, setPage] = useState(1)
  const [canLoadMore, setCanLoadMore] = useState(false)

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')

  useEffect(()=>{
    if(activeIndex !== 1) return
    getDeals()
  }, [activeIndex])

  async function getDeals(){
    if(!userState.user?.user_id) return
    setIsLoading(true)
    if(page > 1){
      setPage(1)
    }
    try{
      const res = await axios.get(new Uri(`${API}/deal-details/`)
      .addQueryParam('ordering', '-created_time')
      .addQueryParam('user_like', userState.user?.user_id)
      .addQueryParam('page', 1)
      .addQueryParam('page_size', 8)
      .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
      .addQueryParam('status', DEAL_STATUS.COMPLETE)
      .toString())
      setDeals(res.data.results)
      setCanLoadMore(res.data.links.next!==null)
    }catch(err){}
    setIsLoading(false)
  }

  async function getMoreDeals(){
    if(!userState.user?.user_id) return
    if(deals.length < 1) return
    setIsLoadingMore(true)
    const newPage = page + 1
    let url = new Uri(`${API}/deal-details/`)
    .addQueryParam('ordering', '-created_time')
    .addQueryParam('user_like', userState.user?.user_id)
    .addQueryParam('page', newPage)
    .addQueryParam('page_size', 8)
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

  async function onConfirm(item: Models.Deal){
    setSelected(item)
    setConfirmMessage('是否确定上链？')
    setIsVisible(true)
  }

  async function onContinue(){
    await onPushToChain()
    setIsVisible(false)
  }

  async function onAddComment(text?: string){
    if(!text){
      setIsPostCommentVisible(false)
      return
    }
    try{
      const res = await axios.post(`${API}/deals/${selected?.id}/comments`,{
        text
      })
      sendNotification({
        user: selected?.dealuser_set[0].user, 
        description: '',
        title: `${userState.user?.nickname || userState.user?.username}评论了你的约定`,
        type: NOTIFICATION_TYPE.DEAL_COMMENT,
      })
      sendNotification({
        user: selected?.dealuser_set[1].user, 
        description: '',
        title: `${userState.user?.nickname || userState.user?.username}评论了你的约定`,
        type: NOTIFICATION_TYPE.DEAL_COMMENT,
      })
      // @ts-ignore
      setSelected({...selected, comment_count: 1})
      setIsCommentVisible(true)
    }catch(err){}
  }

  function sendNotification(data:{user:number, description:string, title: string, type: NOTIFICATION_TYPE, target_id?:number}){
    if(userState.user?.user_id === data.user) return
    const notification =  {
      message_type: 'notification',
      target_id: selected?.id,
      ...data
    }
    context.sendNotification(notification)
  }

  async function onPushToChain(){
    if(!selected) return
    // 上链API
    // let update:Models.Deal[] = [...deals]
    // const res = await axios.patch(`${API}/deal-details/${selected.id}/`,{
    //   is_public: true
    // })
    // const target = update.findIndex((e: Models.Deal) => e.id === selected.id)
    // update[target] = res.data
    // setDeals(update)
  }
  
  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
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

  if(!userState.user) return null
  return (
    <View style={styles.container}>
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
            <DealCard 
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
              onComment={(item: Models.Deal) => {
                setSelected(item)
                if(item.comment_count < 1){
                  setIsPostCommentVisible(true)
                  return
                }
                setIsCommentVisible(true)
              }}
              onSendNotification={sendNotification}
            />
          )}
          />
      </RefreshControl>
      <Modal isVisible={isVisible} onClose={()=>setIsVisible(false)}>
        <Modal.Body>
            <Text style={{textAlign:'center'}}>{confirmMessage}</Text>
            <Text style={styles.tipText}>操作不可撤回</Text>
        </Modal.Body>
        <Modal.Footer 
          leftBtn={{
            title: '我再想想',
            onPress: ()=>setIsVisible(false)
          }}
          rightBtn={{
            title: '确定',
            onPress: onContinue
          }}
        />
      </Modal>
      <DealCommentList 
        isVisible={isCommentVisible} 
        onClose={()=>{
          setSelected(undefined)
          setIsCommentVisible(false)
        }}
        deal={selected} 
        user={userState.user} 
        context={context}
      />
      <PostCommentModal 
        isVisible={isPostCommentVisible} 
        onSubmit={onAddComment}
      />
      <ImagePreview
          isVisible={isFull}
          closeImage={closeImage}
          uri={fullSizeImage} 
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    padding: 30,
    fontSize: 14,
    color: Colors.K600
  },
  content: {
    paddingHorizontal: 20
  },
  textarea: {
    backgroundColor:Colors.white,
    borderRadius: 10,
    padding:10
  },
  contact:{
    marginTop: 20,
    marginHorizontal:28
  },
  avatar:{
    width: 58,
    height: 58,
    borderRadius: 10,
    marginRight:10
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft:64
  },
  send: {
    marginLeft:20
  },
  tipText: {
    textAlign:'center', 
    color:Colors.K600, 
    marginTop:10,
    lineHeight:20, 
    fontSize:14
  },
});

export default LikeScreen