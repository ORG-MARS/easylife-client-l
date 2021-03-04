import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';

import { Text } from '../components'
import { Colors } from '../constants'

interface CommentEditMenuProps {
    isVisible: boolean;
    onClose:()=>void; 
    onDelete: ()=>Promise<void>;
}

const CommentEditMenu = ({isVisible, onClose, onDelete}:CommentEditMenuProps) =>{
    return (
        <Modal
          isVisible={isVisible}
          onBackdropPress={onClose}
          style={styles.editThreadModal}
        >
            <View style={styles.editThreadcontent}>
              <TouchableWithoutFeedback onPress={onDelete}>
                <View style={styles.editThreadOption}>
                  <Text style={styles.editThreadOptionText}>删除评论</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={onClose}>
                <View>
                <Text style={[styles.editThreadOptionText, {color:Colors.R500}]}>取消</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    editThreadModal:{
        justifyContent: 'flex-end',
        margin: 0,
      },
      editThreadcontent:{
        backgroundColor: Colors.white,
        paddingTop: 10,
        paddingHorizontal: 10,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        flexDirection: 'column',
        paddingBottom: 10
      },
      editThreadOption: {
        borderColor: Colors.K200,
        borderBottomWidth: 1
      },
      editThreadOptionText:{
        paddingVertical: 10,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.K950,
      }
  });

  export default CommentEditMenu;