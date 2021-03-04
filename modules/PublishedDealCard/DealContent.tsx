import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, View, TouchableHighlight, Dimensions } from 'react-native';
import axios from 'axios'

import { Text } from '../../components'
import { Models, NOTIFICATION_TYPE } from '../../types'
import { MessageContextProps } from '../../reducers'
import { Colors, API } from '../../constants'
import * as Icons from '../../assets/icons'

const windowWidth = Dimensions.get('window').width;

interface DealContentProps{
    user?: Models.User;
    item: Models.Deal, 
    onPress: (item: Models.Deal)=>void,
    onForward?: (item: Models.Deal)=>void,
    onComment: (item: Models.Deal)=>void,
    onViewImage: (uri: string)=>void,
    onAlert: () => void,
    style?: any,
    context: MessageContextProps
}

const  DealContent = ({ user, item, onPress, onForward, onComment, onViewImage, onAlert, context}:DealContentProps) => {
    const [like, setLike] = useState<number>()
    const [hostUser, setHostUser] = useState<Models.DealUser>()
    const [rightWidth, setRightWidth] = useState<number | string>('100%')
    const [likeCount, setLikeCount] = useState(0)

    useEffect(()=>{
        if(!user) return
        const target = item.dealuser_set.find(e => e.user === item.user_id)
        if(target) setHostUser(target)
    }, [user, item])

    useEffect(() => {
        if(Number.isInteger(item.self_liked_id)){
            setLike(item.self_liked_id)
        }else{
            setLike(undefined)
        }
        setLikeCount(item.like_count)
    }, [item.self_liked_id])

    async function onLike(){
        if(Number.isInteger(like)){
            axios.delete(`${API}/likes/${like}/`)
            setLike(undefined)
            setLikeCount(likeCount-1)
            return
        }
        try{
            const res = await axios.post(`${API}/likes/`,{
                deal: item.id,
                user: user?.user_id
            })
            if(user?.user_id !== item?.dealuser_set[0].user){
                const notification1 =  {
                    message_type: 'notification',
                    type: NOTIFICATION_TYPE.DEAL_LIKE,
                    user: item?.dealuser_set[0].user,
                    title: `${user?.nickname || user?.username}点赞了你的约定`,
                    description: '',
                    target_id: item?.id,
                }
                context.sendNotification(notification1)
            }
            if(user?.user_id !== item?.dealuser_set[1].user){
                const notification2 =  {
                    message_type: 'notification',
                    type: NOTIFICATION_TYPE.DEAL_LIKE,
                    user: item?.dealuser_set[1].user,
                    title: `${user?.nickname || user?.username}点赞了你的约定`,
                    description: '',
                    target_id: item?.id,
                }
                context.sendNotification(notification2)
            }
            setLikeCount(likeCount+1)
            setLike(res.data.id)
        }catch(err){}
    }
    return(
        <View style={styles.item}>
            <TouchableHighlight underlayColor={Colors.white} onPress={() => onPress(item)}>
            <>
            <View style={styles.dealContent} >
                <View style={styles.dealContentUser} onLayout={(event) => {
                    var {x, y, width, height} = event.nativeEvent.layout;
                    setRightWidth(windowWidth-width-60)
                    }} >
                    {hostUser?.avatar ? <Image source={{ uri: hostUser.avatar }} style={styles.avatar} /> :
                    <Icons.PersonCircle style={styles.avatar} />}
                    <Text style={styles.dealContentUserText}>{hostUser?.nickname || hostUser?.username}:</Text>
                </View>
                <View style={{width:rightWidth}}>
                    <Text style={styles.itemText}>{item.description}</Text>
                    <View style={{flexDirection:'row', flexWrap:'wrap', flex:1}}>
                    {item.dealattachment_set.map(file=>(
                        <TouchableWithoutFeedback onPress={()=>{
                            onViewImage(file.attachment || '')
                          }}>
                        <Image key={`deal-${item.id}-image-${file.id}`} source={{ uri: file.attachment }} style={styles.image}/>
                        </TouchableWithoutFeedback>
                    ))}
                    </View>
                </View>
            </View>
            </>
            </TouchableHighlight>
            <View style={styles.iconBar}>
                <View style={styles.icon}>
                    {item.is_push_to_chain && 
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
                <TouchableWithoutFeedback onPress={() => {
                    if(!user?.user_id){
                        onAlert()
                        return
                    }
                    onComment(item)
                    }}>
                    <View style={styles.icon}>
                        <Icons.Comment width={24} height={24} color={user?.user_id ? Colors.Theme : Colors.K300} />
                        <Text style={styles.iconText}>评论{item.comment_count > 0 ? ` ${item.comment_count}` : ""}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>{
                    if(!user?.user_id){
                        onAlert()
                        return
                    }
                    onLike()
                }}>
                    <View style={styles.icon}>
                        <Icons.Like width={22} height={22} color={like !== undefined ? Colors.R500 : user?.user_id ? Colors.Theme : Colors.K300} />
                        <Text style={styles.iconText}>点赞{likeCount > 0 ? ` ${likeCount}` : ""}</Text>
                    </View>
                </TouchableWithoutFeedback>
                </View>
            </View>
        </View>
    )
  }
  DealContent.defaultProps={
    style:{},
  }
  
  const styles = StyleSheet.create({
    item: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: Colors.white,
      borderRadius: 8,
      marginBottom:20
    },
    avatar:{
        width: 24, 
        height: 24,
        borderRadius: 50,
        marginRight: 5
    },
    dealContent: {
        flexDirection: 'row',
        width: windowWidth - 60,
        marginBottom: 10,
    },
    dealContentUser: {
        flexDirection: 'row',
    },
    dealContentUserText: {
        fontSize: 14,
        color: Colors.K600,
        fontWeight: '500',
        marginRight: 8
    },
    itemText:{
      color: Colors.K950,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 10,
      marginTop: 2,
      width: '100%'
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
    },
    statusView: {
        flexDirection: 'row',
        paddingHorizontal:10,
        borderRadius: 50,
        backgroundColor: Colors.ThemeOpacity,
        alignItems:'center'
    },
    statusText: {
        color:Colors.Theme,
        fontSize: 12,
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
    }   
  });

  export default DealContent;