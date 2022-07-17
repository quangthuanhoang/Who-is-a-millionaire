import React, {useEffect, useState} from "react";
import {TouchableOpacity, StyleSheet, Text, View, TextInput, ImageBackground, Image, Dimensions} from "react-native";
import {useNavigation} from '@react-navigation/native';
import {socket} from '../elements/Socket'

const windowWidth = Dimensions.get('window').width;
export default RoomWaiting = ({route}) => {
    const {roomCode: roomId} = route.params
    const startGame = () => {
        socket.emit("STARTGAME",roomCode)
        navigation.navigate("LineAnswers", {roomId})
    }
    socket.on("233", ({check, roomId}) => {
        if(check) {
            navigation.navigate("LineAnswers", {roomId})
        }
    })
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/imgs/background.jpg')} resizeMode="cover"
                             style={styles.image}>
                <Image
                    style={styles.logoImg}
                    source={require('../../assets/imgs/logo.png')}
                />

                <TouchableOpacity onPress={startGame}>
                    <ImageBackground source={require('../../assets/imgs/answer.png')} resizeMode="contain"
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoImg: {
        width: 300,
        height: 300
    },
    image: {
        flex: 1,
        alignItems: 'center'
    },

    buttonStyle: {
        width: windowWidth,
        height: 70
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
    answerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500'
    },
});