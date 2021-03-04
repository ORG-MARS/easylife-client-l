import React, { useState, useContext } from 'react';
import { StyleSheet, TouchableOpacity, Text, Keyboard, Dimensions, TouchableHighlight, AppState } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import CheckBox from 'react-native-check-box'
import axios from 'axios'

import registerForPushNotificationsAsync from './utility/registerForPushNotification';
import { View, TextInput, KeyboardAware, Button, Modal} from '../components'
import { Colors, API } from '../constants'
import * as Icons from '../assets/icons'
import { RootStackParamList, BottomTabParamList } from '../types'
import { AuthContext, AuthTypes, MessageContext } from "../reducers"
import { isEmpty } from 'lodash';
import { getHeaderPadding } from './utility/helper';

type SignupError = {
  username?: string,
  password?: string,
  confirm?: string,
  loginFailed?: string,
}
const SignupScreen = ({ navigation }: StackScreenProps<RootStackParamList> & StackScreenProps<BottomTabParamList>) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('')
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [errors, setErrors] = useState<SignupError>({})

  const { dispatch } = useContext(AuthContext);
  const { context } = useContext(MessageContext);

  function validate(){
    let newErrors:SignupError = {}
    if(isEmpty(username)){
      newErrors.username = "用户名不能为空"
    }
    if(isEmpty(password)){
      newErrors.password = "密码不能为空"
    }else{
      if(password.length < 6 || password.length > 12){
        setIsModalVisible(true)
        return "error"
      }
      // if(!/\d/.test(password)){
      //   setIsModalVisible(true)
      //   return "error"
      // }
      // if(!/[a-z]/.test(password)){
      //   setIsModalVisible(true)
      //   return "error"
      // }
      // if(!/[A-Z]/.test(password)){
      //   setIsModalVisible(true)
      //   return "error"
      // }
      // if(!/[!@#$%^&*]/.test(password)){
      //   setIsModalVisible(true)
      //   return "error"
      // }
    }
    if(password !== confirm){
      newErrors.confirm = "密码不匹配"
    }
    setErrors(newErrors)
    return newErrors
  }

  async function SignupSubmit(){
    Keyboard.dismiss()
    const err = validate()
    if(!isEmpty(err) || !isTermsAgreed){
      return
    }
    const token = await registerForPushNotificationsAsync()
    try{
      setIsSubmiting(true)
      await axios.post(`${API}/register/`,{
        username,
        password,
        terms_agreed: true,
      })
    }catch(err) {
      setErrors({loginFailed: "该用户名已占用。"})
      return
    }finally{
      setIsSubmiting(false)
    }
    const signinRes = await axios.post(`${API}/auth/`,{
      username,
      password,
      pns_token: token
    }) 
    dispatch({ type: AuthTypes.SIGN_IN, token: signinRes.data.token });
    navigation.navigate("Dashboard")
    setIsSubmiting(false)
  }

  return (
    <KeyboardAware isScroll>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
          <Icons.ArrowLeft height={36} color={Colors.K500} />
        </TouchableOpacity>
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeText}>Hi~</Text>
        <Text style={styles.welcomeText}>欢迎来到约定APP</Text>
      </View>
      <View style={styles.form}>
        <TextInput
            onChangeText={setUsername}
            placeholder="请输入用户名"
            icon={<Icons.Person color={Colors.K600} />}
            error={errors.username}
            onSubmitEditing={SignupSubmit}
        />
        <TextInput
          icon={<Icons.Lock color={Colors.K600} />}
          placeholder="请输入密码"
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
          onSubmitEditing={SignupSubmit}
        />
        <TextInput
          icon={<Icons.Lock color={Colors.K600} />}
          placeholder="请确认密码"
          onChangeText={setConfirm}
          error={errors.confirm}
          secureTextEntry
          onSubmitEditing={SignupSubmit}
        />
        <View style={styles.term}>
          <CheckBox
            style={{paddingRight: 5}}
            checkBoxColor={Colors.Theme}
            onClick={()=>{
              setIsTermsAgreed(!isTermsAgreed);
            }}
            isChecked={isTermsAgreed}
        />
          <Text style={{color: Colors.K600, fontSize: 14}}>我已阅读并同意</Text>
          <TouchableHighlight underlayColor={Colors.white} onPress={()=> navigation.navigate("PrivatePolicy")} >
            <Text style={{color:Colors.Theme, fontSize: 14}}>用户协议、</Text>
          </TouchableHighlight>
          <TouchableHighlight underlayColor={Colors.white} onPress={()=> navigation.navigate("PrivatePolicy")} >
            <Text style={{color:Colors.Theme, fontSize: 14}}>隐私条款</Text>
          </TouchableHighlight>
        </View>
      <Button title="注册" onPress={SignupSubmit} disabled={!isTermsAgreed} style={styles.submit} isLoading={isSubmiting} />
      {errors.loginFailed && <Text style={styles.errorText}>{errors.loginFailed}</Text>}

      
    </View>
    <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} isDialog={true}>
      <Modal.Body>
        <Text style={{fontSize: 16}}>请输入6-16位数字、字母或常用符号，字母区分大小写</Text>
      </Modal.Body>
    </Modal>
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
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 20,
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
    marginTop: 20
  },
  errorText: {
    marginTop: 10,
    color: Colors.R500,
    height: 20
  },
  term:{
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
});

export default SignupScreen