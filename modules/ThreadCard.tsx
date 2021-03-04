import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment'
import 'moment/locale/zh-cn'

import { Text } from '../components'
import { Models } from '../types'
import * as Icons from '../assets/icons'
import { Colors } from '../constants'

const ThreadCard = ({thread, onClick, isLast}:{thread: Models.Thread, onClick: (thread: Models.Thread)=>void, isLast: boolean}) => {
    const [time, setTime] = useState('')

     useEffect(()=>{
      moment.locale('zh-cn')
        const createdTime = moment(thread.created_time)
        if(moment().diff(createdTime, 'days') > 5){
            setTime(createdTime.format('YYYY-MM-DD'))
            return
        }
        setTime(moment(thread.created_time).fromNow())
     },[thread.created_time])
     
    return (
      <TouchableWithoutFeedback onPress={() => onClick(thread)}>
      <View style={styles.threadCard}>
        {thread?.avatar
        ? <Image source={{ uri: thread?.avatar }} style={styles.avatar} />
        : <Icons.PersonCircle width={30} height={30} />}
        <View style={[styles.content, isLast ? {borderBottomWidth: 0} : {}]}>
          <Text style={styles.username}>{thread.nickname || thread.username}</Text>
          <Text style={styles.description}>
            {thread.text}
            <Text style={styles.time}> {time}</Text>
          </Text>
        </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }

  const styles = StyleSheet.create({
    threadCard: {
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
  });

  export default ThreadCard;
