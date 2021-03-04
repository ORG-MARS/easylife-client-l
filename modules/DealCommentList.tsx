import React, { useEffect, useState, useRef, useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, Dimensions, FlatList, ScrollView, View, TouchableOpacity, ActivityIndicator, NativeScrollEvent } from 'react-native';
import axios from 'axios'
import Modal from 'react-native-modal';
import Uri from 'jsuri'

import { Text, useKeyboard } from '../components'
import CommentCard from './CommentCard'
import PostCommentModal from './PostCommentModal'
import CommentEditMenu from './CommentEditMenu'
import { Models, NOTIFICATION_TYPE } from '../types'
import * as Icons from '../assets/icons'
import { Colors, API } from '../constants'
import { getFooterPadding } from '../screens/utility/helper'
import { MessageContextProps } from '../reducers'

const windowWidth = Dimensions.get('window').width;

interface DealCommentProps{
  user: Models.User;
  deal?: Models.Deal;
  isVisible: boolean;
  onClose: ()=>void;
  context: MessageContextProps
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}:NativeScrollEvent) => {
  const paddingToBottom = 50;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const  DealCommentList = ({user, deal, isVisible, onClose, context}:DealCommentProps) => {
  const [isKeyboardShow] = useKeyboard();
  const scrollViewRef = useRef()
  const [scrollOffset, setScrollOffset] = useState()
  const [comments, setComments] = useState<Models.Comment[]>([])
  const [commentSelected, setCommentSelected] = useState<Models.Comment>()
  const [commentsTotal, setCommentsTotal] = useState(0)
  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const [isEditCommentVisible, setIsEditCommentCommentVisible] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [rightWidth, setRightWidth] = useState<number | string>('100%')

  function handleOnScroll (event: any) {
    setScrollOffset(event.nativeEvent.contentOffset.y);
    if (isCloseToBottom(event.nativeEvent)) {
      if(isLoadingMore || !canLoadMore) return
      getMoreComments();
    }
  };

  function handleScrollTo(p: number){
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollTo(p);
    }
  };

  useEffect(()=>{
    if(!deal?.id || !isVisible) return
    getComments()
    setCommentsTotal(deal.comment_count)
  },[isVisible])

  useEffect(() =>{
    if(isKeyboardShow) return
    setIsCommentVisible(false)
  }, [isKeyboardShow])

  async function getComments(){
    if(page > 1){
      setPage(1)
    }
    try{
      const res = await axios.get(
        new Uri(`${API}/public/deals/${deal?.id}/comments`)
        .addQueryParam('page', 1)
        .addQueryParam('page_size', 10)
        .toString()
      )
      setComments(res.data.results)
      setCommentsTotal(res.data.count)
      setCanLoadMore(res.data.links.next !== null)
    }catch(err){}
    setIsLoadingMore(false)
  }

  async function getMoreComments(){
    if(comments.length < 1) return
    if(isLoadingMore) return
    setIsLoadingMore(true)
    const newPage = page + 1
    try{
      const res = await axios.get(
        new Uri(`${API}/public/deals/${deal?.id}/comments`)
        .addQueryParam('page', newPage)
        .addQueryParam('page_size', 10)
        .toString()
      )
      setComments([ ...comments, ...res.data.results ])
      setPage(newPage)
      setCanLoadMore(res.data.links.next !== null)
    }catch(err){}
    setIsLoadingMore(false)
  }

  async function onAdd(text?: string){
    if(!text) {
      if(commentSelected){
        setCommentSelected(undefined)
      }
      setIsCommentVisible(false)
      return
    }
    if(commentSelected) {
      await onAddThread(commentSelected, text)
    }else{
      await onAddComment(text)
    }
    if(commentSelected){
      setCommentSelected(undefined)
    }
    setIsCommentVisible(false)
  }

  async function onAddComment(text: string){
    try{
      const res = await axios.post(`${API}/deals/${deal?.id}/comments`,{
        text
      })
      sendNotification({
        title: `${user?.nickname || user?.username}评论了你的约定`,
        text,
        userId: deal?.dealuser_set[0].user
      })
      sendNotification({
        title: `${user?.nickname || user?.username}评论了你的约定`,
        text,
        userId: deal?.dealuser_set[1].user
      })
      setComments([{...res.data}, ...comments])
      setCommentsTotal(commentsTotal+1)
    }catch(err){}
  }

  async function onAddThread(comment: Models.Comment, text: string){
    try{
      const res = await axios.post(`${API}/comments/${comment.id}/threads`,{
          text,
          reply_user: comment.user
      })
      if(![deal?.dealuser_set[0].user,deal?.dealuser_set[1].user].includes(comment.user)){
        sendNotification({
          title: `${user?.nickname || user?.username}追加了评论`,
          text,
          userId: comment.user
        })
      }
      sendNotification({
        title: `${user?.nickname || user?.username}追加了评论`,
        text,
        userId: deal?.dealuser_set[0].user
      })
      sendNotification({
        title: `${user?.nickname || user?.username}追加了评论`,
        text,
        userId: deal?.dealuser_set[1].user,
      })
      let newComments = [...comments]
      const index = comments.findIndex(e => e.id === comment.id)
      newComments[index] = { ...newComments[index], thread_set: [...newComments[index].thread_set, res.data]}
      setComments(newComments)
    }catch(err){}
  }

  function sendNotification(data: {userId:number, title:string, text:string}){
    if(user?.user_id === data.userId) return
    const notification =  {
      message_type: 'notification',
      type: NOTIFICATION_TYPE.DEAL_COMMENT,
      user: data.userId,
      title: data.title,
      description: data.text,
      target_id: deal?.id,
    }
    context.sendNotification(notification)
  }

  async function onDelete(){
    if(!commentSelected) return
    try{
      const res = await axios.delete(`${API}/comments/${commentSelected.id}/`)
      setComments(comments.filter(e => e.id !== commentSelected.id))
      setCommentsTotal(commentsTotal - 1)
    }catch(err){}
    setIsEditCommentCommentVisible(false)
    setCommentSelected(undefined)
  }

  async function onReply(selected:Models.Comment) {
    setCommentSelected(selected)
    if(selected.user === user.user_id){
      setIsEditCommentCommentVisible(true)
      return
    }
    setIsCommentVisible(true)
  }

  function onModalClose(){
    setComments([])
    onClose()
  }

  return (
    <Modal
      testID={'modal'}
      isVisible={isVisible}
      onSwipeComplete={onModalClose}
      onBackdropPress={onModalClose}
      swipeDirection={['down']}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={480 - 300}
      propagateSwipe={true}
      style={styles.modal}
      backdropOpacity={0}
    >
      <View style={styles.scrollableModal}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderTitle}>共 {commentsTotal} 条评论</Text>
          <TouchableOpacity style={styles.close} onPress={onModalClose}>
            <View>
              <Icons.Close width={30} height={30} color={Colors.K700} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          // @ts-ignore
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
        >
          <FlatList
            data={comments}
            keyExtractor={item => `comment-${item.id}`}
            renderItem={({ item }:{ item: Models.Comment }) => (
              <CommentCard comment={item} onClick={onReply} user={user} deal={deal} context={context} />
            )}
            ListEmptyComponent={() => (
              commentsTotal > 0 ? <ActivityIndicator animating={true} style={styles.empty} /> : <Text style={styles.empty} >-- 暂无评论 --</Text>
            )}  
          />
          {isLoadingMore && <ActivityIndicator size='large' animating={true}  style={{padding: 10}} />}
        </ScrollView>
        <TouchableWithoutFeedback onPress={()=>{
          setIsCommentVisible(true)
        }}>
        <View style={styles.postCommentPreview} onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          setRightWidth(windowWidth-58)
        }} >
          {user?.avatar ? <Image source={{ uri: user?.avatar }} style={styles.avatar} />:
          <Icons.PersonCircle width={38} height={38} />}
          <View style={[styles.postCommentPreviewView, {width: rightWidth}]}>
            <Text style={styles.postCommentPreviewText}>说点啥吧～</Text> 
          </View>       
        </View>
        </TouchableWithoutFeedback>
        <PostCommentModal
          isVisible={isCommentVisible}
          onSubmit={onAdd}
        />
        <CommentEditMenu 
          isVisible={isEditCommentVisible}
          onClose={()=> {
            setCommentSelected(undefined); 
            setIsEditCommentCommentVisible(false)
          }}
          onDelete={onDelete}
        />
      </View>
    </Modal>
  );
}

  const styles = StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modalHeader: {
      justifyContent: 'center',
      flexDirection: 'row',
      paddingVertical: 15,
      borderColor: Colors.K200,
      borderBottomWidth: 1
    },
    modalHeaderTitle: {
      color:Colors.K950,
      fontWeight: '500'
    },
    close: {
      position:'absolute',
      top:0,
      right: 0,
      width: 40,
      height: 48,
      justifyContent:'center'
    },
    scrollableModal: {
      height: 480,
      backgroundColor: Colors.white,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 18,
      },
      shadowOpacity: 0.50,
      shadowRadius: 30.50,
      // Android
      elevation: 32,
    },
    item: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginBottom:10,
    },
    empty: {
      textAlign: 'center',
      padding: 30,
      fontSize: 14,
      color: Colors.K600
    },
    postCommentPreview: {
      flexDirection:'row',
      paddingBottom: getFooterPadding(),
      justifyContent: 'space-evenly'
    },
    avatar:{
      width: 38, 
      height: 38,
      borderRadius: 50
    },
    postCommentPreviewView: {
      backgroundColor: Colors.K200,
      color: Colors.K600,
      borderColor: Colors.K200,
      padding: 10,
      borderRadius: 50,
      borderWidth:1,
    },
    postCommentPreviewText: {
      color: Colors.K600,
      fontSize: 14
    },
  });

  export default DealCommentList;