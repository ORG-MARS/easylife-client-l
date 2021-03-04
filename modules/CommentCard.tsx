import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import moment from 'moment'
import 'moment/locale/zh-cn'
import axios from 'axios'
import Uri from 'jsuri'

import { Text } from '../components'
import { Models, NOTIFICATION_TYPE } from '../types'
import ThreadCard from './ThreadCard'
import PostCommentModal from './PostCommentModal'
import CommentEditMenu from './CommentEditMenu'
import * as Icons from '../assets/icons'
import { Colors, API } from '../constants'
import { MessageContextProps } from '../reducers'

const CommentCard = ({user, deal, comment, onClick, onAlert, context}:{
    user?: Models.User;
    deal?: Models.Deal;
    comment:Models.Comment;
    onClick: (comment:Models.Comment) => void;
    onAlert?: () => void;
    context: MessageContextProps
}) => {
    const [time, setTime] = useState('')
    const [threadSelected, setThreadSelected] = useState<Models.Thread>()
    const [isCommentVisible, setIsCommentVisible] = useState(false)
    const [isEditThreadVisible, setIsEditThreadVisible] = useState(false)
    const [threads, setThreads] = useState<Models.Thread[]>(comment.thread_set)
    const [threadsCount, sethreadsCount] = useState(comment.thread_set.length)

    useEffect(()=>{
      moment.locale('zh-cn')
      const createdTime = moment(comment.created_time)
      if(moment().diff(createdTime, 'days') > 5){
          setTime(createdTime.format('YYYY-MM-DD'))
          return
      }
      setTime(moment(comment.created_time).fromNow())
    },[comment.created_time])
  
    useEffect(()=>{
      setThreads(comment.thread_set)
    },[comment.thread_set])

    function onThread (thread: Models.Thread){
      if(!user && onAlert){
        onAlert()
        return
      }
        setThreadSelected(thread)
        if(user && thread.user === user.user_id){
            setIsEditThreadVisible(true)
            return
          }
        setIsCommentVisible(true)
    }

    async function onAddThread(text?:string){
        if(!text){
            setIsCommentVisible(false)
            return
        }
        try{
          const res = await axios.post(`${API}/comments/${comment?.id}/threads`,{
              text,
              reply_user: threadSelected?.user
          })
          if(![deal?.dealuser_set[0].user,deal?.dealuser_set[1].user].includes(threadSelected?.user) && threadSelected?.user){
            sendNotification(threadSelected.user, text)
          }
          sendNotification(deal?.dealuser_set[0].user, text)
          sendNotification(deal?.dealuser_set[1].user, text)
          setThreads([res.data, ...threads])
        }catch(err){
          Alert.alert(err)
        }
        setIsCommentVisible(false)
    }

    function sendNotification(userId:number, text:string){
      if(user?.user_id === userId) return
      const notification =  {
        message_type: 'notification',
        type: NOTIFICATION_TYPE.DEAL_COMMENT,
        user: userId,
        title: `${user?.nickname || user?.username}追加了评论`,
        description: text,
        target_id: deal?.id,
      }
      context.sendNotification(notification)
    }

    async function onDeleteThread(){
      try{
        await axios.delete(`${API}/threads/${threadSelected?.id}/`)
        setThreads(threads.filter(e=>e.id !== threadSelected?.id))
      }catch(err){}
        setIsEditThreadVisible(false)
    }

    async function loadMoreThreads(){
      try{
        const res = await axios.get(new Uri(`${API}/public/comments/${comment?.id}/threads`)
          .addQueryParam('id__lt',threads[threads.length-1].id)
          .addQueryParam('page_size', 10)
          .toString())
        setThreads([...threads, ...res.data.results])
      }catch(err){}
    }

    return (
      <TouchableWithoutFeedback onPress={() => onClick(comment)}>
      <View style={styles.commentCard}>
        {comment?.avatar
        ? <Image source={{ uri: comment?.avatar }} style={styles.avatar} />
        : <Icons.PersonCircle width={30} height={30} />}
        <View style={styles.content}>
          <Text style={styles.username}>{comment.nickname || comment.username}</Text>
          <Text style={styles.description}>
            {comment.text}
            <Text style={styles.time}> {time}</Text>
          </Text>
          {threads.map((thread: Models.Thread, index) => (<ThreadCard isLast={index===threads.length-1} key={`comment-${comment.id}-thread-${thread.id}`} thread={thread} onClick={onThread} />))}
          {comment.thread_total > threadsCount && 
          <TouchableOpacity onPress={loadMoreThreads} >
            <Text style={styles.loadMore}>展开更多回复</Text>
          </TouchableOpacity>}
        </View>
        <PostCommentModal
          isVisible={isCommentVisible}
          onSubmit={onAddThread}
        />
        <CommentEditMenu isVisible={isEditThreadVisible} onClose={()=>setIsEditThreadVisible(false)} onDelete={onDeleteThread} />
      </View>
      </TouchableWithoutFeedback>
    )
  }

  const styles = StyleSheet.create({
    commentCard: {
      flexDirection:'row',
      paddingLeft: 15,
      marginTop:15,
      width:'100%',
    },
    avatar:{
      width: 30, 
      height: 30,
      borderRadius: 50,
    },
    content: {
      paddingLeft: 10,
      borderBottomWidth: 1,
      borderColor: Colors.K200,
      paddingBottom: 15,
      width:'100%',
      marginRight:40
    },
    username: {
      color: Colors.K600,
      marginBottom: 5,
      fontSize:12
    },
    description: {
      color: Colors.K950,
      marginBottom: 5,
      fontSize:14
    },
    time: {
      color: Colors.K600,
      fontSize:12,
    },
    loadMore: {
      fontSize: 12,
      color: Colors.K600,
      paddingTop:10
    }
  });

  export default CommentCard;
