import React, { useState, useEffect, useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, SafeAreaView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios'
import Uri from 'jsuri'

import { Text, View, RefreshControl, SingleContact } from '../../components'
import { RootStackParamList,  Models } from '../../types'
import { Colors, API } from '../../constants'
import { AuthContext, MessageContext, MessageTypes } from '../../reducers'

export default function ContactScreen({ navigation }: StackScreenProps<RootStackParamList>) {
  const [contacts, setContacts] = useState<Models.User[]>([])
  const [page, setPage] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [canLoadMore, setCanLoadMore] = useState(false)
  const { state: userState } = useContext(AuthContext);
  const { state: messageState, dispatch: messageDispatch } = useContext(MessageContext);

  useEffect(() => {
    getContacts()
  },[userState.user?.user_id])

  useEffect(()=>{
    if(!messageState.contactRefresh) return
    getContacts()
    messageDispatch({
      type: MessageTypes.SET_STATE,
      payload: {contactRefresh: false},
    });
  },[messageState.contactRefresh])

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
      try{
        if(page > 1){
          setPage(1)
        }
        const url = new Uri(`${API}/friends/`)
        .addQueryParam('page', 1)
        .addQueryParam('page_size', 20)
        const res = await axios.get(url.toString())
        setContacts(res.data.results)
        setCanLoadMore(res.data.links.next !== null)
        AsyncStorage.setItem('contacts', JSON.stringify(res.data))
        // updateAvatars(res.data.results)
      }catch(err){}
  }

  async function getMoreContactsfromServer(){
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

  // async function updateAvatars(results:  Models.User[]){
  //   avatarDispatch({
  //     type: AvatarTypes.SET_AVATARS,
  //     users: results.filter(e => e.avatar).map(e => ({ user_id: e.friend.username, username: e.friend.username, avatar: e.friend.avatar }))
  //   })
  // }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
      <RefreshControl 
        onRefresh={getContactsfromServer}
        onLoadMore={canLoadMore ? getMoreContactsfromServer : undefined} 
        isLoadingMore={isLoadingMore}
      >
        <FlatList
          data={contacts}
          keyExtractor={item => item.username}
          renderItem={({ item }:{ item: Models.User }) => (
            <SingleContact
              key={item.username}
              onPress={() => navigation.navigate('UserProfile',{userId:item.friend})}
              item={item}
            />
          )}
          ListEmptyComponent={() => (
            <View style={styles.notFound}>
                <Text style={styles.notFoundText}>请添加新朋友</Text>
            </View>
          )}  
        />
        </RefreshControl>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  notFound:{
    alignItems:'center',
    backgroundColor: Colors.white,
  },
  notFoundText:{
    color: Colors.K400,
  }
});
