import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Image,
  Dimensions,
  ToastAndroid
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {socket} from '../elements/Socket';

const windowWidth = Dimensions.get('window').width;
export default RoomWaiting = ({route}) => {
  let {roomId} = route.params
  const [user1, setUser1] = useState(route.params.user1)
  const [user2, setUser2] = useState(route.params.user2)
  const navigation = useNavigation();
  useEffect(() => {
    socket.on('215', ({roomId: r, user2, user1}) => {
      roomId = r;
      setUser2(user2)
      setUser1(user1)
      ToastAndroid.showWithGravity(
        "Đã có người chơi vào phòng",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    });
  }, [])
  useEffect(() => {
    socket.on('777', ({roomId}) => {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    });
  }, [])
  const startGame = () => {
    socket.emit('STARTGAME', roomId);
  };
  socket.on('233', data => {
    navigation.navigate('LineAnswers', {roomId});
  });
useEffect(() => {
  socket.on('239', data => {
    ToastAndroid.showWithGravity(
      "Chưa đủ người chơi",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  });

}, [])
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/imgs/background.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <Image
          style={styles.logoImg}
          source={require('../../assets/imgs/logo.png')}
        />
        <ImageBackground
           style={styles.logoImgInfor}
           resizeMode="contain"
           source={require('../../assets/imgs/result.png')}
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
                <View>
                  <Text style={styles.textTitleNote2}>Mã phòng: <Text style={styles.textTitle}>{roomId}</Text></Text>
                  { user1 ? <View>
                    <Text style={styles.answerText}>Người chơi 1: {user1.name}</Text>
                    <Text style={styles.answerText}>Người chơi 2: {user2.name}</Text> 
                  </View>: <Text style={styles.textTitleNote}>Trò chơi có thể bắt đầu khi có đủ 2 người chơi</Text>}
                </View>
              </View>
        </ImageBackground>
        <TouchableOpacity onPress={startGame}>
          <ImageBackground
            source={require('../../assets/imgs/answer.png')}
            resizeMode="contain"
            style={styles.buttonStyle}>
            <View style={styles.answerStyle}>
              <Text style={styles.answerText}>Bắt đầu trò chơi</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoImg: {
    width: 300,
    height: 300,
  },
  image: {
    flex: 1,
    alignItems: 'center',
  },

  buttonStyle: {
    width: windowWidth,
    height: 70,
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
  answerText: {
    color: 'white',
    fontSize: 16,
  },
  logoImgInfor: {
    width: 250,
    height: 150,
  },

  textTitle: {
    color: '#df7821', fontSize: 22, fontWeight: 'bold', textAlign: 'center', fontStyle: 'italic'
  },
  textTitleNote: {
    color: 'white', fontSize: 14, textAlign: 'center',fontStyle: 'italic', padding: 5
  },
  textTitleNote2: {
    color: 'white', fontSize: 20, textAlign: 'center'
  }
});