import React from 'react'
import { TouchableHighlight, TouchableHighlightProps, StyleSheet } from 'react-native'
import { omit } from 'lodash'
import * as Icons from '../assets/icons'
import { Colors } from '../constants'


export default function SendButton(props: TouchableHighlightProps) {
  return (
    <TouchableHighlight
        style={[styles.send, props.style]}
        underlayColor={Colors.ThemeFocus}
        {...omit(props, 'style')}
    >
    <Icons.Publish color={props.disabled ? Colors.K300: Colors.Theme} />
    </TouchableHighlight>
  )
}
SendButton.defaultProps={
    color:Colors.Theme,
    isLoading: false
}

const styles = StyleSheet.create({
    send:{
        backgroundColor: Colors.white, 
        padding: 12,
        borderRadius:50,
        shadowColor: Colors.shadow,
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
      }
})