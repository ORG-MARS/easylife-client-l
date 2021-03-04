import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';

import { Button, RefreshControl, Modal, ImagePreview } from '../../../components';
import { Image, View, Text, TouchableOpacity, FlatList, TouchableHighlight, ScrollView, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';
import { styles } from './styles'
import { BottomTabParamList, Models, DEAL_STATUS } from '../../../types'
import * as Icons from '../../../assets/icons'
import TabView from './components/tabView'

export default function UserProfileScreen({ navigation }: StackScreenProps<BottomTabParamList>) {
    
    return (

        <View style={styles.container}>
            <View style={styles.bitBox}>
                <View style={styles.shadowLeft}></View>
                <View style={styles.shadowBottom}></View>
            </View>
            <View style={styles.mainBox}>
                <View style={styles.wrapBox}>
                    <View style={styles.avatarBox}>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                            }}
                        />
                    </View>
                    <View style={styles.userInfoP}>
                        <Text style={styles.userName} >Timo</Text>
                        <View style={styles.userTag}>
                            <Image
                                style={styles.super}
                                source={require('../../../assets/images/profile/xunzhang.png')}
                            />
                            <Text style={styles.userTagTxt}>超级守信</Text>
                        </View>
                    </View>
                    <View style={styles.userDeal}>
                        <View style={styles.udSpan}>
                            <Text style={styles.udNum}>199</Text>
                            <Text style={styles.udText}>约定</Text>
                        </View>
                        <View style={styles.udSpan}>
                            <Text style={styles.udNum}>199</Text>
                            <Text style={styles.udText}>交易</Text>
                        </View>
                    </View>
                    <Text style={styles.signature}>个性签名：努力学习，天天向上，考研成功！</Text>
                    <TouchableOpacity style={styles.addBtnBox}>
                        <Image
                            style={styles.addIcon}
                            source={require('../../../assets/images/profile/add.png')}
                        />
                        <Text style={styles.addText}>添加好友</Text>
                    </TouchableOpacity>
                    <View style={styles.tabViewBox}>
                        <TabView />
                    </View>
                </View>
            </View>
        </View>
    );
}