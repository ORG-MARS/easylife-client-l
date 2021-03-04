import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components'
import { Models } from '../types'
import { Colors } from '../constants'
import * as Icons from '../assets/icons'

const  Status = ({userSet, style}:{userSet: Models.DealUser[], style?:any}) =>{
    if(userSet.some((i: Models.DealUser) => !i.fullfilled_time)){
      return <View style={[styles.statusView, styles.inProgress, style]}><Icons.Status width={12} height={12} color={Colors.white} /><Text style={[styles.statusText, styles.fullfilledText]}>进行中约定</Text></View>
    }
    return(
            userSet.some((i: Models.DealUser) => !i.is_fullfilled)?
                <View style={[styles.statusView, style]}><Icons.Status width={12} height={12} color={Colors.Theme} /><Text style={styles.statusText}>未完成约定</Text></View> : 
                <View style={[styles.statusView, styles.fullfilled, style]}><Icons.Status width={12} height={12} color={Colors.white} /><Text style={[styles.statusText, styles.fullfilledText]}>已完成约定</Text></View> 
    )
  }
  Status.defaultProps={
    style:{},
  }
  const styles = StyleSheet.create({
    statusView: {
        flexDirection: 'row',
        marginTop: 10,
        paddingVertical:5,
        paddingHorizontal:10,
        borderRadius: 50,
        backgroundColor: Colors.ThemeOpacity,
    },
    inProgress: {
      backgroundColor: '#7fd6a5'
    },
    fullfilled:{
      backgroundColor: Colors.Theme
    },
    statusText: {
        color:Colors.Theme,
        fontSize: 10,
        fontWeight: '500',
        marginLeft: 2
    }, 
    fullfilledText: {
      color: Colors.white
    }
  });

  export default Status;