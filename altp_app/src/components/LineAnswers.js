import React, {useEffect, useState} from "react";
import {ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image} from "react-native";
import {socket} from '../elements/Socket'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default LineAnswers = ({route}) => {
    const {roomId} = route.params
    const [question, setQuestion] = useState({})
    const [questionIndex, setQuestionIndex] = useState(0)
    const [count, setCount] = useState(15);
    const [notify, setNotify] = useState('');
    socket.on("question", ({question, currentIndex, time}) => {
        if(question) {
            question.content.forEach(item => {
                item.select = false
            })
            setQuestion(question)
            setQuestionIndex(currentIndex)
            setCount(time)

        }
    })
    socket.on("end", ({notify}) => {
        setNotify(notify)
    })
    const handleClick = () => {
        setInterval(() => {
          if(!notify) {
            setCount(prevCount => prevCount - 1);
          }
          else {
            setCount(0)
          }
        }, 1000);
      }
    useState(() => {
        handleClick()
    }, [])
    function answerQuestion(idx) {
        console.log('idx', idx, route.params)
        socket.emit('ANSWER', {userAnswer: idx, roomId})
        socket.on("230", console.log)
    }

    return (
        <>
            {question?.content ? <View style={styles.container}>
                <ImageBackground source={require('../../assets/imgs/background.jpg')} resizeMode="cover"
                                 style={styles.image}>
                    <Image
                        style={styles.logoImg1}
                        source={require('../../assets/imgs/logo.png')}
                    />
                    <View style={styles.container2}>
                        <ImageBackground source={require('../../assets/imgs/number.png')} resizeMode="contain"
                                         style={styles.Number}>
                            <View style={{
                                position: 'absolute',
                                top: -10,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.questionNumber}>Câu hỏi {questionIndex}</Text>
                            </View>

                            <View style={{
                                position: 'absolute',
                                top: -10,
                                left: 230,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.questionNumber}>Thời gian: {count}</Text>
                            </View>
                            <View style={{
                                position: 'absolute',
                                top: -10,
                                left: 430,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={styles.questionNumber}>{notify}</Text>
                            </View>
                        </ImageBackground>
                        <ImageBackground source={require('../../assets/imgs/question.png')} resizeMode="contain"
                                         style={styles.question}>
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 10
                            }}>
                                <Text style={styles.textQuestion}>{question.question}</Text>
                            </View>
                        </ImageBackground>
                        {question.content.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        answerQuestion(index)
                                    }
                                    }>
                                    <ImageBackground
                                        source={item.select ? require('../../assets/imgs/answer_select.png') : require('../../assets/imgs/answer.png')}
                                        resizeMode="contain" style={styles.logoImg}>
                                        <View style={styles.label}>
                                            <Text
                                                style={styles.labelText}>{index === 0 ? `A.` : (index === 1 ? `B.` : (index === 2 ? `C.` : `D.`))}</Text>
                                        </View>
                                        <View style={styles.answerStyle}>
                                            <Text style={styles.answerText}>{item}</Text>
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ImageBackground>
            </View> : <Text>Khoong co clg</Text>}
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImg1: {
        width: 300,
        height: 300
    },
    image: {
        flex: 1,
        alignItems: 'center'
    },
    container2: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoImg: {
        width: windowWidth,
        height: 70
    },
    question: {
        width: windowWidth,
        height: 100
    },
    Number: {
        width: windowWidth,
        height: 50,
        position: 'absolute',
        top: -30,
        left: -60
    },
    textQuestion: {
        padding: 10,
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        fontWeight: '500'
    },
    label: {
        position: 'absolute',
        top: 0,
        left: 50,
        right: 0,
        bottom: 0,
        justifyContent: 'center'
    },
    answerStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    labelText: {
        color: 'yellow',
        fontSize: 17,
        fontWeight: '500'
    },
    answerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    },
    questionNumber: {
        color: 'white',
        fontSize: 17,
        fontWeight: '500'
    }
});