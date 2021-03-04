import React, { useEffect, useState, useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Image, ActivityIndicator, View, Alert, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios'
import Uri from 'jsuri'
import { debounce } from 'lodash'

import { Text, Modal, UserAvatar } from '../../../components'
import { NotificationDealCard } from '../../../modules'
import { Colors, API } from '../../../constants'
import { Models, NOTIFICATION_TYPE, BottomTabParamList, RootStackParamList, DEAL_STATUS } from '../../../types';
import * as Icons from '../../../assets/icons'
import { MessageContext, MessageTypes, AuthContext } from '../../../reducers'

interface NotificationDealModalProps {
    title?: string;
    notification: Models.Notification;
    isVisible: boolean;
    onClose:() => void; 
    messageDispatch: any;
    userState?:any;
    context?: any
}

const ContactRequestBody = ({notification, onClose, messageDispatch, userState, context}:NotificationDealModalProps) =>{
    const [requestUser, setRequestUser] = useState<Models.User>()
    const [isLoading, setIsLoading] = useState(false)
    useEffect(()=>{
        setIsLoading(true)
        axios.get(new Uri(`${API}/users/`).addQueryParam('id',notification.target_id).toString()).then(res=>{
            setRequestUser({
                user_id: notification.target_id,
                username: res.data.results[0].username,
                nickname: res.data.results[0].nickname,
                avatar: res.data.results[0].userprofile.avatar
            })
            setIsLoading(false)
        })
    },[notification])

    async function onConfirm(){
        await axios.post(`${API}/friends/`,{
            user: notification.target_id,
            friend: notification.user
        }).catch(err=>{})
        try{
            await axios.post(`${API}/friends/`,{
                user: notification.user,
                friend: notification.target_id,
            })
            const webspcketNotification =  {
                message_type: 'notification',
                type: MessageTypes.CONTACT_ADDED,
                user: requestUser?.user_id,
                title: `“${userState.user?.nickname || userState.user?.username}”接受了你的好友请求～`,
                description: '',
                target_id: userState.user?.user_id,
            }
            context.sendNotification(webspcketNotification)
            context.fetchContacts()
            onDeleteNotification()
        }catch(err){
            if (err.response.data.hasOwnProperty("non_field_errors")){
                onDeleteNotification()
                return
            }
            Alert.alert("添加失败")
        }
      
    }

    async function onDeleteNotification(){
        messageDispatch({
            type: MessageTypes.CONTACT_REQUEST_RESPONSED,
            notification
        })
        await axios.delete(`${API}/notifications/${notification.id}/`)
        onClose()
    }

    if(isLoading) return <Modal.Body><ActivityIndicator animating={true} /></Modal.Body>
    return (
        <>
        <Modal.Body style={styles.contactModalBody}>
            {requestUser?.avatar ? <Image source={{ uri: requestUser.avatar }} style={styles.avatar} />:
            <Icons.PersonCircle width={60} height={60} />}
            <Text style={styles.modalText} >{notification.description}</Text>
        </Modal.Body>
        <Modal.Footer 
            leftBtn={{
                title: '残忍拒绝',
                onPress: onDeleteNotification
            }}
            rightBtn={{
                title: '立刻答应',
                onPress: onConfirm
            }}
        />
      </>
    )
}

const DealDetailBody = ({ title, notification, onClose, messageDispatch, navigation, userState }:StackScreenProps<BottomTabParamList> & NotificationDealModalProps) =>{
    const [dealDetail, setDealDetail] = useState<Models.Deal>()
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(()=>{
        setIsLoading(true)
        axios.get(new Uri(`${API}/deal-details/${notification.target_id}/`).toString()).then(res=>{
            setDealDetail(res.data)
            setIsLoading(false)
        })
    },[notification])

    if(isLoading || !dealDetail) return <Modal.Body><ActivityIndicator animating={true} /></Modal.Body>
    return (
        <>
        <Modal.Body style={styles.dealModalBody}>
            <Text style={styles.dealModalHeader} >{title}</Text>
            <Text style={styles.dealModalText} >{dealDetail.description}</Text>
            <NotificationDealCard item={dealDetail} />
            {notification.type !== NOTIFICATION_TYPE.DEAL_CANCELLED &&
            <>
                <View style={styles.divider}></View>
                <TouchableWithoutFeedback onPress={() => {
                    onClose()
                    if(notification.type === NOTIFICATION_TYPE.DEAL_REQUEST_APPROVED){
                        const sender = dealDetail.dealuser_set.find(e=>e.user !== userState.user?.user_id)
                        navigation.navigate("Room", {
                            dealId:dealDetail.id,
                            dealDetail: {
                                sender_avatar: sender?.avatar,
                                sender_id: sender?.user,
                                status: dealDetail.status,
                                user: userState.user?.user_id,
                                is_public: dealDetail.is_public,
                                description: dealDetail.description,
                            }
                        })
                        return
                    }
                    navigation.navigate("DealDetail", {dealId:dealDetail.id})
                }}>
                <View style={styles.button}>
                    <Icons.ArrowDownLarge />
                </View>
                </TouchableWithoutFeedback>
            </>
            }
        </Modal.Body>
      </>
    )
}

const DealRequestBody = ({ title, notification, onClose, messageDispatch, userState, context, navigation }: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList> & NotificationDealModalProps) =>{
    const [dealDetail, setDealDetail] = useState<Models.Deal>()
    const [isLoading, setIsLoading] = useState(false)
    const [requestUser, setRequestUser] = useState<Models.User>()
    const url = new Uri(`${API}/deal-details/${notification.target_id}/`).toString()

    useEffect(()=>{
        setIsLoading(true)
        axios.get(url).then(res=>{
            setDealDetail(res.data)
            const sender = res.data.dealuser_set.find((e: Models.User) => e.user !== userState.user?.user_id)
            setRequestUser(sender)
            setIsLoading(false)
        })
    },[notification])
    
    function onAcceptDeal(){
        axios.patch(url, {status: DEAL_STATUS.IN_PROGRESS})
        const notification =  {
            message_type: 'notification',
            type: NOTIFICATION_TYPE.DEAL_REQUEST_APPROVED,
            user: dealDetail?.user_id,
            title: `与“${userState.user?.nickname || userState.user?.username}”约定建立成功`,
            description: dealDetail?.description,
            target_id: dealDetail?.id,
        }
        context.sendNotification(notification)
        context.fetchDeals()
        sendMessage()
        onDeleteNotification()
        navigateQuestionnaire()
    }

    function onRejectDeal(){
        axios.patch(url, {status: DEAL_STATUS.CANCEL})
        const notification =  {
            message_type: 'notification',
            type: NOTIFICATION_TYPE.DEAL_REQUEST_REJECTED,
            user: dealDetail?.user_id,
            title: `“${userState.user?.nickname || userState.user?.username}”拒绝了你的约定请求～`,
            description: dealDetail?.description,
            target_id: dealDetail?.id,
        }
        context.sendNotification(notification)
        onDeleteNotification()
    }

    async function onDeleteNotification(){
        messageDispatch({
            type: MessageTypes.DEAL_REQUEST_RESPONSED,
            notification
        })
        onClose()
    }

    async function sendMessage(){
        const message={
            user: null,
            text: dealDetail?.description,
            deal: dealDetail?.id,
          }
        try{
          const res = await axios.post(new Uri(`${API}/messages/`).toString(),{...message})
          if(res.data){
            context.sendMessage(res.data)
          }
        }catch(err){}
      }

    const navigateQuestionnaire = debounce(async()=>{
        if(userState.user?.user_config.is_quentionnaire_answered !== true){
            navigation.navigate("Questionnaire")
        }
    }, 500)
    if(isLoading || !dealDetail) return <Modal.Body><ActivityIndicator animating={true} /></Modal.Body>
    return (
        <>
        <Modal.Body style={styles.dealModalBody}>
            <View style={styles.dealModalTitle}>
                <View style={styles.dealModalAvatar}>
                    <UserAvatar avatar={requestUser?.avatar} />
                </View>
                <Text style={styles.dealModalHeader}>{title}</Text>
            </View>
            <Text style={styles.dealModalText} >{dealDetail.description}</Text>
            <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection:'row', flexWrap:'wrap', flex:1}}>
                {dealDetail.dealattachment_set.map(file => (
                    <Image key={`deal-${dealDetail.id}-image-${file.id}`} source={{ uri: file.attachment }} style={styles.image}/>
                ))}
                </View>
            </View>
        </Modal.Body>
        {notification.type === NOTIFICATION_TYPE.DEAL_REQUEST && 
            <Modal.Footer 
                leftBtn={{
                    title: '残忍拒绝',
                    onPress: onRejectDeal
                }}
                rightBtn={{
                    title: '立刻答应',
                    onPress: onAcceptDeal
                }}
            />
        }
      </>
    )
}

