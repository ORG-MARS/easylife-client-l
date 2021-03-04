import React, { useState, useContext, useLayoutEffect } from 'react';
import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import { Text, View, Modal, GestureRecognizer } from '../../../components';
import { SettingsStackParamList } from '../../../types'
import { Colors } from '../../../constants';
import * as Icons from '../../../assets/icons'
import { MessageContext, MessageTypes } from '../../../reducers/index'

const MenuItem =({onPress, name, isLast}:{onPress: () => void; name: string, isLast?: boolean}) =>{
 return (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.menu, isLast ? {} : { borderBottomWidth: 1, borderBottomColor: Colors.K250 }]}>
            <Text style={styles.menuText} >{name}</Text>
            <Icons.ArrowRight color={Colors.K300} height={16} width={16} />
        </View>
    </TouchableOpacity>
 )
}

const SettingScreen = ({ navigation, route }: StackScreenProps<SettingsStackParamList>) => {
    const { dispatch: messageDispatch } = useContext(MessageContext);
    const [isVisable, setIsVisible] = useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
              <TouchableOpacity style={styles.close} onPress={() => {
                navigation.goBack()
              }}>
              <View style={styles.back}>
                  <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
              </View>
              </TouchableOpacity>
            ),
        });
      }, [navigation]);

    function clearCache(){
        AsyncStorage.setItem('notifications', JSON.stringify([]))
        AsyncStorage.setItem('rooms', JSON.stringify({}))
        messageDispatch({type: MessageTypes.SET_STATE, payload: { rooms: {}, notifications: []} })
        setIsVisible(false)
        Alert.alert('已删除～')
    }

  return (
    <GestureRecognizer style={{ flex: 1 }} onSwipeRight={()=> navigation.goBack()}>
    <View style={styles.container}>
      <MenuItem onPress={()=> navigation.navigate('Nickname')} name='修改昵称' />
      <MenuItem onPress={() => setIsVisible(true)} name='清除缓存' />
      <MenuItem onPress={()=> navigation.navigate('About')} name='关于约定' isLast={true}/>
      <Modal
        isVisible={isVisable}
        onClose={() => setIsVisible(false)}
      >
        <Modal.Body>
        <Text style={{textAlign:'center'}}>确定删除缓存数据？</Text>
        </Modal.Body>
        <Modal.Footer 
            leftBtn={{
                title: '我再想想',
                onPress: () => setIsVisible(false)
            }}
            rightBtn={{
                title: '确定',
                onPress: clearCache
            }}
        />
        </Modal>
    </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  menu:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  menuText:{
    color: Colors.K800
  },
  back: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
  },
});

export default SettingScreen