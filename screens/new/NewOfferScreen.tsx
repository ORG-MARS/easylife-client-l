import React, { useLayoutEffect } from 'react';
import { StyleSheet, Button, TouchableWithoutFeedback } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Text, View, } from '../../components';
import { Colors } from '../../constants'
import * as Icons from '../../assets/icons'
import { RootStackParamList } from '../../types'

const NewOfferScreen = ({ navigation }: StackScreenProps<RootStackParamList>) => {
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default NewOfferScreen