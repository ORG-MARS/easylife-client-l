import React from 'react'
import { View, StyleSheet, TextInput as DefaultTextInput, TextInputProps as DefaultTextInputProps } from 'react-native'
import { Colors } from '../constants'
import { HelperText  } from 'react-native-paper';
import { isEmpty } from 'lodash';

interface TextInputProps extends DefaultTextInputProps {
    icon?: React.ReactNode,
    textWrapperStyle?:{},
    textStyle?: {},
    inputStyle?: {},
    error?: string,
    borderColor?:string,
    ref?:any
}

export default function TextInput(props: TextInputProps) {
  return (
    <View style={{...styles.inputWrapper, ...props.textWrapperStyle}}>
    <View style={{
        borderColor: !isEmpty(props.error) ? Colors.R500 : props.borderColor,
        backgroundColor: !isEmpty(props.error) ? Colors.R100 : props.borderColor,
        ...styles.searchSection, 
        ...props.textStyle,
    }}>
        {props.icon}
        <DefaultTextInput
            style={{...styles.input, ...props.inputStyle}}
            placeholderTextColor={Colors.K600}
            underlineColorAndroid="transparent"
            {...props}
            ref={props.ref}
        />
    </View>
    <HelperText type="error" visible={!isEmpty(props.error)}>
        {props.error}
    </HelperText>
    </View>
  )
}

TextInput.defaultProps={
    textWrapperStyle: {},
    textStyle: {},
    inputStyle: {},
    borderColor: Colors.K200
}

const styles = StyleSheet.create({
    inputWrapper: {
        marginBottom: 20,
    },
    searchSection: {
        flexDirection:"row",
        alignSelf:"stretch",
        borderRadius: 50,
        padding: 10,
        paddingLeft: 20,
        borderWidth:1,
        fontSize:16
    },
    input: {
        paddingRight: 10,
        paddingLeft: 10,
        color: Colors.K600,
        width: "100%",
        fontSize:16
    }
})