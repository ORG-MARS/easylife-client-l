import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View, CheckBox } from '../components';
import { Models } from '../types';
import { Colors } from '../constants';
import UserAvatar from './UserAvatar';

const  SingleContact = (
  {item, onPress, allowSelect = false, selected = false}:{item: Models.User, onPress: ()=>void, allowSelect?: boolean, selected?: boolean }
) =>{
  return(
    <TouchableOpacity onPress={onPress}>
      <View style={styles.item}>
        <View style={styles.wrapper}>
          <UserAvatar avatar={item.avatar} />
          <View style={styles.itemTextWrapper}>
            <Text style={styles.itemText}>
              {item.nickname ||item.username}
            </Text>
          </View>
        </View>
        {allowSelect ? (
          <CheckBox
            onClick={onPress}
            isChecked={selected}
          />
        ) : <View />}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    padding: 10,
    flexDirection:'row',
    borderBottomWidth:1,
    borderBottomColor: Colors.K200,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  avatar:{
    width: 42,
    height: 42,
    borderRadius: 50
  },
  itemTextWrapper:{
    marginLeft: 20,
    backgroundColor: Colors.white
  },
  itemText:{
    lineHeight: 42,
    color: Colors.K950
  },
});

export default SingleContact;