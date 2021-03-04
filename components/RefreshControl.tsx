import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, RefreshControl as DefaultRefreshControl, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent, Alert } from 'react-native';
import { debounce } from 'lodash'

interface RefreshControlProps {
    onRefresh: () => void,
    style?: {},
    children?: React.ReactNode,
    isRefreshing?: boolean,
    refreshOffSet?:number,
    isLoadingMore?: boolean,
    onLoadMore?: () => void,
    onScroll?: (event:NativeSyntheticEvent<NativeScrollEvent>) => void,
    scrollEventThrottle?: number,
}

export const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}:NativeScrollEvent) => {
  const paddingToBottom = 50;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

const RefreshControl: React.FC<RefreshControlProps> = React.forwardRef(
  (props, ref) => {
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = debounce(async () => {
    try{
      await props.onRefresh()
    }catch(err){
      if(err.response.status === 401){
        Alert.alert("请登录～")
      }
    }
    setRefreshing(false)
  }, 500)

  useEffect(()=>{
    if(props.isRefreshing === undefined) return
    setRefreshing(props.isRefreshing)
  },[props.isRefreshing])

  return (
      <SafeAreaView style={{flex:1}}>
      <ScrollView
        refreshControl={
          <DefaultRefreshControl 
            refreshing={refreshing} 
            onRefresh={()=>{
              setRefreshing(true);
              refreshData()
            }}
            progressViewOffset={props.refreshOffSet}
          />
        }
        style={props.style}
        // @ts-ignore
        ref={ref}
        onScroll={(event:NativeSyntheticEvent<NativeScrollEvent>) => {
          if (isCloseToBottom(event.nativeEvent) && props.onLoadMore) {
            if(props.isLoadingMore) return
            props.onLoadMore();
          }
          if(props.onScroll){
            props.onScroll(event)
          }
        }}
        scrollEventThrottle={ props.scrollEventThrottle || 400}
      >
        {props.children}
        {props.isLoadingMore && <ActivityIndicator size='large' animating={true}  style={{padding: 10}} />}
        </ScrollView>
      </SafeAreaView>
  );
})

RefreshControl.defaultProps={
  refreshOffSet: 0,
}

export default RefreshControl
