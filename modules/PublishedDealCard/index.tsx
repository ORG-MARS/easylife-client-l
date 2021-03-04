import React from 'react';
import { View } from 'react-native';

import { Models } from '../../types'
import DealHeader from './DealHeader'
import DealContent from './DealContent'
import { MessageContextProps } from '../../reducers'

interface PublishedDealCardProps{
    user?: Models.User;
    item: Models.Deal, 
    onPress: (item: Models.Deal)=>void,
    onForward?: (item: Models.Deal)=>void,
    onComment: (item: Models.Deal)=>void,
    onViewImage: (uri: string)=>void,
    onAlert: () => void,
    context: MessageContextProps
}

const  PublishedDealCard = (props:PublishedDealCardProps) => {
    return(
        <View style={{paddingHorizontal:20}}>
            <DealHeader item={props.item} onPress={props.onPress} style={{marginBottom: 10}} />
            <DealContent {...props} style={{marginBottom: 20}} />
        </View>
    )
  }

  export default PublishedDealCard;