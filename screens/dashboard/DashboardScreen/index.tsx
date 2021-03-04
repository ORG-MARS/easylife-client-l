import * as React from 'react';
import { RefreshControl, Modal, ImagePreview } from '../../../components';
import { Button, Image, View, Text, TouchableWithoutFeedback} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { styles } from './styles'
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, Models, DEAL_STATUS } from '../../../types'
import { dateFormat } from '../../utility/helper'

export default function TabOneScreen({ navigation }: StackScreenProps<BottomTabParamList>) {

    return (
        <View style={styles.container}>
            <View style={styles.barBox}>
                <View style={[styles.barInnerBox, styles.directionRow]} >
                    <Image
                        style={styles.logo}
                        source={require('../../../assets/images/dashboard/logo.png')}
                    />
                    <View style={[styles.searchBar, styles.directionRow]} >
                        <Image
                            style={styles.searchIcon}
                            source={require('../../../assets/images/dashboard/sousuo.png')}
                        />
                        <TextInput
                            style={styles.input}
                        />
                        {/* <Button style={styles.searchButton} textStyle={styles.textStyle} outline title="搜索" onPress={onPressLearnMore} /> */}
                    </View>
                </View>
            </View>
            <View style={styles.bitBox}>
                <View style={styles.shadowLeft}></View>
                <View style={[styles.numBox, styles.directionRow]}>
                    <Text style={styles.numText} >22</Text>
                    <Text style={styles.numText} >2222</Text>
                    <Text style={styles.numText} >{dateFormat(+new Date, 'yyyy.MM.dd')}</Text>
                </View>
                <View style={[styles.cellBox, styles.directionRow]}>
                    <View style={styles.cell}>
                        <View style={styles.imgCell}>
                            <Image
                                style={styles.peNumIcon}
                                source={require('../../../assets/images/dashboard/chengyuan.png')}
                            />
                        </View>
                        <Text style={styles.cellText}>注册总人数</Text>
                    </View>
                    <View style={styles.cell}>
                        <View style={styles.imgCell}>
                            <Image
                                style={styles.bitebiIcon}
                                source={require('../../../assets/images/dashboard/bitebi.png')}
                            />
                        </View>
                        <Text style={styles.cellText} >币池数量</Text>
                    </View>
                    <View style={styles.cell}>
                        <View style={styles.imgCell}>
                            <Image
                                style={styles.dateIcon}
                                source={require('../../../assets/images/dashboard/date.png')}
                            />
                        </View>
                        <Text style={styles.cellText} >日期</Text>
                    </View>
                </View>
            </View>
            <View style={styles.mainBox}>
                {/* <Button
                    onPress={() =>
                        navigation.navigate('DealDetail', { names: ['Brent', 'Satya', 'Michaś'] })
                    }
                    title="Go to Brent's profile"
                /> */}
                <View style={styles.agreeBox}>

                    <TouchableWithoutFeedback onPress={()=>{
                        navigation.navigate('DealDetail', { names: ['Brent', 'Satya', 'Michaś'] })
                    }}>
                        <View>
                    <View style={[styles.agBrief, styles.directionRow]}>
                        <Image
                            style={styles.ags}
                            source={require('../../../assets/images/dashboard/yd_5.png')}
                        />
                        <View style={styles.agPicBox}>
                            <Image
                                style={[styles.agpic, styles.agpicLeft]}
                                source={{
                                    uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                }}
                            />
                            <View style={[styles.agTextLeft, styles.agsfBox]}>
                                <Text style={[styles.agsf]} >一起画画啊</Text>
                            </View>
                        </View>
                        <View style={styles.agPicBox}>
                            <View style={[styles.agTextRight, styles.agsfBox]}>
                                <Text style={[styles.agsf]} >约定进行中</Text>
                            </View>
                            <Image
                                style={[styles.agpic, styles.agpicRight]}
                                source={{
                                    uri: 'http://yue05.sogoucdn.com/cdn/image/book/13241867048_1605693653766.jpg'
                                }}
                            />
                        </View>
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
                    <Text style={styles.agText}>每天一张产品图，提升自己的技巧，同时也能够提升我的画画速度简直太妙了，加油冲呀。</Text>
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
                        </View>
                    </TouchableWithoutFeedback>

                    <View style={styles.agPop}>
                        <Image
                            style={[styles.agPopIcon, styles.l150]}
                            source={require('../../../assets/images/dashboard/dianzan.png')}
                        />
                        <Text style={styles.agPopNum} >999+</Text>
                        <Image
                            style={[styles.agPopIcon, styles.l45]}
                            source={require('../../../assets/images/dashboard/pinglun.png')}
                        />
                        <Text style={styles.agPopNum} >999+</Text>
                    </View>

                </View>
            </View>
                        
            
            

        </View>
    );
}


