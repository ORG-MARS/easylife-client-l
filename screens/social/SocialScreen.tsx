import * as React from 'react';
import { StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { Text, View } from '../../components';
import { BottomTabParamList } from '../../types'

const SocialScreen = ({ navigation }: StackScreenProps<BottomTabParamList>) => {
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

export default SocialScreen