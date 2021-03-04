import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Text, View } from '../../../components';
import { RootStackParamList } from '../../../types'
import { Colors } from '../../../constants';
import * as Icons from '../../../assets/icons'

const MenuItem =({onPress, name, isLast}:{onPress: () => void; name: string, isLast?: boolean}) =>{
 return (
    <TouchableOpacity onPress={onPress}>
        <View style={[styles.menu, isLast ? {} : { borderBottomWidth: 1, borderBottomColor: Colors.K250 }]}>
            <Text style={styles.menuText} >{name}</Text>
            <Icons.ArrowRight color={Colors.K300} height={16} width={16} />
        </View>
    </TouchableOpacity>
 )
}

const AboutScreen = ({ navigation, route }: StackScreenProps<RootStackParamList>) => {
  return (
    <View style={styles.container}>
      <MenuItem onPress={()=> navigation.navigate('PrivatePolicy')} name='服务协议' />
      <MenuItem onPress={() => navigation.navigate('PrivatePolicy')} name='隐私政策' isLast={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  menu:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20,
    paddingVertical: 10,
    backgroundColor: Colors.white,
  },
  menuText:{
    color: Colors.K800
  },
  back: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  close: {
    paddingLeft: 5,
    paddingRight:30,
    paddingVertical: 10,
  },
});

export default AboutScreen