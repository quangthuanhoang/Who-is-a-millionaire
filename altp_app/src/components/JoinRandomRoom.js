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
export default JoinRandomRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const navigation = useNavigation();
 

  useEffect(() => {
    socket.on("266", ({roomId, user1, user2}) => {
      navigation.navigate('RoomWaiting', {roomId, user1, user2});
    })
  }, [])
  useEffect(() => {
    socket.on("267", ({message}) => {
      ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    })
  }, [])
  const joinRandomRoom = () => {
   if(name) {
    socket.emit('JOINRANDOMROOM', name);
   }
   else {
    ToastAndroid.showWithGravity(
      "Vui lòng nhập đầy đủ thông tin",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
   }
  }

  return (
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
    <TouchableOpacity onPress={joinRandomRoom}>
      <ImageBackground
        source={require('../../assets/imgs/button.png')}
        resizeMode="contain"
        style={styles.buttonStyle}>
        <View style={styles.answerStyle}>
          <Text style={styles.answerText}>Vào phòng ngẫu nhiên</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  </ImageBackground>
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