import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback, 
  TouchableHighlight, 
  Dimensions, 
  Image, 
  SafeAreaView, 
  ActivityIndicator
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'
import { Models } from 'models';
import Uri from 'jsuri'

import { Text, View, RefreshControl, Modal, ImagePreview } from '../../components';
import { RootStackParamList } from '../../types'
import { AuthContext } from '../../reducers'
import { Colors, API } from '../../constants';
import * as Icons from '../../assets/icons'

interface ChatHistoryProps {
    dealId: number,
    route: {params:{deal:Models.Deal}}
}

const ChatHistory = ({ route, navigation }: StackScreenProps<RootStackParamList> & ChatHistoryProps) => {
  const { state: userState } = useContext(AuthContext); 
  const [isLoadHistory, setIsLoadHistory] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [massages, setMessages] = useState<Models.Message[]>([])
  const [leftUser, setLeftUser] = useState<Models.DealUser>()
  const [rightUser, setRightUser] = useState<Models.DealUser>()
  const refreshControlRef = useRef()

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')

  const [isAddressVisible, setIsAddressVisible] = useState(false)
  const [address, setAddress] = useState('')
  
  useEffect(()=>{
    if(!route.params.deal) return
    route.params.deal.dealuser_set.forEach(e => {
      if(e.user === route.params.deal.user_id){
        setRightUser({...e})
      }else{
        setLeftUser({...e})
      }
    })
    getChatHistory()
  },[route.params])

  async function getChatHistory(){
    let url = new Uri(`${API}/messages/`)
    .addQueryParam('page', 1)
    .addQueryParam('page_size', 20)
    .addQueryParam('deal',route.params.deal.id)
    .addQueryParam('ordering','-id')
    if(massages.length > 0){
      url = url.addQueryParam('id__lt',massages[0].id)
      setIsLoadHistory(true)
    }
    try{
      const res = await axios.get(url.toString())
      setMessages([...res.data.results.reverse(), ...massages])
    }catch(err){}
    setIsLoading(false)
  }

  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
  }

  function onViewAddress(address:Models.Address){
    setIsAddressVisible(true)
    setAddress(`${address.address_line} ${address.province_state} ${address.city} ${address.postal_zip} ${address.phone}`)
  }

  const renderRow = ({item}:{item:Models.Message}) => {
    const isRightSide = item.user === route.params.deal.user_id
    if(item.user === null){
      return (
        <View>
          <Text style={styles.loadMore}>{item.text}</Text>
        </View>
      )
    }
    return (
      <View style={[isRightSide ? styles.meRow : styles.messageRow]}>
        <TouchableWithoutFeedback onPress={()=> {navigation.navigate('UserProfile',{userId:leftUser?.user})}}>
        <View>
        {!isRightSide && leftUser?.avatar ? <Image source={{ uri: leftUser.avatar }} style={styles.avatar} />:null}
        {!isRightSide && !leftUser?.avatar && <Icons.PersonCircle width={36} height={36} />}
        </View>
        </TouchableWithoutFeedback>
        {item.image ? 
        <TouchableWithoutFeedback onPress={()=>{
          setIsFull(!isFull)
          setFullSizeImage(item.image?item.image:'')
        }}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableWithoutFeedback>
        :
        <TouchableHighlight
          underlayColor='#dddddd'
          style={[
            styles.messageContent, 
            isRightSide ? {backgroundColor: Colors.Theme, borderTopRightRadius: 0} : {backgroundColor: Colors.white, borderTopLeftRadius: 0}
          ]}
          onPress={()=>{
            if(route.params.deal.dealuser_set.find(e => e.user === userState.user?.user_id) === undefined) return
            
            if(item?.address?.id){
              return onViewAddress(item.address)
            }else if(item?.qr_image){
              setIsFull(true)
              setFullSizeImage(item.qr_image)
            }
          }}
        >
            <View style={styles.message}>
            {item?.text ? <Text style={[styles.messageText, isRightSide ? {color: Colors.white} : {color: Colors.K800}]}>{item.text}</Text> : null}
            {item?.address?.id && <Icons.Place color={isRightSide ? Colors.white : Colors.Theme} />}
            {item?.qr_image ? <Icons.Money color={isRightSide ? Colors.white : Colors.Theme} /> : null}
            </View>
        </TouchableHighlight>
        }
        <TouchableWithoutFeedback onPress={()=>navigation.navigate('UserProfile',{userId:rightUser?.user})}>
        <View>
        {isRightSide && rightUser?.avatar ? <Image source={{ uri: rightUser.avatar }} style={[styles.avatar, {marginLeft:5}]} />:null}
        {isRightSide && !rightUser?.avatar && <Icons.PersonCircle width={36} height={36} />}
        </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  return (
    <View style={styles.container} >
      <SafeAreaView style={styles.container}>
        <RefreshControl 
          onRefresh={getChatHistory} 
          // @ts-ignore
          ref={refreshControlRef}
        >
        {isLoading && <ActivityIndicator size='large' animating={true}  style={styles.loading} />}
        {!isLoading && <Text style={styles.loadMore}>-- 向下滑查看更多 --</Text>}
        <FlatList 
            style={styles.listView}
            data={massages}
            keyExtractor={item => `message-${item.id}`}
            renderItem={renderRow}
            onContentSizeChange={() => {
              if(isLoadHistory) return
              // @ts-ignore
              refreshControlRef?.current?.scrollToEnd({animated: true})
            }}
        />
        </RefreshControl>
        </SafeAreaView>
        <ImagePreview
          isVisible={isFull}
          closeImage={closeImage}
          uri={fullSizeImage} 
        />
        <Modal
          isVisible={isAddressVisible}
          onClose={()=>{
            setIsAddressVisible(false)
            setAddress('')
          }}
        >
          <Modal.Body>
            <Text selectable>{address}</Text>
          </Modal.Body>
        </Modal>
      </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
     container: {
        flex: 1,
      },
      loading:{
        padding: 10,
      },
      loadMore:{
        textAlign: 'center',
        padding: 10,
        fontSize: 14,
        color: Colors.K600,
        backgroundColor: 'transparent'
      },
      listView: {
        paddingHorizontal: 10,
        paddingBottom:70
      },
      messageRow: {
        alignItems:'flex-start',
        marginBottom:15,
        flexDirection: 'row'
      },
      meRow: {
        flexDirection:'row',
        justifyContent:'flex-end',
        marginBottom:15,
      },
      avatar:{
        width: 36, 
        height: 36,
        borderRadius: 50,
        marginTop:5,
        marginRight:5
      },
      messageContent:{
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius:15,
        marginTop: 5,
      },
      message: {
        backgroundColor: 'transparent'
      },
      messageText: {
        fontSize: 16,
        color: Colors.K800,
        maxWidth: windowWidth - 150
      },
      image:{
        width: 120, 
        height: 160,
        borderRadius: 5,
        marginTop:5,
        marginRight:5,
      }
});

export default ChatHistory