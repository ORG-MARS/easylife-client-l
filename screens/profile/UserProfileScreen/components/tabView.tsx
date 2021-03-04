import * as React from 'react';
import { TabView, SceneMap , TabBar} from 'react-native-tab-view';
import { Image, View, Text, TouchableOpacity, FlatList, TouchableHighlight, ScrollView, SafeAreaView } from 'react-native';

import { styles } from './styles'


const Item = () => (
  <View style={styles.itemBox}>
    <Image
      style={styles.ipic}
      source={{
        uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
      }}
    />
    <View style={styles.irightBox}>
      <Text style={styles.iTxt}>每天一张产品图，提升自己的技巧，同时也能够提升我…</Text>
      <View style={styles.iDateBox}>
        <View style={styles.iDatePic}>
          <Image
            style={styles.idAvatar}
            source={{
              uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
            }}
          />
          <Image
            style={styles.idIcon}
            source={require('../../../../assets/images/profile/yd.png')}
          />
          <Image
            style={styles.idAvatar}
            source={{
              uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
            }}
          />
        </View>
        <Text style={styles.idTime}>2020.01.10</Text>
      </View>
    </View>
  </View>
)


const FirstRoute = () => (
  <View style={[styles.scene]}>
    <Item />
    <Item />
    <Item />
    <Item />
  </View>
);
const SecondRoute = () => (
  <View style={[styles.scene]}>
    <Item />
    <Item />
    <Item />
    <Item />
  </View>
);

const initialLayout = {};


export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: '已履行的约定' },
    { key: 'second', title: '未履行约定' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={props => 
        <TabBar 
          {...props} 
          style={styles.tabBar}
          indicatorStyle={styles.indicatorStyle}
          labelStyle={styles.labelStyle}
          activeColor={'#77C998'}
          inactiveColor={'#AAAAAA'}
        />
      }
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}
