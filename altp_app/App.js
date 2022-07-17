import 'react-native-gesture-handler';
import React from 'react';
import {View } from 'react-native';
import SignIn from './src/components/SignIn';
import HomeScreen from './src/components/HomeScreen';
import LineAnswers from './src/components/LineAnswers';
import RoomWaiting from "./src/components/RoomWaiting";
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
      </Stack.Navigator>
    </NavigationContainer>
 
  )
}
export default App;