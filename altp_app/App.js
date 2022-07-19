import 'react-native-gesture-handler';
import React from 'react';
import {View } from 'react-native';
import SigResultnIn from './src/components/Result';
import HomeScreen from './src/components/HomeScreen';
import LineAnswers from './src/components/LineAnswers';
import RoomWaiting from "./src/components/RoomWaiting";
import CreateRoom from "./src/components/CreateRoom";
import JoinRoom from "./src/components/JoinRoom";
import JoinRandomRoom from "./src/components/JoinRandomRoom";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
       screenOptions={{
        headerShown: false,
      }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="LineAnswers" component={LineAnswers} />
        <Stack.Screen name="RoomWaiting" component={RoomWaiting} />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
        <Stack.Screen name="JoinRoom" component={JoinRoom} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="JoinRandomRoom" component={JoinRandomRoom} />
      </Stack.Navigator>
    </NavigationContainer>
 
  )
}
export default App;