import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../components'
import { Colors } from '../constants';

const  Badge = ({children, number, style, emptyStyle, color}:{children:React.ReactNode, number:number | boolean, style?:{}, emptyStyle?:{}, color?: string}) =>{
    return(
        <View style={[styles.tabContainer, style]}>
        {Number.isInteger(number) && number > 0 && <View style={[styles.tabBadge, {backgroundColor: color}]}>
          <Text style={[styles.tabBadgeText]}>
          {number}
          </Text>
        </View>}
        {number === true && <View style={[styles.tabBadgeEmpty, emptyStyle, , {backgroundColor: color}]}>
        </View>}
        {children}
        </View>
    )
  }
  Badge.defaultProps={
    color: Colors.Theme,
    emptyStyle: {},
    style: {}
}
  const styles = StyleSheet.create({
    tabContainer: {
        paddingRight:10,
        backgroundColor:'transparent'
      },
      tabBadge: {
        position: 'absolute',
        top: -5,
        right: -10,
        borderRadius: 16,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
      },
      tabBadgeEmpty:{
        position: 'absolute',
        top: -5,
        right: 0,
        borderRadius: 50,
        width:10,
        height:10,
        zIndex: 2,
      },
      tabBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
      },
  });

  export default Badge;