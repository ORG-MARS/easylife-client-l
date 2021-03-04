import React, { useState, useContext, useLayoutEffect, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TouchableWithoutFeedback, Image, Dimensions, Platform } from 'react-native';
import axios from 'axios'
import Uri from 'jsuri'
import { debounce } from 'lodash'

import { BottomTabParamList, Models, NOTIFICATION_TYPE } from '../../../types'
import { View, Text, TextInput, KeyboardAware, Modal, Button, UserAvatar } from '../../../components'
import { Colors, API } from '../../../constants'
import * as Icons from '../../../assets/icons'
import { AuthContext, MessageContext } from '../../../reducers'
import MessageHeader from '../MessageHeader';

export default function NewContactScreen({ navigation, route }: StackScreenProps<BottomTabParamList>) {
  const { state: userState } = useContext(AuthContext);
  const { context } = useContext(MessageContext);
  const [search, setSearch] = useState("")
  const [contacts, setContacts] = useState<Models.User[]>([])
  const [result, setResult] = useState(`我的用户名：${userState.user?.username}`)
  const [error, setError] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <View style={{paddingHorizontal:10, backgroundColor:Colors.white}}>
            <Icons.CloseCircle color={Colors.Theme} />
          </View>
        </TouchableWithoutFeedback>
      ),
    });
  }, [navigation]);

  async function onSearch (){
    setContacts([])
    if(search === userState.user?.username){
      setError("不能添加自己为好友哦～")
      setIsModalVisible(true)
      return
    }
    if(!search){
      setResult(`我的用户名：${userState.user?.username}`)
      return
    }
    try{
      const res = await axios.get(new Uri(`${API}/users/`).addQueryParam('username', search).toString())
      setContacts(res.data.results)
      if(res.data.results.length < 1){
        setResult("抱歉，没有找到相关用户。")
      }
    }catch(err){setResult("抱歉，没有找到相关用户。")}
  }

  async function onPress(item: Models.User){
    const res = await axios.get(new Uri(`${API}/friends/`).addQueryParam('friend', item.id).toString())
    if (res.data.count > 0){
      setError(`${item.username}已为好友，不能重复添加～`)
      setIsModalVisible(true)
      return
    }
    try{
      const notification =  {
        message_type: 'notification',
        type: NOTIFICATION_TYPE.CONTACT_REQUEST,
        user: item.id,
        title: '好友请求',
        description: `“${userState.user?.username}”请求添加你为好友～`,
        target_id: userState.user?.user_id,
      }
      context.sendNotification(notification)
      setError('好友请求已发送！')
      setIsModalVisible(true)
      onSuccess()
    }catch(err) {
      setError(JSON.stringify(err.response.data))
      setIsModalVisible(true)
    }
  }

  const onSuccess = debounce(()=>{
    setIsModalVisible(false)
    onExit()
  }, 1000)

  const onExit = debounce(()=>{
    navigation.goBack()
  }, 500)

  return (
    <KeyboardAware>
      <View style={styles.container}>
        <MessageHeader isCommon={false} navigation={navigation} route={route} />
        <View style={styles.wrapper}>
          <View style={styles.search}>
            <TextInput
              icon={<Icons.Search color={Colors.K600} />}
              placeholder="用户名"
              onChangeText={setSearch}
              onSubmitEditing={onSearch}
              textWrapperStyle={styles.form}
              textStyle={styles.input}
            />
            <Button title="搜索" onPress={onSearch} style={styles.button} />
          </View>
          <SafeAreaView>
            <FlatList
              data={contacts}
              keyExtractor={item => item.username}
              renderItem={({ item }:{ item: Models.User }) => (
                <RenderItem
                  key={item.username}
                  onPress={() => onPress(item)}
                  item={item}
                />
              )}
              ListEmptyComponent={() => <RenderEmptyItem result={result} />}
            />
          </SafeAreaView>
          <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} isDialog={true}>
            <Modal.Body>
              <Text style={{fontSize: 16}}>{error}</Text>
            </Modal.Body>
          </Modal>
        </View>
      </View>
    </KeyboardAware>
  );
}

const RenderEmptyItem = ({result}:{result:string}) =>{
  return(
    <View style={styles.notFound}>
      <Text style={styles.notFoundText}>{result}</Text>
    </View>
  )
}

const RenderItem = ({item, onPress}:{item: Models.User, onPress: ()=>{}}) =>{
  const [avatar, setAvatar] = useState("")

  useEffect(()=>{
    setAvatar(item.userprofile.avatar)
  },[item])
  
  return(
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <UserAvatar avatar={avatar} />
        <Text style={styles.itemText}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.Theme
  },
  wrapper: {
    flex: 1,
    paddingTop: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: Colors.white,
    flexDirection: 'column'
  },
  search: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center'
  },
  form: {
    marginHorizontal: 5,
    marginVertical:5,
    zIndex: 1,
  },
  input: {
    borderRadius: 50,
    backgroundColor: Colors.white,
    marginRight: 40,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 3,
    height: 45,
  },
  button:{
    position: 'absolute',
    zIndex: 2,
    width: 70,
    marginTop: 3,
    height: 48,
    right: 0,
    borderRadius: 50
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection:'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomWidth:1,
    borderBottomColor: Colors.K200,
  },
  itemText:{
    marginLeft:10,
    color: Colors.K950
  },
  notFound:{
    alignItems:'center',
    backgroundColor: Colors.white,
  },
  notFoundText:{
    color: Colors.K400,
  }
});
