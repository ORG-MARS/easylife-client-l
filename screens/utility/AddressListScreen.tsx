import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';

import { View, Text, RefreshControl } from '../../components'
import { Colors, API } from '../../constants'
import * as Icons from '../../assets/icons'
import { AuthContext } from '../../reducers'
import { RootStackParamList, Models } from '../../types'
import { getHeaderPadding } from './helper'

const windowWidth = Dimensions.get('window').width;

const AddressListScreen = ({ navigation, route, onBack }: StackScreenProps<RootStackParamList> & {onBack?: ()=>void}) => {
    const { state: userState } = useContext(AuthContext);
    const [addresses, setAddresses] = useState<Models.Address[]>([])
    const [isLoading, setIsLoading] = useState(false)
  
    useEffect(()=>{
      fetchAddresses()
    },[userState.user?.user_id, route?.params])
  
    async function fetchAddresses(){
      setIsLoading(true)
      try{
        const res = await axios.get(`${API}/user-addresses/`)
        setAddresses(res.data)
      }catch(err){}
      setIsLoading(false)
    }

    async function deleteAddress(address:Models.Address){
      try{
        await axios.delete(`${API}/user-addresses/${address.id}/`)
        setAddresses(addresses.filter(e=>e.id !== address.id))
      }catch(err){}
    }

  async function onPress(address: Models.Address){
    goBack()
    // @ts-ignore
    route?.params?.onSelectAddress(address);
  }

  function goBack(){
    if(onBack){
      onBack()
    }else{
      navigation.goBack()
    }
  }
  const renderAddressCard = (item: Models.Address) =>{
    return(
      <View key={`user-address-${item.id}`} style={styles.addressCard}>
          <TouchableOpacity style={styles.deleteAddress} onPress={()=>deleteAddress(item)}>
            <Icons.Delete width={28} height={28} color={Colors.R500} />
          </TouchableOpacity>
          <Text style={{width:windowWidth-88, marginLeft:10}}>{`${item.address_line} ${item.province_state} ${item.city} ${item.postal_zip} ${item.phone}`}</Text>
      </View>
    )
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row',alignItems:'center'}}>
        <TouchableOpacity style={styles.close} onPress={goBack}>
          <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
          <Text style={styles.title}>地址</Text>
        </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.add} onPress={() => navigation.navigate('NewAddress', {onRefresh: fetchAddresses})}>
          <Icons.AddCircleOutline width={24} height={24} color={Colors.Theme} />
        </TouchableOpacity>
      </View>
      <RefreshControl 
            onRefresh={() => {
                fetchAddresses()
            }} 
            isRefreshing={isLoading}
        >
        <FlatList
          data={addresses}
          keyExtractor={item => `address-${item.id}`}
          scrollEnabled={false}
          renderItem={({ item }:{ item: Models.Address }) =>  {
            //@ts-ignore
            if(route?.params?.isFromChat){
              return (
                <TouchableOpacity style={styles.close} onPress={()=>onPress(item)}>
                  {renderAddressCard(item)}
                </TouchableOpacity>
              )
            }
            return renderAddressCard(item)
          }}
          ListEmptyComponent={() => (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>添加新地址～</Text>
            </View>
          )}
        />
        </RefreshControl>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingTop: getHeaderPadding(),
    paddingBottom: 5
  },
  title:{
    fontSize: 18,
    fontWeight:'500'
  },
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  add: {
    paddingLeft: 30,
    paddingRight: 10,
    paddingVertical: 10,
  },
  addressCard: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: Colors.shadow,
    backgroundColor: Colors.white
  },
  avatar:{
    width: 60, 
    height: 60,
    borderRadius: 50
  },
  deleteAddress:{
    marginLeft: 5,
  },
  notFound:{
    alignItems:'center',
  },
  notFoundText:{
    color: Colors.K400
  }
});

export default AddressListScreen