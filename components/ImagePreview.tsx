

import React from 'react'
import { TouchableWithoutFeedback, TouchableHighlightProps, Image, TouchableHighlight, StyleSheet, Alert } from 'react-native'
import { Colors } from '../constants'
import ReactModal from 'react-native-modal';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import moment from 'moment'
import * as Icons from '../assets/icons'
import { getHeaderPadding } from '../screens/utility/helper'

interface ImagePreviewProps extends TouchableHighlightProps {
    isVisible: boolean,
    closeImage: () => void,
    uri: string,
}

export default function ImagePreview({isVisible, closeImage, uri}: ImagePreviewProps) {
  async function saveImage() {
    let { status } = await MediaLibrary.requestPermissionsAsync()
    if(status === 'granted'){
      const base64Code = uri.split("data:image/jpeg;base64,")[1];
      const filename = `${FileSystem.documentDirectory}${moment().format()}.png`;
      await FileSystem.writeAsStringAsync(filename, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
      });
      try{
          await MediaLibrary.saveToLibraryAsync(filename);
      }catch(err){}
      Alert.alert('已保存～')
    }
    if(status === 'denied'){
      Alert.alert('无法保存图片，请在设置中设置权限')
    }
  }
  return (
    <ReactModal
        isVisible={isVisible}
        onBackdropPress={closeImage}
        onBackButtonPress={closeImage} 
        backdropOpacity={1}
    >
        <TouchableWithoutFeedback onPress={closeImage}>
            <Image source={{uri}} style={styles.imageFull} />
        </TouchableWithoutFeedback>
        <TouchableHighlight style={styles.download} onPress={saveImage}>
            <Icons.Download width={28} height={28} />
        </TouchableHighlight>
    </ReactModal>
  )
}

ImagePreview.defaultProps={
    color:Colors.Theme,
    isLoading: false,
    outline: false
}

const styles = StyleSheet.create({
    imageFull: {  
        width: '100%',
        height: '100%',
        resizeMode:'contain',
     },
      disabled:{
        backgroundColor: Colors.K300,
      },
      submitText:{
        textAlign:'center',
        fontSize: 16,
      },
      icon:{
        marginLeft: 10 
      },
      download:{
          alignItems:'flex-end',
          alignSelf:'flex-end',
          padding: 10,
          marginBottom: getHeaderPadding(),
      }
})