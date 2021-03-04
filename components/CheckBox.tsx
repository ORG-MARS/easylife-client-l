import React from 'react'
import CheckBox from 'react-native-check-box'
import { Text, StyleSheet } from 'react-native'
import { Colors } from '../constants'
import * as Icons from '../assets/icons'

interface CheckBoxProps {
    style?: any,
    onClick: ()=>void,
    isChecked: boolean,
    text?: string,
}

export default function MyCheckBox({style, onClick, isChecked, text}: CheckBoxProps) {
  return (
    <CheckBox
        style={style}
        onClick={onClick}
        isChecked={isChecked}
        checkedImage={<Icons.CheckCircleRounded color={Colors.Theme} />}
        unCheckedImage={<Icons.Rounded />}
        rightTextView={<Text style={{color: Colors.K650, fontSize: 14, paddingLeft: 5}}>{text}</Text>}
    />
  )
}

MyCheckBox.defaultProps={
    text:'',
    isChecked: false,
    style: {}
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