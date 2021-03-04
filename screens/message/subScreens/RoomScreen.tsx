import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react';
import { 
  StyleSheet,
  FlatList,
  TouchableHighlight, 
  TouchableWithoutFeedback, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  LayoutAnimation, 
  TouchableOpacity, 
  Keyboard, 
  Dimensions, 
  Image, 
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'
import { Models } from 'models';
import Uri from 'jsuri'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { debounce } from 'lodash';

import { Text, View, RefreshControl, TextInput, SendButton, Button, Modal, ImagePreview, useKeyboard } from '../../../components';
import { RootStackParamList, BottomTabParamList, NOTIFICATION_TYPE, DEAL_STATUS } from '../../../types'
import { MessageContext, AuthContext, MessageTypes } from '../../../reducers'
import { Colors, API } from '../../../constants';
import * as Icons from '../../../assets/icons'
import { getInputHeight } from '../../utility/helper'

const windowWidth = Dimensions.get('window').width;
interface RoomProps {
    dealId: number,
    route: {params:{dealId:number, dealDetail: Models.RoomDeal}}
}

const RoomScreen = ({ route, navigation }: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList> & RoomProps) => {
  const { state: messageState, dispatch: messageDispatch, context } = useContext(MessageContext);
  const { state: userState } = useContext(AuthContext);

  const [editable, setEditable] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoadHistory, setIsLoadHistory] = useState(false)
  const [isChatKeyboardShow, setIsChatKeyboardShow] = useState(false)
  const [isKeyboardShow] = useKeyboard()
  const [massages, setMessages] = useState<Models.Message[]>(messageState.rooms[`room-deal-${route.params?.dealId}`]?.messages)
  const [newMessage, setNewMessage] = useState("")
  const [title, setTitle] = useState("")
  const [senderDetail, setSenderDetail] = useState<Models.DealUser>()
  const [userDetail, setUserDetail] = useState<Models.DealUser>()
  const refreshControlRef = useRef()

  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [step, setStep] = useState(1)
  const [completeStatus, setCompleteStatus] = useState(false)

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')

  const [isAddressVisible, setIsAddressVisible] = useState(false)
  const [address, setAddress] = useState('')
  const inputStyle = getInputHeight()

  const dealDetail = route.params.dealDetail

  useEffect(()=>{
    if(isKeyboardShow) return
    setIsChatKeyboardShow(isKeyboardShow)
  },[isKeyboardShow])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        isEditable() && <Button outline onPress={onCancelDealConfirm} style={styles.cancelTrade} textStyle={{fontSize: 14, fontWeight: '600'}} title="取消约定" />
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.close} onPress={() => {
          // @ts-ignore
          if(route.params?.onGoBack){
            // @ts-ignore
            route.params.onGoBack(route.params?.dealId)
          }
          navigation.goBack()
        }}>
        <View style={styles.back}>
            <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
          {messageState.messageUnread > 0 && <View style={styles.backTextView}><Text style={styles.backText}>{messageState.messageUnread}</Text></View>}
        </View>
        </TouchableOpacity>
      ),
      headerTitle: () => <Text style={{maxWidth:windowWidth-220}} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
    });
  }, [navigation, messageState.messageUnread, title]);

  useEffect(() => {
    setEditable(isEditable())
    setUserDetails()
  },[])

  useEffect(() => {
    const targetRoom = messageState.rooms[`room-deal-${route.params?.dealId}`]
    if(targetRoom) {
      setMessages(targetRoom.messages)
      scrollToEnd()
      if(targetRoom.unRead > 0) {
        updateUnreadMessages(targetRoom.dealId)
      }
    }
  },[messageState.rooms])

  useEffect(()=>{
    if(dealDetail){
      setTitle(dealDetail.description)
    }
  },[dealDetail])

  async function updateUnreadMessages(dealId:number){
    axios.put(new Uri(`${API}/deals/${dealId}/messages/read-all`).toString())
    messageDispatch({
      type: MessageTypes.UPDATE_UNREAD_MESSAGE,
      roomId: `room-deal-${route.params?.dealId}`,
    });
  }

  function isEditable(){
    if (userState.user?.user_id === dealDetail.sender_id || userState.user?.user_id === dealDetail.user ) {
      if(dealDetail.status === DEAL_STATUS.IN_PROGRESS){
        return true
      }
    }
    return false
  }

  async function getMoreMessages(){
    setIsLoadHistory(true)
    let newMessages = massages ? [...massages] : []
    let url = new Uri(`${API}/messages/`)
    .addQueryParam('page', 1)
    .addQueryParam('page_size', 20)
    .addQueryParam('deal',route.params?.dealId)
    .addQueryParam('ordering','-id')
    if(newMessages.length > 0){
      url = url.addQueryParam('id__lt',newMessages[0].id)
    }
    try{
      const res = await axios.get(url.toString())
      setMessages([...res.data.results.reverse(), ...newMessages])
    }catch(err){}
  }

  async function setUserDetails(){
    if(!route.params?.dealId) return
    const res = await axios.get(`${API}/deals/${route.params?.dealId}/users`)
    res.data.forEach((e:Models.DealUser) => {
      if(e.user === dealDetail.sender_id){
        setSenderDetail({...e})
      }else{
        setUserDetail({...e})
      }
    })
  }

  async function onSendMessage(){
    if (newMessage) {
        setNewMessage("");
        const message =  {
          user: userState.user?.user_id,
          text: newMessage,
          deal: route.params?.dealId,
        }
        sendMessage(message)
      }
  }

  async function sendMessage(message:any){
    let newMessages = massages ? [...massages] : []
    if(message.user){
      newMessages.push({...message, isLoading: true})
      setMessages(newMessages)
    }
    try{
      const res = await axios.post(new Uri(`${API}/messages/`).toString(),{...message})
      if(res.data){
        if(message.user){
          messageDispatch({
            type: MessageTypes.NEW_MESSAGE_RECEIVE,
            message: {...res.data, message_type: 'message'},
            currentUser: userState.user?.user_id
          })
          const index = newMessages.findIndex(e => e.text === message.text)
          newMessages[index] = {...res.data}
          setMessages(newMessages)
        }
        context.sendMessage(res.data)
      }else{
        const index = newMessages.findIndex(e=>e.text === message.text)
        newMessages[index].isLoading = false
        setMessages(newMessages)
      }
    }catch(err){
      const index = newMessages.findIndex(e=>e.text === message.text)
      newMessages[index].isLoading = false
      setMessages(newMessages)
    }
  }

  function toggleExpand(isExpand:boolean){
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsVisible(isExpand)
  }

  async function onCancelDealConfirm(){
    try{
      setStep(4)
      setIsCompleteModalVisible(true)
    }catch(err){}
  }

  async function onCancelDeal(){
    if(userDetail && userDetail.is_cancelled){
      setStep(1)
      setIsCompleteModalVisible(false)
      debounceAlert('你已取消了约定～')
      return
    }
    if(userDetail && userDetail.fullfilled_time !== null){
      setStep(1)
      setIsCompleteModalVisible(false)
      debounceAlert(`${senderDetail?.nickname || senderDetail?.username}已点击完成，约定不可删除`)
      return
    }
    if(senderDetail && senderDetail.is_cancelled){
      cancelDeal()
      setStep(1)
      setIsCompleteModalVisible(false)
      return
    }
    try{
      await axios.patch(`${API}/deal-users/${userDetail?.id}/`,{is_cancelled: true})
      sendMessage({
        user: null,
        text: `${userState.user?.nickname || userState.user?.username}取消了约定`,
        deal: route.params?.dealId,
      })
    }catch(err){}
    setStep(1)
    setIsCompleteModalVisible(false)
  }

  async function cancelDeal(){
    try{
      await axios.put(`${API}/deal-details/${route.params?.dealId}/`,{status: DEAL_STATUS.CANCEL})
      sendNotification({
        title: '取消约定',
        type: NOTIFICATION_TYPE.DEAL_CANCELLED,
        text: `“${userState.user?.nickname || userState.user?.username}”取消了与你的约定～`,
        userId: dealDetail.sender_id,
      })
      sendNotification({
        title: '取消约定',
        type: NOTIFICATION_TYPE.DEAL_CANCELLED,
        text: `你取消了约定～`,
        // @ts-ignore
        userId: userState.user?.user_id,
      })
      context.fetchDeals()
      messageDispatch({
        type: MessageTypes.SET_STATE,
        payload: {
          deleteRoom: `room-deal-${route.params?.dealId}`
        },
      });
      navigation.goBack()
    }catch(err){}
  }

  async function completeDeal(){
    try{
      const res = await axios.put(`${API}/deal-details/${route.params?.dealId}/`,{
        status: DEAL_STATUS.COMPLETE,
        is_fullfilled: completeStatus
      })
      setIsCompleteModalVisible(false)
      setStep(1)
      if(res.data.status !== DEAL_STATUS.COMPLETE){
        sendMessage({
          user: null,
          text: `${userState.user?.nickname || userState.user?.username}已点击完成`,
          deal: route.params?.dealId,
        })
      }
      sendNotification({
        title: '约定完成',
        type: NOTIFICATION_TYPE.DEAL_APPROVED,
        text: `与“${userState.user?.nickname || userState.user?.username}”约定完成～`,
        userId: dealDetail.sender_id,
      })
      if(res.data.status === DEAL_STATUS.COMPLETE){
        sendNotification({
          title: '约定完成',
          type: NOTIFICATION_TYPE.DEAL_APPROVED,
          text: `与“${senderDetail?.nickname || senderDetail?.username}”约定完成～`,
          //@ts-ignore
          userId: userState.user?.user_id,
        })
        navigation.navigate("Messages", {refresh:true})
      }
    }catch(err){
      setIsCompleteModalVisible(false)
      setStep(1)
    }
  }

  async function pickImage () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      await ImagePicker.requestCameraRollPermissionsAsync()
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true
      });
      sendImage(result)
    } catch (err) {
      console.log(err)
    }
  };

  async function takePhoto () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      await ImagePicker.requestCameraPermissionsAsync()
    }
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true
      });
      sendImage(result)
    } catch (err) {
      console.log(err)
    }
  };

  async function sendImage(result:any){
    const manipResult = await ImageManipulator.manipulateAsync(
      result.localUri || result.uri,
      [{ resize: {width: 300} }],
      { compress: 1, base64: true }
    );
    const message =  {
      user: userState.user?.user_id,
      text: '',
      //@ts-ignore
      image: `data:image/jpeg;base64,${manipResult.base64}`,
      deal: route.params?.dealId,
    }
    sendMessage(message)
  }

  async function onSelectAddress(address:Models.Address){
    const message =  {
      user: userState.user?.user_id,
      address: address.id,
      deal: route.params?.dealId,
    }
    sendMessage(message)
  }

  async function onSendQR(){
    try{
      const res = await axios.get(`${API}/user-profile/${userState.user?.user_id}/`)
      if(res.data.qr_image){
        const message =  {
          user: userState.user?.user_id,
          qr_image: res.data.qr_image,
          deal: route.params?.dealId,
        }
        sendMessage(message)
      }else{
        Alert.alert("请先在个人中心设置收付款码")
      }
    }catch(err){}
  }

  async function onPublish(){
    try{
      await axios.patch(`${API}/deal-details/${route.params?.dealId}/`,{
        is_public: true,
      })
      sendNotification({
        title: `${userState.user?.nickname || userState.user?.username}发布了约定`,
        type: NOTIFICATION_TYPE.DEAL_PUBLISHED,
        text: '',
        userId: dealDetail.sender_id,
      })
      messageDispatch({
        type: MessageTypes.SET_STATE,
        payload:{
          dealDetail: {
            ...dealDetail,
            is_public: true
          },
        }
      })
      setIsCompleteModalVisible(false)
      setStep(1)
    }catch(err){}
  }

  function sendNotification(data: {userId:number, title:string, text:string, type: NOTIFICATION_TYPE}){
    const notification =  {
      message_type: 'notification',
      type: data.type,
      user: data.userId,
      title: data.title,
      description: data.text,
      target_id: route.params?.dealId,
    }
    context.sendNotification(notification)
  }

  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
  }

  function onViewAddress(address:Models.Address){
    setIsAddressVisible(true)
    setAddress(`${address.address_line} ${address.province_state} ${address.city} ${address.postal_zip} ${address.phone}`)
  }

  const renderRow = ({item}:{item:Models.Message}) => {
    const isMe = item.user === userState.user?.user_id
    if(item.user === null){
      return (
        <View>
          <Text style={styles.loadMore}>{item.text}</Text>
        </View>
      )
    }
    return (
      <View style={[isMe ? styles.meRow : styles.messageRow]}>
        {!isMe && dealDetail.sender_avatar ? <TouchableWithoutFeedback onPress={()=>navigation.navigate('UserProfile',{userId:dealDetail.sender_id})}><Image source={{ uri: dealDetail.sender_avatar }} style={styles.avatar} /></TouchableWithoutFeedback>:null}
        {!isMe && !dealDetail.sender_avatar && <TouchableWithoutFeedback onPress={()=>navigation.navigate('UserProfile',{userId:dealDetail.sender_id})}><Icons.PersonCircle width={40} height={40} /></TouchableWithoutFeedback>}
        {item.isLoading === true ? <ActivityIndicator animating={true}  style={{marginRight: 5}} /> : null}
        {item.isLoading === false ? <Icons.Exclamation color={Colors.R500} style={{marginTop:10, marginRight: 5}} /> : null}
        {item.image ? 
        <TouchableWithoutFeedback onPress={()=>{
          setIsFull(!isFull)
          setFullSizeImage(item.image?item.image:'')
        }}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableWithoutFeedback>
        :
        <TouchableHighlight
          underlayColor='#dddddd'
          style={[
            styles.messageContent, 
            isMe ? {backgroundColor: Colors.Theme, borderTopRightRadius: 0} : {backgroundColor: Colors.white, borderTopLeftRadius: 0}
          ]}
          onPress={()=>{
            if(userState.user?.user_id !== dealDetail.sender_id && userState.user?.user_id !== dealDetail.user) return

            if(item?.address?.id){
              return onViewAddress(item.address)
            }else if(item?.qr_image){
              setIsFull(true)
              setFullSizeImage(item.qr_image)
            }
          }}
        >
            <View style={styles.message}>
            {item?.text ? <Text style={[styles.messageText, isMe ? {color: Colors.white} : {color: Colors.K800}]}>{item.text}</Text> : null}
            {item?.address?.id && <Icons.Place color={isMe ? Colors.white : Colors.Theme} />}
            {item?.qr_image ? <Icons.Money color={isMe ? Colors.white : Colors.Theme} /> : null}
            </View>
        </TouchableHighlight>
        }
      </View>
    );
  }

  const scrollToEnd = debounce(()=>{
    // @ts-ignore
    refreshControlRef?.current?.scrollToEnd({animated: true})
  }, 50)

  const debounceAlert = debounce((text) => Alert.alert(text), 600)

  return (
        <View style={styles.container} >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <SafeAreaView style={styles.container} onTouchStart={()=>{
                    if(isVisible){
                        toggleExpand(false)
                    }
                }}>
                <RefreshControl 
                  onRefresh={getMoreMessages} 
                  // @ts-ignore
                  ref={refreshControlRef}
                >
                  <Text style={styles.loadMore}>-- 向下滑查看更多 --</Text>
                <FlatList 
                    style={styles.listView}
                    data={massages}
                    keyExtractor={item => `message-${item.id}`}
                    renderItem={renderRow}
                    onContentSizeChange={() => {
                      if(isLoadHistory) return
                      // @ts-ignore
                      // refreshControlRef?.current?.scrollToEnd({animated: true})
                    }}
                />
                </RefreshControl>
                {editable && <SendButton onPress={()=>{setStep(3); setIsCompleteModalVisible(true)}} style={styles.publish} disabled={dealDetail.is_public} />}
                </SafeAreaView>
                {editable && 
                <View 
                  style={[
                    styles.inputRow, 
                    {paddingBottom: inputStyle.paddingBottom, height: inputStyle.height},
                    isChatKeyboardShow ? {marginBottom:inputStyle.marginBottom}:{}
                ]}>
                    <TextInput
                      textWrapperStyle={styles.newInput}
                      textStyle={{borderRadius: 8, paddingLeft: 0}}
                      value={newMessage}
                      blurOnSubmit={false}
                      onSubmitEditing={onSendMessage}
                      placeholder="Message..."
                      returnKeyType="send"
                      onChangeText={setNewMessage}
                      onTouchStart={() => {
                        setIsChatKeyboardShow(true)
                        if(isVisible){
                            toggleExpand(false)
                        }
                        scrollToEnd()
                      }}
                      onBlur={() => setIsChatKeyboardShow(false)}
                    />
                    {/* <TouchableOpacity style={styles.barIcon} onPress={() => toggleExpand(true)}>
                        <Icons.Emoji width={26} height={26} color={Colors.Theme} />
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.barIcon} onPress={() => {
                        Keyboard.dismiss()
                        toggleExpand(!isVisible)
                        scrollToEnd()
                    }}>
                        <Icons.AddCircleOutline width={26} height={26} color={Colors.Theme} />
                    </TouchableOpacity>
                </View>}
            </KeyboardAvoidingView>
            {isVisible && editable && 
            <>
                <View style={styles.messageMenu}>
                    <TouchableOpacity onPress={pickImage}>
                        <Icons.Upload width={48} height={48} color={Colors.Theme} />
                        <Text style={styles.messageMenuText}>图片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={takePhoto}>
                        <Icons.Camera width={48} height={48} color={Colors.Theme} />
                        <Text style={styles.messageMenuText}>拍照</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('AddressList', {onSelectAddress, isFromChat:true})}>
                        <Icons.House width={48} height={48} color={Colors.Theme} />
                        <Text style={styles.messageMenuText}>发送地址</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSendQR}>
                        <Icons.TransferMoney width={48} height={48} color={Colors.Theme} />
                        <Text style={styles.messageMenuText}>收付款码</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.messageMenu, {paddingBottom:30}]}>
                    <TouchableOpacity onPress={() => {
                      setIsCompleteModalVisible(true)
                    }}>
                        <Icons.Promise width={64} height={64} color={Colors.Theme} />
                        <Text style={styles.messageMenuText}>完成约定</Text>
                    </TouchableOpacity>
                </View>
            </>
            }
            <Modal
              isVisible={isCompleteModalVisible}
              onClose={()=>{}}
            >
              <Modal.Body>
                {step === 1 && <Text style={styles.alert}>对方是否完成履行约定？</Text>}
                {step === 2 && <Text style={styles.alert}>{completeStatus ? '是否确定对方已完成履行?' : '是否确定对方已完成履行?' }</Text>}
                {step === 3 && <Text style={styles.alert}>是否发布约定？</Text>}
                {step === 4 && <Text style={styles.alert}>是否取消约定？</Text>}
                <Text style={styles.tipText}>操作不可撤回</Text>
              </Modal.Body>
              <Modal.Footer 
                  leftBtn={{
                      title: step === 1 ? '未履行' : '我再想想',
                      onPress: () => {
                        if(step === 1 ){
                          setCompleteStatus(false)
                          setStep(2)
                        }else{
                          setIsCompleteModalVisible(false)
                          setStep(1)
                        }
                      }
                  }}
                  rightBtn={{
                      title: step === 1 ? '已履行' : '确定',
                      onPress: () => {
                        if(step === 1 ){
                          setCompleteStatus(true)
                          setStep(2)
                        }else if(step === 2){
                          completeDeal()
                        }else if(step === 3){
                          onPublish()
                        }else{
                          onCancelDeal()
                        }
                      }
                  }}
              />
            </Modal>
            <ImagePreview
              isVisible={isFull}
              closeImage={closeImage}
              uri={fullSizeImage} 
            />
            <Modal
              isVisible={isAddressVisible}
              onClose={()=>{
                setIsAddressVisible(false)
                setAddress('')
              }}
            >
              <Modal.Body>
                <Text selectable>{address}</Text>
              </Modal.Body>
            </Modal>
        </View>
  );
}

const styles = StyleSheet.create({
      container: {
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
      backTextView: {
        backgroundColor:Colors.K200,
        marginTop:-2,
        borderRadius:50,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
      },
      backText: {
        color: Colors.K950,
      },
      cancelTrade: {
        paddingVertical: 6,
        marginRight: 10,
      },
      listView: {
        paddingHorizontal: 10,
        paddingBottom:70
      },
      loadMore:{
        textAlign: 'center',
        padding: 10,
        fontSize: 14,
        color: Colors.K600,
        backgroundColor: 'transparent'
      },
      publish: {
        position:'absolute',
        right:20,
        bottom:20
      },
      inputRow:{
        flexDirection:'row',
        paddingVertical: 10,
        backgroundColor: Colors.white,
      },
      newInput: {
        borderColor: '#ccc',
        width: windowWidth - 46,
        marginBottom: 0,
        marginLeft: 5,
      },
      barIcon:{
          paddingLeft: 5,
          paddingVertical:7,
      },
      messageRow: {
        alignItems:'flex-start',
        marginBottom:15,
        flexDirection: 'row'
      },
      meRow: {
        flexDirection:'row',
        justifyContent:'flex-end',
        marginBottom:15,
      },
      avatar:{
        width: 36, 
        height: 36,
        borderRadius: 50,
        marginTop:5,
        marginRight:5
      },
      messageContent:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius:15,
        marginTop: 5,
      },
      message: {
        backgroundColor: 'transparent'
      },
      messageText: {
        fontSize: 16,
        color: Colors.K800,
        maxWidth: windowWidth - 150
      },
      messageMenu: {
        flexDirection:'row',
        backgroundColor:Colors.white,
        justifyContent:'space-around',
        paddingVertical:10
      },
      messageMenuText:{
        textAlign:'center',
        fontSize: 12,
        marginTop: 4,
        color: Colors.K600
      },
      tipText: {
        textAlign:'center', 
        color:Colors.K600, 
        marginTop:10,
        lineHeight:20, 
        fontSize:14
      },
      image:{
        width: 120, 
        height: 160,
        borderRadius: 5,
        marginTop:5,
        marginRight:15,
      },
      alert:{
        fontSize:22,
        textAlign:'center'
      }
});

export default RoomScreen