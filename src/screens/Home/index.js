import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StatusBar,
  LayoutAnimation,
  UIManager,
  Platform,
  BackHandler,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  Touchable,
} from 'react-native';
import {Fonts} from '../../utils/fonts';
import {Dialog} from 'react-native-simple-dialogs';
import {useTheme} from '@react-navigation/native';
import {stringToBytes, bytesToString} from 'convert-string';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';
import {
  MyHeader,
  Button,
  Footer,
  GradientButton,
  Loader,
} from '../../components';
import SystemSetting from 'react-native-system-setting';
import {WebView} from 'react-native-webview';

//Import React Native Video to play video
import Video from 'react-native-video';

import {TextInput} from 'react-native-paper';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
import NetInfo from '@react-native-community/netinfo';
import BleManager from 'react-native-ble-manager';

//Media Controls to control Play/Pause/Seek and full screen
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Orientation, {
  useDeviceOrientationChange,
  useOrientationChange,
} from 'react-native-orientation-locker';
import {
  useDimensions,
  useDeviceOrientation,
} from '@react-native-community/hooks';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {useState as uS} from '@hookstate/core';

import {rS, cS} from '../../states';

const clc = require('cli-color');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const level = {
  empty: 'battery-empty',
  batt1: 'battery-1',
  batt2: 'battery-2',
  batt3: 'battery-3',
  full: 'battery-full',
};

let i = 0;

