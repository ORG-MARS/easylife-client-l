import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { 
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback, 
  View, 
  Dimensions, 
  Image, 
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'
import Uri from 'jsuri'

import { Text, Button, useKeyboard, Status, RefreshControl, Modal, ImagePreview } from '../../components';
import { RootStackParamList, Models, NOTIFICATION_TYPE } from '../../types'
import { AuthContext, MessageContext } from '../../reducers'
import { CommentCard, PostCommentModal, CommentEditMenu } from '../../modules'
import { Colors, API } from '../../constants';
import * as Icons from '../../assets/icons'
import { getFooterPadding } from '../utility/helper';

const windowWidth = Dimensions.get('window').width;

interface DealDetailProps {
    dealId: number,
    route: {params:{dealId:number, onGoBack:(dealId:number)=>void}}
}

const DealDetailScreen = ({ route, navigation }: StackScreenProps<RootStackParamList> & DealDetailProps) => {
  const { state: userState } = useContext(AuthContext);
  const { context } = useContext(MessageContext);
  const [deal, setDeal] = useState<Models.Deal>()
  const [comments, setComments] = useState<Models.Comment[]>([])
  const [hostUser, setHostUser] = useState<Models.DealUser>()
  const [rightWidthOne, setRightWidthOne] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [like, setLike] = useState<number>()
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [page, setPage] = useState(1)
  const [likeCount, setLikeCount] = useState(0)

  const [isKeyboardShow] = useKeyboard();
  const [commentSelected, setCommentSelected] = useState<Models.Comment>()
  const [commentsTotal, setCommentsTotal] = useState(0)
  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const [isEditCommentVisible, setIsEditCommentCommentVisible] = useState(false)

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')
  const [rightInputWidth, setRightInputWidth] = useState<number | string>('100%')

  useLayoutEffect(() => {
    navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity style={styles.close} onPress={() => {
            if(route.params.onGoBack){
              route.params.onGoBack(route.params?.dealId)
            }
            navigation.goBack()
          }}>
          <View style={styles.back}>
              <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
          </View>
          </TouchableOpacity>
        ),
        headerRight: () => (
            <Button outline onPress={()=>{
              if(!userState.user){
                setIsModalVisible(true)
                return
              }
              navigation.navigate("ChatHistory", {deal})
            }} style={styles.checkHistory} textStyle={{fontSize: 14, fontWeight: '600'}} title="查看对话1111" />
          ),
    });
  }, [navigation, deal]);

  useEffect(() => {
    getDealDetails()
  },[route.params?.dealId])

  useEffect(() =>{
    if(isKeyboardShow) return
    setIsCommentVisible(false)
  }, [isKeyboardShow])

  async function getDealDetails(){
    if(page > 1){
      setPage(1)
    }
    const dealUrl = userState.user ? 'deal-details' : 'public/deals'
    try{
      const res = await axios.get(new Uri(`${API}/${dealUrl}/${route.params?.dealId}/`).toString())
      setDeal(res.data)
      const target = res.data.dealuser_set.find((e:Models.DealUser) => e.user === res.data.user_id)
      if(target) setHostUser(target)
      const commentRes = await axios.get(
        new Uri(`${API}/public/deals/${route.params?.dealId}/comments`)
        .addQueryParam('page', 1)
        .addQueryParam('page_size', 10)
        .toString()
      )
      setComments(commentRes.data.results)
      setCommentsTotal(commentRes.data.count)
      if(Number.isInteger(res.data.self_liked_id)){
        setLike(res.data.self_liked_id)
      }
      setLikeCount(res.data.like_count)
      setCanLoadMore(commentRes.data.links.next !== null)
    }catch(err){}
    setIsLoading(false)
  }

  async function getMoreComments(){
    if(comments.length < 1) return
    setIsLoadingMore(true)
    const newPage = page + 1
    try{
      const commentRes = await axios.get(
        new Uri(`${API}/public/deals/${route.params?.dealId}/comments`)
        .addQueryParam('page', newPage)
        .addQueryParam('page_size', 10)
        .toString()
      )
      setComments([ ...comments, ...commentRes.data.results ])
      setPage(newPage)
      setCanLoadMore(commentRes.data.links.next!==null)
    }catch(err){}
    setIsLoadingMore(false)
  }

  async function onLike(){
    if(!userState.user){
      setIsModalVisible(true)
      return
    }
    if(Number.isInteger(like)){
        axios.delete(`${API}/likes/${like}/`)
        setLike(undefined)
        setLikeCount(likeCount-1)
        return
    }
    try{
      const res = await axios.post(`${API}/likes/`,{
        deal: route.params?.dealId,
        user: userState.user?.user_id
      })
      setLikeCount(likeCount+1)
      sendNotification({
        type: NOTIFICATION_TYPE.DEAL_LIKE,
        title: `${userState?.user?.nickname || userState?.user?.username}点赞了你的约定`,
        text: '',
        userId: deal?.dealuser_set[0].user
      })
      sendNotification({
        type: NOTIFICATION_TYPE.DEAL_LIKE,
        title: `${userState?.user?.nickname || userState?.user?.username}点赞了你的约定`,
        text: '',
        userId: deal?.dealuser_set[1].user
      })
      setLike(res.data.id)
    }catch(err){}
  }

  async function onAdd(text?: string){
    if(!userState.user){
      setIsModalVisible(true)
      return
    }
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
    const res = await axios.post(`${API}/deals/${route.params?.dealId}/comments`,{
      text
    })
    sendNotification({
      type: NOTIFICATION_TYPE.DEAL_COMMENT,
      title: `${userState?.user?.nickname || userState.user?.username}评论了你的约定`,
      text,
      userId: deal?.dealuser_set[0].user
    })
    sendNotification({
      type: NOTIFICATION_TYPE.DEAL_COMMENT,
      title: `${userState?.user?.nickname || userState.user?.username}评论了你的约定`,
      text,
      userId: deal?.dealuser_set[1].user
    })
    setComments([{...res.data}, ...comments])
    setCommentsTotal(commentsTotal+1)
  }

  async function onAddThread(comment: Models.Comment, text: string){
    const res = await axios.post(`${API}/comments/${comment.id}/threads`,{
        text,
        reply_user: comment.user
    })
    sendNotification({
      type: NOTIFICATION_TYPE.DEAL_COMMENT,
      title: `${userState?.user?.nickname || userState.user?.username}追加了评论`,
      text,
      userId: deal?.dealuser_set[0].user
    })
    sendNotification({
      type: NOTIFICATION_TYPE.DEAL_COMMENT,
      title: `${userState?.user?.nickname || userState.user?.username}追加了评论`,
      text,
      userId: deal?.dealuser_set[1].user
    })
    if(![deal?.dealuser_set[0].user,deal?.dealuser_set[1].user].includes(comment.user)){
      sendNotification({
        type: NOTIFICATION_TYPE.DEAL_COMMENT,
        title: `${userState?.user?.nickname || userState.user?.username}追加了评论`,
        text,
        userId: comment.user
      })
    }
    let newComments = [...comments]
    const index = comments.findIndex(e => e.id === comment.id)
    newComments[index] = { ...newComments[index], thread_set: [...newComments[index].thread_set, res.data]}
    setComments(newComments)
  }

  function sendNotification(data: {userId:number, title:string, text:string, type: NOTIFICATION_TYPE}){
    if(userState.user?.user_id === data.userId) return
    const notification =  {
      message_type: 'notification',
      type: data.type,
      user: data.userId,
      title: data.title,
      description: data.text,
      target_id: deal?.id,
    }
    context.sendNotification(notification)
  }

  async function onDelete(){
    if(!commentSelected) return
    const res = await axios.delete(`${API}/comments/${commentSelected.id}/`)
    setComments(comments.filter(e => e.id !== commentSelected.id))
    setCommentsTotal(commentsTotal - 1)
    setIsEditCommentCommentVisible(false)
    setCommentSelected(undefined)
  }

  async function onReply(selected:Models.Comment) {
    if(!userState.user){
      setIsModalVisible(true)
      return
    }
    setCommentSelected(selected)
    if(selected.user === userState.user?.user_id){
      setIsEditCommentCommentVisible(true)
      return
    }
    setIsCommentVisible(true)
  }

  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
  }

  if(!deal || isLoading) return <ActivityIndicator size='large' animating={true}  style={{padding: 10}} />
  const rightWidth = rightWidthOne
  return (
    <View style={styles.container}>
          <RefreshControl 
            onRefresh={getDealDetails}
            onLoadMore={canLoadMore ? getMoreComments : undefined} 
            isLoadingMore={isLoadingMore}
          >
          <View style={styles.deal} >
      <View style={styles.dealContent} >
        <View style={[styles.dealContentUser]} onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
              setRightWidthOne(windowWidth - width-20)
            }} >
            <TouchableWithoutFeedback onPress={()=>navigation.navigate('UserProfile',{userId:hostUser?.user})}>
            {hostUser?.avatar ? <Image source={{ uri: hostUser.avatar }} style={styles.avatar} /> :
            <Icons.PersonCircle style={styles.avatar} width={38} height={38} />}
            </TouchableWithoutFeedback>
            <Text style={styles.dealText}>{hostUser?.nickname || hostUser?.username}:</Text>
        </View>
        <View style={{width: rightWidth, backgroundColor: 'transparent' }}>
            <Text style={styles.dealDescription}>{deal.description}</Text>
            <View style={{flexDirection:'row', flexWrap:'wrap', flex:1}}>
            {deal.dealattachment_set.map((file:Models.Attachment) =>(
              <TouchableWithoutFeedback onPress={()=>{
                setIsFull(!isFull)
                setFullSizeImage(file.attachment || '')
              }}>
                <Image key={`deal-${deal.id}-image-${file.id}`} source={{ uri: file.attachment }} style={styles.image}/>
              </TouchableWithoutFeedback>
            ))}
            </View>
        </View>
      </View>
      <View style={styles.iconBar}>
          <View style={styles.icon}>
              <View style={styles.statusBar}>
                <Status userSet={deal.dealuser_set} />
            </View>
              {deal.is_push_to_chain && 
              <View style={styles.statusView}>
                  <Icons.Status width={12} height={12} color={Colors.Theme} />
                  <Text style={styles.statusText}>已上链</Text>
              </View>}
          </View>
          <View style={styles.iconRight}>
          {/* {item.is_public && <TouchableWithoutFeedback onPress={() => onForward(item)}>
              <View style={styles.icon}>
                  <Icons.Forward width={24} height={24} color={Colors.Theme} />
                  <Text style={styles.iconText}>转发</Text>
              </View>
          </TouchableWithoutFeedback>}*/}
          <TouchableWithoutFeedback onPress={onLike}>
              <View style={styles.icon}>
                  <Icons.Like width={22} height={22} color={like !== undefined ? Colors.R500 : userState.user ? Colors.Theme : Colors.K300} />
                  <Text style={styles.iconText}>点赞{likeCount > 0 ? ` ${likeCount}` : ""}</Text>
              </View>
          </TouchableWithoutFeedback>
          </View>
      </View>
        <View style={styles.modalHeader}>
          <Text style={styles.modalHeaderTitle}>共 {commentsTotal} 条评论</Text>
        </View>
          <FlatList
            data={comments}
            scrollEnabled={false}
            keyExtractor={item => `comment-${item.id}`}
            renderItem={({ item }:{ item: Models.Comment }) => (
              <CommentCard comment={item} onClick={onReply} onAlert={()=> setIsModalVisible(true)} user={userState.user} context={context} />
            )}
            ListEmptyComponent={() => (
              commentsTotal > 0 ? <ActivityIndicator animating={true} style={styles.empty} /> : <Text style={styles.empty} >-- 暂无评论 --</Text>
            )}  
          />
          </View>
        </RefreshControl>
        <TouchableWithoutFeedback onPress={()=>{
          if(!userState.user){
            setIsModalVisible(true)
            return
          }
          setIsCommentVisible(true)
        }}>
        <View style={styles.postCommentPreview} onLayout={(event) => {
          var {x, y, width, height} = event.nativeEvent.layout;
          setRightInputWidth(windowWidth-58)
        }}>
          {userState.user?.avatar ? <Image source={{ uri: userState.user?.avatar }} style={styles.avatar} />:
          <Icons.PersonCircle width={38} height={38} />}
          <View style={[styles.postCommentPreviewView, {width: rightInputWidth}]}>
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
        <ImagePreview
          isVisible={isFull}
          closeImage={closeImage}
          uri={fullSizeImage} 
        />
        <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} isDialog={true}>
          <Modal.Body>
            <Text style={{fontSize: 16, textAlign: 'center'}}>请先登录～</Text>
          </Modal.Body>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  checkHistory: {
    paddingVertical: 6,
    marginRight: 10,
  },
  container:{
    backgroundColor: Colors.white,
    flex: 1,
  },
  back: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
  },
  deal: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
    borderRadius: 8,
    flex: 1,
  },
  avatar:{
    width: 38, 
    height: 38,
    borderRadius: 50,
    marginRight: 5
  },
  dealContent: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent:'space-between'
  },
  dealContentUser: {
    flexDirection: 'row',
  },
  dealText: {
    fontSize: 14,
    color: Colors.K600,
    fontWeight: '500',
    marginRight: 8,
    marginTop:10
  },
  dealDescription:{
    color: Colors.K950,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: 'transparent',
    marginTop:10
  },
  image:{
    width: 58,
    height: 58,
    marginRight:10,
    marginBottom: 10,
    borderRadius: 5
  },
  statusBar: {
    flexDirection: 'row',
    marginRight:5
  },
  statusView: {
    flexDirection: 'row',
    paddingVertical:5,
    paddingHorizontal:10,
    borderRadius: 50,
    backgroundColor: Colors.ThemeOpacity,
    marginTop: 10,
  },
  statusText: {
    color:Colors.Theme,
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 2
  },
  iconBar: {
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  icon: {
    flexDirection: 'row',
  },
  iconRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconText:{
    lineHeight: 24,
    color: Colors.K600,
    fontSize: 12,
    fontWeight: '500'
  },
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
    paddingVertical: 10,
    paddingBottom: getFooterPadding(),
    justifyContent: 'space-evenly',
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

export default DealDetailScreen