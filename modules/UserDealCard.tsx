import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Image, View,TouchableHighlight } from 'react-native';
import axios from 'axios'

import { Text, Status } from '../components'
import { Models, NOTIFICATION_TYPE } from '../types'
import { Colors, API } from '../constants'
import * as Icons from '../assets/icons'

interface UserDealCardProps{
    user?: Models.User;
    item: Models.Deal, 
    onPress: (item: Models.Deal)=>void,
    onViewImage: (uri: string)=>void,
    onSendNotification:(data:{user:number, description:string, title: string, type: NOTIFICATION_TYPE, target_id:number}) => void,
}

const  UserDealCard = ({ user, item, onPress, onSendNotification, onViewImage}:UserDealCardProps) => {
    const [like, setLike] = useState<number>()
    const [likeCount, setLikeCount] = useState(0)

    useEffect(()=>{
        if(!user) return
        if(Number.isInteger(item.self_liked_id)){
            setLike(item.self_liked_id)
        }
        setLikeCount(item.like_count)
    }, [user, item.id])

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
            onSendNotification({
                user: item?.dealuser_set[0].user,
                title: `${user?.nickname || user?.username}点赞了你的约定`,
                description: '',
                type: NOTIFICATION_TYPE.DEAL_LIKE,
                target_id:item.id, 
            })
            onSendNotification({
                user: item?.dealuser_set[1].user,
                title: `${user?.nickname || user?.username}点赞了你的约定`,
                description: '',
                type: NOTIFICATION_TYPE.DEAL_LIKE,
                target_id:item.id,
            })
            setLike(res.data.id)
            setLikeCount(likeCount+1)
        }catch(err){}
    }

    async function onDealPress(){
        if(item.is_public){
            onPress(item)
        }
    }
    
    return(
          <View style={styles.item}>
            <TouchableHighlight underlayColor={Colors.white} onPress={onDealPress}>
            <>
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
            <View style={styles.statusBar}>
                <Status userSet={item.dealuser_set} />
            </View>
            </>
            </TouchableHighlight>
            <View style={styles.iconBar}>
                <View style={styles.iconRight}>
                {item.is_public && 
                <TouchableHighlight style={styles.iconWrapper} underlayColor={Colors.white} onPress={onDealPress}>
                    <View style={styles.icon}>
                        <Icons.Comment width={24} height={24} color={Colors.Theme} />
                        <Text style={styles.iconText}>评论{item.comment_count > 0 ? ` ${item.comment_count}` : ""}</Text>
                    </View>
                </TouchableHighlight>
                }
                {item.is_public && 
                <TouchableHighlight style={styles.iconWrapper} underlayColor={Colors.white} onPress={onLike}>
                    <View style={styles.icon}>
                        <Icons.Like width={22} height={22} color={like !== undefined ? Colors.R500 : Colors.Theme} />
                        <Text style={styles.iconText}>点赞{likeCount > 0 ? ` ${likeCount}` : ""}</Text>
                    </View>
                </TouchableHighlight>
                }
                </View>
            </View>
          </View>
      
    )
  }

  const styles = StyleSheet.create({
    item: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: Colors.white,
      borderRadius: 8,
      marginBottom:10
    },
    itemText:{
      color: Colors.K950,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 10
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
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius: 50,
        backgroundColor: Colors.ThemeOpacity,
    },
    statusText: {
        color:Colors.Theme,
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 2
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent:'flex-end'
    },
    iconWrapper:{
        paddingTop: 10,
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

  export default UserDealCard;