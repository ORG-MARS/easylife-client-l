import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import Modal from 'react-native-modal';

import { TextInput, Button, useKeyboard } from '../components'
import { Colors } from '../constants'

interface PostCommentModalProps{
    isVisible: boolean;
    onSubmit: (text?: string) => Promise<void>;
}


const PostCommentModal = ({isVisible, onSubmit}:PostCommentModalProps) =>{
  const [commentToPost, setCommentToPost] = useState('')
  const [isKeyboardShow] = useKeyboard()

  useEffect(()=>{
    if(isKeyboardShow || Platform.OS === 'ios') return
    onSubmit()
  },[isKeyboardShow])

  async function onAdd(){
    onSubmit(commentToPost)
    setCommentToPost('')
  }

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={()=>onSubmit()}
      avoidKeyboard
      style={styles.postCommentModal}
    >
        <View style={styles.content}>
          <TextInput
            onChangeText={setCommentToPost}
            placeholder="说点啥吧～"
            onSubmitEditing={onAdd}
            autoFocus
            textWrapperStyle={{marginBottom: 0}}
            inputStyle={{width:'80%'}}
            onBlur={() => onSubmit()}
          />
          <View style={styles.send}>
          <Button onPress={onAdd} title='提交' />
          </View>
        </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    postCommentModal:{
      justifyContent: 'flex-end',
      margin: 0,
    },
    content:{
      backgroundColor: Colors.white,
      paddingTop: 10,
      paddingHorizontal: 10,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      flexDirection:'row'
    },
    send:{
      width: '20%',
      paddingHorizontal: 5
    }
  });

export default PostCommentModal;
