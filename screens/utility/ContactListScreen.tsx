import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import Uri from 'jsuri'

import { View, Text, SingleContact, RefreshControl, Button } from '../../components'
import { Colors, API } from '../../constants'
import * as Icons from '../../assets/icons'
import { BottomTabParamList, Models } from '../../types'
import { getHeaderPadding } from './helper'
import { debounce } from 'lodash';


const ContactListScreen = ({ navigation, route }: StackScreenProps<BottomTabParamList>) => {
  const [contacts, setContacts] = useState<Models.User[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(false)
  const [selected, setSelected] = useState<Models.User[]>([])

  useEffect(() => {
    getContacts()
  },[route?.params])

  async function getContacts(){
    const localContactsString = await AsyncStorage.getItem('contacts');
    if(localContactsString){
      getContactsFromLocal(localContactsString)
    }else{
      getContactsfromServer()
    }
  }

  async function getContactsFromLocal(localContactsString:string){
    const localContacts = JSON.parse(localContactsString)
    setContacts(localContacts.results)
    setPage(localContacts.page)
    setCanLoadMore(localContacts.links.next !== null)
  }

  async function getContactsfromServer(){
    if(page > 1){
      setPage(1)
    }
    const url = new Uri(`${API}/friends/`)
      .addQueryParam('page', 1)
      .addQueryParam('page_size', 20)
      try{
        const res = await axios.get(url.toString())
        setContacts(res.data.results)
        setCanLoadMore(res.data.links.next !== null)
        AsyncStorage.setItem('contacts', JSON.stringify(res.data))
      }catch(err){}
  }

  async function getMoreContacts(){
    try{
      if(contacts.length < 1) return
      setIsLoadingMore(true)
      const newPage = page + 1
      const url = new Uri(`${API}/friends/`)
      .addQueryParam('page', newPage)
      .addQueryParam('page_size', 20)
      const res = await axios.get(url.toString())
      setContacts([ ...contacts, ...res.data.results])
      setPage(newPage)
      setCanLoadMore(res.data.links.next!==null)
      setIsLoadingMore(false)
      AsyncStorage.setItem('contacts', JSON.stringify({
        results: [ ...contacts, ...res.data.results],
        page: res.data.page,
        links: res.data.links
      }))
      // updateAvatars(res.data.results)
    }catch(err){}
  }

  const setUserOnBack = debounce((user)=>navigation.setParams({user: JSON.stringify(user)}), 200)

  async function onPress(user: Models.User){
    // const currentSelected = selected.find(u => u.friend === user.friend)
    //   ? selected.filter(u => u.friend !== user.friend)
    //   : [...selected, user];
    setSelected([{...user}]);
  }

  async function onConfirm() {
    navigation.goBack()
    // @ts-ignore
    route?.params?.onSelect(selected);
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
          <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
        </TouchableOpacity>
        <Text>添加对象</Text>
        <Button title='确定' onPress={onConfirm} style={{width: 56, paddingVertical:6}} textStyle={{fontSize:14}}/>
      </View>
      <View style={styles.list}>
        <RefreshControl 
          onRefresh={getContactsfromServer}
          onLoadMore={canLoadMore ? getMoreContacts : undefined} 
          isLoadingMore={isLoadingMore}
        >
          <FlatList
            data={contacts}
            keyExtractor={item => item.friend.username}
            renderItem={({ item }:{ item: Models.User }) => (
              <SingleContact
                key={item.friend.username}
                onPress={() => onPress(item)}
                item={item}
                allowSelect
                selected={Boolean(selected.find(u => u.friend === item.friend))}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.notFound}>
                  <Text style={styles.notFoundText}>请添加新朋友</Text>
              </View>
            )}  
          />
        </RefreshControl>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: Colors.white
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getHeaderPadding(),
    paddingBottom: 5,
    backgroundColor: Colors.white
  },
  confirm: {
    backgroundColor: Colors.Theme,
    color: Colors.white,
    fontSize: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50
  },
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
  },
  list: {
    flexDirection: 'column',
    flex:1,
    padding: 10,
    borderRadius: 8,
    borderColor: Colors.shadow,
    backgroundColor: Colors.white,
    margin: 5,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 3,
  },
  notFound:{
    alignItems:'center',
  },
  notFoundText:{
    color: Colors.K400
  }
});

export default ContactListScreen