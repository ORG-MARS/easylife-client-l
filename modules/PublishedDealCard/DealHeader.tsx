import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, TouchableHighlight, Dimensions } from 'react-native';
import moment from 'moment'

import { Text, Status } from '../../components'
import { Models } from '../../types'
import { Colors } from '../../constants'
import * as Icons from '../../assets/icons'

interface DealHeaderProps{
    item: Models.Deal, 
    onPress: (item: Models.Deal)=>void,
    style?: any
}

const  DealHeader = ({ item, onPress, style }:DealHeaderProps) => {
    const firstUser = item.dealuser_set[0]
    const secondUser = item.dealuser_set[1]
    const startTime = moment(item.start_date).format('MM/DD')
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
        <View style={style} >
            <TouchableHighlight underlayColor={Colors.light.background} onPress={() => onPress(item)}>
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
                        <Text style={styles.headerTime}>开始{startTime} - 结束{firstUser.fullfilled_time ? moment(firstUser.fullfilled_time).format('MM/DD') : 'N/A'}</Text>
                    </View>}
                    <View style={styles.dealFullfillIcon}>
                        {isComplete ?
                            <Icons.DealFullfilled style={iconDirection} /> :
                            <Icons.Timer style={iconDirection} />
                        }
                    </View>
                    {!isComplete && 
                    <View style={[styles.dealUser, styles.secondUser, styles.inProgress]}>
                        <View style={styles.headerUser}>
                            <Status userSet={[secondUser]} />
                            {secondUser.avatar ? <Image source={{ uri: secondUser.avatar }} style={styles.avatar} />:
                            <Icons.PersonCircle width={40} height={40} />}
                        </View>
                    </View>}
                    {isComplete && 
                    <View style={secondUser.is_fullfilled ? [styles.dealUser, styles.secondUser] : [styles.dealUser, styles.secondUser, styles.dealNotFullfilled]}>
                        <View style={styles.headerUser}>
                            <Status userSet={[secondUser]} style={!secondUser.is_fullfilled && styles.notFullfilledStatus} />
                            {secondUser.avatar ? <Image source={{ uri: secondUser.avatar }} style={styles.avatar} />:
                            <Icons.PersonCircle width={40} height={40} />}
                        </View>
                        <Text style={styles.headerTime}>开始{startTime} - 结束{secondUser.fullfilled_time ? moment(secondUser.fullfilled_time).format('MM/DD') : 'N/A'}</Text>
                    </View>}
                </View>
            </TouchableHighlight>
        </View>
    )
  }
  DealHeader.defaultProps={
    style:{},
}

const windowWidth = Dimensions.get('window').width - 40;

  const styles = StyleSheet.create({
    statusCard: {
        flexDirection: 'row',
        position: 'relative',
    },
    dealUser:{
        borderRadius: 8,
        width: (windowWidth * 0.5) + 8,
        height: 80,
        backgroundColor: Colors.white,
        padding: 10,
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
        marginLeft: -16,
        alignItems:'flex-end'
    },
    headerUser: {
        flexDirection: 'row',
        alignItems:'flex-start'
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
    headerTime: {
        fontSize: 12,
        color: Colors.K600,
        marginTop: 5
    }
  });

  export default DealHeader;