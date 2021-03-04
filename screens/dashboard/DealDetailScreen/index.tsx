import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';

import { Button, RefreshControl, Modal, ImagePreview } from '../../../components';
import { Image, View, Text, TouchableOpacity, FlatList, TouchableHighlight, ScrollView, SafeAreaView} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';
import { styles } from './styles'
import { BottomTabParamList, Models, DEAL_STATUS } from '../../../types'
import * as Icons from '../../../assets/icons'

export default function DealDetailScreen({ navigation }: StackScreenProps<BottomTabParamList>) {
    return (
        // <SafeAreaView style={styles.container}>


        <View style={styles.container}>
            <ScrollView>

            <View style={styles.barBox}>
                <TouchableOpacity onPress={()=>{
                        navigation.goBack()
                }}>
                    <View style={styles.goback}>
                        <Icons.ArrowLeft width={10} height={20} color='#ffffff' />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitleStyle}>约定</Text>
                    <TouchableOpacity style={styles.checkHistory} onPress={() => {
                        navigation.navigate('UserProfile')
                    }}>
                        <Text style={styles.checkHistoryText}>查看对话</Text>
                    </TouchableOpacity>
            </View>

            {/* <FlatList> */}

                <View style={styles.mainBox}>
                    <View style={styles.bitBox}>
                        <View style={styles.shadowLeft}></View>
                        <View style={styles.shadowBottom}></View>
                    </View>
                     
                    <View style={styles.wrapBox}>
                        <View style={styles.agreeBox}>
                            <View style={[styles.agBrief, styles.directionRow]}>
                                <Image
                                    style={styles.ags}
                                    source={require('../../../assets/images/dashboard/yd_5.png')}
                                />
                                <TouchableOpacity 
                                    style={styles.agPicBox}
                                    onPress={() => {
                                    navigation.navigate('UserProfile')
                                }} >
                                    <Image
                                        style={[styles.agpic, styles.agpicLeft]}
                                        source={{
                                            uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                        }}
                                    />
                                    <View style={[styles.agTextLeft, styles.agsfBox]}>
                                        <Text style={[styles.agsf]} >一起画画啊</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.agPicBox}
                                    onPress={() => {
                                        navigation.navigate('UserProfile')
                                    }} >
                                    <View style={[styles.agTextRight, styles.agsfBox]}>
                                        <Text style={[styles.agsf]} >约定进行中</Text>
                                    </View>
                                    <Image
                                        style={[styles.agpic, styles.agpicRight]}
                                        source={{
                                            uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.agBit}>
                                <Image
                                    style={styles.agBitPic}
                                    source={{
                                        uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                    }}
                                />
                                <Text style={styles.agBitTxt} numberOfLines={1} ellipsizeMode={'tail'}>jom：今日目标已完成</Text>
                                <Text style={styles.time} >12:12</Text>
                                <Image
                                    style={styles.check}
                                    source={require('../../../assets/images/dashboard/lujing.png')}
                                />
                            </View>
                            <Text style={styles.agText}>111每天一张产品图，提升自己的技巧，同时也能够提升我的画画速度简直太妙了，加油冲呀。</Text>
                            <View style={styles.agImgBox}>
                                <Image
                                    style={styles.agShowPic}
                                    source={{
                                        uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                    }}
                                />
                                <Image
                                    style={styles.agShowPic}
                                    source={{
                                        uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                    }}
                                />
                                <Image
                                    style={styles.agShowPic}
                                    source={{
                                        uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                    }}
                                />
                            </View>
                            <View style={styles.hr2}></View>
                            <View style={styles.agPop}>
                                <Text style={styles.agPopNum} >点赞999+</Text>
                                <Text style={[styles.agPopNum, styles.agPopPl]} >评论999+</Text>
                            </View>
                            <View >
                                <View style={styles.comLi}>
                                    <Image
                                        style={styles.clPic}
                                        source={{
                                            uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                        }}
                                    />
                                    <View style={styles.clRightBox}>
                                        <View style={styles.clBit}>
                                            <Text style={styles.clName}>啦啦</Text>
                                            <Text style={styles.clTime}>2020.01.10</Text>
                                        </View>
                                        <Text style={styles.clText}>敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。</Text>
                                    </View>
                                </View>
                                <View style={styles.comLi}>
                                    <Image
                                        style={styles.clPic}
                                        source={{
                                            uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                        }}
                                    />
                                    <View style={styles.clRightBox}>
                                        <View style={styles.clBit}>
                                            <Text style={styles.clName}>tim</Text>
                                            <Text style={styles.clTime}>2020.01.10</Text>
                                        </View>
                                        <Text style={styles.clText}>敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。敢问大神你们是如何坚持到现在的。</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

            {/* </FlatList> */}
            
            </ScrollView>
            <Button
                onPress={() => { }}
                style={styles.btmBtn}
                title='提交' />
        </View>
        // </SafeAreaView>
    );
}


