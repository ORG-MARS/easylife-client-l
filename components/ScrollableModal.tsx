import React, { useState, useRef } from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import Modal from 'react-native-modal';
import { Colors } from '../constants';

interface ScrollableModalProps  {
  isVisible: boolean,
  onClose: ()=>void,
  style?: any,
  children?: React.ReactNode,
};

const ScrollableModal = (props:ScrollableModalProps) => {
    const scrollViewRef = useRef()
    const [scrollOffset, setScrollOffset] = useState()

  function handleOnScroll (event: any) {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  function handleScrollTo(p: number){
    if (scrollViewRef.current) {
      // @ts-ignore
      scrollViewRef.current.scrollTo(p);
    }
  };

    return (
      <Modal
        testID={'modal'}
        isVisible={props.isVisible}
        onSwipeComplete={props.onClose}
        swipeDirection={['down']}
        scrollTo={handleScrollTo}
        scrollOffset={scrollOffset}
        scrollOffsetMax={400 - 300}
        propagateSwipe={true}
        style={styles.modal}
        backdropOpacity={0}
      >
        <View style={styles.scrollableModal}>
          <ScrollView
            // @ts-ignore
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={16}
          >
            {props.children}
          </ScrollView>
        </View>
      </Modal>
    );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  scrollableModal: {
    height: 400,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.50,
    shadowRadius: 30.50,
    // Android
    elevation: 32,
  },
});

export default ScrollableModal;
