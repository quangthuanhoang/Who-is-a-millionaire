import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, TextInput } from "react-native";
import io from "socket.io-client";

export default HomeScreen = () => {
    const [roomCode, setRoomCode] = useState('');
    const [question, setQuestion] = useState('')
    const [msg, setMsg] = useState('');
    const socket = io("http://192.168.40.122:3000")
    //1. Tạo phòng
    socket.on("200", console.log)
    socket.on("210", console.log)
    // Thông báo có người chơi khác vào phòng
    socket.on("211", data => {
        setMsg(data)
    })
    socket.on("220", console.log)
    socket.on("question", data => {
       setQuestion(data)
    })
    const createRoom = () => {
       socket.emit('CREATEROOM')
    }
    const joinRoom = () => {
        socket.emit('JOINROOM', roomCode)
     }
    const startGame = () => {
        socket.emit("STARTGAME")
    }
    useEffect(() => {
         socket.on("msg", msg => {
          console.log('Chuyeejn la VN', msg);
      })
    }, [])

    return (
      <View style={styles.container}>
       <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={newText => setRoomCode(newText)}
      />
       <TouchableOpacity onPress={createRoom} style={{backgroundColor: 'green', padding: 10}}><Text>Tạo phòng</Text></TouchableOpacity>
       <TouchableOpacity onPress={joinRoom} style={{backgroundColor: 'pink', padding: 10}}><Text>Vào phòng</Text></TouchableOpacity>
       <Text>{msg}</Text>
       <TouchableOpacity onPress={startGame} style={{backgroundColor: 'pink', padding: 10}}><Text>Bắt đầu chơi</Text></TouchableOpacity>
       <Text>{question.question}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
      justifyContent: 'center',
      alignItems: 'center'
  }
});