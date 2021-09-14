import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import styles from './style';
import {useTheme, useFocusEffect} from '@react-navigation/native';
import {
  Footer,
  Header,
  CustumStatusBar,
  GradientButton,
  Loader,
} from '../../components';
import CheckBox from '@react-native-community/checkbox';
import {RadioButton, Divider, TouchableRipple} from 'react-native-paper';
import {Switch} from 'react-native-switch';
import {TextInput} from 'react-native-paper';
import {stringToBytes, bytesToString} from 'convert-string';
import {Fonts} from '../../utils/fonts';
import {Dialog} from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';
import Access from 'react-native-vector-icons/MaterialCommunityIcons';
import DB from 'react-native-vector-icons/FontAwesome5';
import Cloud from 'react-native-vector-icons/MaterialCommunityIcons';
import Signal from 'react-native-vector-icons/MaterialCommunityIcons';
import Floppy from 'react-native-vector-icons/MaterialCommunityIcons';
import Wifi from 'react-native-vector-icons/FontAwesome5';
import UpCloud from 'react-native-vector-icons/FontAwesome5';
import YT from 'react-native-vector-icons/Entypo';
import FB from 'react-native-vector-icons/MaterialCommunityIcons';
import Upload from 'react-native-vector-icons/AntDesign';
import SystemSetting from 'react-native-system-setting';
import BleManager, {connect} from 'react-native-ble-manager';
import NetInfo from '@react-native-community/netinfo';
import {useLayout, useDimensions} from '@react-native-community/hooks';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';

import {ButtonGroup} from 'react-native-elements';

