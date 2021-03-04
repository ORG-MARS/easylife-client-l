import React, { useState, useEffect, useContext, useLayoutEffect, FC } from 'react';

import { Button, RefreshControl, Modal, ImagePreview } from '../../../components';
import { Image, View, Text, TouchableOpacity, FlatList, TouchableHighlight, ScrollView, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { TextInput } from 'react-native-gesture-handler';
import { styles, IconUrl} from './styles'
import { BottomTabParamList, Models, DEAL_STATUS } from '../../../types'
import * as Icons from '../../../assets/icons'
import Icon from 'components/Icon';

// 先暂时这样

export default function SettingScreen({ navigation }: StackScreenProps<BottomTabParamList>) {
    

    const configData = [
        {
            text: '更换头像',
            icon: 'touxiang',
            path: 'xxx'
        },
        {
            text: '修改昵称',
            icon: 'edit',
            path: 'Nickname'
        },
        {
            text: '清除缓存',
            icon: 'clear',
            path: 'xxx'
        },
        {
            text: '常见问题',
            icon: 'ques',
            path: 'xxx'
        },
        {
            text: '关于约定',
            icon: 'guanyu',
            path: 'About'
        },
        {
            text: '退出登录',
            icon: 'logout',
            path: 'xxx'
        }
    ]
    type ItemProps = Partial<(typeof configData)[0]>;
    const Item: FC<ItemProps> = (v) => {
        
        return (
            <TouchableOpacity 
                style={styles.itemBox}
                onPress={()=>{}}
            >
                <Image
                    style={styles.itemIcon}
                    source={(IconUrl as any)[v.icon]}
                />
                <View style={styles.iTextBox}>
                    <Text style={styles.iText}>{v.text}</Text>
                </View>
                <Image
                    style={styles.arrIcon}
                    source={require('../../../assets/images/profile/arr.png')}
                />
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>

            <View style={styles.barBox}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
                    <View style={styles.goback}>
                        <Icons.ArrowLeft width={10} height={20} color='#ffffff' />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitleStyle}>设置</Text>
                <View style={styles.cell}></View>
            </View>

            <View style={styles.mainBox}>
                <View style={styles.bitBox}>
                    <View style={styles.shadowLeft}></View>
                    <View style={styles.shadowBottom}></View>
                </View>

                <View style={styles.wrapBox}>
                    <View style={styles.shadowBox}>
                        {
                            configData.map((v, i) => <Item {...v} key={i}/>)
                        }
                    </View>
                </View>
            </View>

        </View>
    );
}


