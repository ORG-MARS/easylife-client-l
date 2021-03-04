import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, FlatList, Image, Keyboard, TouchableHighlight, SafeAreaView, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { View, Text, SendButton, DateTimePicker, SlideupMenu } from '../../../components';
import { Colors } from '../../../constants'
import * as Icons from '../../../assets/icons'
import { DrawerTabParamList, Models } from '../../../types'


const MyOfferScreen = ({ navigation, activeIndex }: StackScreenProps<DrawerTabParamList> & {activeIndex: number}) => {
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

export default MyOfferScreen