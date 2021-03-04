import React, { useContext, useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'

import { View, Text, Button, TextInput, KeyboardAware } from '../../components';
import { RootStackParamList } from '../../types'
import { AuthContext } from '../../reducers/AuthReducer' 
import { Colors, API } from '../../constants';
import * as Icons from '../../assets/icons'
import { getHeaderPadding } from './helper'

const NewAddressScreen = ({ navigation, route }: StackScreenProps<RootStackParamList>) => {
  const { state: userState } = useContext(AuthContext);
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [addressLine, setAddressLine] = useState('')
  const [city, setCity] = useState('')
  const [provinceState, setProvinceState] = useState('')
  const [postalZip, setPostalZip] = useState('')
  const [country, setCountry] = useState(45)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

//   const cityRef = useRef()
//   const addressRef = useRef()
//   const postalRef = useRef()
//   const phoneRef = useRef()


  async function createAddress(result:any){
    try{
        setIsSubmiting(true)
        const res = await axios.post(`${API}/user-addresses/`,{
            address_line: addressLine,
            city,
            province_state: provinceState,
            postal_zip: postalZip,
            country,
            phone,
            user: userState.user?.user_id
        })
        setCity('')
        setProvinceState('')
        setPostalZip('')
        setPhone('')
        setError('')
        // @ts-ignore
        route?.params?.onRefresh();
        navigation.goBack()
        setIsSubmiting(false)
    }catch(err) {
        setIsSubmiting(false)
        setError("创建有错误，请稍后再试。")
    }
  }

  return (
    <KeyboardAware isScroll>
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
            <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
            </TouchableOpacity>
        </View>
        <View style={styles.content}>
            <View style={styles.title}>
                <Text style={styles.titleText}>添加新地址</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    onChangeText={setProvinceState}
                    placeholder="省/直辖市"
                    autoFocus = {true}
                />
                <TextInput
                    onChangeText={setCity}
                    placeholder="市"
                />
                <TextInput
                    onChangeText={setAddressLine}
                    placeholder="具体地址"
                />
                <TextInput
                    onChangeText={setPostalZip}
                    placeholder="邮编"
                />
                <TextInput
                    onChangeText={setPhone}
                    placeholder="电话"
                    onSubmitEditing={createAddress}
                />
                
            <Button title="创建" onPress={createAddress} style={styles.submit} isLoading={isSubmiting} />
            <Text style={styles.errorText}>{error}</Text>
            </View>
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
  content: {
    flex: 1,
  },
  header:{
    justifyContent:"center",
    alignItems: 'flex-start',
    paddingTop: getHeaderPadding(),
    paddingBottom: 5
  },
  close: {
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  title: {
    marginTop: 20
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    color: Colors.K800,
    marginBottom: 20
  },
  form: {
    marginTop:40,
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
});

export default NewAddressScreen