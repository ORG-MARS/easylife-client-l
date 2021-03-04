import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu';

import { Colors } from '../constants';
import { getFooterPadding } from '../screens/utility/helper'

const { SlideInMenu } = renderers;

interface SlideupMenuProp {
    onPress: (value: string)=>void;
    options: {label:string, value: string}[];
    children: React.ReactNode;
    disabled?: boolean
}
const SlideupMenu = (props: SlideupMenuProp) => {
  return (
      <Menu name="numbers" renderer={SlideInMenu} onSelect={props.onPress}>
        <MenuTrigger customStyles={{
            TriggerTouchableComponent: TouchableWithoutFeedback,
        }} disabled={props.disabled}>
            {props.children}
        </MenuTrigger>
        {/* @ts-ignore */}
        <MenuOptions customStyles={{...optionsStyles, ...props.style}}>
            {props.options.map((e, index) => (
                <MenuOption key={e.value} value={e.value} text={e.label} style={index===0 && {borderTopLeftRadius:12, borderTopRightRadius:12}} />
            ))}
          <MenuOption value="cancel" text='取消' style={{marginTop:5, paddingBottom:getFooterPadding()}} />
        </MenuOptions>
      </Menu>
       
  );
}
SlideupMenu.defaultProps ={
  disabled: false
}
const optionsStyles = {
  optionsContainer: {
    backgroundColor: Colors.K200,
  },
  optionWrapper: {
    paddingVertical:15,
    borderBottomWidth: 1 ,
    borderBottomColor:Colors.K200,
    backgroundColor: Colors.white,
  },
  optionText: {
    fontSize:18,
    color: Colors.K950,
    textAlign: 'center'
  },
};
export default SlideupMenu