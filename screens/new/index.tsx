import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { TabView, SceneMap, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Animated from 'react-native-reanimated';
import { StackScreenProps } from '@react-navigation/stack';

import NewOfferScreen from './NewOfferScreen';
import NewDealScreen from './NewDealScreen';
import { Colors } from '../../constants';
import * as Icons from '../../assets/icons';
import { RootStackParamList } from '../../types'

type Route = {
  key: string;
  title: string;
};

type State = NavigationState<Route>;

export default function NewTabs({ navigation, route }: StackScreenProps<RootStackParamList>) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'offer', title: '交易' },
    { key: 'deal', title: '约定' },
  ]);

  const renderScene = SceneMap({
    offer: () => <NewOfferScreen navigation={navigation} route={route} />,
    deal: () => <NewDealScreen navigation={navigation} route={route} />,
  });
  
  return (
    <NewDealScreen navigation={navigation} route={route} />
    // <TabView
    //   navigationState={{ index, routes }}
    //   renderTabBar={props => <RenderTabBar {...props} navigation={navigation} />}
    //   renderScene={renderScene}
    //   onIndexChange={setIndex}
    // />
  );
}

function RenderTabBar (props: SceneRendererProps & { navigationState: State, navigation: any}) {
    useLayoutEffect(() => {
        props.navigation.setOptions({
          headerRight: () => (
            <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
              <View style={{paddingHorizontal:10, backgroundColor:Colors.white}}>
                <Icons.CloseCircle color={Colors.Theme} />
              </View>
            </TouchableWithoutFeedback>
          ),
        });
      }, [props.navigation]);

  const renderItem =({
    navigationState,
    position,
  }: {
    navigationState: State;
    position: Animated.Node<number>;
  }) => ({ route, index }: { route: Route; index: number }) =>{
    const inputRange = navigationState.routes.map((_, i) => i);
  
    const activeOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 1 : 0)),
    });
    const inactiveOpacity = Animated.interpolate(position, {
      inputRange,
      outputRange: inputRange.map((i: number) => (i === index ? 0 : 1)),
    });
  
    return (
      <View style={styles.tab}>
        <Animated.View style={[styles.item, { opacity: inactiveOpacity }]}>
          <Text style={[styles.label, styles.inactive]}>{route.title}</Text>
        </Animated.View>
        <Animated.View
          style={[styles.item, styles.activeItem, { opacity: activeOpacity }]}
        >
          <Text style={[styles.label, styles.active]}>{route.title}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        <View style={styles.tabBarMenu}>
          {props.navigationState.routes.map((route: Route, index: number) => {
            return (
              <TouchableWithoutFeedback
                onPress={() => props.jumpTo(route.key)}
                key={route.key}
              >
                {renderItem(props)({ route, index })}
              </TouchableWithoutFeedback>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper:{
    backgroundColor: Colors.K100,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabBar: {
    flex:1,
    justifyContent:'center', 
    alignItems:'center', 
  },
  tabBarMenu: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: Colors.K200,
    borderRadius:50,
    margin: 10,
    width:"36%"
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  activeItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:Colors.white,
    borderRadius:50,
  },
  active: {
    color: Colors.Theme,
  },
  inactive: {
    color: Colors.K600,
  },
  label: {
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: 'transparent',
    fontSize: 14,
    fontWeight: '600',
  },
  addIcon:{
    paddingRight: 15,
    paddingTop: 15
  }
});