const DescriptionBody = ({ title }:StackScreenProps<BottomTabParamList> & NotificationDealModalProps) =>{
    return (
        <>
        <Modal.Body style={styles.dealModalBody}>
            <Text style={styles.dealModalHeader} >{title}</Text>
        </Modal.Body>
      </>
    )
}

const NotificationDealModal = (props: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList> & NotificationDealModalProps) =>{
    const { dispatch: messageDispatch, context } = useContext(MessageContext);
    const { state: userState } = useContext(AuthContext);
    const renderModalBody=()=>{
        switch(props.notification.type){
            case NOTIFICATION_TYPE.CONTACT_REQUEST:
                return <ContactRequestBody {...props} messageDispatch={messageDispatch} context={context} userState={userState} />
            case NOTIFICATION_TYPE.DEAL_REQUEST:
            case NOTIFICATION_TYPE.DEAL_REQUEST_REJECTED:
                return <DealRequestBody {...props} title={props.notification.title} messageDispatch={messageDispatch} context={context} userState={userState} />
            case NOTIFICATION_TYPE.DEAL_REQUEST_APPROVED:    
                return <DealDetailBody {...props} title={props.notification.title} messageDispatch={messageDispatch} userState={userState} />        
            case NOTIFICATION_TYPE.DEAL_APPROVED:
            case NOTIFICATION_TYPE.DEAL_CANCELLED:
                return <DealDetailBody {...props} title={props.notification.description} messageDispatch={messageDispatch} userState={userState} />
            case NOTIFICATION_TYPE.DEAL_COMMENT:
                return <DealDetailBody {...props} title={`${props.notification.title}: ${props.notification.description}`} messageDispatch={messageDispatch} userState={userState} />
            case NOTIFICATION_TYPE.DEAL_LIKE:
            case NOTIFICATION_TYPE.DEAL_PUBLISHED:
                return <DealDetailBody {...props} title={props.notification.title} messageDispatch={messageDispatch} userState={userState} />
            case NOTIFICATION_TYPE.CONTACT_ADDED:
                return <DescriptionBody {...props} title={props.notification.title} messageDispatch={messageDispatch} userState={userState} />
        }
    }

    return (
        <Modal
          isVisible={props.isVisible}
          onClose={props.onClose}
          isDialog={props.notification.type === NOTIFICATION_TYPE.CONTACT_ADDED}
        >
            {renderModalBody()}
        </Modal>
    )
}

const styles = StyleSheet.create({
    contactModalBody: {
        alignItems:'center',
    },
    dealModalBody: {

    },
    dealModalTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dealModalAvatar: {
        marginRight: 5
    },
    dealModalHeader:{
        color: Colors.K950,
        fontWeight:'500',
        fontSize:16
    },
    dealModalText:{
        fontSize:14,
        color:Colors.K600,
        marginVertical:10
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    modalText: {
        marginTop: 10
    },
    editThreadOption: {
        borderColor: Colors.K200,
        borderBottomWidth: 1
    },
    editThreadOptionText:{
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.K950,
    },
    divider:{
        borderWidth:1,
        marginVertical:20,
        borderColor:Colors.K200
    },
    button:{
        alignItems:'center',
        backgroundColor: Colors.white,
        width: '100%',
        paddingVertical: 20,
        margin: -30
    },
    image:{
        width: 58,
        height: 58,
        marginRight:10,
        marginBottom: 10,
        borderRadius: 5
    },
  });

  export default NotificationDealModal;