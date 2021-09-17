import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Button,
  Platform,
  ScrollView,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  Image,
  AppState,
  LayoutAnimation,
  UIManager,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, useFocusEffect } from '@react-navigation/native';
import {
  Footer,
  Header,
  CustumStatusBar,
  GradientButton,
  Loader,
  MyInput,
} from '../../components';
import CheckBox from '@react-native-community/checkbox';
import { stringToBytes, bytesToString } from 'convert-string';
import { Fonts } from '../../utils/fonts';
import { Dialog } from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';

import SystemSetting from 'react-native-system-setting';
import BleManager from 'react-native-ble-manager';
import NetInfo from '@react-native-community/netinfo';
import { useLayout, useDimensions } from '@react-native-community/hooks';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';

import { useState as uS } from '@hookstate/core';
import {
  toggle1MPs,
  toggle2MPs,
  toggle5MPs,
  toggle8MPs,
  d10,
  d20,
  d30,
  swTgl,
  strTgl,
  strView,
  checkVal,
  dataBtn,
  cldBtn,
  strmBtn,
  stOp,
  cS,
  rS,
} from '../../states';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Settings({ props, navigation }) {
  const { width, height } = useDimensions().window;
  const portrait = width < height;
  const { colors, font } = useTheme();
  // const [toggle1MP, setToggle1MP] = useState(true);
  // const [toggle2MP, setToggle2MP] = useState(false);
  // const [toggle5MP, setToggle5MP] = useState(false);

  const toggle1MP = uS(toggle1MPs); //!
  const toggle2MP = uS(toggle2MPs); //!
  const toggle5MP = uS(toggle5MPs); //!
  const toggle8MP = uS(toggle8MPs); //!

  // const [selectedIndex, setSelectedIndex] = useState(1);
  // const [selectedNetwork, setSelectedNetwork] = useState(1);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [wifiToggle, setWifiToggle] = useState(false);
  // const [storageToggle, setStorageToggle] = useState(false);

  const storageToggle = uS(strTgl);
  const storageOption = uS(stOp); //!

  // const [switchToggle, setSwitchToggle] = useState(true);

  const switchToggle = uS(swTgl); //!

  // const [dataToggle, setDataToggle] = useState(false);
  const [bleToggle, setBleToggle] = useState(false);
  // const [checkValue, setCheckValue] = useState('fb');

  const checkValue = uS(checkVal); //!

  // const [cameraToggle, setCameraToggle] = useState(false);

  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(false);
  const [pinView, setPinView] = useState(false)
  const [fbPinVisible, setFbPinVisible] = useState(false)
  const [ytPinVisible, setYtPinVisible] = useState(false)
  const [keysData, setKeysData] = useState([
    {
      type: 'fb',
      key: '1',
      name: 'Facebook Stream Key',
      view: false,
      input: '',
      placeholder: 'Enter FaceBook Key...',
    },
    {
      type: 'yt',
      key: '2',
      name: 'Youtube Stream Key',
      view: false,
      input: '',
      placeholder: 'Enter Youtube Key...',

    },
  ]);
  const [resulationData, setResulationData] = useState([
    {
      type: '1MP',
      key: '1',
      name: '480p',
      view: toggle1MP.get(),
    },
    {
      type: '2MP',
      key: '2',
      name: '576p',
      view: toggle2MP.get(),
    },
    {
      type: '5MP',
      key: '3',
      name: '720p',
      view: toggle5MP.get(),
    },
    {
      type: '8MP',
      key: '4',
      name: '1080p',
      view: toggle8MP.get(),
    },
  ]);
  // const [streamViewVisible, setStreamViewVisible] = useState(false);
  const [bleName, setBleName] = useState('');
  const [bleId, setBleId] = useState('');
  const [pin, setPin] = useState('');
  const [devPin, setDevPin] = useState('');
  const [serID, setSerID] = useState('');
  const [charID, setCharID] = useState('');
  UIManager.setLayoutAnimationEnabledExperimental(true);

  const [server, setServer] = useState('Click to Connect');

  // const [dbBtn, setDbBtn] = useState(true);
  // const [cloudBtn, setCloudBtn] = useState(false);
  // const [streamBtn, setStreamBtn] = useState(false);

  const dbBtn = uS(dataBtn);
  const cloudBtn = uS(cldBtn);
  const streamBtn = uS(strmBtn);

  const dur10 = uS(d10); //!
  const dur20 = uS(d20); //!
  const dur30 = uS(d30); //!

  const camOn = uS(cS);
  const recOn = uS(rS);

  const socketIntegrate = key => {
    const socket = io('http://192.168.18.40:8000');

    console.log('socket fired______?');

    socket.on(key, arg => {
      setActivityIndicator(false);
      console.log('getRes', arg);
    });
  };

  // useEffect(() => {
  //   const socket = io('http://192.168.18.40:8000');
  //   socket.on('getRes', arg => {
  //     console.log('socket chala', arg);
  //   });
  //   socketIntegrate();
  // }, [socketIntegrate]);

  const socketHandle = (key, msg) => {
    if (key) setActivityIndicator(true);
    setTopicUrl(key);
    setTopicMsg(msg);
    const socket = io(
      'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/',
    );
    socket.emit(key, msg);
    camOn.set(false);
    recOn.set(false);
    socket.on(key, arg => {
      console.log('socket=/storage/cloud----------', arg);
      setActivityIndicator(false);
    });
  };

  useEffect(() => {
    socketHandle(topicUrl, topicMsg);
    console.log('effecting');
  }, [topicUrl, topicMsg]);

  useEffect(() => {
    AppState.addEventListener('change', () => {
      console.log('Change me kuch aya', AppState.currentState);
      if (
        AppState.currentState == 'background' ||
        AppState.currentState == 'inactive'
      ) {
        storeItems();
        console.log('chala raha ha storeItems');
      }
    });
    console.log(checkValue.get());
    console.log('aya', toggle1MP.get());

    checkBluetooth();
    checkWifi();
    checkData();
    return () => {
      console.log('chala unmount??');
      AppState.removeEventListener('change');
    };
  }, []);

  const storeItems = async () => {
    try {
      await AsyncStorage.setItem('mp1', toggle1MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('mp2', toggle2MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('mp5', toggle5MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem(
        'storageOption',
        storageOption.get() == true ? '1' : '0',
      );
      await AsyncStorage.setItem(
        'switchToggle',
        switchToggle.get() == true ? '1' : '0',
      );
      await AsyncStorage.setItem('checkValue', checkValue.get());
      await AsyncStorage.setItem('d10', dur10.get() == true ? '1' : '0');
      await AsyncStorage.setItem('d20', dur20.get() == true ? '1' : '0');
      await AsyncStorage.setItem('d30', dur30.get() == true ? '1' : '0');
    } catch (e) {
      console.log('koi error aya storing me', e);
    }
  };

  const openAppSettings = async () => {
    await SystemSetting.openAppSystemSettings();
  };

  const changeResolution = (type, indexx) => {
    // console.log('type--->', type)

    if (type == '1MP') {
      // if (!toggle1MP.get()) {
      //   socketHandle('pi_cm3/cam_res/', '1');
      // }
      toggle1MP.set(true);
      toggle2MP.set(false);
      toggle5MP.set(false);
      toggle8MP.set(false);

    }
    if (type == '2MP') {
      // if (!toggle2MP.get()) {
      //   socketHandle('pi_cm3/cam_res/', '2');
      // }
      toggle1MP.set(false);
      toggle2MP.set(true);
      toggle5MP.set(false);
      toggle8MP.set(false);
    }
    if (type == '5MP') {
      // if (!toggle5MP.get()) {
      //   socketHandle('pi_cm3/cam_res/', '3');
      // }
      toggle1MP.set(false);
      toggle2MP.set(false);
      toggle5MP.set(true);
      toggle8MP.set(false);
    }
    if (type == '8MP') {
      // if (!toggle8MP.get()) {
      //   socketHandle('pi_cm3/cam_res/', '4');
      // }
      toggle1MP.set(false);
      toggle2MP.set(false);
      toggle5MP.set(false);
      toggle8MP.set(true);
    }
    
    resulationData.map((data, index) => {
      if (index == indexx) {
        let newArr = [...resulationData]; // copying the old datas array
        newArr[index].view = true; // replace value with whatever you want to change it to
        setKeysData(newArr);
      } else {
        let newArr = [...resulationData]; // copying the old datas array
        newArr[index].view = false; // replace value with whatever you want to change it to
        setKeysData(newArr);
      }
    })
  };


  // const changeResolutionTo1MP = (url, msg) => {
  //   if (!toggle1MP.get()) {
  //     socketHandle(url, msg);
  //   }
  //   toggle1MP.set(true);
  //   toggle2MP.set(false);
  //   toggle5MP.set(false);
  // };

  // const changeResolutionTo2MP = (url, msg) => {
  //   if (!toggle2MP.get()) {
  //     socketHandle(url, msg);
  //   }
  //   toggle1MP.set(false);
  //   toggle2MP.set(true);
  //   toggle5MP.set(false);
  // };

  // const changeResolutionTo5MP = (url, msg) => {
  //   if (!toggle5MP.get()) {
  //     socketHandle(url, msg);
  //   }
  //   toggle1MP.set(false);
  //   toggle2MP.set(false);
  //   toggle5MP.set(true);
  // };

  const checkBluetooth = () => {
    SystemSetting.isBluetoothEnabled().then(enable => {
      let onOff = enable ? 'On' : 'Off';
      if (onOff == 'On') {
        setBleToggle(true);
      } else {
        setBleToggle(false);
      }
      checkBluetooth();
    });
  };

  const checkWifi = () => {
    SystemSetting.isWifiEnabled().then(enable => {
      let onOff = enable ? 'On' : 'Off';
      if (onOff == 'On') {
        setWifiToggle(true);
      } else {
        setWifiToggle(false);
      }
      checkWifi();
    });
  };

  const net = NetInfo.useNetInfo();

  const checkData = () => {
    console.log('data', net.type);
  };

  const handleStorageMode = () => {
    storageOption.set(!storageOption.get());
    if (storageOption.get() === false) {
      console.log('local');
      socketHandle('pi_cm3/storage/', 'local'); // param is 'key', 'msg'
    } else if (storageOption.get() === true) {
      console.log('cloud');
      socketHandle('pi_cm3/storage/', 'cloud');
    }
  };

  //!-------------------------------------------------------------------------------------------------------------------#FF5000

  const byCloud = () => {
    console.log('By cloud Chala');
    setDialogVisible(false);
    socketHandle('pi_cm3/device/', 'off');
    console.log('kuch nhi hoa');
  };

  const readFromDevice = (macId, serId, charId) => {
    BleManager.read(macId, serId, charId)
      .then(readData => {
        // Success code
        const stringData = bytesToString(readData);
        console.log('Read: ' + stringData);
        if (stringData) {
          setDevPin(stringData);
        }
        setLoader(false);
        setInputVisible(true);
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        Toast.show('Error while pin reading', Toast.SHORT);
        console.log('Read pr error', error);
      });
  };

  const retrieveServices = macId => {
    let serId = '';
    let charId = '';
    BleManager.retrieveServices(macId)
      .then(peripheralInfo => {
        // Success code
        console.log('Peripheral info:', peripheralInfo.characteristics);
        setTimeout(() => {
          charId = 'c301'; //? read characteristic id
          serId = 'a002'; //? read service id
          let wcharId = 'c304';
          let wserId = 'a002';
          setSerID(wserId); //? write service id
          setCharID(wcharId); //? write characteristic id
          console.log('aya service', serId);
          console.log('aya', charId);
          readFromDevice(macId, serId, charId);
        }, 15000);
      })
      .catch(e => {
        console.log('Error aya retrieve me', e);
      });
  };

  const writeToDevice = () => {
    stringData = 'CAM_0';
    console.log('power off chala ble se');

    const bytesData = stringToBytes(stringData);
    BleManager.write(bleId, serID, charID, bytesData)
      .then(() => {
        // Success code
        setLoader(false);
        console.log('Write SuccessFully');
        camOn.set(false);
        recOn.set(false);
        setInputVisible(false);
        Toast.show('Successful!', Toast.SHORT);
        setTimeout(() => {
          _disconnectDevice();
        }, 10000);
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        console.log('Error aya write me', error);
        Toast.show('Command Send Unsuccessful!', Toast.SHORT);
      });
  };

  const _disconnectDevice = () => {
    if (bleId != '') {
      BleManager.disconnect(bleId)
        .then(() => {
          // Success code
          console.log('Disconnected Device Successfully');
          setBleId('');
          setBleName('');
        })
        .catch(error => {
          // Failure code
          console.log('Error aya Disconnect me', error);
        });
    } else {
      console.log('Nothing to disconnect');
      null;
    }
  };

  const _connectToDevice = macId => {
    console.log('aya mac', macId);
    BleManager.connect(macId)
      .then(() => {
        retrieveServices(macId);
        console.log('Connected Device');
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        console.log('Error at Connecting: ', error);
        Toast.show('Error, Try Again', Toast.SHORT);
      });
  };

  const _scanAndGet = () => {
    let blN = '';
    let blId = '';
    BleManager.scan([], 10, true).then(() => {
      console.log('Scan started');
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        ({ name, id, rssi }) => {
          console.log('kia aya name', name);
          console.log('kya aya id', id);
          console.log('kia aya rssi', rssi);
          if (name == 'abbas') {
            setBleName(name);
            setBleId(id);
            blN = name;
            blId = id;
          }
        },
      );
      setTimeout(() => {
        console.log('id', blId);
        console.log('name', blN);
        console.log('Stopped scanning');
        if (blId != '' && blN != '') {
          _connectToDevice(blId);
          console.log('***** pakra isne Device *****');
          bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
          Toast.show('Device Found, Getting Services', Toast.show);
        } else {
          console.log('Device not Found!');
          Toast.show('Device not Found', Toast.SHORT);
          setLoader(false);
        }
      }, 10000);
    });
  };

  const byBlueT = () => {
    SystemSetting.isBluetoothEnabled().then(enable => {
      if (enable) {
        setDialogVisible(false);
        setLoader(true);
        BleManager.start({ showAlert: false }).then(() => {
          // Success code
          console.log('Module initialized');
          _scanAndGet();
        });
      } else {
        Toast.show('Turn on Bluetooth', Toast.SHORT);
      }
    });
  };

  const validatePin = () => {
    if (pin == devPin) {
      writeToDevice();
      setPin('');
    } else {
      setLoader(false);
      Toast.show('Incorrect Pin, Try Again', Toast.SHORT);
      setPin('');
    }
  };

  const onSubmitPin = () => {
    setLoader(true);
    validatePin();
  };

  //!------------------------------------------------------------------------------------------------------------------- #FF5000

  const styles = StyleSheet.create({
    container: {
      height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
      width: width,
      backgroundColor: '#202427',
      justifyContent: 'center',
    },
    inner: {
      flex: 1,
      alignItems: 'center',
      marginTop: portrait ? height * 0.02 : width * 0.02,
      marginBottom: portrait ? height * 0.15 : width * 0.1,
    },
    listContainer: {
      flexDirection: 'row',
      height: portrait ? height * 0.1 : width * 0.1,
      width: width * 0.95,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: 'white',
      paddingHorizontal: portrait ? height * 0.02 : width * 0.02,
      borderRadius: height * 0.01,
      shadowColor: '#25AAE1',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: height * 0.1,
      elevation: portrait ? height * 0.003 : width * 0.003,
      marginVertical: portrait ? height * 0.01 : width * 0.01,
    },
    listContainerDropdown: {
      height: portrait ? height * 0.1 : width * 0.1,
      width: width * 0.95,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: 'white',
      paddingHorizontal: portrait ? height * 0.02 : width * 0.02,
      borderRadius: height * 0.01,
      shadowColor: '#25AAE1',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
      shadowRadius: height * 0.1,
      elevation: portrait ? height * 0.003 : width * 0.003,
      marginVertical: portrait ? height * 0.01 : width * 0.01,
    },
    listInnerDropdown: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: height * 0.01,

      // backgroundColor:'red'
    },
    dropDownTextInput: {
      flex: 1,
      fontSize: width * 0.04,
      fontFamily: font,
      color: colors,
      borderRadius: 4,
      paddingLeft: 10,
      borderBottomWidth: 0,
      backgroundColor: 'white',
    },
    dropDownButton: {
      backgroundColor: '#22343E',
      padding: height * 0.01,
      marginLeft: height * 0.02,
    },
    fontContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    listFont: {
      color: 'white',
      fontSize: portrait ? width * 0.04 : height * 0.04,
      fontFamily: Fonts.Lato,
      marginLeft: portrait ? width * 0.01 : height * 0.01,
    },
    doneButton: {
      width: portrait ? width * 0.4 : height * 0.4,
      height: portrait ? height * 0.05 : width * 0.05,
      borderRadius: height * 0.005,
    },
    inputDoneBtn: {
      alignSelf: 'center',
      width: portrait ? width * 0.2 : height * 0.2,
      height: portrait ? height * 0.05 : width * 0.05,
      borderRadius: height * 0.005,
      marginHorizontal: portrait ? height * 0.01 : width * 0.01,
    },
  });

  const handleStreamingChanging = type => {
    if (type == 'yt') {
      // socketHandle('pi_cm3/streaming/', 'yt')
      checkValue.set('yt');
      console.log('yt runs');
    } else if (type == 'fb') {
      // socketHandle('pi_cm3/streaming/', 'fb');
      checkValue.set('fb');
      console.log('fb runs');
    } else if (type == 'cl') {
      // socketHandle('pi_cm3/streaming/', 'cl');
      checkValue.set('cl');
      console.log('cl runs');
    }
  };

  const changeLayout = (type, index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].view = !newArr[index].view; // replace e.target.value with whatever you want to change it to
    setKeysData(newArr);
    console.log('data--->', keysData);
  };

  const setThePins = (type, value) => {
    // console.log('typetype--->', type);
    // console.log('valuevalue--->', value);

    if (type == 'fb' && value) {
      console.log('type--->', type);
      Toast.show('Please wait we check your key', Toast.LONG);
    }
    else if (type == 'yt' && value) {
      console.log('type--->', type);
    }
    else {
      Toast.show('Invalid Key', Toast.SHORT);
    }
  };

  const changeLayoutBattery = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBatteryLevel(!batteryLevel);
  };

  const changeLayoutPin = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPinView(!pinView);
  };

  const handleInput = (value, index) => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].input = value; // replace value with whatever you want to change it to
    setKeysData(newArr);
    console.log('data--->', keysData);
  };

  return (
    <Footer props={props} screen="Settings">
      <CustumStatusBar />
      {loader || activityIndicator ? <Loader /> : null}
      <View style={styles.container}>
        <Header
          colors={colors}
          fontF={font}
          title="Presets"
          iconName={'settings-sharp'}
          iconColor={'white'}
          iconSize={portrait ? height * 0.035 : width * 0.035}
          extraContent={
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="ios-menu" color="#fff" size={height * 0.045} />
            </TouchableOpacity>
          }
        />
        {
          //! Options Dialog
        }
        <Dialog
          visible={dialogVisible}
          contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
          overlayStyle={{
            paddingHorizontal: portrait ? width * 0.2 : height * 0.5,
          }}
          dialogStyle={{
            backgroundColor: '#1C212D',
            borderRadius: height * 0.01,
          }}
          onTouchOutside={() => setDialogVisible(false)}>
          <Icon
            name="close"
            color="#003CC2"
            onPress={() => setDialogVisible(false)}
            size={portrait ? height * 0.04 : width * 0.04}
            style={{
              position: 'absolute',
              zIndex: 1,
              right: 1,
              top: 1,
            }}
          />
          <View
            style={{
              height: portrait ? height * 0.12 : width * 0.12,
              justifyContent: 'space-between',
            }}>
            <GradientButton
              title={'By Cloud'}
              style={styles.doneButton}
              onPress={byCloud}
            />
            <GradientButton
              title={'By Bluetooth'}
              style={styles.doneButton}
              onPress={byBlueT}
            />
          </View>
        </Dialog>
        {
          //! Input Dialog
        }
        <Dialog
          visible={inputVisible}
          overlayStyle={{
            paddingHorizontal: portrait ? width * 0.2 : height * 0.55,
          }}
          dialogStyle={{
            backgroundColor: '#1C212D',
            borderRadius: height * 0.01,
          }}
          onTouchOutside={() => {
            setInputVisible(false);
            _disconnectDevice();
            setPin('');
          }}>
          <View
            style={{
              height: portrait ? width * 0.3 : height * 0.3,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: portrait ? width * 0.05 : height * 0.05,
                color: '#ffffff',
                textAlign: 'center',
              }}>
              Device Found
            </Text>
            <View
              style={{
                height: portrait ? width * 0.1 : height * 0.1,
                backgroundColor: '#fff',
                alignItems: 'center',
                justifyContent: 'center',
                padding: portrait ? width * 0.01 : height * 0.01,
                borderRadius: portrait ? width * 0.01 : height * 0.01,
              }}>
              <TextInput
                label="Enter Pin"
                value={pin}
                onChangeText={text => {
                  setPin(text);
                }}
                mode="outlined"
                outlineColor="#003CC2"
                selectionColor="#003CC2"
                secureTextEntry
                style={{
                  width: portrait ? width * 0.4 : height * 0.4,
                  height: portrait ? width * 0.06 : height * 0.06,
                }}
                theme={{
                  colors: {
                    primary: '#003CC2',
                    underlineColor: 'transparent',
                  },
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: portrait ? width * 0.03 : height * 0.03,
              }}>
              <GradientButton
                title={'Connect'}
                style={styles.inputDoneBtn}
                onPress={onSubmitPin}
              />
              <GradientButton
                title={'Cancel'}
                style={styles.inputDoneBtn}
                onPress={() => {
                  setPin('');
                  setInputVisible(false);
                  _disconnectDevice();
                }}
              />
            </View>
          </View>
        </Dialog>
        <ScrollView>
          <View style={styles.inner}>
            <Header
              colors={colors}
              fontF={font}
              title="Resolution"
              iconName={'tv-outline'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <View style={{ marginTop: portrait ? width * 0.03 : height * 0.03 }}>
              {
                resulationData &&
                resulationData.map((data, index) => (
                  <>
                    <TouchableOpacity
                      disabled={camOn.get() || recOn.get()}
                      activeOpacity={0.7}
                      style={styles.listContainer}
                      onPress={() => {
                        camOn.get() || recOn.get()
                          ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                          : changeResolution(data.type, index);
                      }}>
                      <View style={styles.fontContainer}>
                        <CheckBox
                          disabled={true}
                          value={data.view}
                          tintColors={{
                            true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                          }}
                        />
                        <Text style={styles.listFont}>{data.name} {data.name == "720p" && " {default}"} </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ))
              }
              {/* <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : changeResolutionTo1MP('pi_cm3/cam_res/', '1');
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggle1MP.get()}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>480p</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : changeResolutionTo2MP('pi_cm3/cam_res/', '2');
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggle2MP.get()}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>576p</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : changeResolutionTo5MP('pi_cm3/cam_res/', '3');
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggle5MP.get()}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>720p {' {Default}'}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : changeResolutionTo2MP('pi_cm3/cam_res/', '4');
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggle2MP.get()}
                    onValueChange={() => {
                      changeResolutionTo2MP('pi_cm3/cam_res/', '4');
                    }}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>1080p</Text>
                </View>
              </TouchableOpacity> */}
            </View>
            <Header
              colors={colors}
              fontF={font}
              title="Streaming Location"
              iconName={'md-radio'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <View style={{ marginTop: portrait ? width * 0.03 : height * 0.03 }}>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : checkValue.get() !== 'cl'
                      ? handleStreamingChanging('cl')
                      : null;
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={checkValue.get() === 'cl' ? true : false}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>
                    Cloud Storage {' {Default}'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : checkValue.get() !== 'cl'
                      ? handleStreamingChanging('cl')
                      : null;
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={toggle2MP.get()}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>Local Storage (SD card)</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : checkValue.get() !== 'yt'
                      ? handleStreamingChanging('yt')
                      : null;
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={checkValue.get() === 'yt' ? true : false}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>YouTube LIVE</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={camOn.get() || recOn.get()}
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={() => {
                  camOn.get() || recOn.get()
                    ? Toast.show('Turn Off Cam to change', Toast.SHORT)
                    : checkValue.get() !== 'fb'
                      ? handleStreamingChanging('fb')
                      : null;
                }}>
                <View style={styles.fontContainer}>
                  <CheckBox
                    disabled={true}
                    value={checkValue.get() === 'fb' ? true : false}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>FaceBook LIVE</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Header
              colors={colors}
              fontF={font}
              title="Configuration"
              iconName={'build'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            {keysData &&
              keysData.map((data, index) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={[
                    styles.listContainerDropdown,
                    { height: !data.view ? height * 0.1 : height * 0.18 },
                  ]}
                  onPress={() => changeLayout(data.type, index)}>
                  <View style={styles.listInnerDropdown}>
                    <View style={styles.fontContainer}>
                      <Text style={styles.listFont}>{data.name}</Text>
                    </View>
                    <View>
                      <Icon
                        name={!data.view ? 'chevron-down' : 'chevron-up'}
                        color={'white'}
                        size={portrait ? width * 0.06 : height * 0.06}
                      />
                    </View>
                  </View>
                  {data.view && (
                    <View style={[styles.listInnerDropdown]}>
                      <TextInput
                        placeholder={data.placeholder}
                        placeholderTextColor="#8b8b91"
                        underlineColorAndroid="transparent"
                        style={styles.dropDownTextInput}
                        textAlignVertical="center"
                        onChangeText={e => handleInput(e, index)}
                      />
                      <GradientButton
                        title={'Set'}
                        unfilled={true}
                        style={styles.dropDownButton}
                        onPress={() => setThePins(data.type, data.input)}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.listContainerDropdown,
                { height: !pinView ? height * 0.1 : height * 0.18 },
              ]}
              onPress={changeLayoutPin}>
              <View style={styles.listInnerDropdown}>
                <View style={styles.fontContainer}>
                  <Text style={styles.listFont}>Generate Bluetooth Pin</Text>
                </View>
                <View>
                  <Icon
                    name={!pinView ? 'chevron-down' : 'chevron-up'}
                    color={'white'}
                    size={portrait ? width * 0.06 : height * 0.06}
                  />
                </View>
              </View>
              {pinView && (
                <View style={[styles.listInnerDropdown]}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: font,
                      fontSize: height * 0.03,
                      marginLeft: 5,
                    }}>
                    123456
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.listContainerDropdown,
                { height: !batteryLevel ? height * 0.1 : height * 0.18 },
              ]}
              onPress={changeLayoutBattery}>
              <View style={styles.listInnerDropdown}>
                <View style={styles.fontContainer}>
                  <Text style={styles.listFont}>Check Battery Level</Text>
                </View>
                <View>
                  <Icon
                    name={!batteryLevel ? 'chevron-down' : 'chevron-up'}
                    color={'white'}
                    size={portrait ? width * 0.06 : height * 0.06}
                  />
                </View>
              </View>
              {batteryLevel && (
                <View style={[styles.listInnerDropdown]}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: font,
                      fontSize: height * 0.03,
                      marginLeft: 5,
                    }}>
                    30%
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <Header
              colors={colors}
              fontF={font}
              title="POWER OFF DEVICE"
              iconName={'power-sharp'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.listContainer}
              onPress={() =>
                camOn.get() || recOn.get()
                  ? setDialogVisible(true)
                  : alert('Device is already off')
              }>
              <View style={styles.fontContainer}>
                <Text style={styles.listFont}>POWER OFF</Text>
              </View>
              <View>
                <Icon
                  name={'ios-chevron-forward'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Footer>
  );
}

export default Settings;
