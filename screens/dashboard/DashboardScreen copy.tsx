import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Dimensions, FlatList, Animated, ActivityIndicator, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import Uri from 'jsuri';
import moment from 'moment';

import { Text, View, TextInput, Button, RefreshControl, Modal, ImagePreview } from '../../components';
import { PublishedDealCard } from '../../modules';
import { BottomTabParamList, Models, DEAL_STATUS } from '../../types'
import { Colors, API } from '../../constants'
import { getHeaderPadding } from '../utility/helper'
import * as Icons from '../../assets/icons'
import { AuthContext, AuthTypes, MessageContext } from '../../reducers'; 

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const H_MAX_HEIGHT = getDashboardHeaderHeight()
const H_MIN_HEIGHT = 0;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;

export function getDashboardHeaderHeight(){
  switch(true){
    // Android, iPhone 8
    case windowHeight >= 640 && windowHeight < 680:
        return windowHeight * 0.28;
    // iPhone 12
    case windowHeight >= 680 && windowHeight < 845:
        return windowHeight * 0.26;
    // iPhone xr, 11 xs max, 12 max
    case windowHeight >= 896:
    default:
        return windowHeight * 0.22;
  }
}

const DashboardScreen = ({ navigation }: StackScreenProps<BottomTabParamList>) => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: "clamp"
  });

  const { state: userState, dispatch: userDispatch } = useContext(AuthContext);
  const { context } = useContext(MessageContext);
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deals, setDeals] = useState<Models.Deal[]>([])
  const [page, setPage] = useState(1)
  const [totalUser, setTotalUser] = useState(0)
  const [totalDealCount, setTotalDealCount] = useState(0)
  const [canLoadMore, setCanLoadMore] = useState(false)

  const [isFull, setIsFull] = useState(false)
  const [fullSizeImage, setFullSizeImage] = useState('')

  useEffect(()=>{
    fetchDeals()
    fetchBasicInfo()
  },[])

  useEffect(()=>{
    if(!userState.refresh) return
    fetchDeals()
    fetchBasicInfo()
    userDispatch({
      type: AuthTypes.SET_STATE,
      payload: {refresh: false},
    })
  },[userState.refresh])

  function onSearch(){
    fetchDeals(search)
  }

  async function fetchBasicInfo() {
    try{
      const res = await axios.get(new Uri(`${API}/basic-info/`).toString())
      setTotalUser(res.data.total_users)
    }catch(err){}
  }

  async function fetchDeals(query=""){
    setIsLoading(true)
    if(page > 1){
      setPage(1)
    }
    const dealUrl = userState.user ? 'deal-details' : 'public/deals'
    const url = new Uri(`${API}/${dealUrl}/`)
    .addQueryParam('page', 1)
    .addQueryParam('page_size', 8)
    .addQueryParam('is_public', true)
    .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
    .addQueryParam('status', DEAL_STATUS.COMPLETE)
    .addQueryParam('ordering', '-public_time')
    if(query){
      url.addQueryParam('query', query)
    }
    try{
      const res = await axios.get(url.toString())
      setDeals(res.data.results)
      setTotalDealCount(res.data.count)
      setCanLoadMore(res.data.links.next!==null)
    }catch(err){}
    setIsLoading(false)
  }

  async function getMoreDeals(){
    if(deals.length < 1) return
    setIsLoadingMore(true)
    const newPage = page + 1
    const dealUrl = userState.user ? 'deal-details' : 'public/deals'
    let url = new Uri(`${API}/${dealUrl}/`)
    .addQueryParam('ordering', '-public_time')
    .addQueryParam('page', newPage)
    .addQueryParam('page_size', 8)
    .addQueryParam('is_public', true)
    .addQueryParam('status', DEAL_STATUS.IN_PROGRESS)
    .addQueryParam('status', DEAL_STATUS.COMPLETE)
    if(search){
      url.addQueryParam('query', search)
    }
    try{
      const res = await axios.get(url.toString())
      setDeals([ ...deals, ...res.data.results ])
      setPage(newPage)
      setCanLoadMore(res.data.links.next!==null)
    }catch(err){}
    setIsLoadingMore(false)
  }

  function closeImage() {
    setIsFull(false)
    setFullSizeImage('')
  }

  function getLoadingMargin(){
    switch(true){
      // iPhone 11, 12
      case windowHeight >= 667 && windowHeight < 896:
          return -(H_MAX_HEIGHT-(windowWidth * 0.45)/2) + 20
      case windowHeight >= 896:
      default:
          return -(H_MAX_HEIGHT-(windowWidth * 0.45)/2);
    }
  }

  async function updateSelectedDeal(dealId:number){
    if(!dealId) return
    const updated = [...deals]
    const dealUrl = userState.user ? 'deal-details' : 'public/deals'
    const url = new Uri(`${API}/${dealUrl}/${dealId}/`)
    const res = await axios.get(url.toString())
    const index = updated.findIndex(e=>e.id === dealId)
    updated[index] = { ... res.data}
    setDeals(updated)
  }

  return (
    <View style={styles.container}>
      <RefreshControl 
        onRefresh={() => {
          fetchDeals()
        }} 
        isRefreshing={isLoading}
        refreshOffSet={H_MAX_HEIGHT}
        onLoadMore={canLoadMore ? getMoreDeals : undefined} 
        isLoadingMore={isLoadingMore}
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrollOffsetY } } }
        ])}
        scrollEventThrottle={16}
      >
        <View style={[styles.content, {paddingTop: H_MAX_HEIGHT}]}>
          {Platform.OS === 'ios' && <ActivityIndicator size='large' animating={true} style={{marginTop:getLoadingMargin(), marginBottom:20}} />}
          <FlatList
            data={deals}
            keyExtractor={item => `deal-${item.id}`}
            scrollEnabled={false}
            renderItem={({ item }:{ item: Models.Deal }) => (
              <PublishedDealCard 
                key={`published-deal-${item.id}`}
                user={userState.user}
                item={item} 
                onViewImage={(uri:string) => {
                  setIsFull(true)
                  setFullSizeImage(uri || '')
                }}
                onPress={(item: Models.Deal) => {
                  navigation.navigate("DealDetail", {dealId:item.id, onGoBack: updateSelectedDeal})
                }} 
                onComment={(item: Models.Deal) => {
                  navigation.navigate("DealDetail", {dealId:item.id, onGoBack: updateSelectedDeal})
                }}
                onAlert={()=>setIsModalVisible(true)}
                context={context}
              />
            )}
            ListEmptyComponent={() => (
              <Text style={styles.empty} >-- 暂无约定 --</Text>
            )} 
          />
          </View>
      </RefreshControl>
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: headerScrollHeight,
          width: "100%",
          overflow: "hidden",
          zIndex: 999,
          backgroundColor: 'transparent',
        }}
        >
        <View style={styles.headerWrapper} />
        <View style={styles.header}>
          <View style={styles.headerSearch}>
              <TextInput
                  onChangeText={setSearch}
                  placeholder="请输入搜索关键词"
                  icon={<Icons.Search color={Colors.white} />}
                  textWrapperStyle={styles.searchInput}
                  textStyle={styles.searchInputText}
                  inputStyle={styles.searchInputStyle}
                  placeholderTextColor={Colors.white}
                  borderColor={Colors.ThemeFocus}
              />
            <Button style={styles.searchButton} outline title="搜索" onPress={onSearch} />
          </View>
          <View style={styles.headerInfo}>
            <View style={styles.headerInfoColumn}>
            <Text style={styles.headerInfoText}>{totalUser}</Text>
            <Text style={styles.headerInfoLabel}>注册总人数</Text>
            </View>
            <View style={styles.headerInfoColumn}>
            <Text style={styles.headerInfoText}>{totalDealCount}</Text>
            <Text style={styles.headerInfoLabel}>币池数量</Text>
            </View>
            <View style={styles.headerDivider}></View>
            <View style={styles.headerInfoColumn}>
              <Text style={styles.headerInfoText}>{moment().format('YYYY-MM-DD')}</Text>
              <View style={styles.headerInfoTime}>
                <Icons.Clock color={Colors.white} width={16} height={16} />
                <Text style={styles.headerInfoLabel}>日期</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      <ImagePreview
          isVisible={isFull}
          closeImage={closeImage}
          uri={fullSizeImage} 
        />
      <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} isDialog={true}>
        <Modal.Body>
          <Text style={{fontSize: 16, textAlign: 'center'}}>请先登录～</Text>
        </Modal.Body>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    position:'absolute',
    backgroundColor: Colors.Theme,
    alignSelf: 'center',
		width: windowWidth * 0.45,
		height: H_MAX_HEIGHT,
		borderBottomRightRadius: (windowWidth * 0.45)/2,
		borderBottomLeftRadius: (windowWidth * 0.45)/2,
    transform: [{ scaleX: 4 }],
  },
  header:{
    paddingTop: getHeaderPadding()+20,
    backgroundColor: Colors.Theme,
  },
  headerSearch: {
    flexDirection: 'row',
    backgroundColor: Colors.Theme,
    paddingHorizontal: 10
  },
  searchInput: {
    borderColor: '#ccc',
    width:'80%',
    marginBottom: 0,
    marginLeft: 5,
  },
  searchInputText: {
    padding: 4,
    paddingLeft: 12,
    backgroundColor: 'rgba(51, 51, 51, 0.2)',
  },
  searchInputStyle: {
    paddingLeft: 4,
    fontSize:14,
    color: Colors.white
  },
  searchButton: {
    width:'16%',
    height: 36,
    marginLeft: 8,
    padding: 8
  },
  headerInfo:{
    flexDirection: 'row',
    backgroundColor: Colors.Theme,
    justifyContent:'space-around',
    alignItems:'center',
  },
  headerInfoColumn: {
    backgroundColor: 'transparent',
    alignItems:'center',
    justifyContent:'center',
  },
  headerInfoText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: 18,
    marginBottom: 4
  },
  headerInfoLabel: {
    color: Colors.white,
    fontSize: 14,
  },
  headerDivider:{
    width: 2,
    backgroundColor: Colors.white,
    height: '70%'
  },
  headerInfoTime: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20,
    flex: 1
  },
  empty: {
    textAlign: 'center',
    padding: 30,
    fontSize: 14,
    color: Colors.K600
  },
});

export default DashboardScreen