import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import Draw from './DrawerStack';

import {Fonts} from '../utils/fonts';

import {useState} from '@hookstate/core';
import {
  toggle1MPs,
  toggle2MPs,
  toggle5MPs,
  toggle8MPs,
  checkVal,
  isLogged,
  fbPinFlag,
  ytPinFlag,
} from '../states';

const Stack = createStackNavigator();

const myDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#181a1d',
    text: '#ffffff',
    textGrey: '#b4c6e1',
    button: '#0f35bd',
    buttonLight: '#267dff',
    border: '#0ce1ff',
    card: '#25292D',
  },
  font: Fonts.Lato,
};

function App() {
  const toggle1MP = useState(toggle1MPs); //!
  const toggle2MP = useState(toggle2MPs); //!
  const toggle5MP = useState(toggle5MPs); //!
  const toggle8MP = useState(toggle8MPs); //!
  const checkValue = useState(checkVal); //!
  const logIn = useState(isLogged);
  const fbPin = useState(fbPinFlag);
  const ytPin = useState(ytPinFlag);

  useEffect(() => {
    getItems();
    setTimeout(() => {
      console.log('FaceBook pin', fbPin.get());
      console.log('Youtube pin', ytPin.get());
    }, 1500);
  }, []);

  const getItems = async () => {
    try {
      const mp1Val = await AsyncStorage.getItem('mp1');
      const mp2Val = await AsyncStorage.getItem('mp2');
      const mp5Val = await AsyncStorage.getItem('mp5');
      const mp8Val = await AsyncStorage.getItem('mp8');
      const CheckTheVal = await AsyncStorage.getItem('checkValue');
      const fbPinInserted = await AsyncStorage.getItem('fb_pin');
      const ytPinInserted = await AsyncStorage.getItem('yt_pin');
      if (
        mp1Val !== null &&
        mp2Val !== null &&
        mp5Val !== null &&
        mp8Val !== null &&
        CheckTheVal !== null &&
        fbPinInserted !== null &&
        ytPinInserted !== null
      ) {
        toggle1MP.set(mp1Val == '1' ? true : false);
        toggle2MP.set(mp2Val == '1' ? true : false);
        toggle5MP.set(mp5Val == '1' ? true : false);
        toggle8MP.set(mp8Val == '1' ? true : false);
        checkValue.set(CheckTheVal);
        fbPin.set(fbPinInserted == '1' ? false : true);
        ytPin.set(ytPinInserted == '1' ? false : true);
      }
    } catch (e) {
      console.log('koi error aya getting me', e);
    }
  };

  return (
    <NavigationContainer theme={myDarkTheme}>
      <Stack.Navigator
        headerMode="none"
        screenOptions={{gestureEnabled: false}}
        initialRouteName={logIn.get() ? 'Draw' : 'Login'}>
        <Stack.Screen name="Draw" component={Draw} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
