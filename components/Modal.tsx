import React, { createContext } from 'react'
import Modal from 'react-native-modal';
import { StyleSheet, View, TouchableHighlight, Text } from 'react-native'
import { Colors } from '../constants'

interface ModalProps {
    isVisible: boolean,
    onClose: ()=>void,
    style?: any,
    children?: React.ReactNode,
    isDialog?: boolean
}

interface ModalBodyProps {
  children?: React.ReactNode,
  style?: {}
}

interface ModalFooterProps {
  leftBtn: { title: string; onPress: ()=>void}
  rightBtn: { title: string; onPress: ()=>void}
}

const Context = createContext<{isDialog?:boolean; onClose?:()=>void}>({isDialog:false})

const ModalBody = (props: ModalBodyProps) => {
  return (
    <View style={[styles.modalContent, props.style]}>
      {props.children}
    </View>
  )
}

const ModalFooter = (props: ModalFooterProps) => {
  return (
    <View style={styles.modalFooter}>
      {
        props.leftBtn ? (
          <TouchableHighlight style={styles.button} onPress={props.leftBtn.onPress}>
            <Text style={styles.modalLeftText}>
              {props.leftBtn.title}
            </Text>
          </TouchableHighlight>
        ) : <View />
      }
      {
        props.rightBtn ? (
          <TouchableHighlight style={[styles.button, {backgroundColor: Colors.Theme}]} onPress={props.rightBtn.onPress}>
            <Text style={styles.modalRightText}>
              {props.rightBtn.title}
            </Text>
          </TouchableHighlight>
        ) : <View />
      }
    </View>
  )
}

export default function MyModal(props: ModalProps) {
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
      onBackButtonPress={props.onClose}
    >
      <Context.Provider value={{isDialog: props.isDialog, onClose: props.onClose}}>
        <View style={[styles.modal, { ...props.style, borderRadius: 20 }]}>
          {props.children}
          {props.isDialog && 
            <View style={styles.modalFooterDialog}>
              <TouchableHighlight style={[styles.button, {backgroundColor: Colors.Theme}]} onPress={props.onClose}>
                <Text style={styles.modalRightText}>确定</Text>
              </TouchableHighlight>
            </View>
          }
        </View>
      </Context.Provider>
    </Modal>
  )
}
MyModal.defaultProps={
    isVisible: false,
    isDialog: false,
    style: {}
}
ModalBody.defaultProps={
  style: {},
}
MyModal.Body = ModalBody
MyModal.Footer = ModalFooter

const styles = StyleSheet.create({
  modal:{
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 15,
    overflow: 'hidden'
  },
  modalContent: {
    padding: 20,
    paddingBottom: 15,
    width: '100%',
    alignItems: 'center'
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalFooterDialog: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: Colors.K300,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 50
  },
  modalLeftText:{
    color: Colors.white,
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold'
  },
  modalRightText:{
    color: Colors.white,
    lineHeight: 24,
    fontSize: 14,
    fontWeight: 'bold'
  }
})