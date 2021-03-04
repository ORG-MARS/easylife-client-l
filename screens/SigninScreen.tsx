import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text, TouchableHighlight, Keyboard, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { isEmpty } from 'lodash';
import axios from 'axios';
import Uri from 'jsuri';
import jwtDecode from "jwt-decode";

import registerForPushNotificationsAsync from './utility/registerForPushNotification';
import { View, TextInput, KeyboardAware, Button } from '../components'
import { Colors, API } from '../constants'
import * as Icons from '../assets/icons'
import { RootStackParamList, BottomTabParamList } from '../types'
import { AuthContext, AuthTypes, MessageTypes, MessageContext } from "../reducers"
import { getHeaderPadding } from './utility/helper';

type SigninError = {
  username?: string,
  password?: string,
  loginFailed?: string,
}

const SigninScreen = ({ navigation }: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList>) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [errors, setErrors] = useState<SigninError>({})

  const { dispatch: userDispatch } = useContext(AuthContext);
  const { dispatch: messageDispatch, context } = useContext(MessageContext);


  function validate(){
    let newErrors:SigninError = {}
    if(isEmpty(username)){
      newErrors.username = "用户名不能为空"
    }
    if(isEmpty(password)){
      newErrors.password = "密码不能为空"
    }
    setErrors(newErrors)
    return newErrors
  }

  async function SigninSubmit(){
    Keyboard.dismiss()
    const err = validate()
    if(!isEmpty(err)){
      return
    }
    setIsSubmiting(true)
    const token = await registerForPushNotificationsAsync()
    try{
      const res = await axios.post(`${API}/auth/`,{
        username,
        password,
        pns_token: token
      }) 
      const userInfo:{user_id:number} = jwtDecode(res.data.token)
      const profileRes = await axios.get(`${API}/user-profile/${userInfo.user_id}/`,{
        headers:{
          Authorization: `JWT ${res.data.token}`
        }
      })
      userDispatch({ type: AuthTypes.SIGN_IN, token: res.data.token, avatar: profileRes.data.avatar });
      context.fetchUnread()
      context.fetchContacts()
      navigation.goBack()
    }catch(err) {
      setErrors({loginFailed: "用户名或密码错误。"})
    }finally{
      setIsSubmiting(false)
    }
  }

  return (
    <KeyboardAware isScroll>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
          <Icons.Close width={36} height={36} color={Colors.K500} />
        </TouchableOpacity>
      </View>
      <View style={styles.form}>
        <TextInput
            onChangeText={setUsername}
            placeholder="请输入用户名"
            icon={<Icons.Person color={Colors.K600} />}
            error={errors.username}
            onSubmitEditing={SigninSubmit}
        />
        <TextInput
          icon={<Icons.Lock color={Colors.K600} />}
          placeholder="请输入密码"
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          onSubmitEditing={SigninSubmit}
        />
      <Button title="登录" onPress={SigninSubmit} style={styles.submit} isLoading={isSubmiting} />
      {errors.loginFailed && <Text style={styles.errorText}>{errors.loginFailed}</Text>}

      <View style={styles.term}>
        <Text style={[styles.signupText, {fontSize: 12}]}>登录注册即表示同意</Text>
        <TouchableHighlight underlayColor={Colors.white} onPress={()=> navigation.navigate("PrivatePolicy")} >
          <Text style={{color:Colors.Theme, fontSize: 12}}>用户协议、</Text>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={Colors.white} onPress={()=> navigation.navigate("PrivatePolicy")} >
          <Text style={{color:Colors.Theme, fontSize: 12}}>隐私条款</Text>
        </TouchableHighlight>
      </View>

    </View>
    <View style={styles.signup}>
        <Text style={styles.signupText}>还没有账号？
        </Text>
        <TouchableHighlight underlayColor={Colors.white} onPress={()=> navigation.navigate("Signup")} >
        <Text style={{color:Colors.Theme}}>立即注册!</Text>
        </TouchableHighlight>
    </View>
  </View>
  </KeyboardAware>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height
  },
  header:{
    justifyContent:"center",
    alignItems: 'flex-start',
    paddingTop: getHeaderPadding(),
    paddingBottom: 5
  },
  close: {
    padding: 5,
  },
  welcome: {
    marginTop: 20
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    color: Colors.K800
  },
  form: {
    flex: 0.8,
    marginHorizontal:"15%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    marginTop: 30
  },
  term:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  signup:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  signupText:{
    color: Colors.K600,
  },
  errorText: {
    marginTop: 10,
    color: Colors.R500
  }
});

export default SigninScreen