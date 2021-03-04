import React, { useEffect, useState } from 'react'
import { TouchableWithoutFeedback, Keyboard, KeyboardEvent, ScrollView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { omit } from 'lodash';

export const useKeyboard = (): [boolean, number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)

  function onKeyboardDidShow(e: KeyboardEvent): void {
    setKeyboardHeight(e.endCoordinates.height);
    setIsKeyboardShow(true)
  }

  function onKeyboardDidHide(): void {
    setKeyboardHeight(0);
    setIsKeyboardShow(false)
  }

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return (): void => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  return [isKeyboardShow, keyboardHeight];
};

export default function KeyboardAware(props: { children:React.ReactNode, isScroll: boolean, extraScrollHeight?:number, onKeyboardWillShow?: ()=> void, onKeyboardWillHide?: (frames:any)=> void }) {
  const renderDismiss =() => (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss()
    }}> 
        {props.children}
      </TouchableWithoutFeedback>
  )
  return props.isScroll ? (
    <KeyboardAwareScrollView
      contentContainerStyle={{flex:1}}
      {...omit(props, "isScroll")}
    >
      <ScrollView
        scrollEventThrottle={16}
        style={{flex:1}}
      >
      {renderDismiss()}
      </ScrollView>
    </KeyboardAwareScrollView>
  ) : renderDismiss()
}

KeyboardAware.defaultProps={
  isScroll: false,
}
