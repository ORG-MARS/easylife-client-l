import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios'

import { View, SlideupMenu, GestureRecognizer } from '../../../components';
import { DrawerTabParamList } from '../../../types'
import { AuthContext } from '../../../reducers/AuthReducer' 
import * as Icons from '../../../assets/icons'
import { Colors, API } from '../../../constants';
import { getHeaderPadding } from '../../utility/helper'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const QRScreen = ({ navigation, route }: StackScreenProps<DrawerTabParamList>) => {
  const { state: userState } = useContext(AuthContext);
  const [qrImage, setQrImage] = useState<string>()

  useEffect(() => {
    getQRImage()
  },[userState.user?.user_id])

  async function getQRImage(){
    try{
      const res = await axios.get(`${API}/user-profile/${userState.user?.user_id}/`)
      setQrImage(res.data.qr_image)
    }catch(err){}
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
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        updateQRImage(result)
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
        aspect: [4, 3],
        quality: 1,
        base64: true
      });
      if (!result.cancelled) {
        updateQRImage(result)
      }
    } catch (err) {
      console.log(err)
    }
  };

  async function deleteImage(){
    if(!qrImage) return
    try{
      await axios.put(`${API}/user-profile/${userState.user?.user_id}/`,{
        qr_image: ''
      })
      setQrImage('');
      Alert.alert('删除成功～')
    }catch(err){}
  }

  async function updateQRImage(result:any){
    const manipResult = await ImageManipulator.manipulateAsync(
      result.localUri || result.uri,
      [{ resize: {width: windowWidth} }],
      { compress: 1, base64: true }
    );
    try{
      await axios.put(`${API}/user-profile/${userState.user?.user_id}/`,{
        qr_image: `data:image/jpeg;base64,${manipResult.base64}`
      })
      setQrImage(manipResult.uri);
    }catch(err){}
  }
  
  return (
    <GestureRecognizer style={{ flex: 1 }} onSwipeRight={()=> navigation.navigate('Profile')}>
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.close} onPress={() => navigation.navigate('Profile')}>
            <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
        <SlideupMenu 
          onPress={value => {
            if(value === 'camera'){
              takePhoto()
            }else if(value === 'library'){
              pickImage()
            }else{
              deleteImage()
            }
          }} 
          options={[{
            label: '拍摄', value: 'camera'
          },{
            label: '选取照片', value: 'library'
          },{
            label: '删除', value: 'delete'
          }]}
        >
          {qrImage ? <Image source={{ uri: qrImage }} style={styles.qrImage} />:
          <Icons.Attach width={100} height={100} />}
        </SlideupMenu>
        </View>
     
    </View>
    </GestureRecognizer>
  );
}



const styles = StyleSheet.create({
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop:getHeaderPadding(),
    flexDirection: 'row',
    alignItems:'center',
    lineHeight:30,
    backgroundColor: Colors.white
  },
  content:{
    flex:1,
    justifyContent: 'center',
    alignItems:'center',
  },
  qrImage:{
    width: windowWidth - 40,
    height: windowHeight - 200,
    resizeMode:'contain',
  },
});

export default QRScreen