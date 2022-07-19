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
import Modal from "react-native-modal";
const windowWidth = Dimensions.get('window').width;
export default CreateRoom = () => {
  const [name, setName] = useState('');
  // const [roomCode, setRoomCode] = useState('');
  const [roomId, setRoomId] = useState('');
  //   const [roomCode, setRoomcCode] = useState('');r
  const navigation = useNavigation();
  //1. Tạo phòng
  socket.on('200', console.log);
  socket.on('210', ({roomId, user1}) => {
    navigation.navigate('RoomWaiting', {roomId});
  });
  // Thông báo có người chơi khác vào phòng
  socket.on('211', console.log);
  socket.on('220', console.log);


  //Theo dõi người chơi vào phòng
  const createRoom = () => {
    if(name) {
        socket.emit('CREATEROOM',name);
    }
    else {
        ToastAndroid.showWithGravity(
            "Vui lòng nhập đầy đủ thông tin",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
    }
  };

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
        <TextInput
          placeholderTextColor='white'
          style={{height: 60, borderBottomColor: '#ffffff', borderBottomWidth: 3, width: windowWidth*0.8, marginHorizontal: 10, marginVertical: 20, fontSize: 16, color: 'white'}}
          placeholder="Nhập định dang của bạn"
          onChangeText={newText => setName(newText)}
        />
        <TouchableOpacity onPress={createRoom}>
          <ImageBackground
            source={require('../../assets/imgs/button.png')}
            resizeMode="contain"
            style={styles.buttonStyle}>
            <View style={styles.answerStyle}>
              <Text style={styles.answerText}>Tạo phòng chơi mới</Text>
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
    fontWeight: '500',
  },
});
