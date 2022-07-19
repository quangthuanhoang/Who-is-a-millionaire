import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import {socket} from '../elements/Socket';
import {useNavigation} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default LineAnswers = ({route}) => {
  const [question, setQuestion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [count, setCount] = useState(15);
  const [notify, setNotify] = useState('');
  const [roomId, setRoomId] = useState('');
  const [user1, setUser1] = useState({});
  const [user2, setUser2] = useState({});
  const navigation = useNavigation();
  socket.on('question', ({question, time, roomId: r, user1, user2}) => {
    if (question) {
      question.content.forEach(item => {
        item.select = false;
      });
      setQuestion(question);
      setQuestionIndex(question.index);
      setCount(time);
      setRoomId(r);
      setUser1(user1);
      setUser2(user2);
    }
  });
  useEffect(() => {
    socket.on('end', ({notify, user1, user2}) => {
      setNotify(notify);
      console.log('Jeets thuc roi');
      navigation.navigate('Result', {user1, user2});
    });
  }, []);

  const handleClick = () => {
    const timer = setInterval(() => {
      if (!notify) {
        setCount(prevCount => prevCount - 1);
      } else {
        setCount(0);
      }
    }, 1000);
  };
  useEffect(() => {}, [user2]);
  useEffect(() => {}, [user1]);
  useEffect(() => {
    handleClick();
  }, []);
  function answerQuestion(idx) {
    const {index} = question;
    socket.emit('ANSWER', {userAnswer: idx, roomId, indexQuestion: +index + 1});
  }

  useEffect(() => {
    socket.on('230', ({user1, user2}) => {
      setUser2(user2);
      setUser1(user1);
    });
  }, []);
  return (
    <>
      {question?.content ? (
        <View style={styles.container}>
          <ImageBackground
            source={require('../../assets/imgs/background.jpg')}
            resizeMode="cover"
            style={styles.image}>
           <View style={{paddingTop:40, paddingBottom: 40}}>
           <ImageBackground
              style={styles.logoImgInfor}
              resizeMode="contain"
              source={require('../../assets/imgs/infor.png')}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                 <View style={{paddingHorizontal: 20}}>
                 <Text style={styles.questionNumber}>Bạn</Text>
                 <Text style={{color: '#df7821', fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
                  {user1.score}
                  </Text>
                 </View>
                 <View style={{paddingHorizontal: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                 <Text style={styles.questionNumber}>Đối thủ</Text>
                 <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>
                   {user2.score}
                  </Text>
                 </View>
                
            </View>
              </View>
            </ImageBackground>
           <View style={{position: 'absolute',right: -45, bottom: 10}}>
           <ImageBackground
              style={styles.logoImg1}
               resizeMode="cover"
              source={require('../../assets/imgs/time.png')}
            >
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  }}>
                  <Text style={styles.time}>{count}</Text>
                </View>
            </ImageBackground>
           </View>
         
            </View>
            <View style={styles.container2}>
              <ImageBackground
                source={require('../../assets/imgs/number.png')}
                resizeMode="contain"
                style={styles.Number}>
                <View
                  style={{
                    position: 'absolute',
                    top: -15,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.questionNumber}>
                    Câu hỏi {+questionIndex + 1}
                  </Text>
                </View>
              </ImageBackground>
              <ImageBackground
                source={require('../../assets/imgs/question.png')}
                resizeMode="contain"
                style={styles.question}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <Text style={styles.textQuestion}>{question.question}</Text>
                </View>
              </ImageBackground>
              {question.content.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      answerQuestion(index);
                    }}>
                    <ImageBackground
                      source={
                        item.select
                          ? require('../../assets/imgs/answer_select.png')
                          : require('../../assets/imgs/answer.png')
                      }
                      resizeMode="contain"
                      style={styles.logoImg}>
                      <View style={styles.label}>
                        <Text style={styles.labelText}>
                          {index === 0
                            ? `A.`
                            : index === 1
                            ? `B.`
                            : index === 2
                            ? `C.`
                            : `D.`}
                        </Text>
                      </View>
                      <View style={styles.answerStyle}>
                        <Text style={styles.answerText}>{item}</Text>
                      </View>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ImageBackground>
        </View>
      ) : (
        <Text>Hiện tại chưa bắt đầu</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImg1: {
    width: 100,
    height: 100,
  },
  logoImgInfor: {
    width: 250,
    height: 150,
  },
  image: {
    flex: 1,
    alignItems: 'center',
  },
  container2: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: windowWidth,
    height: 70,
  },
  question: {
    width: windowWidth,
    height: 100,
  },
  Number: {
    width: windowWidth,
    height: 50,
    position: 'absolute',
    top: -30,
    left: -60,
  },
  textQuestion: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
  },
  label: {
    position: 'absolute',
    top: 0,
    left: 95,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  answerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    color: 'yellow',
    fontSize: 17,
    fontWeight: '500',
  },
  answerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  questionNumber: {
    color: 'white',
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center'
  },
  time: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
});
