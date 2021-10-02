import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/SignUp';
import Draw from './DrawerStack';

import { Fonts } from '../utils/fonts';

import { useState } from '@hookstate/core';
import {
  toggle1MPs,
  toggle2MPs,
  toggle5MPs,
  d10,
  d20,
  d30,
  swTgl,
  checkVal,
  stOp,
  isLogged,
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
  const storageOption = useState(stOp); //!
  const switchToggle = useState(swTgl); //!
  const checkValue = useState(checkVal); //!
  const dur10 = useState(d10); //!
  const dur20 = useState(d20); //!
  const dur30 = useState(d30); //!
  const logIn = useState(isLogged);

  useEffect(() => {
    getItems();
  }, []);

  const getItems = async () => {
    try {
      const mp1Val = await AsyncStorage.getItem('mp1');
      const mp2Val = await AsyncStorage.getItem('mp2');
      const mp5Val = await AsyncStorage.getItem('mp5');
      const strOpsVal = await AsyncStorage.getItem('storageOption');
      const swtTVal = await AsyncStorage.getItem('switchToggle');
      const CheckTheVal = await AsyncStorage.getItem('checkValue');
      const d10Val = await AsyncStorage.getItem('d10');
      const d20Val = await AsyncStorage.getItem('d20');
      const d30Val = await AsyncStorage.getItem('d30');
      if (
        mp1Val !== null &&
        mp2Val !== null &&
        mp5Val !== null &&
        strOpsVal !== null &&
        swtTVal !== null &&
        CheckTheVal !== null &&
        d10Val !== null &&
        d20Val !== null &&
        d30Val !== null
      ) {
        toggle1MP.set(mp1Val == '1' ? true : false);
        toggle2MP.set(mp2Val == '1' ? true : false);
        toggle5MP.set(mp5Val == '1' ? true : false);
        storageOption.set(strOpsVal == '1' ? true : false);
        switchToggle.set(swtTVal == '1' ? true : false);
        checkValue.set(CheckTheVal);
        dur10.set(d10Val == '1' ? true : false);
        dur20.set(d20Val == '1' ? true : false);
        dur30.set(d30Val == '1' ? true : false);
      }
    } catch (e) {
      console.log('koi error aya getting me', e);
    }
  };

  return (
    <NavigationContainer theme={myDarkTheme}>
      <Stack.Navigator
        headerMode="none"
      // initialRouteName={logIn.get() ? 'Draw' : 'Login'}
      >
        <Stack.Screen name="Draw" component={Draw} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