function index({props, navigation}) {
  const height = Dimensions.get('screen').height;
  const width = Dimensions.get('screen').width;

  const [rotateScreen, setRotateScreen] = useState(false);
  const [orientationState, setOrientationState] = useState(false);
  const Dorientation = useDeviceOrientation();
  console.log('is orientation portrait: ', Dorientation.portrait);
  console.log('is orientation landscape: ', Dorientation.landscape);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const net = NetInfo.useNetInfo();
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const {colors, font} = useTheme();

  let d = new Date();

  const [battery, setBattery] = useState(level.batt1);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [btnToggle, setBtnToggle] = useState(false);
  const [loader, setLoader] = useState(true);
  const [playFront, setPlayFront] = useState(false);
  const [playBack, setPlayBack] = useState(false);
  const [recBoth, setRecBoth] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [onPowerOff, setOnPowerOff] = useState(false);
  const [streamState, setStreamState] = useState(false);
  const [recState, setRecState] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pausedCam1, setPausedCam1] = useState(false);
  const [pausedCam2, setPausedCam2] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [bleName, setBleName] = useState('');
  const [bleId, setBleId] = useState('');
  const [pin, setPin] = useState('');
  const [devPin, setDevPin] = useState('');
  const [serID, setSerID] = useState('');
  const [charID, setCharID] = useState('');

  const [inputVisible, setInputVisible] = useState(false);
  const [recFlag, setRecFlag] = useState(false);
  const [powerFlag, setPowerFlag] = useState(false);

  const rec_On = uS(rS);
  const cam_On = uS(cS);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackToDo,
    );
    setLoader(false);
    iotResponse();
    return () => {
      console.log('chala video unmount videos');
      backHandler.remove();
    };
  }, [iotResponse]);

  const socketHandle = (key, msg) => {
    if (key) setActivityIndicator(true);
    setTopicUrl(key);
    setTopicMsg(msg);
    const socket = io(
      'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/',
    );
    socket.emit(key, msg);
    socket.on(key, arg => {
      console.log('socket=/storage/cloud----------', key, arg);
      setActivityIndicator(false);
    });
  };

  const iotResponse = () => {
    const socket = io(
      'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/',
    );

    socket.on('iotResponse/', arg => {
      if (arg === 'ON') {
        console.log('ON Recieving_____', arg);
        navigation.navigate('Home');
        cam_On.set(true);
        rec_On.set(true);
        Toast.show('Device turned On', Toast.SHORT);
        setStreamState(true);
        setRecState(true);
      } else if (arg === 'OFF') {
        rec_On.set(false);
        cam_On.set(false);
        Toast.show('Device turned Off', Toast.SHORT);
        setStreamState(false);
        setRecState(false);
        console.log('OFF Recieving_____', arg);
      }
      console.log('getiotresponse use effect----------', arg);
    });
  };

  useOrientationChange(o => {
    console.log('Oreintation change', o);
    if (o == 'LANDSCAPE-LEFT') {
      setOrientationState(true);
    } else if (o == 'PORTRAIT') {
      setOrientationState(false);
    }
  });

  const goToStream = () => {
    if (cam_On.get()) {
      setLoader(true);
      setTimeout(() => {
        setRotateScreen(true);
        setBtnToggle(true);
        setLoader(false);
      }, 3000);
    } else {
      alert('Streaming is Not Available!');
    }
  };

  const goToOffStream = () => {
    setLoader(true);
    setTimeout(() => {
      setRotateScreen(false);
      setBtnToggle(false);
      setLoader(false);
      Orientation.lockToPortrait();
    }, 3000);
  };

  const rotateToLandscape = () => {
    setRotateScreen(false);
    Orientation.getOrientation(orientation => {
      console.log('Current UI Orientation: ', orientation);
    });
    Orientation.lockToLandscape();
  };
  const rotateToPortrait = () => {
    setRotateScreen(true);
    Orientation.lockToPortrait();
  };

  const onBackToDo = () => {
    return true;
  };

  let some = () => {
    flatListRef.current.scrollToIndex({index: i++});
    setTimeout(() => {
      some();
    }, 1000);
    if (i > 3) {
      i = 0;
    }
  };

  const byCloud = () => {
    if (recFlag) {
      console.log(clc.xterm(9)('chala record off byCloud'));
      socketHandle('pi_cm3/state_record/', 'off');
      rec_On.set(false);
      setRecFlag(false);
      Toast.show('Recording turned off Successfully', Toast.SHORT);
    } else if (powerFlag) {
      console.log(clc.xterm(87)('chala power off byCloud'));
      socketHandle('pi_cm3/state_stream/', 'off');
      setBtnToggle(false);
      setPowerFlag(false);
      cam_On.set(false);
      Toast.show('Camera turned off Successfully', Toast.SHORT);
    }
    if (onPowerOff) {
      console.log('power off pr yeh chala');
      if (net.isConnected === false) {
        Toast.show('Network Unavailable.!', Toast.SHORT);
        setOnPowerOff(false);
        console.log(clc.xterm(159)('Net is not connected at Power Off'));
      } else {
        setDialogVisible(false);
        setOnPowerOff(false);
        console.log(clc.xterm(229)('Net is connected at Power Off'));
      }
    } else {
      console.log(clc.xterm(144)('Stop Recording'), btnToggle);
      console.log('record stop pr yeh chala');
      setRecBoth(false);
      console.log('chala');
      if (net.isConnected === false) {
        console.log(clc.xterm(38)('Stop Recording net is not connected'));
        Toast.show('Network Unavailable.!', Toast.SHORT);
      } else {
        setDialogVisible(false);
      }
    }
  };

  //!-------------------------------------------------------------------------------------------------------------------#FF5000

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
    let stringData = '';
    if (recFlag) {
      stringData = 'REC_0';
      Toast.show('Recording Stopped', Toast.SHORT);
      rec_On.set(false);
      console.log('record off chala ble se');
    } else if (powerFlag) {
      stringData = 'STR_0';
      Toast.show('Streaming Stopped', Toast.SHORT);
      cam_On.set(false);
      setOnPowerOff(true);
      setBtnToggle(false);
      console.log('stream off chala ble se');
    }
    setRecFlag(false);
    setPowerFlag(false);
    const bytesData = stringToBytes(stringData);
    BleManager.write(bleId, serID, charID, bytesData)
      .then(() => {
        // Success code
        setLoader(false);
        console.log('Write SuccessFully');
        setInputVisible(false);
        Toast.show('Command Send Successful!', Toast.SHORT);
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
          console.log('Disconnected');
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
      Toast.show('Connected, Sending Command', Toast.SHORT);
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

  const onFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      if (Platform.OS === 'ios') {
        Orientation.lockToPortrait();
      }
      Orientation.lockToPortrait();
    }
    setIsFullScreen(!isFullScreen);
  };

  const playFrontCam = value => {
    if (value == true) {
      setTimeout(() => {
        setPausedCam1(!pausedCam1);
        onFullScreen();
      }, 30);
      console.log(value, 'mili');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlayFront(!playFront);
    } else {
      setTimeout(() => {
        setPausedCam1(!pausedCam1);
        if (Dorientation.portrait) {
          onFullScreen();
        } else {
          setIsFullScreen(!isFullScreen);
        }
        setTimeout(() => {
          Orientation.unlockAllOrientations();
        }, 30);
      }, 30);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPlayFront(!playFront);
    }
  };

  const playBackCam = value => {
    if (value == true) {
      setTimeout(() => {
        setPausedCam2(!pausedCam2);
        onFullScreen();
      }, 30);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlayBack(!playBack);
    } else {
      setTimeout(() => {
        setPausedCam2(!pausedCam2);
        if (Dorientation.portrait) {
          onFullScreen();
        } else {
          setIsFullScreen(!isFullScreen);
        }
        setTimeout(() => {
          Orientation.unlockAllOrientations();
        }, 30);
      }, 30);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPlayBack(!playBack);
    }
  };

  const handlePowerOff = () => {
    console.log('daba power');
    if (cam_On.get()) {
      setPowerFlag(true);
      setDialogVisible(true);
      setRecState(false);
    } else {
      alert('Cam is already powered off!');
    }
  };

  const handleRecOff = () => {
    console.log('daba rec');
    if (rec_On.get()) {
      setRecFlag(true);
      setDialogVisible(true);
      setStreamState(false);
    } else {
      alert('Cam is already not Recording!');
    }
  };

  const handleBattCharging = () => {
    if (battery == level.empty) {
      setBattery(level.batt1);
    } else if (battery == level.batt1) {
      setBattery(level.batt2);
    } else if (battery == level.batt2) {
      setBattery(level.batt3);
    } else if (battery == level.batt3) {
      setBattery(level.full);
    } else if (battery == level.full) {
      setBattery(level.empty);
    }
    setTimeout(() => {
      handleBattCharging.bind(this);
    }, 800);
    console.log('chala', battery);
  };

  const alertToStopRec = () => {
    Alert.alert('Stop Recording', 'Do you want to stop recording?', [
      {
        text: 'Yes',
        onPress: handleRecOff,
        style: 'default',
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Canceled at Stop recording'),
        style: 'cancel',
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      width: orientationState ? height * 1 : width * 1,
      height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
      top: orientationState ? height * -0.05 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#242424',
    },
    text: {
      fontSize: height * 0.05,
    },
    leftCam: {
      height: Platform.OS == 'ios' ? height * 0.43 : height * 0.46,
      width: width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#202427',
    },
    rightCam: {
      height: Platform.OS == 'ios' ? height * 0.43 : height * 0.46,
      width: width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#202427',
    },
    streamCam: {
      height: Platform.OS == 'ios' ? height * 0.43 : height * 0.77,
      width: orientationState ? height * 1 : width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#202427',
    },
    blurImage: {
      height: Platform.OS == 'ios' ? height * 0.43 : height * 0.46,
      width: width,
      position: 'absolute',
    },
    insideImage: {
      height: height * 0.2,
      width: width,
      position: 'absolute',
    },
    btnContainer: {
      position: 'absolute',
      alignSelf: 'center',
      top: height * 0.38,
    },
    buttonsContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: width * 1,
      bottom: Platform.OS == 'ios' ? height * 0.38 : height * 0.5,
    },
    recordButton: {
      borderRadius: height * 0.1,
      height: height * 0.1,
      width: height * 0.1,
      marginHorizontal: height * 0.06,
      elevation: height * 0.005,
    },
    moreButton: {
      borderRadius: width * 0.2,
      height: width * 0.11,
      width: width * 0.11,
      elevation: width * 0.005,
    },
    cameraOneText: {
      color: 'white',
      fontFamily: Fonts.Lato,
      fontSize: width * 0.08,
      top: height * 0.05,
      textAlign: 'center',
    },
    mediaPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      backgroundColor: 'black',
      justifyContent: 'center',
    },
    backgroundVideo: {
      height: '100%',
      width: '100%',
    },
    mediaControls: {
      width: height - 170,
      height: '100%',
      flex: 1,
      alignSelf:
        Platform.OS === 'android'
          ? height < 800
            ? 'center'
            : 'flex-start'
          : 'center',
    },
    backgroundVideoFullScreen: {
      height: height,
      width: width,
    },
    backCam1: {
      borderRadius: height * 0.05,
      height: height * 0.06,
      width: height * 0.06,
      elevation: height * 0.005,
      borderWidth: height * 0.032,
    },
    doneButton: {
      width: width * 0.4,
      height: height * 0.05,
      borderRadius: height * 0.005,
    },
    inputDoneBtn: {
      alignSelf: 'center',
      width: width * 0.2,
      height: height * 0.05,
      borderRadius: height * 0.005,
      marginHorizontal: height * 0.01,
    },
  });
  return (
    <Footer props={props} hide={btnToggle} screen="home">
      <StatusBar backgroundColor="#202427" barStyle="default" />
      {loader || activityIndicator ? <Loader /> : null}
      <View style={styles.container}>
        {btnToggle == false ? (
          //? Off Stream View
          <View
            style={{
              flexDirection: 'column',
              bottom: height * 0.04,
            }}>
            {/*
            //! bluetooth / cloud dialog
            */}
            <Dialog
              visible={dialogVisible}
              contentStyle={{justifyContent: 'center', alignItems: 'center'}}
              overlayStyle={{
                paddingHorizontal: width * 0.2,
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
                size={height * 0.04}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 1,
                  top: 1,
                }}
              />
              <View
                style={{
                  height: height * 0.12,
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
            {/*
            //! Pin input Dialog
            */}
            <Dialog
              visible={inputVisible}
              overlayStyle={{
                paddingHorizontal: width * 0.2,
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
                  height: width * 0.3,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: width * 0.05,
                    color: '#ffffff',
                    textAlign: 'center',
                  }}>
                  Device Found
                </Text>
                <View
                  style={{
                    height: width * 0.1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: width * 0.01,
                    borderRadius: width * 0.01,
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
                      width: width * 0.4,
                      height: width * 0.06,
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
                    marginTop: width * 0.03,
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
                      setInputVisible(false);
                      _disconnectDevice();
                      setPin('');
                    }}
                  />
                </View>
              </View>
            </Dialog>
          </View>
        ) : (
          //? On Stream View
          <View
            style={{
              flexDirection: 'column',
              bottom: height * 0.05,
            }}>
            {/*
            //! bluetooth / cloud dialog
            */}
            <Dialog
              visible={dialogVisible}
              contentStyle={{justifyContent: 'center', alignItems: 'center'}}
              overlayStyle={{
                paddingHorizontal: width * 0.2,
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
                size={height * 0.04}
                style={{
                  position: 'absolute',
                  zIndex: 1,
                  right: 1,
                  top: 1,
                }}
              />
              <View
                style={{
                  height: height * 0.12,
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
            {/*
            //! bluetooth pin dialog
            */}
            <Dialog
              visible={inputVisible}
              overlayStyle={{
                paddingHorizontal: width * 0.2,
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
                  height: width * 0.3,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: width * 0.05,
                    color: '#ffffff',
                    textAlign: 'center',
                  }}>
                  Device Found
                </Text>
                <View
                  style={{
                    height: width * 0.1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: width * 0.01,
                    borderRadius: width * 0.01,
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
                      width: width * 0.4,
                      height: width * 0.06,
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
                    marginTop: width * 0.03,
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
                      setInputVisible(false);
                      _disconnectDevice();
                      setPin('');
                    }}
                  />
                </View>
              </View>
            </Dialog>
            <View style={styles.streamCam}>
              <View
                style={{
                  top: orientationState ? height * -0.12 : 0,
                  width: orientationState ? height * 1 : width * 1,
                  height: orientationState ? height * 0.55 : height * 0.46,
                  backgroundColor: '#ff5000',
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: height * 0.03,
                    left: width * 0.04,
                    zIndex: 1,
                  }}>
                  <Button
                    iconName={'chevron-back'}
                    iconColor={'white'}
                    iconSize={width * 0.045}
                    style={styles.moreButton}
                    onPress={() => goToOffStream()}
                  />
                </View>
                {/*
                //! in Landscape
                */}
                {!rotateScreen ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: height * 0.03,
                      right: width * 0.05,
                      zIndex: 1,
                    }}>
                    <Button
                      iconName={'contract'}
                      iconColor={'white'}
                      iconSize={width * 0.045}
                      style={styles.moreButton}
                      onPress={() => rotateToPortrait()}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      top: height * 0.03,
                      right: width * 0.05,
                      zIndex: 1,
                    }}>
                    <Button
                      iconName={'expand'}
                      iconColor={'white'}
                      iconSize={width * 0.045}
                      style={styles.moreButton}
                      onPress={() => rotateToLandscape()}
                    />
                  </View>
                )}
                <WebView
                  showsVerticalScrollIndicator={false}
                  style={{
                    width: width * 0.9,
                  }}
                  source={{uri: 'http://192.168.18.40:3000/'}}
                />
              </View>
            </View>
          </View>
        )}
        {btnToggle === false ? (
          <>
            <View
              style={{
                height: height,
                width: width,
                position: 'absolute',
                alignItems: 'flex-end',
                paddingTop: height * 0.01,
                paddingRight: height * 0.01,
              }}>
              <Button
                iconName={'ios-menu'}
                iconColor={'white'}
                iconSize={width * 0.08}
                style={styles.moreButton}
                onPress={() => {
                  cam_On.set(false);
                  console.log('Opened Drawer');
                }}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={goToStream}
                disabled={rec_On.get() || !cam_On.get()}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.55,
                    height: height * 0.1,
                    borderWidth: height * 0.002,
                    borderColor: !rec_On.get()
                      ? cam_On.get()
                        ? '#48dd08'
                        : '#555353'
                      : '#555353',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Kanit,
                      fontSize: height * 0.05,
                      color: !rec_On.get()
                        ? cam_On.get()
                          ? '#48dd08'
                          : '#555353'
                        : '#555353',
                    }}>
                    LIVE VIEW
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'absolute',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: width * 1,
                height: height * 1,
                bottom: Platform.OS == 'ios' ? height * 0.16 : height * 0.16,
              }}>
              <TouchableOpacity
                onPress={alertToStopRec}
                disabled={!rec_On.get() || !cam_On.get()}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                    height: height * 0.1,
                    borderWidth: height * 0.002,
                    borderColor: rec_On.get()
                      ? cam_On.get()
                        ? '#dd2408'
                        : '#555353'
                      : '#555353',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Kanit,
                      fontSize: height * 0.05,
                      color: rec_On.get()
                        ? cam_On.get()
                          ? '#dd2408'
                          : '#555353'
                        : '#555353',
                    }}>
                    STOP RECORDING
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : //  <Button
        //     iconName={'power'}
        //     iconColor={'white'}
        //     iconSize={width * 0.04}
        //     style={styles.moreButton}
        //     onPress={() => {
        //       // rec_On.set(!rec_On.get());
        //       handlePowerOff();
        //     }}/>
        null}
      </View>
    </Footer>
  );
}

export default index;
