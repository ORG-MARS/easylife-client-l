import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'
import Uri from 'jsuri'

import { View, TextInput, Button } from '../../../components';
import { BottomTabParamList } from '../../../types'
import { AuthContext, AuthTypes } from '../../../reducers' 
import { Colors, API } from '../../../constants';
import { getHeaderPadding } from '../../utility/helper'

const NicknameScreen = ({ navigation, route }: StackScreenProps<BottomTabParamList>) => {
  const { state: userState, dispatch: userDispatch } = useContext(AuthContext);
  const [nickname, setNickname] = useState<string>()

  useEffect(() => {
    setNickname(userState.user?.nickname || userState.user?.username)
  },[userState.user?.user_id])
  
  function onUpdateNickname() {
    if(!nickname) return
    axios.patch(new Uri(`${API}/user-profile/${userState.user?.user_id}/`).toString(),{nickname})
    userDispatch({
        type: AuthTypes.SET_STATE,
        // @ts-ignore
        payload:{ user: {...userState.user, nickname }}
      })
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
        <View style={styles.content}>
        <TextInput 
          textWrapperStyle={styles.newInput}
          textStyle={{borderRadius: 8, paddingLeft: 0}}
          onChangeText={setNickname}
          placeholder={userState.user?.nickname || userState.user?.username}
          value={nickname}
          autoFocus
          blurOnSubmit={false}
          error={!nickname ? '昵称不能为空' : ''}
          onSubmitEditing={onUpdateNickname}
        />
        <Button title="确定" style={styles.button} onPress={onUpdateNickname} />
        </View>
    </View>
  );
}
const windowWidth = Dimensions.get('window').width;
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
    paddingTop: getHeaderPadding(),
    flexDirection: 'row',
    alignItems:'center',
    lineHeight:30,
    backgroundColor: Colors.white
  },
  content:{
    flexDirection:'row'
  },
  newInput:{
    borderColor: '#ccc',
    width: windowWidth - 80,
    marginBottom: 0,
    marginLeft: 5,
  },
  button:{
    width: 70,
    paddingHorizontal: 5,
    marginLeft: 5,
    height: Platform.OS === 'ios' ? 42 : 48
  }
});

export default NicknameScreen