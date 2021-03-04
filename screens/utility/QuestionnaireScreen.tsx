import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import axios from 'axios'

import { View, Text, Button, CheckBox } from '../../components';
import { RootStackParamList } from '../../types'
import { AuthContext, AuthTypes } from '../../reducers/AuthReducer' 
import { Colors, API } from '../../constants';
import * as Icons from '../../assets/icons'
import { getHeaderPadding } from './helper'
import { Models } from '../../types'

const QuestionCard = ({question, onClick}:{question: Models.Question, onClick: (questionId:number, answerId: number)=>void}) => {
    const [selected, setSelected] = useState<Number>()
    const [p1, p2, p3, p4] = question.questionnaireanswer_set

    return (
        <View>
            <View style={{ flexDirection:'row'}}>
                <View style={{ paddingVertical:10, paddingLeft:8, paddingRight:20, borderColor: Colors.Theme, borderWidth: 1, borderRadius: 50, marginVertical:10}}>
                    <Text >{question.question}</Text>
                </View>
            </View>
            <View style={{ flexDirection:'row'}}>
                {[p1, p2].map((answer: Models.QuestionAnswer)=>(
                    <CheckBox
                        style={styles.term}
                        onClick={()=>{
                            setSelected(answer.id)
                            onClick(question.id, answer.id);
                        }}
                        isChecked={selected === answer.id}
                        text={answer.answer}
                    />
                ))}
            </View>
            <View style={{ flexDirection:'row'}}>
                {[p3, p4].map((answer: Models.QuestionAnswer)=>(
                    <CheckBox
                        style={styles.term}
                        onClick={()=>{
                            setSelected(answer.id)
                            onClick(question.id, answer.id);
                        }}
                        isChecked={selected === answer.id}
                        text={answer.answer}
                    />
                ))}
            </View>
        </View>
    )
}

const QuestionnaireScreen = ({ navigation, route }: StackScreenProps<RootStackParamList>) => {
  const { state: userState, dispatch: userDispatch } = useContext(AuthContext);
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [rightMargin, setRightMargin] = useState(0)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState<{question:number,answer:number, user?:number}[]>([])
  const [error, setError] = useState('')

    useEffect(()=>{
       getQuestions() 
    },[])

    async function getQuestions(){
        const res = await axios.get(`${API}/questions/`)
        setQuestions(res.data)
    }

    function onChange (questionId:number, answerId:number) {
        const newAnswers = [...answers]
        const updateIndex = newAnswers.findIndex(e=> e.question === questionId)
        const updateData = { 
            question: questionId, 
            answer: answerId, 
            user: userState.user?.user_id
        }
        if(updateIndex>-1){
            newAnswers[updateIndex] = updateData
        }else{
            newAnswers.push(updateData)
        }
        setAnswers(newAnswers)
    }

  async function createQuestionnaire(result:any){
    if(answers.length < questions.length){
        setError("请完成问卷～")
        return
    }
    try{
        setIsSubmiting(true)
        await axios.post(`${API}/user-question/`,answers)
        // update user config
        const res = await axios.patch(`${API}/user-config/${userState.user?.user_config?.id}/`,{
            is_quentionnaire_answered: true
        })
        // @ts-ignore
        userDispatch({type: AuthTypes.SET_STATE, payload: { user: {...userState.user, user_config: {...res.data}} } })
        setAnswers([])
        setError('')
        navigation.goBack()
        setIsSubmiting(false)
    }catch(err) {
        setIsSubmiting(false)
        setError("提交有错误，请稍后再试。")
    }
  }

  return (
        <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity  onPress={() => navigation.goBack()}>
                <View style={styles.close} onLayout={(event) => {
                    var {x, y, width, height} = event.nativeEvent.layout;
                    setRightMargin(width+5)
                }}>
                    <Icons.ArrowLeft width={24} height={24} color={Colors.K950} />
                </View>
            </TouchableOpacity>
            <View style={[{ marginRight: rightMargin }, styles.headerTitle]}>
                <Text style={{textAlign:'center', fontSize: 18, fontWeight:'500', color: Colors.K900}}>问卷调查</Text>
            </View>
        </View>
        <View style={styles.content}>
            <View style={styles.form}>
                {questions.map((question: Models.Question, index) => (
                <QuestionCard key={`question-${question.id}`} question={question} onClick={onChange} />
                ))}
            </View>
        </View>
        <View style={styles.footer}>
            <Text style={styles.tip}>如有任何问题可发送邮件到 support@yuedingyixia.com</Text>
            <Button title="提交" onPress={createQuestionnaire} style={styles.submit} isLoading={isSubmiting} />
            <Text style={styles.errorText}>{error}</Text>
        </View>
        </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height
  },
  content: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,
    elevation: 13,
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'flex-start',
    paddingTop: getHeaderPadding(),
    paddingBottom: 5
  },
  headerTitle:{
    flex: 1,
    height: 30,
    marginVertical:10,
    justifyContent:'center',
  },
  close: {
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  form: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  term:{
    alignItems: 'center',
    width:'50%',
    flexDirection: 'row',
    marginTop: 5,
  },
  footer:{
    margin: 20
  },
  submit: {
    marginTop: 20
  },
  tip:{
    fontSize:14, 
    textAlign:'center', 
    color: Colors.K400
  },
  errorText: {
    marginTop: 5,
    color: Colors.R500,
    textAlign:'center',
    fontSize:14,  
    height: 20
  },
});

export default QuestionnaireScreen