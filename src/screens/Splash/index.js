import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';

import {isLogged} from '../../states';
import {useState as uS} from '@hookstate/core';
import {Provider} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from 'react-native-splash-screen';
import Main from '../../routes/NavigationContainer';
import SystemSetting from 'react-native-system-setting';
import BleManager from 'react-native-ble-manager';
import Toast from 'react-native-simple-toast';

// import Main from '../../../App';

import styles from './style';

const {width, height} = Dimensions.get('window');

Splash = () => {
  const logIn = uS(isLogged);

  const [permissionEnabled, setPermissionEnabled] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      _askPermissions();
    }
    _locationPermission();
    getLogInStatus();
    _requestBluetoothPermission();
    SplashScreen.hide();
  }, []);

  const _locationPermission = () => {
    SystemSetting.isLocationEnabled().then(enable => {
      if (enable) {
        console.log('Location is On');
      } else {
        Alert.alert(
          'Turn Location On',
          'Dual Camera App wants to turn on your Location',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed on Location Setting'),
              style: 'cancel',
            },
            {
              text: 'Settings',
              onPress: () => {
                SystemSetting.switchLocation();
              },
            },
          ],
        );
      }
    });
  };

  const getLogInStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLogged');
      if (isLoggedIn !== null) {
        logIn.set(isLoggedIn == '1' ? true : false);
        console.log('kia', isLoggedIn, logIn.get());
      }
    } catch (error) {
      console.log('Error at getting log in status', error);
    }
  };

  const _requestBluetoothPermission = () => {
    BleManager.enableBluetooth()
      .then(() => {
        console.log('The bluetooth is already enabled or the user confirmed');
      })
      .catch(() => {
        Alert.alert(
          'Turn Bluetooth',
          'This App wants to turn on your bluetooth',
          [
            {
              text: 'Cancel',
              onPress: () =>
                console.log('Cancel Pressed on Bluetooth Permissions'),
              style: 'cancel',
            },
            {
              text: 'Settings',
              onPress: () => {
                SystemSetting.switchBluetooth();
              },
            },
          ],
        );
      });
  };

  const _askPermissions = () => {
    try {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]).then(results => {
        if (
          results['android.permission.ACCESS_FINE_LOCATION'] &&
          results['android.permission.ACCESS_COARSE_LOCATION'] &&
          results['android.permission.CAMERA'] &&
          results['android.permission.RECORD_AUDIO'] &&
          results['android.permission.READ_EXTERNAL_STORAGE'] &&
          results['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          setPermissionEnabled(true),
            console.log('Permission are Accepted already');
        } else if (
          (results['android.permission.ACCESS_FINE_LOCATION'] &&
            results['android.permission.ACCESS_COARSE_LOCATION'] &&
            results['android.permission.CAMERA'] &&
            results['android.permission.RECORD_AUDIO'] &&
            results['android.permission.READ_EXTERNAL_STORAGE'] &&
            results['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'denied') ||
          (results['android.permission.ACCESS_FINE_LOCATION'] &&
            results['android.permission.ACCESS_COARSE_LOCATION'] &&
            results['android.permission.CAMERA'] &&
            results['android.permission.RECORD_AUDIO'] &&
            results['android.permission.READ_EXTERNAL_STORAGE'] &&
            results['android.permission.WRITE_EXTERNAL_STORAGE'] ===
              'never_ask_again')
        ) {
          Toast.show(
            'App cannot Start Without Accepting Permission',
            Toast.SHORT,
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ImageBackground
        source={require('../../assets/images/portrait.png')}
        style={styles.imgBack}
        resizeMode="cover">
        <View style={styles.logoContainer}>
          <Text
            style={[
              styles.textStyle,
              {fontSize: height * 0.03, marginVertical: 0},
            ]}>
            Logo Here
          </Text>
        </View>
        <Text style={styles.textStyle}>Dual Camera</Text>
        <ActivityIndicator size={height * 0.06} color="#0f35bd" />
      </ImageBackground>
    </View>
  );
};

export default App = () => {
  const [currentScreen, setCurrentScreen] = useState('Splash');

  useEffect(() => {
    setTimeout(() => {
      setCurrentScreen('Main');
    }, 2000);
  }, []);

  return currentScreen == 'Splash' ? (
    <Provider>
      <Splash />
    </Provider>
  ) : (
    <Provider>
      <Main />
    </Provider>
  );
};
