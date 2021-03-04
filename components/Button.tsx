import React from 'react'
import { TouchableHighlight, TouchableHighlightProps, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { omit } from 'lodash'
import { Colors } from '../constants'

interface ButtonProps extends TouchableHighlightProps {
    title: string | React.ReactNode,
    style?: any,
    isLoading?: boolean,
    outline?: boolean,
    textStyle?: any,
}

export default function Button(props: ButtonProps) {
  let style = {
    backgroundColor:Colors.Theme,
    borderColor: Colors.white
  }
  if(props.disabled){
    style = {
      backgroundColor:Colors.K300,
      borderColor: Colors.white
    }
  }
  if(props.outline){
    style = {
      backgroundColor: Colors.white,
      borderColor: Colors.Theme
    }
    if(props.disabled){
      style = {
        backgroundColor: Colors.white,
        borderColor: Colors.K300
      }
    }
  }
  
  return (
      <TouchableHighlight
            style={[styles.button, props.style, style]}
            underlayColor={Colors.ThemeFocus}
            disabled={props.isLoading}
            {...omit(props, 'style')}
        >
          <>
          <Text style={[styles.submitText, props.textStyle, {color: props.outline ? props.disabled ? Colors.K300 : Colors.Theme : Colors.white}]}>{props.title}</Text>
          {props.isLoading && <ActivityIndicator animating={true} style={styles.icon} />}
          </>
      </TouchableHighlight>
  )
}

Button.defaultProps={
    color:Colors.Theme,
    isLoading: false,
    outline: false
}

const styles = StyleSheet.create({
    button:{
        padding:12,
        borderRadius:50,
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        borderWidth: 1
      },
      disabled:{
        backgroundColor: Colors.K300,
      },
      submitText:{
        textAlign:'center',
        fontSize: 16,
      },
      icon:{
        marginLeft: 10 
      }
})