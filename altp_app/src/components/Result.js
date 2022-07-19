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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {socket} from '../elements/Socket';

const windowWidth = Dimensions.get('window').width;
export default Result = ({route}) => {
  const {user1, user2} = route.params;
  const navigation = useNavigation()
  const goBackHome = () => {
    navigation.navigate("HomeScreen")
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/imgs/background.jpg')}
        resizeMode="cover"
        style={styles.image}>
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View style={{paddingHorizontal: 20}}>
                    <Text style={styles.answerText}>Người chiến thắng</Text>
                    <Text style={{color: '#df7821', fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>{user1.score > user2.score ? user1.score : user2.score} điểm</Text>
                    <Text style={{color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>{user1.score > user2.score ? user1.name : user2.name}</Text>
                  </View>
                
            </View>
              </View>
        </ImageBackground>

        <Text style={styles.answerTextTitle}>THÔNG TIN TRẬN ĐẤU</Text>
        <Text style={styles.answerText}>
          {user1.name}: {user1.score} điểm
        </Text>
        <Text style={styles.answerText}>
          {user2.name}: {user2.score} điểm
        </Text>
      
        <TouchableOpacity onPress={goBackHome}>
          <ImageBackground
            source={require('../../assets/imgs/button.png')}
            resizeMode="contain"
            style={styles.buttonStyle}>
            <View style={styles.answerStyle}>
              <Text style={styles.answerTextTitle}>Quay lại trang chủ</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoImg: {
    width: 300,
    height: 300,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonStyle: {
    width: windowWidth*0.8,
    height: 80,
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
    fontStyle: 'italic'
  },
  answerTextTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoImgInfor: {
    width: 250,
    height: 150,
  },
});