import {useState as uS} from '@hookstate/core';
import {
  toggle1MPs,
  toggle2MPs,
  toggle5MPs,
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
import {ActivityIndicator} from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Settings({props, navigation}) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const {colors, font} = useTheme();
  // const [toggle1MP, setToggle1MP] = useState(true);
  // const [toggle2MP, setToggle2MP] = useState(false);
  // const [toggle5MP, setToggle5MP] = useState(false);

  const toggle1MP = uS(toggle1MPs); //!
  const toggle2MP = uS(toggle2MPs); //!
  const toggle5MP = uS(toggle5MPs); //!

  const [selectedIndex, setSelectedIndex] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState(1);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [wifiToggle, setWifiToggle] = useState(false);
  // const [storageToggle, setStorageToggle] = useState(false);

  const storageToggle = uS(strTgl);
  const storageOption = uS(stOp); //!

  // const [switchToggle, setSwitchToggle] = useState(true);

  const switchToggle = uS(swTgl); //!

  const [dataToggle, setDataToggle] = useState(false);
  const [bleToggle, setBleToggle] = useState(false);
  // const [checkValue, setCheckValue] = useState('fb');

  const checkValue = uS(checkVal); //!

  const [cameraToggle, setCameraToggle] = useState(false);

  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const [loader, setLoader] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [streamVisible, setStreamVisible] = useState(false);
  const [streamViewVisible, setStreamViewVisible] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [bleName, setBleName] = useState('');
  const [bleId, setBleId] = useState('');
  const [pin, setPin] = useState('');
  const [devPin, setDevPin] = useState('');
  const [serID, setSerID] = useState('');
  const [charID, setCharID] = useState('');

  const [server, setServer] = useState('Click to Connect');

  // const [dbBtn, setDbBtn] = useState(true);
  // const [cloudBtn, setCloudBtn] = useState(false);
  // const [streamBtn, setStreamBtn] = useState(false);

  const dbBtn = uS(dataBtn);
  const cloudBtn = uS(cldBtn);
  const streamBtn = uS(strmBtn);

  // const [dur10, setdur10] = useState(true);
  // const [dur20, setdur20] = useState(false);
  // const [dur30, setdur30] = useState(false);
  const dur10 = uS(d10); //!
  const dur20 = uS(d20); //!
  const dur30 = uS(d30); //!

  const camOn = uS(cS);
  const recOn = uS(rS);

  const buttons = ['Local Storage', 'Cloud Storage'];
  const networkBtns = ['WIFI', '3G/4G'];

  // const netInfo = useNetInfo()

  let data = [
    {
      value: 'Banana',
    },
    {
      value: 'Mango',
    },
    {
      value: 'Pear',
    },
  ];

  const socketIntegrate = key => {
    const socket = io('http://192.168.18.40:8000');

    // setActivityIndicator(true);
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
    // checkQualityAndStream();
    // setInputVisible(true);

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

  // const checkQualityAndStream = () => {
  //   if (checkValue.get() === 'fb') {
  //     sendResponse('/stream/facebook');
  //   } else if (checkValue.get() === 'yt') {
  //     sendResponse('/stream/youtube');
  //   } else if (checkValue.get() === 'cl') {
  //     sendResponse('/stream/cloud');
  //   }
  //   if (toggle1MP.get()) {
  //     sendResponse('/quality/720p');
  //   } else if (toggle2MP.get()) {
  //     sendResponse('/quality/1080p');
  //   } else if (toggle5MP.get()) {
  //     sendResponse('/quality/2560p');
  //   }
  //   if (dur10.get()) {
  //     sendResponse('/duration/10');
  //   } else if (dur20.get()) {
  //     sendResponse('/duration/20');
  //   } else if (dur30.get()) {
  //     sendResponse('/duration/30');
  //   }
  // };
  const openAppSettings = async () => {
    await SystemSetting.openAppSystemSettings();
  };

  const changeResolutionTo1MP = (url, msg) => {
    if (!toggle1MP.get()) {
      // sendResponse(path);
      socketHandle(url, msg);
    }
    toggle1MP.set(true);
    toggle2MP.set(false);
    toggle5MP.set(false);
    // setToggle2MP(true);
    // setToggle2MP(false);
    // setToggle5MP(false);
  };

  const changeResolutionTo2MP = (url, msg) => {
    if (!toggle2MP.get()) {
      // sendResponse(path);
      socketHandle(url, msg);
    }
    toggle1MP.set(false);
    toggle2MP.set(true);
    toggle5MP.set(false);
    // setToggle2MP(true);
    // setToggle1MP(false);
    // setToggle5MP(false);
  };

  const changeResolutionTo5MP = (url, msg) => {
    if (!toggle5MP.get()) {
      // sendResponse(path);
      socketHandle(url, msg);
    }
    toggle1MP.set(false);
    toggle2MP.set(false);
    toggle5MP.set(true);
    // setToggle5MP(true);
    // setToggle1MP(false);
    // setToggle2MP(false);
  };

  const sendResponse = (path, key) => {
    //
    setActivityIndicator(true);
    const URL = `http://192.168.18.40:8000${path}`;
    fetch(URL)
      .then(response => {
        // socketIntegrate();
        if (response.status == 200) {
          return response.text();
        }
      })
      .then(resonseText => {
        setServer(resonseText);
        console.log('response me mila', resonseText);
        setActivityIndicator(false);
        socketIntegrate(key);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const checkBluetooth = () => {
    SystemSetting.isBluetoothEnabled().then(enable => {
      let onOff = enable ? 'On' : 'Off';
      // console.log('Current bluetooth is ' + this.state.onOff);
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
      // console.log('Current bluetooth is ' + this.state.onOff);
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
    // console.log('data', netInfo.isConnected.toString())
    console.log('data', net.type);
    // console.log('data', netInfo.details.toString())
  };

  const handleStorageMode = () => {
    storageOption.set(!storageOption.get());
    if (storageOption.get() === false) {
      console.log('local');
      // setActivityIndicator(true);
      socketHandle('pi_cm3/storage/', 'local'); // param is 'key', 'msg'
      // socketIntegrate('local');
    } else if (storageOption.get() === true) {
      console.log('cloud');
      // setActivityIndicator(true);

      socketHandle('pi_cm3/storage/', 'cloud');
      // socketIntegrate('cloud');
    }
  };

  const handleNetwork = val => {
    if (val == 0) {
      console.log('Wifi Active');
    }
    if (val == 1) {
      console.log('3G/4G Active');
    }
    setSelectedNetwork(val);
  };

  //!-------------------------------------------------------------------------------------------------------------------#FF5000

  const byCloud = () => {
    console.log('By cloud Chala');
    setDialogVisible(false);
    socketHandle('pi_cm3/device/', 'off');
    // camOn.set(false);
    // recOn.set(false);
    console.log('kuch nhi hoa');
    // setSwitchToggle(!switchToggle);
    // switchToggle.set(!switchToggle.get());
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
    // setBtnToggle(!btnToggle);
    // Toast.show('Device Powered Off', Toast.SHORT);
    // camOn.set(false);
    console.log('power off chala ble se');

    const bytesData = stringToBytes(stringData);
    BleManager.write(bleId, serID, charID, bytesData)
      .then(() => {
        // Success code
        setLoader(false);
        console.log('Write SuccessFully');
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
        // _disconnectDevice();
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
        ({name, id, rssi}) => {
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
        BleManager.start({showAlert: false}).then(() => {
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
      // flexDirection: 'column',
      backgroundColor: '#202427',
      justifyContent: 'center',
    },
    inner: {
      flex: 1,
      // justifyContent:'center',
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
      // borderBottomWidth: height * 0.001,
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
        />
        {
          //! Options Dialog
        }
        <Dialog
          visible={dialogVisible}
          contentStyle={{justifyContent: 'center', alignItems: 'center'}}
          overlayStyle={{
            paddingHorizontal: portrait ? width * 0.2 : height * 0.5,
          }}
          // title="Custom Dialog"
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
        {
          //! Streaming Dialog
        }
        <Dialog
          visible={streamVisible}
          // contentStyle={{justifyContent: 'center', alignItems: 'center'}}
          overlayStyle={{
            paddingHorizontal: portrait ? width * 0.25 : height * 0.6,
          }}
          // title="Custom Dialog"
          dialogStyle={{
            backgroundColor: '#1C212D',
            borderRadius: height * 0.01,
          }}
          onTouchOutside={() => {
            setStreamVisible(false);
          }}>
          <View>
            <Text
              style={{
                fontSize: portrait ? width * 0.03 : height * 0.038,
                color: '#fff',
                marginBottom: portrait ? width * 0.03 : height * 0.03,
              }}>
              Select Streaming Option
            </Text>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (checkValue.get() !== 'yt') {
                  // sendResponse('/stream/youtube');
                  socketHandle('pi_cm3/streaming/', 'yt');
                }
                checkValue.set('yt');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="yt"
                    status={checkValue.get() === 'yt' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                <Image
                  source={require('../../assets/images/yt-logo.png')}
                  style={{
                    height: portrait ? width * 0.034 : height * 0.034,
                    width: portrait ? width * 0.0499 : height * 0.0499,
                    alignSelf: 'center',
                    marginHorizontal: portrait ? width * 0.015 : height * 0.015,
                  }}
                />
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: checkValue.get() == 'yt' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  Youtube
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (checkValue.get() !== 'fb') {
                  // sendResponse('/stream/facebook');
                  socketHandle('pi_cm3/streaming/', 'fb');
                }
                checkValue.set('fb');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="fb"
                    status={checkValue.get() === 'fb' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                <Image
                  source={require('../../assets/images/fb-logo.png')}
                  style={{
                    height: portrait ? width * 0.041 : height * 0.042,
                    width: portrait ? width * 0.0412 : height * 0.042,
                    alignSelf: 'center',
                    marginHorizontal: portrait ? width * 0.02 : height * 0.02,
                  }}
                />
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: checkValue.get() == 'fb' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  Facebook
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (checkValue.get() !== 'cl') {
                  // sendResponse('/stream/cloud');
                  socketHandle('pi_cm3/streaming/', 'cl');
                }
                checkValue.set('cl');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="cl"
                    status={checkValue.get() === 'cl' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                {/* <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Access
                    name={'access-point'}
                    color={checkValue.get() == 'aw' ? '#25AAE1' : '#999999'}
                    size={portrait ? width * 0.055 : height * 0.055}
                    style={{
                      marginHorizontal: portrait
                        ? width * 0.013
                        : height * 0.013,
                    }}
                  />
                  <View
                    style={{
                      position: 'absolute',
                      width: portrait ? width * 0.006 : height * 0.006,
                      height: portrait ? width * 0.055 : height * 0.055,
                      backgroundColor:
                        checkValue.get() == 'aw' ? '#25AAE1' : '#999999',
                      borderRadius: portrait ? width * 0.5 : height * 0.5,
                      alignSelf: 'center',
                      transform: [{rotate: '45deg'}],
                    }}
                  />
                </View> */}
                <Image
                  source={require('../../assets/images/aws-logo.png')}
                  style={{
                    height: portrait ? width * 0.03 : height * 0.03,
                    width: portrait ? width * 0.047 : height * 0.047,
                    alignSelf: 'center',
                    marginHorizontal: portrait ? width * 0.017 : height * 0.017,
                  }}
                />
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: checkValue.get() == 'cl' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  AWS Cloud
                </Text>
              </View>
            </TouchableRipple>
            <View
              style={{
                marginTop: portrait ? height * 0.02 : width * 0.02,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <GradientButton
                title={'OK'}
                style={styles.inputDoneBtn}
                onPress={() => setStreamVisible(false)}
              />
            </View>
          </View>
        </Dialog>
        <Dialog
          visible={streamViewVisible}
          // contentStyle={{justifyContent: 'center', alignItems: 'center'}}
          overlayStyle={{
            paddingHorizontal: portrait ? width * 0.25 : height * 0.6,
          }}
          // title="Custom Dialog"
          dialogStyle={{
            backgroundColor: '#1C212D',
            borderRadius: height * 0.01,
          }}
          onTouchOutside={() => {
            setStreamViewVisible(false);
          }}>
          <View>
            <Text
              style={{
                fontSize: portrait ? width * 0.03 : height * 0.038,
                color: '#fff',
                marginBottom: portrait ? width * 0.03 : height * 0.03,
              }}>
              Select Streaming View
            </Text>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (strView.get() !== 'bt') {
                  // sendResponse('/change/cam_bt');
                  socketHandle('pi_cm3/sel_cam/', 'both');
                }
                strView.set('bt');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="bt"
                    status={strView.get() === 'bt' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: strView.get() == 'bt' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  Both Cam
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (checkValue.get() !== 'lt') {
                  // sendResponse('/change/cam_lt');
                  socketHandle('pi_cm3/sel_cam/', 'left');
                }
                strView.set('lt');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="lt"
                    status={strView.get() === 'lt' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: strView.get() == 'lt' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  Left Cam
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              disabled={camOn.get() || recOn.get()}
              onPress={() => {
                if (strView.get() !== 'rt') {
                  // sendResponse('/change/cam_rt');
                  socketHandle('pi_cm3/sel_cam/', 'right');
                }
                strView.set('rt');
              }}
              rippleColor="rgba(255, 255, 255, 0.1)">
              <View style={{flexDirection: 'row'}}>
                <View>
                  <View
                    style={{
                      // backgroundColor: 'yellow',
                      width: height * 0.055,
                      height: height * 0.055,
                      position: 'absolute',
                      zIndex: 1,
                      alignSelf: 'center',
                    }}
                  />
                  <RadioButton
                    value="rt"
                    status={strView.get() === 'rt' ? 'checked' : 'unchecked'}
                    uncheckedColor={'#999999'}
                    color={camOn.get() || recOn.get() ? '#999999' : '#25AAE1'}
                  />
                </View>
                <Text
                  style={{
                    fontSize: portrait ? width * 0.03 : height * 0.03,
                    color: strView.get() == 'rt' ? '#fff' : '#ffffff99',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                  }}>
                  Right Cam
                </Text>
              </View>
            </TouchableRipple>
            <View
              style={{
                marginTop: portrait ? height * 0.02 : width * 0.02,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <GradientButton
                title={'OK'}
                style={styles.inputDoneBtn}
                onPress={() => setStreamViewVisible(false)}
              />
            </View>
          </View>
        </Dialog>
        <ScrollView>
          <View style={styles.inner}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.listContainer}
              onPress={() =>
                camOn.get() || recOn.get()
                  ? setDialogVisible(true)
                  : alert('Device is already off')
              }>
              <View style={styles.fontContainer}>
                {/* <Icon
                  name={'power'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                /> */}
                <Text style={styles.listFont}>Turn off Device</Text>
              </View>
              <View>
                <Icon
                  name={'ios-chevron-forward'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.listContainer}
              onPress={() => setStreamVisible(true)}>
              <View style={styles.fontContainer}>
                {/* <Icon
                  name={'repeat'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                /> */}
                <Text style={styles.listFont}>Live Streaming</Text>
              </View>
              <View>
                <Icon
                  name={'ios-chevron-forward'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.listContainer}
              onPress={() => setStreamViewVisible(true)}>
              <View style={styles.fontContainer}>
                {/* <Icon
                  name={'repeat'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                /> */}
                <Text style={styles.listFont}>Streaming View</Text>
              </View>
              <View>
                <Icon
                  name={'ios-chevron-forward'}
                  color={'white'}
                  size={portrait ? width * 0.06 : height * 0.06}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.listContainer}>
              <View style={styles.fontContainer}>
                <Text style={styles.listFont}>Storage Location</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: portrait ? width * 0.25 : height * 0.25,
                  justifyContent: 'space-between',
                }}>
                <Floppy
                  name={'floppy'}
                  color={'#999999'}
                  size={portrait ? width * 0.06 : height * 0.06}
                  style={{
                    alignSelf: 'center',
                  }}
                />
                <View
                  style={{
                    paddingHorizontal: portrait
                      ? width * 0.008
                      : height * 0.008,
                    alignSelf: 'center',
                  }}>
                  <Switch
                    value={storageOption.get()}
                    disabled={camOn.get()}
                    activeText="ON"
                    inActiveText="OFF"
                    onValueChange={handleStorageMode}
                    backgroundActive={
                      camOn.get() || recOn.get() ? '#999999' : '#25AAE1'
                    }
                    backgroundInactive={
                      camOn.get() || recOn.get() ? '#999999' : '#25AAE1'
                    }
                    changeValueImmediately
                    barHeight={portrait ? height * 0.03 : width * 0.03}
                    switchRightPx={2}
                    switchLeftPx={2}
                    // switchWidthMultiplier={width * 0.01}
                    switchBorderRadius={30}
                    circleSize={portrait ? width * 0.05 : height * 0.05}
                    innerCircleStyle={{
                      width: portrait ? height * 0.02 : width * 0.023,
                      height: portrait ? height * 0.02 : width * 0.023,
                      backgroundColor: 'white',
                      borderColor: 'white',
                    }}
                    renderInActiveText={false}
                    renderActiveText={false}
                  />
                </View>
                <UpCloud
                  name={'cloud-upload-alt'}
                  color={'#999999'}
                  size={portrait ? width * 0.05 : height * 0.05}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View>
            {/* <View style={styles.listContainer}>
              <View style={styles.fontContainer}>
                <Text style={styles.listFont}>Network</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: portrait ? width * 0.25 : height * 0.25,
                  justifyContent: 'space-between',
                }}>
                <Signal
                  name={'signal'}
                  color={'#999999'}
                  size={portrait ? width * 0.06 : height * 0.06}
                  style={{
                    alignSelf: 'center',
                  }}
                />
                <View
                  style={{
                    paddingHorizontal: portrait
                      ? width * 0.008
                      : height * 0.008,
                    alignSelf: 'center',
                  }}>
                  <Switch
                    value={switchToggle.get()}
                    disabled={camOn.get() || recOn.get()}
                    activeText="ON"
                    inActiveText="OFF"
                    onValueChange={() => {
                      setDialogVisible(true);
                    }}
                    backgroundActive={
                      camOn.get() || recOn.get() ? '#999999' : '#25AAE1'
                    }
                    backgroundInactive={
                      camOn.get() || recOn.get() ? '#999999' : '#25AAE1'
                    }
                    changeValueImmediately
                    barHeight={portrait ? height * 0.03 : width * 0.03}
                    switchRightPx={2}
                    switchLeftPx={2}
                    // switchWidthMultiplier={width * 0.01}
                    switchBorderRadius={30}
                    circleSize={portrait ? width * 0.05 : height * 0.05}
                    innerCircleStyle={{
                      width: portrait ? height * 0.02 : width * 0.023,
                      height: portrait ? height * 0.02 : width * 0.023,
                      backgroundColor: 'white',
                      borderColor: 'white',
                    }}
                    renderInActiveText={false}
                    renderActiveText={false}
                  />
                </View>
                <Wifi
                  name={'wifi'}
                  color={'#999999'}
                  size={portrait ? width * 0.05 : height * 0.05}
                  style={{
                    alignSelf: 'center',
                  }}
                />
              </View>
            </View> */}
            <View style={styles.listContainer}>
              <View style={styles.fontContainer}>
                <Text style={styles.listFont}>Duration (sec)</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width * 0.25,
                }}>
                <Text
                  style={[
                    styles.listFont,
                    {
                      color: dur10.get()
                        ? camOn.get() || recOn.get()
                          ? '#30545a'
                          : '#02768A'
                        : camOn.get() || recOn.get()
                        ? '#666666'
                        : '#999999',
                    },
                  ]}
                  onPress={() => {
                    camOn.get() || recOn.get()
                      ? null
                      : (console.log('chala kia'),
                        // sendResponse('/duration/10'),
                        socketHandle('pi_cm3/rec_dur/', '10'),
                        dur10.set(true),
                        dur20.set(false),
                        dur30.set(false));
                  }}>
                  10
                </Text>
                <Text
                  style={[
                    styles.listFont,
                    {
                      color: dur20.get()
                        ? camOn.get() || recOn.get()
                          ? '#30545a'
                          : '#02768A'
                        : camOn.get() || recOn.get()
                        ? '#666666'
                        : '#999999',
                    },
                  ]}
                  onPress={() => {
                    camOn.get() || recOn.get()
                      ? null
                      : // sendResponse('/duration/20'),
                        (socketHandle('pi_cm3/rec_dur/', '20'),
                        dur10.set(false),
                        dur20.set(true),
                        dur30.set(false));
                  }}>
                  20
                </Text>
                <Text
                  style={[
                    styles.listFont,
                    {
                      color: dur30.get()
                        ? camOn.get() || recOn.get()
                          ? '#30545a'
                          : '#02768A'
                        : camOn.get() || recOn.get()
                        ? '#666666'
                        : '#999999',
                    },
                  ]}
                  onPress={() => {
                    camOn.get() || recOn.get()
                      ? null
                      : // sendResponse('/duration/30'),
                        (socketHandle('pi_cm3/rec_dur/', '30'),
                        dur10.set(false),
                        dur20.set(false),
                        dur30.set(true));
                  }}>
                  30
                </Text>
              </View>
            </View>
            <Header
              colors={colors}
              fontF={font}
              title="Resolution"
              iconName={'tv-outline'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <View style={{marginTop: portrait ? width * 0.03 : height * 0.03}}>
              <TouchableOpacity
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
                    onValueChange={() => {
                      changeResolutionTo1MP('pi_cm3/cam_res/', '1');
                    }}
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
                    onValueChange={() => {
                      changeResolutionTo2MP('pi_cm3/cam_res/', '2');
                    }}
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
                    onValueChange={() => {
                      changeResolutionTo5MP('pi_cm3/cam_res/', '3');
                    }}
                    tintColors={{
                      true: camOn.get() || recOn.get() ? '#999999' : '#25AAE1',
                    }}
                  />
                  <Text style={styles.listFont}>720p</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.listContainer}
                onPress={StreamOff}>
                <View style={styles.fontContainer}>
                  <Icon
                    name={'repeat'}
                    color={'white'}
                    size={portrait ? width * 0.06 : height * 0.06}
                  />
                  <Text style={styles.listFont}>Stream Off</Text>
                </View>
                <View>
                  <Icon
                    name={'ios-chevron-forward'}
                    color={'white'}
                    size={portrait ? width * 0.06 : height * 0.06}
                  />
                </View>
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>
      </View>
    </Footer>
  );
}

export default Settings;
