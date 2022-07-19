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
  const navigation = useNavigation();
  socket.on('215', ({roomId: r}) => {
    roomId = r;
  });
  const startGame = () => {
    socket.emit('STARTGAME', roomId);
  };
  socket.on('233', data => {
    navigation.navigate('LineAnswers', {roomId});
  });
  socket.on('239', data => {
    ToastAndroid.showWithGravity(
      "Chưa đủ người chơi",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  });
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

        <View>
          <Text>Người chơi 1</Text>
        </View>
        <View>
          <Text>Người chơi 2</Text>
        </View>
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
    fontWeight: '500',
  },
});