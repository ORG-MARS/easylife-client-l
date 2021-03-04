import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { debounce } from 'lodash'
import { Colors } from '../constants'
import * as Icons from '../assets/icons'
import { View, Text} from './Themed'

interface DateTimePickerProps {
    onFocus?: () =>{ },
    onLayout?: (e:any) => void,
    placeholder: string,
    value: any,
    onChange: (date: any) => void
}
export default function CustomeDateTimePicker(props:DateTimePickerProps) {
    const [isShow, setIsShow] = useState(false)
    const focus = debounce(()=> props.onFocus && props.onFocus(),40)

  return (
    <View onLayout={props.onLayout}>
        <TouchableOpacity onPress={()=> {
            setIsShow(!isShow);
            if(!isShow){
              focus();
            } 
        }}>
        <View style={styles.pickerWrapper}>
            <View style={{flexDirection: "row"}}>
            <Icons.Clock color={Colors.Theme} width={20} height={20} />
            <Text style={styles.placeholder}>{props.placeholder}</Text>
            </View>
            {isShow? <Icons.ArrowUp color={Colors.K600} />: <Icons.ArrowDown color={Colors.K600} />}
        </View>
        </TouchableOpacity>
        {isShow && <DateTimePicker
            value={props.value}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={(_, date)=> {
              setIsShow(Platform.OS === 'ios');
              props.onChange(date);
            }}
            locale='zh-cn'
        />}
    </View>
  )
}
CustomeDateTimePicker.defaultProps={
    color:Colors.Theme,
}

const styles = StyleSheet.create({
    pickerWrapper:{
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingVertical:10,
      },
      placeholder:{
        color: Colors.K600,
        lineHeight:20,
        marginLeft:5
      },
      icon:{
        marginLeft: 10 
      }
})