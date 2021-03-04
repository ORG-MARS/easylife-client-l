import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { RootStackParamList, DrawerTabParamList } from '../../../types'
import DefaultAddressListScreen from '../../utility/AddressListScreen'
import { GestureRecognizer } from '../../../components'

const AddressListScreen = (props: StackScreenProps<RootStackParamList> & StackScreenProps<DrawerTabParamList>) => {
  return (
    <GestureRecognizer 
      style={{
        flex: 1,
      }} 
      onSwipeRight={()=> props.navigation.navigate('Profile')}
      config={{
        detectSwipeUp:false,
        detectSwipeDown:false
      }}
    >
    <DefaultAddressListScreen {...props} onBack={()=> props.navigation.navigate('Profile')} />
    </GestureRecognizer>
  );
}

export default AddressListScreen
