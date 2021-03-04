import React, { useState, useRef, useContext, useEffect } from 'react';
import { StyleSheet, TextInput, FlatList, Image, Keyboard, TouchableHighlight, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';

import { View, Button, SendButton, DateTimePicker, SlideupMenu, Modal, Text } from '../../components';
import { Colors, API } from '../../constants'
import * as Icons from '../../assets/icons'
import { RootStackParamList, Models, NOTIFICATION_TYPE } from '../../types'
import { MessageContext, AuthContext, MessageTypes } from '../../reducers'

const NewDealScreen = ({ navigation }: StackScreenProps<RootStackParamList>) => {
  const { state: userState } = useContext(AuthContext);
  const { dispatch: messageDispatch, context } = useContext(MessageContext);
  const [description, setDescription] = useState("")
  const [photoes, setPhotoes] = useState<Models.Photo[]>([])
  const [selected, setSelected] = useState<Models.User[]>([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  let arr: {start?:number, end?:number} = {}
  const scrollRef = useRef()

  useEffect(()=>{
    if(userState.user?.user_config?.is_quentionnaire_answered !== true){
      navigation.navigate("Questionnaire")
    }
  },[])

  async function pickImage () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      await ImagePicker.requestCameraRollPermissionsAsync()
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        setPhoto(result);
      }
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
      if (!result.cancelled) {
        setPhoto(result);
      }
    } catch (err) {
      console.log(err)
    }
  };

  async function setPhoto(result:any){
    const manipResult = await ImageManipulator.manipulateAsync(
      result.localUri || result.uri,
      [{ resize: {width: 300} }],
      { compress: 1, base64: true }
    );
    setPhotoes([ ...photoes, {uri: manipResult.uri, base64: manipResult.base64}]);
  }

  const renderAddPhoto=()=>{
    return(
      <SlideupMenu 
          onPress={value => {
            if(value === 'camera'){
              takePhoto()
            }else if(value === 'library'){
              pickImage()
            }
          }} 
          options={[{
            label: '拍摄', value: 'camera'
          },{
            label: '选取照片', value: 'library'
          }]}
        >
          <Icons.Attach /> 
        </SlideupMenu>
    )
  }

  function onSelect(users:any){
    setSelected(users)
  }

  function formatDate(date:any) {
    let month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

  async function onSubmit(is_public=false){
    if(isLoading) return
    setIsLoading(true)
    try{
      const res = await axios.post(`${API}/deal-details/`, {
        description,
        is_public,
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        dealuser_set: [{user: selected[0].friend}, {user: userState.user?.user_id}],
        dealattachment_set: photoes.map(item => ({attachment:`data:image/jpeg;base64,${item.base64}`}))
      })
      const notification =  {
        message_type: 'notification',
        type: NOTIFICATION_TYPE.DEAL_REQUEST,
        user: selected[0].friend,
        title: `“${userState.user?.nickname || userState.user?.username}”发起了一个约定`,
        description,
        target_id: res.data.id,
      }
      context.sendNotification(notification)
      if(is_public){
        setIsVisible(false)
      }
      navigation.goBack()
    }catch (err){
      Alert.alert(JSON.stringify(err))
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ScrollView 
          style={{paddingHorizontal:20}} 
          //@ts-ignore
          ref={scrollRef}
        >
        <View style={styles.textarea}>
          <TextInput 
            onBlur={()=>Keyboard.dismiss()} 
            style={{height: 156, color: Colors.K600, textAlignVertical:'top'}} 
            placeholderTextColor={Colors.K600} 
            multiline={true} 
            placeholder="请输入您的约定主题～" 
            onChangeText={setDescription}
          ></TextInput>
          <FlatList
            data={[...photoes, {uri: 'empty', base64:""}]}
            horizontal
            renderItem={({ item }:{ item: Models.Photo }) => (
                item.uri === 'empty' && photoes.length < 9 ? renderAddPhoto() : <Image source={{ uri: item.uri }} style={styles.avatar} />
            )}
            ListEmptyComponent={() => renderAddPhoto()} 
          />
        </View>
        <DateTimePicker 
          placeholder="开始时间" 
          value={startDate}
          onChange={setStartDate}
          onLayout={e => {
            arr.start = e.nativeEvent.layout.y
          }} 
          // @ts-ignore
          onFocus={() => scrollRef?.current?.scrollTo({y: arr.start, animated: true})} 
        />
        <DateTimePicker 
          placeholder="结束时间" 
          value={endDate}
          onChange={setEndDate} 
          onLayout={e => {
            arr.end = e.nativeEvent.layout.y
          }} 
          //@ts-ignore
          onFocus={() => scrollRef?.current?.scrollTo({y: arr.end, animated: true})} 
        />
        </ScrollView>
      </SafeAreaView>
      <View>
        <FlatList
          data={selected}
          horizontal
          style={styles.contact}
          keyExtractor={item => item.username}
          renderItem={({ item }:{ item: Models.User }) => (
            <TouchableHighlight underlayColor={Colors.K100} onPress={() => navigation.navigate("ContactList", {onSelect})}>
              {item.username === 'empty' ? <Icons.Attach color={Colors.Theme} /> :
              item.avatar ? <Image source={{ uri: item.avatar }} style={styles.avatar} /> : <Icons.PersonCircle width={58} height={58} />
              }
            </TouchableHighlight>
          )}
          ListEmptyComponent={() => 
          <TouchableHighlight underlayColor={Colors.K100} onPress={() => navigation.navigate("ContactList", {onSelect})}>
            <Icons.Attach color={Colors.Theme} />
          </TouchableHighlight>} 
        />
        <View style={styles.buttonWrapper}>
          <Button title="发起约定" style={{width: '50%'}} isLoading={isLoading} onPress={() => onSubmit()} disabled={!description || selected.length<1} />
          <SendButton style={styles.send} onPress={() => setIsVisible(true)} disabled={!description || selected.length<1}  />
        </View>
      </View>
      <Modal
        isVisible={isVisible}
        onClose={()=>{}}
      >
        <Modal.Body>
          <Text>确定发布约定？</Text>
        </Modal.Body>
        <Modal.Footer 
            leftBtn={{
                title: '我再想想',
                onPress: () => setIsVisible(false)
            }}
            rightBtn={{
                title: '确定',
                onPress: () => onSubmit(true)
            }}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  content: {
    flex: 0.9,
  },
  textarea: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10
  },
  contact:{
    marginTop: 20,
    marginHorizontal:28
  },
  avatar:{
    width: 58,
    height: 58,
    borderRadius: 10,
    marginRight:10
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginLeft:64
  },
  send: {
    marginLeft:20
  },
});

export default NewDealScreen