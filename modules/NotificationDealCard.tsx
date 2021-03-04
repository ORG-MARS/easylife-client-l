import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Dimensions, Platform } from 'react-native';
import moment from 'moment'

import { Text, Status } from '../components'
import { Models } from '../types'
import { Colors } from '../constants'
import * as Icons from '../assets/icons'

interface NotificationDealCardProps{
    item: Models.Deal, 
}

const  NotificationDealCard = ({ item }:NotificationDealCardProps) => {
    const firstUser = item.dealuser_set[0]
    const secondUser = item.dealuser_set[1]
    const [iconDirection, setIconDirection] = useState({})
    const [isComplete, setIsComplete] = useState(false)

    useEffect(()=>{
        if(firstUser.fullfilled_time && secondUser.fullfilled_time){
            setIsComplete(true)
            if(firstUser.is_fullfilled && secondUser.is_fullfilled){
                setIconDirection({transform: [{rotate: '90deg'}]})
            }else if(!firstUser.is_fullfilled && !secondUser.is_fullfilled){
                setIconDirection({transform: [{rotate: '270deg'}]})
            }else if(secondUser.is_fullfilled){
                setIconDirection({transform: [{rotate: '180deg'}]})
            }else{
                setIconDirection({})
            }
            return
        }else{
            setIsComplete(false)
        }
    },[item])

    return(
        <View >
            <View style={styles.statusCard}>
                {!isComplete && 
                <View style={[styles.dealUser, styles.inProgress]}>
                    <View style={styles.headerUser}>
                        {firstUser.avatar ? <Image source={{ uri: firstUser.avatar }} style={styles.avatar} />:
                        <Icons.PersonCircle width={40} height={40} />}
                        <Status userSet={[secondUser]} />
                    </View>
                </View>}
                {isComplete && 
                <View style={firstUser.is_fullfilled ? styles.dealUser : [styles.dealUser, styles.dealNotFullfilled]}>
                    <View style={styles.headerUser}>
                        {firstUser.avatar ? <Image source={{ uri: firstUser.avatar }} style={styles.avatar} />:
                        <Icons.PersonCircle width={40} height={40} />}
                        <Status userSet={[firstUser]}  style={!firstUser.is_fullfilled && styles.notFullfilledStatus} />
                    </View>
                </View>}
                <View style={styles.dealFullfillIcon}>
                    {isComplete ?
                        <Icons.DealFullfilled style={iconDirection} /> :
                        <Icons.DealFullfilled style={iconDirection} />
                    }
                </View>
                {!isComplete && 
                <View style={[styles.dealUser, styles.secondUser, styles.inProgress]}>
                    <View style={{alignItems:'flex-end'}}>
                        {secondUser.avatar ? <Image source={{ uri: secondUser.avatar }} style={styles.avatar} />:
                        <Icons.PersonCircle width={40} height={40} />}
                        <Status userSet={[secondUser]} />
                    </View>
                </View>}
                {isComplete && 
                <View style={secondUser.is_fullfilled ? [styles.dealUser, styles.secondUser] : [styles.dealUser, styles.secondUser, styles.dealNotFullfilled]}>
                    <View style={{alignItems:'flex-end'}}>
                        {secondUser.avatar ? <Image source={{ uri: secondUser.avatar }} style={styles.avatar} />:
                        <Icons.PersonCircle width={40} height={40} />}
                        <Status userSet={[secondUser]} style={!secondUser.is_fullfilled && styles.notFullfilledStatus} />
                    </View>
                </View>}
            </View>
            <View style={styles.headerTimeWrapper}>
                <View style={styles.headerTimeView}>
                    <Text style={styles.headerTime}>开始{moment(item.start_date).format('MM/DD')} - 结束{moment(item.end_date).format('MM/DD')}</Text>
                </View>
            </View>
            
        </View>
    )
  }
  NotificationDealCard.defaultProps={
    style:{},
}

let windowWidth = Dimensions.get('window').width - 80;
// @ts-ignore
if(Platform.isPad){
    windowWidth = windowWidth - 40
}

  const styles = StyleSheet.create({
    statusCard: {
        flexDirection: 'row',
        position: 'relative',
    },
    dealUser:{
        borderRadius: 8,
        width: (windowWidth * 0.5),
        height: 90,
        backgroundColor: Colors.white,
        padding: 10,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
    },
    dealNotFullfilled: {
        backgroundColor: Colors.ThemeOpacity,
        zIndex: -1,
    },
    inProgress: {
        backgroundColor: Colors.Theme
    },
    secondUser:{
        marginTop: 15,
        alignItems:'flex-end',
        justifyContent:'flex-end'
    },
    headerUser: {
        alignItems:'flex-start',
    },
    avatar:{
        width: 40, 
        height: 40,
        borderRadius: 50
    },
    dealFullfillIcon: {
        position: 'absolute',
        left: (windowWidth * 0.5) - 22,
        top: 28,
        zIndex: 3
    },
    notFullfilledStatus: {
        backgroundColor: Colors.white
    },
    headerTimeWrapper: {
        alignItems:'center',
        marginTop: 10
    },
    headerTimeView:{
        backgroundColor: Colors.K200,
        padding: 5,
        borderRadius:50
    },
    headerTime: {
        fontSize: 14,
        color: Colors.K600,
    }
  });

  export default NotificationDealCard;