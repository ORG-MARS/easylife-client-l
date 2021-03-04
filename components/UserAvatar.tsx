import React from 'react';
import { StyleSheet, Image } from 'react-native';
import * as Icons from '../assets/icons';

const  UserAvatar = ({avatar, size }:{avatar?: string, size?: number}) =>{
  return avatar
    ? <Image source={{ uri: avatar }} style={styles.avatar} width={size} height={size}/>
    : <Icons.PersonCircle width={size} height={size} />;
}

const styles = StyleSheet.create({
  avatar:{
    borderRadius: 50
  },
});

UserAvatar.defaultProps={
  size:42,
}

export default UserAvatar;