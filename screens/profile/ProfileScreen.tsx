import React, { useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios'

import { Text, View, SlideupMenu } from '../../components';
import { DrawerTabParamList, RootStackParamList } from '../../types'
import { AuthContext, AuthTypes } from '../../reducers/AuthReducer' 
import * as Icons from '../../assets/icons'
import { Colors, API } from '../../constants';
import ProfileTabScreen from './ProfileTabScreen'

const ProfileScreen = ({ navigation, route }: StackScreenProps<RootStackParamList> & StackScreenProps<DrawerTabParamList>) => {
  const { state: userState, dispatch: userDispatch } = useContext(AuthContext);
  const [avatar, setAvatar] = useState<string>()

  useEffect(()=>{
    getAvatar()
  },[userState.user?.user_id])

  async function getAvatar(){
    const localAvatar = await AsyncStorage.getItem('avatar');
    setAvatar(localAvatar||'')
  }

  async function pickImage () {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      await ImagePicker.requestCameraRollPermissionsAsync()
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        updateAvatar(result)
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
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        updateAvatar(result)
      }
    } catch (err) {
      console.log(err)
    }
  };

  async function updateAvatar(result:any){
    const manipResult = await ImageManipulator.manipulateAsync(
      result.localUri || result.uri,
      [{ resize: {width: 60} }],
      { compress: 1, base64: true }
    );
    try{
      await axios.put(`${API}/user-profile/${userState.user?.user_id}/`,{
        avatar: `data:image/jpeg;base64,${manipResult.base64}`
      })
      setAvatar(manipResult.uri);
      userDispatch({
        type: AuthTypes.SET_STATE,
        // @ts-ignore
        payload:{ user: {...userState.user, avatar: manipResult.uri }}
      })
    }catch(err){}
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icons.HighLevel />
        <Icons.MidLevel />
        <Icons.LowLevel />
        <Icons.Exchange />
        {/* @ts-ignore */}
        <TouchableOpacity style={styles.setting} onPress={()=>navigation.openDrawer()}>
          <Icons.Setting width={30} height={30}/>
        </TouchableOpacity>
      </View>
      <View style={styles.user}>
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
          disabled={!userState.user}
        >
          {avatar ? <Image source={{ uri: avatar }} style={styles.avatar} />:
          <Icons.PersonCircle width={60} height={60} />}
        </SlideupMenu>
        <View style={styles.userText}>
          <View style={{flexDirection:'row',backgroundColor: Colors.white}}>
          <Text style={{fontWeight:'bold', color:Colors.K950}}>{userState.user?.nickname || userState.user?.username}(约定ID: {userState.user?.username})</Text>
          {/* <TouchableHighlight style={styles.tag} >
            <Text style={styles.tagText}>{`ID: ${userStateuser?.username}`}</Text>
          </TouchableHighlight> */}
          </View>
          <View style={{flexDirection:'row'}}>
          </View>
        </View>
      </View>
      <ProfileTabScreen navigation={navigation} route={route} />
      <View style={styles.content}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop:40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'center',
    lineHeight:30,
    backgroundColor: Colors.white
  },
  avatar:{
    width: 60, 
    height: 60,
    borderRadius: 50
  },
  setting:{
    paddingHorizontal:10,
    paddingVertical:5,
  },
  user: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    padding: 15
  },
  userText:{
    backgroundColor: Colors.white,
    paddingVertical:10,
    marginLeft: 15,
  },
  tag:{
    padding: 5,
    backgroundColor: Colors.K200,
    borderRadius:50,
  },
  tagText:{
    color: Colors.K600,
  },
  content:{

  }
});

const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.K200,
  },
  optionWrapper: {
    paddingVertical:15,
    borderBottomWidth: 1 ,
    borderBottomColor:Colors.K200,
    backgroundColor: Colors.white,
  },
  optionText: {
    fontSize:18,
    color: Colors.K950,
    textAlign: 'center'
  },
};
export default ProfileScreen