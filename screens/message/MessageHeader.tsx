import React, { useContext } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { BottomTabParamList } from '../../types'
import { Colors } from '../../constants';
import { Text, View, UserAvatar } from '../../components';
import * as Icons from '../../assets/icons';
import { AuthContext } from '../../reducers' 

export default function MessageHeader (
  { isCommon, navigation }: StackScreenProps<BottomTabParamList> & { isCommon: boolean }
) {
  const { state: userState } = useContext(AuthContext);
  const title = isCommon ? '我的消息' : '添加好友';
  const iconSize = 28;
  
  const renderAction = () => {
    if (isCommon) {
      return (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('NewContact')}
        >
          <View style={styles.icon}>
            <Icons.PersonAdd width={iconSize} height={iconSize} color={Colors.K200} />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => navigation.goBack()}
      >
        <View style={styles.icon}>
          <Icons.CloseCircle width={iconSize} height={iconSize} color={Colors.K200} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <UserAvatar avatar={userState.user?.avatar} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {renderAction()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.Theme,
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: Colors.Theme,
    borderWidth: 2,
    borderColor: Colors.K250,
    width: 48,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  icon: {
    backgroundColor: Colors.Theme,
    marginBottom: 15,
  }
});
