import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  UIManager,
  Platform,
  BackHandler,
  Dimensions,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {Fonts} from '../../utils/fonts';
import {Dialog} from 'react-native-simple-dialogs';
import {stringToBytes, bytesToString} from 'convert-string';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';
import {
  Button,
  Footer,
  GradientButton,
  Loader,
  CustumStatusBar,
} from '../../components';
import SystemSetting from 'react-native-system-setting';
import {TextInput} from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import BleManager from 'react-native-ble-manager';
import Orientation, {
  useOrientationChange,
} from 'react-native-orientation-locker';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {useState as uS} from '@hookstate/core';
import useTimeout from '../../hooks/useTimeout';
import usePrevious from '../../hooks/usePrevious';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import useDebounce from '../../hooks/useDebounce';
import VideoPlayer from 'react-native-video-controls';
import styles from './style';

import {rS, cS} from '../../states';
import {create} from 'apisauce';

const clc = require('cli-color');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

var awsURL =
  'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com';

const api = create({
  baseURL: awsURL,
});

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

  const errorCountRef = useRef(0);

  const {reset, clear} = useTimeout(() => {
    Toast.show('Some Error while Finding, Try Again');
    setLoader(false);
    console.log('Device not Found!');
    setTimeout(() => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    }, 800);
  }, 10000);

  const {reset: resetRes, clear: clearRes} = useTimeout(() => {
    Toast.show('Not Getting Response', Toast.SHORT);
    console.log('Not Getting Response! Home Se');
    setLoader(false);
    setActivityIndicator(false);
    if (liveStateOn) {
      goToOffStream(false);
      resp.current = false;
      setTimeout(() => {
        resp.current = true;
      }, 23000);
    }
  }, 20000);

  useDebounce(
    () => {
      errorCountRef.current = 0;
      console.log(
        clc.xterm(216)('No Error Found for 1 minute, Resetting Count!'),
      );
    },
    60000,
    [errorCountRef.current],
  );

  const resp = useRef(true);

  const [rotateScreen, setRotateScreen] = useState(false);
  const [orientationState, setOrientationState] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const net = NetInfo.useNetInfo();
  const flatListRef = useRef();

  const topic = useRef('');
  const msg = useRef('');
  const previousTopic = usePrevious(topicUrl);
  const previousMsg = usePrevious(topicMsg);

  const [battery, setBattery] = useState(level.batt1);
  const [btnToggle, setBtnToggle] = useState(false);
  const [loader, setLoader] = useState(true);

  const [recBoth, setRecBoth] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [onPowerOff, setOnPowerOff] = useState(false);
  const [streamState, setStreamState] = useState(false);
  const [recState, setRecState] = useState(false);
  const [liveUrl, setLiveUrl] = useState('');
  const [liveStateOn, setLiveStateOn] = useState(true);
  const [urlFound, setUrlFound] = useState(false);

  const [bleName, setBleName] = useState('');
  const [bleId, setBleId] = useState('');
  const [pin, setPin] = useState('');
  const [devPin, setDevPin] = useState('');
  const [serID, setSerID] = useState('');
  const [charID, setCharID] = useState('');

  const [inputVisible, setInputVisible] = useState(false);
  const [recFlag, setRecFlag] = useState(false);
  const [powerFlag, setPowerFlag] = useState(false);

  const videoPlayer = useRef(null);

  const rec_On = uS(rS);
  const cam_On = uS(cS);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    clear();
    clearRes();
    console.log('chala useEffect homey');
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackToDo,
    );
    setLoader(false);
    socketHandle('pi_cm3/application/', 'on');
    return () => {
      console.log('chala video unmount Homes');
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', () => {
      console.log('Change me kuch aya', AppState.currentState);
      if (AppState.currentState == 'active') {
        console.log('XXXXXXOUTXXXXXXX');
        resetRes();
      }
    });
    return () => {
      AppState.removeEventListener('change');
    };
  }, []);

  useEffect(() => {
    iotResponse();
  }, [iotResponse]);

  const local = 'http://192.168.0.118:8000';
  const global =
    'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/';
  const socket = io(global);

  const socketHandle = (key, message) => {
    console.log('socketHandle');
    if (key) setActivityIndicator(true);
    setTopicUrl(key);
    setTopicMsg(message);
    topic.current = key;
    msg.current = message;
  };

  const socketCatcher = (topics, msgs) => {
    resetRes();
    console.log('Socket Catcher runs', clc.xterm(86)('Resetted Home'));
    socket.emit(topics, msgs);
    socket.on(topics, arg => {
      console.log(
        clc.yellowBright(
          'Home socket=/storage/cloud catcher----------',
          topics,
          arg,
        ),
      );
      setTimeout(() => {
        socket.off(topics);
        topic.current = '';
        msg.current = '';
      }, 800);
    });
  };

  useUpdateEffect(() => {
    if (previousTopic !== topic.current && previousMsg !== msg.current) {
      if (topic.current !== '' || msg.current !== '') {
        console.log('CHALA USE EFFECT HOME PR');
        socketCatcher(topic.current, msg.current);
        console.log(
          clc.xterm(14)(
            'Home Chala socketHandle use Update Effect me',
            clc.yellowBright(`topic=${topic.current}`),
            clc.redBright(`Msg=${msg.current}`),
          ),
        );
        setTimeout(() => {
          setTopicUrl('');
          setTopicMsg('');
        }, 200);
      }
    }
  }, [topicUrl, topicMsg]);

  const iotResponse = () => {
    socket.on('iotResponse/', arg => {
      if (arg === 'pwr_on') {
        console.log('pwr_on Recieving_____Home', arg);
        // navigation.navigate('Home');
        cam_On.set(true);
        Toast.show('Device turned On', Toast.SHORT);
        setStreamState(true);
        setRecState(false);
        setActivityIndicator(false);
        console.log(clc.xterm(140)('XXXX CHALA KIA'));
        clearRes();
      } else if (arg === 'pwr_off') {
        rec_On.set(false);
        cam_On.set(false);
        Toast.show('Device turned Off', Toast.SHORT);
        setStreamState(false);
        setRecState(false);
        console.log('pwr_off Recieving_____ Home', arg);
        clearRes();
      } else if (arg === 'rec_on') {
        rec_On.set(true);
        Toast.show('Recording turned On', Toast.SHORT);
        // navigation.navigate('Home');
        setActivityIndicator(false);
        setRecState(true);
        console.log('rec_on Recieving_____', arg);
        clearRes();
      } else if (arg === 'rec_off') {
        rec_On.set(false);
        Toast.show('Recording turned Off', Toast.SHORT);
        setRecState(false);
        console.log('rec_off Recieving_____', arg);
        clearRes();
      } else if (arg === 'success') {
        console.log(clc.xterm(149)('success Recieving_____', arg));
        setActivityIndicator(false);
        clearRes();
      }
      console.log('getiotresponse use effect home----------', arg);
      setActivityIndicator(false);
      // socket.close();
      // setTimeout(() => {
      //   socket.open();
      //   socket.off('iotResponse/');
      // }, 800);
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

  const fetchLiveStream = () => {
    setLiveUrl('');
    setUrlFound(false);
    console.log('XXX', resp.current);
    if (resp.current) {
      api
        .get('/api/video/getLiveStream')
        .then(res => {
          if (res?.data?.success) {
            setLiveUrl(res?.data?.info);
            console.log(clc.xterm(120)('Url Generated', res?.data?.info));
            setTimeout(() => {
              setUrlFound(true);
            }, 800);
          } else {
            setUrlFound(false);
            Toast.show('Live Stream Not Exist at the Moment', Toast.SHORT);
            goToOffStream(true);
          }
        })
        .catch(e => {
          console.log('Error while Fetching Live Stream', e);
          setUrlFound(false);
          goToOffStream(true);
        });
    }
  };

  const goToStream = () => {
    if (cam_On.get()) {
      if (net.isConnected) {
        if (liveStateOn) {
          socketHandle('pi_cm3/live/', 'on');
          AppState.addEventListener('change', state => {
            if (state === 'active') {
              // do this
              console.log('Active State');
            } else if (state === 'background') {
              // do that
              console.log('Background State');
              goToOffStream(true);
            } else if (state === 'inactive') {
              console.log('inActive State');
              // do that other thing
            }
          });
          setBtnToggle(true);
          setRotateScreen(true);
          setTimeout(() => {
            fetchLiveStream();
          }, 30000);
        } else {
          Toast.show(
            'Live Stream not Ready Yet, Try Again in 30 seconds',
            Toast.SHORT,
          );
        }
      } else {
        Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
      }
    } else {
      alert('Streaming is Not Available!');
    }
  };

  const goToOffStream = bool => {
    console.log('goToOffStream');
    if (bool) {
      socketHandle('pi_cm3/live/', 'off');
    }
    setTimeout(() => {
      setLiveUrl('');
      setUrlFound(false);
      setLiveStateOn(false);
      setLoader(false);
      setBtnToggle(false);
      setRotateScreen(false);
      Orientation.lockToPortrait();
      setTimeout(() => {
        setLiveStateOn(true);
      }, 30000);
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
    if (net.isConnected) {
      if (recFlag) {
        console.log(clc.xterm(9)('chala record off byCloud'));
        socketHandle('pi_cm3/stop/', 'off');
        setRecFlag(false);
        // Toast.show('Recording turned off Successfully', Toast.SHORT);
      } else if (powerFlag) {
        console.log(clc.xterm(87)('chala power off byCloud'));
        socketHandle('pi_cm3/state_stream/', 'off');
        setBtnToggle(false);
        setPowerFlag(false);
        cam_On.set(false);
        // Toast.show('Camera turned off Successfully', Toast.SHORT);
      }
      if (onPowerOff) {
        console.log('power off pr yeh chala');
        setDialogVisible(false);
        setOnPowerOff(false);
        console.log(clc.xterm(229)('Net is connected at Power Off'));
      } else {
        console.log(clc.xterm(144)('Stop Recording'), btnToggle);
        console.log('record stop pr yeh chala');
        setRecBoth(false);
        console.log('chala');
        setDialogVisible(false);
      }
    } else {
      Toast.show('Check Your Mobile Internet Connection', Toast.SHORT);
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
        }, 800);
      })
      .catch(e => {
        console.log('Error aya retrieve me', e);
      });
  };

  const handleTurnOffStream = () => {
    if (errorCountRef.current >= 5) {
      console.log('Stream Turning Off.....');
      goToOffStream(false);
      Toast.show('Streaming Failed, Device not Responding', Toast.SHORT);
      errorCountRef.current = 0;
    }
    errorCountRef.current = errorCountRef.current + 1;
    console.log('What is the error count', errorCountRef.current);
  };

  const writeToDevice = () => {
    let stringData = '';
    if (recFlag) {
      stringData = 'REC_0';
      Toast.show('Recording Stopped', Toast.SHORT);
      rec_On.set(false);
      cam_On.set(true);
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
        }, 1000);
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
    }
  };

  const _connectToDevice = macId => {
    console.log('aya mac', macId);
    BleManager.connect(macId)
      .then(() => {
        bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
        clear();
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
      reset();
      console.log('Scan started');
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        ({name, id, rssi}) => {
          console.log('kia aya name', name);
          console.log('kya aya id', id);
          console.log('kia aya rssi', rssi);
          if (name == 'app') {
            setBleName(name);
            setBleId(id);
            blN = name;
            blId = id;
            console.log('id', blId);
            console.log('name', blN);
            console.log('***** pakra isne Device *****');
          }
        },
      );
      setTimeout(() => {
        if (blId !== '') {
          _connectToDevice(blId);
        }
      }, 8000);
    });
  };

  const byBlueT = () => {
    if (Platform.OS == 'ios') {
      BluetoothStateManager.getState().then(bluetoothState => {
        if (bluetoothState == 'PoweredOn') {
          setDialogVisible(false);
          setLoader(true);
          console.log('Module initialized');
          _scanAndGet();
        } else {
          Alert.alert(
            'Turn Bluetooth',
            'This App wants to turn on your bluetooth',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed on Bluetooth On'),
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => {
                  Linking.openURL('App-Prefs:Bluetooth');
                },
              },
            ],
          );
        }
      });
    } else {
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
    }
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

  const handleRecOff = () => {
    console.log('daba rec');
    if (rec_On.get()) {
      setRecFlag(true);
      setDialogVisible(true);
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

  const reloadVideo = () => {
    setUrlFound(false);
    setTimeout(() => {
      setUrlFound(true);
    }, 400);
  };

  const handleStreamEnd = () => {
    setUrlFound(false);
    setLiveUrl('');
    goToOffStream(true);
  };

  const testHls =
    'https://diceyk6a7voy4.cloudfront.net/e78752a1-2e83-43fa-85ae-3d508be29366/hls/fitfest-sample-1_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_6.0Mbps_qvbr.m3u8';

  const testMp4 =
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

  const awsHls =
    'https://b-feb73142.kinesisvideo.ap-south-1.amazonaws.com/hls/v1/getHLSMasterPlaylist.m3u8?SessionToken=CiBzY8Pc60cgUYacGaJtg5uJGjUdMC0brek1xYKIYnuEuRIQ02a_5IWAchABvehjjBI6mxoZ1tvMlbv5UkRsN-CJycnLKoApSLLYpXspgCIg3COKRH6C8YJ4Bms5cCHvOqHIjMBkdBxzk0ACdiis7o4~';

  return (
    <Footer props={props} hide={btnToggle} screen="home">
      {btnToggle == true ? null : <CustumStatusBar />}
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

          //? Landscape Stream View
          <View
            style={{
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              backgroundColor: '#ff5000',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                top: Platform.OS == 'ios' ? height * 0.05 : height * 0.03,
                left: width * 0.04,
                zIndex: 1,
              }}>
              <Button
                iconName={'chevron-back'}
                iconColor={'white'}
                iconSize={
                  Platform.OS == 'ios'
                    ? orientationState
                      ? height * 0.055
                      : width * 0.045
                    : width * 0.045
                }
                style={styles.moreButton}
                onPress={() => goToOffStream(true)}
              />
            </View>
            {/*
                //! in Landscape
            */}
            {!rotateScreen ? (
              <View
                style={{
                  position: 'absolute',
                  top: Platform.OS == 'ios' ? height * 0.05 : height * 0.03,
                  right: width * 0.05,
                  zIndex: 1,
                }}>
                <Button
                  iconName={'contract'}
                  iconColor={'white'}
                  iconSize={
                    Platform.OS == 'ios'
                      ? orientationState
                        ? height * 0.055
                        : width * 0.045
                      : width * 0.045
                  }
                  style={styles.moreButton}
                  onPress={() => rotateToPortrait()}
                />
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  top: Platform.OS == 'ios' ? height * 0.05 : height * 0.03,
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
            <View
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#1C212D',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {urlFound ? (
                <VideoPlayer
                  source={{uri: liveUrl}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: width * 0.01,
                  }}
                  onBuffer={() => console.log('Video is Buffering')} // Callback when remote video is buffering
                  onError={e => {
                    console.log('Error while Loading Video', e);
                    reloadVideo();
                    handleTurnOffStream();
                  }} // Callback when video cannot be loaded
                  onEnd={() => {
                    console.log(clc.bgMagenta('Stream has Ended!'));
                    handleStreamEnd();
                  }}
                  onReadyForDisplay={() =>
                    console.log('<+++++++ Ready to Stream ++++++>')
                  }
                  ref={videoPlayer}
                  disablePlayPause
                  disableSeekbar
                  disableFullscreen
                  disableVolume
                  disableTimer
                  disableBack
                  volume={10}
                />
              ) : (
                <View>
                  <ActivityIndicator color="#fff" size="large" />
                  <Text style={{color: '#fff', fontSize: width * 0.045}}>
                    Fetching Stream Please Wait...
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        {btnToggle === false ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: '#292929',
            }}>
            <View
              style={{
                alignItems: 'flex-end',
                height: '10%',
                justifyContent: 'center',
                paddingRight: height * 0.01,
              }}>
              <Button
                iconName={'ios-menu'}
                iconColor={'white'}
                iconSize={width * 0.08}
                style={styles.moreButton}
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </View>
            <View
              style={{
                height: '45%',
                alignSelf: 'center',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={goToStream}
                disabled={rec_On.get() || !cam_On.get()}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.55,
                    height: height * 0.1,
                    borderWidth: width * 0.004,
                    borderColor: cam_On.get()
                      ? !rec_On.get()
                        ? '#48dd08'
                        : '#555353'
                      : '#555353',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Kanit,
                      fontSize: width * 0.1,
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
                height: '45%',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={alertToStopRec}
                disabled={!rec_On.get()}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                    height: height * 0.1,
                    borderWidth: width * 0.004,
                    borderColor: rec_On.get() ? '#dd2408' : '#555353',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.Kanit,
                      fontSize: width * 0.1,
                      color: rec_On.get() ? '#dd2408' : '#555353',
                    }}>
                    STOP RECORDING
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
    </Footer>
  );
}

export default index;
