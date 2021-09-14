import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
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
} from 'react-native';
// import styles from './style';
import {Fonts} from '../../utils/fonts';
import {Dialog} from 'react-native-simple-dialogs';
import {useTheme} from '@react-navigation/native';
import {stringToBytes, bytesToString} from 'convert-string';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';
import Pusher from 'pusher-js/react-native';
import {
  MyHeader,
  Button,
  Footer,
  GradientButton,
  Loader,
} from '../../components';
import SystemSetting from 'react-native-system-setting';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';
//Import React Native Video to play video
import Video from 'react-native-video';

// import RecordScreen from 'react-native-record-screen';
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
import {useDimensions} from '@react-native-community/hooks';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {useState as uS} from '@hookstate/core';

import {rS, cS} from '../../states';

const clc = require('cli-color');

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

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
// Pusher.logToConsole = true;

// var pusher = new Pusher('90701427f881755575d5', {
//   cluster: 'ap1',
// });
// let { width, height } = useDimensions().window;

// var channel = pusher.subscribe('dual-cam');

function index({props, navigation}) {
  // const {width, height} = useDimensions().window;
  const net = NetInfo.useNetInfo();
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const {colors, font} = useTheme();
  // const [portrait, setPortrait] = useState();
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const portrait = width < height;

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
  const [streamState, setStreamState] = useState(true);
  const [recState, setRecState] = useState(true);

  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
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
  const [server, setServer] = useState('Click to Connect');
  const [pinError, setPinError] = useState(false);

  const rec_On = uS(rS);
  const cam_On = uS(cS);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  Dimensions.addEventListener('change', e => {
    // const { width, height } = e.window;
    // this.setState({width, height});
    // console.log('change---__>', e.window);
    // const { width, height } = e.window;
    setWidth(e.window.width);
    setHeight(e.window.height);
  });
  useEffect(() => {
    const socket = io('http://192.168.18.40:8000');

    socket.emit('hello', 'world');
    socket.on('getRes', arg => {
      if (arg === 'ON') {
        navigation.navigate('Home'), cS.set(true);
        rS.set(true);
        setStreamState(true);
        setRecState(true);
      } else if (arg === 'OFF') {
        cS.set(false);
        rS.set(false);
        setStreamState(false);
        setRecState(false);
      }
    });

    setTimeout(() => {
      setLoader(false);
    }, 2000);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackToDo,
    );
    // setInputVisible(true);
    return () => {
      backHandler.remove();
      _disconnectDevice();
      console.log('chala unmout home>>>');
      BleManager.stopScan().then(() => {
        console.log('Scan Stopped');
      });
    };
  }, []);
  Dimensions.addEventListener('change', e => {
    // const { width, height } = e.window;
    // this.setState({width, height});
    console.log('change---__>', e.window);
  });
  useEffect(() => {
    // console.log('isPortrait---__>', isPortrait());
    // console.log('isLandscape---__>', isLandscape());
    // console.log('isPhone---__>', isPhone());
  }, []);
  // useDeviceOrientationChange(o => {
  //   console.log('Device Oreintation change', o);
  //   if (!btnToggle) {
  //     if (o == 'PORTRAIT') {
  //       setPortrait(true);
  //     } else if (o == 'LANDSCAPE-RIGHT') {
  //       setPortrait(false);
  //     } else if (o == 'LANDSCAPE-LEFT') {
  //       setPortrait(false);
  //     }
  //   }
  // });
  useOrientationChange(o => {
    console.log('Oreintation change', o);
  });

  const goToStream = () => {
    // setPortrait(false);
    setBtnToggle(true);
    // Orientation.lockToLandscape();
  };
  const goToOffStream = () => {
    // setPortrait(true);
    setBtnToggle(false);
    // Orientation.lockToPortrait();
    // Orientation.unlockAllOrientations();
  };

  const onBackToDo = () => {
    // alert('close');
    setTimeout(() => {
      // setPausedCam1(!pausedCam1);
      if (isFullScreen) {
        playFrontCam(false);
      }
    }, 30);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return true;
  };

  let some = () => {
    flatListRef.current.scrollToIndex({index: i++});
    // flatListRef1.current.scrollToIndex({index: i++});
    setTimeout(() => {
      some();
    }, 1000);
    if (i > 3) {
      i = 0;
    }
  };

  const sendResponse = path => {
    console.log('responded');
    const URL = `http://192.168.18.40:8000${path}`;
    fetch(URL)
      .then(response => {
        if (response.status == 200) {
          return response.text();
        }
      })
      .then(resonseText => {
        setServer(resonseText);
      })
      .catch(error => {
        console.error(error.message);
      });
  };

  const onProgress = data => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const checkData = () => {
    console.log('data', net.isInternetReachable);
    console.log('data', net.type);
    console.log('data', net.details);
    console.log('data', net.isConnected);
    console.log('data', net.isWifiEnabled);
  };

  const byCloud = () => {
    if (recFlag) {
      console.log(clc.xterm(9)('chala record off byCloud'));
      sendResponse('/rec/off');
      setRecFlag(false);
      Toast.show('Recording turned off Successfully', Toast.SHORT);
    } else if (powerFlag) {
      console.log(clc.xterm(87)('chala power off byCloud'));
      sendResponse('/stream/off');
      setBtnToggle(false);
      setPowerFlag(false);
      Toast.show('Camera turned off Successfully', Toast.SHORT);
    }
    if (onPowerOff) {
      console.log('power off pr yeh chala');
      if (net.isConnected === false) {
        Toast.show('Network Unavailable.!', Toast.SHORT);
        setOnPowerOff(false);
        console.log(clc.xterm(159)('Net is not connected at Power Off'));
      }
      // else if (net.isInternetReachable === false) {
      //   Toast.show('Internet Not Available', Toast.SHORT);
      // }
      else {
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
      }
      // else if (net.isInternetReachable === false) {
      //   Toast.show('Internet Not Available', Toast.SHORT);
      // }
      else {
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

  const _readAgain = () => {
    // sendResponse('/device/on');
    const socket = io('http://192.168.18.40:8000');
    // sendResponse('/stream/off');

    console.log('pressed');
    socket.emit('hello', 'world');
    socket.on('getRes', arg => {
      console.log('pakistan', arg); // world
    });
  };

  // Enable pusher logging - don't include this in production

  // channel.bind('testing', function (data) {
  //   console.log('data me yeh mila', data);
  //   console.log('data.JSON me yeh mila', JSON.stringify(data));
  //   // alert(JSON.stringify(data));
  // });
  // // var channel2 = pusher.subscribe('dual-cam');
  // channel.bind('streaming', function (data) {
  //   console.log('steaming data me yeh mila', data);
  //   if (data === 'ON') {
  //     console.log('On milagaya');
  //     cS.set(true);
  //   } else if (data === 'OFF') {
  //     console.log('Off milagaya');
  //     cS.set(false);
  //   }
  //   // alert(JSON.stringify(data));
  // });
  // channel.bind('recording', function (data) {
  //   console.log('recording data me yeh mila', data);
  //   if (data === 'ON') {
  //     console.log('On milagaya');
  //     navigation.navigate('Home'), cS.set(true);
  //     rS.set(true);
  //     setStreamState(true);
  //     setRecState(true);
  //   } else if (data === 'OFF') {
  //     console.log('Off milagaya');
  //     cS.set(false);
  //     rS.set(false);
  //     setStreamState(false);
  //     setRecState(false);
  //   }
  //   // alert(JSON.stringify(data));
  // });

  const retrieveServices = macId => {
    let serId = '';
    let charId = '';
    BleManager.retrieveServices(macId)
      .then(peripheralInfo => {
        // Success code
        console.log('Peripheral info:', peripheralInfo.characteristics);
        setTimeout(() => {
          charId = 'c301';
          serId = 'a002';
          let wcharId = 'c304';
          let wserId = 'a002';
          setSerID(wserId);
          setCharID(wcharId);
          console.log('aya service', serId);
          console.log('aya', charId);
          readFromDevice(macId, serId, charId);
          // writeToDevice(macId, serId, charId);
        }, 15000);
      })
      .catch(e => {
        console.log('Error aya retrieve me', e);
      });
  };

  const writeToDevice = (macId, serId, charId) => {
    let stringData = '';
    if (recFlag) {
      if (recBoth == false) {
        stringData = 'REC_1';
        Toast.show('Recording Start BLe', Toast.SHORT);
        setRecBoth(true);
      } else if (recBoth == true) {
        stringData = 'REC_0';
        Toast.show('Recording Stopped', Toast.SHORT);
        setRecBoth(false);
        console.log('record off chala ble se');
      }
    } else if (powerFlag) {
      stringData = 'STR_0';
      // setBtnToggle(!btnToggle);
      Toast.show('Device Powered Off', Toast.SHORT);
      setOnPowerOff(true);
      setBtnToggle(false);
      console.log('power off chala ble se');
    }
    setRecFlag(false);
    setPowerFlag(false);
    const bytesData = stringToBytes(stringData);
    BleManager.write(macId, serID, charID, bytesData)
      .then(() => {
        // Success code
        setLoader(false);
        console.log('Write SuccessFully');
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
        _disconnectDevice();
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
        // Toast.show(
        //   'Connection Success, Sending Command...',
        //   Toast.SHORT,
        // );
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        console.log('Error at Connecting: ', error);
        Toast.show('Error, Try Again', Toast.SHORT);
      });
  };

  const _scan = () => {
    BleManager.scan([], 10, false).then(() => {
      console.log('Scan Started');
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
          // setLoader(false);
          // setInputVisible(true);
          _connectToDevice(blId);
          console.log('***** pakra isne Device *****');
          bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
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
      Toast.show('Connected, Sending Command', Toast.SHORT);
      writeToDevice(bleId, serID, charID);
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

  const onLoadStart = data => setIsLoading(true);

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

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

  const playBothCam = () => {
    sendResponse('/stream/on');
    setPausedCam1(!pausedCam1);
    console.log('paused ka btaa', pausedCam1);
    if (pausedCam1) {
      sendResponse('/stream/off');
      setPowerFlag(true);
      setDialogVisible(true);
    }
    setTimeout(() => {
      setPausedCam2(!pausedCam2);
    }, 2000);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBtnToggle(!btnToggle);
  };

  const handleBothCam = () => {
    console.log('kia hai', btnToggle);
    if (!btnToggle) {
      // Stream is starting
      console.log('start karna chahte ho?');
      sendResponse('/stream/on');
      setBtnToggle(!btnToggle);
    }
    if (btnToggle) {
      // Stream is pausing
      console.log('stop karna chate ho?');
      setPowerFlag(true);
      setDialogVisible(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const playFrontCam = value => {
    if (value == true) {
      setTimeout(() => {
        setPausedCam1(!pausedCam1);
        // onFullScreen();
      }, 30);
      console.log(value, 'mili');
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlayFront(!playFront);
    } else {
      setTimeout(() => {
        setPausedCam1(!pausedCam1);
        if (portrait) {
          // onFullScreen();
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
        // onFullScreen();
      }, 30);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlayBack(!playBack);
    } else {
      setTimeout(() => {
        setPausedCam2(!pausedCam2);
        if (portrait) {
          // onFullScreen();
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

  // const StartRecord = () => {
  //   RecordScreen.startRecording({mic: true})
  //     .then(() => console.log('Started'))
  //     .catch(error => console.error(error));
  // };

  // const StopRecord = async () => {
  //   const res = await RecordScreen.stopRecording().catch(error =>
  //     console.warn(error),
  //   );
  //   if (res) {
  //     const url = res.result.outputURL;
  //     console.log('Path:', url);
  //     Toast.show('Done', Toast.SHORT);
  //     let kdata = files.slice();
  //     kdata.push({name: 'test1', filepath: url, filetype: 'video/mp4'});
  //     setFiles(kdata);
  //     setTimeout(() => {
  //       console.log('ata', files);
  //       uploadVideoFile();
  //     }, 2000);
  //   }
  // };

  const recordBothFn = () => {
    // recBoth ? sendResponse('/rec/off') : sendResponse('/rec/on');
    if (recBoth) {
      console.log('pakra hai');
      setDialogVisible(true);
      // setRecBoth(false);
    } else {
      setRecBoth(true);
      sendResponse('/rec/on');
      setRecFlag(true);
      Toast.show('Recording Start', Toast.SHORT);
    }
  };

  const handlePowerOff = () => {
    console.log('daba power');
    if (cam_On.get()) {
      setPowerFlag(true);
      setDialogVisible(true);
      sendResponse('/device/off');
      setRecState(false);
      if (streamState === false) {
        sendResponse('/device/off');
      }
      cS.set(false);
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
      if (recState === false) {
        sendResponse('/device/off');
      }
      rS.set(false);
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

  const styles = StyleSheet.create({
    container: {
      width: width * 1,
      height: Platform.OS == 'ios' ? height * 0.86 : height * 0.975,
      // top: height * .02,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'green',
    },
    text: {
      fontSize: height * 0.05,
    },
    leftCam: {
      height: portrait
        ? Platform.OS == 'ios'
          ? height * 0.43
          : height * 0.46
        : Platform.OS == 'ios'
        ? height * 0.43
        : height * 0.77,
      width: portrait ? width * 1 : width * 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#202427',
    },
    rightCam: {
      height: portrait
        ? Platform.OS == 'ios'
          ? height * 0.43
          : height * 0.46
        : Platform.OS == 'ios'
        ? height * 0.43
        : height * 0.77,
      width: portrait ? width * 1 : width * 0.5,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: 'blue',
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
      flexDirection: portrait ? 'row' : 'column',
      justifyContent: portrait ? 'center' : 'space-between',
      alignItems: 'center',
      width: width * 1,
      height: portrait ? height * 0 : height * 0.5,
      bottom: portrait
        ? Platform.OS == 'ios'
          ? height * 0.38
          : height * 0.535
        : Platform.OS == 'ios'
        ? height * 0.38
        : height * 0.31,
    },
    recordButton: {
      // position: 'absolute',
      borderRadius: height * 0.1,
      height: portrait ? height * 0.1 : width * 0.1,
      width: portrait ? height * 0.1 : width * 0.1,
      marginHorizontal: portrait ? height * 0.06 : width * 0.06,
      elevation: height * 0.005,
    },
    moreButton: {
      // position: 'absolute',
      borderRadius: portrait ? width * 0.2 : height * 0.2,
      height: portrait ? width * 0.11 : height * 0.11,
      width: portrait ? width * 0.11 : height * 0.11,
      elevation: width * 0.005,
      // borderWidth: width * .05
      // bottom:height * .02,
      zIndex: 1,
    },
    cameraOneText: {
      color: 'white',
      fontFamily: Fonts.Lato,
      fontSize: width * 0.08,
      top: height * 0.05,
      textAlign: 'center',
      // position:'absolute'
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
      width: screenHeight - 170,
      height: '100%',
      flex: 1,
      alignSelf:
        Platform.OS === 'android'
          ? screenHeight < 800
            ? 'center'
            : 'flex-start'
          : 'center',
    },
    backgroundVideoFullScreen: {
      height: screenHeight,
      width: screenWidth,
    },
    backCam1: {
      borderRadius: height * 0.05,
      height: height * 0.06,
      width: height * 0.06,
      elevation: height * 0.005,
      borderWidth: height * 0.032,
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

  // console.log('portrait bata', portrait);

  return playFront == true ? (
    <View>
      <StatusBar backgroundColor="#202427" barStyle="default" hidden={true} />
      {/* <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={!pausedCam1}
        ref={ref => (videoPlayer.current = ref)}
        resizeMode={'cover'}
        posterResizeMode={'cover'}
        onFullScreen={isFullScreen}
        source={require('../../assets/videos/MyVideo1.mp4')}
        style={styles.backgroundVideo}
        volume={10}
      /> */}
      <View style={styles.backgroundVideo}>
        <View
          style={{
            // top: height * -0.02,
            left: width * 0.3,
            // right: portrait ? width * 0.0 : width * -0.15,
            width: width * 0.425,
            height: height * 1,
            backgroundColor: '#abc212',
            // right: width * 0.0,
            // width: width * 0.75 ,
            // height: height * 0.46 ,
            // transform: [{rotate: '90deg'}],
          }}>
          <WebView
            showsVerticalScrollIndicator={false}
            style={{
              width: width * 0.85,
            }}
            source={{uri: 'http://192.168.18.40:3000/'}}
          />
        </View>
      </View>
      {/* <MediaControls
          isFullScreen={isFullScreen}
          duration={duration}
          isLoading={isLoading}
          progress={currentTime}
          // onFullScreen={onFullScreen}
          onPaused={() => playFrontCam(false)}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          mainColor={'#0179B0'}
          playerState={playerState}
          // style={isFullScreen ? styles.backgroundVideoFullScreen : styles.backgroundVideo}
        // sliderStyle={isFullScreen ? { containerStyle: styles.mediaControls, thumbStyle: {}, trackStyle: {} } : { containerStyle: {}, thumbStyle: {}, trackStyle: {} }}
        /> */}
      <View
        style={{
          position: 'absolute',
          top: height * 0.03,
          left: width * 0.04,
        }}>
        {/* <Button
          iconName={'chevron-back'}
          iconColor={'white'}
          iconSize={width * 0.045}
          style={styles.moreButton}
          onPress={() => playFrontCam(false)}
        /> */}
      </View>
    </View>
  ) : playBack == true ? (
    <View>
      <StatusBar backgroundColor="#202427" barStyle="default" hidden={true} />
      {/* <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={!pausedCam2}
        ref={ref => (videoPlayer.current = ref)}
        resizeMode={'cover'}
        posterResizeMode={'cover'}
        onFullScreen={isFullScreen}
        // source={require('../../assets/videos/MyVideo8.mp4')}
        style={styles.backgroundVideo}
        volume={10}
      /> */}
      <View style={styles.backgroundVideo}>
        <View
          style={{
            // top: height * -0.02,
            left: width * 0.3,
            width: width * 0.425,
            height: height * 1,
          }}>
          <WebView
            showsVerticalScrollIndicator={false}
            style={{
              right: width * 0.425,
              width: width * 0.85,
            }}
            source={{uri: 'http://192.168.10.6:3000/'}}
          />
        </View>
      </View>
      {/* <MediaControls
              duration={duration}
              isLoading={isLoading}
              mainColor="#333"
              onFullScreen={onFullScreen}
              onPaused={onPaused}
              onReplay={onReplay}
              onSeek={onSeek}
              onSeeking={onSeeking}
              playerState={playerState}
              progress={currentTime}
              toolbar={renderToolbar()}
            /> */}
      <View
        style={{
          position: 'absolute',
          top: height * 0.03,
          left: width * 0.04,
        }}>
        {/* <Button
          iconName={'chevron-back'}
          iconColor={'white'}
          iconSize={width * 0.045}
          style={styles.moreButton}
          onPress={() => playBackCam(false)}
        /> */}
      </View>
    </View>
  ) : (
    <Footer props={props} screen="home">
      <StatusBar backgroundColor="#202427" barStyle="default" />
      {loader ? <Loader /> : null}
      <View style={styles.container}>
        {playFront == false && btnToggle == false ? (
          <View
            style={{
              flexDirection: portrait ? 'column' : 'row',
              bottom: portrait ? height * 0.04 : width * 0.04,
            }}>
            <Dialog
              visible={dialogVisible}
              contentStyle={{justifyContent: 'center', alignItems: 'center'}}
              overlayStyle={{
                paddingHorizontal: portrait ? width * 0.2 : height * 0.55,
              }}
              // title="Custom Dialog"
              dialogStyle={{
                backgroundColor: '#1C212D',
                borderRadius: height * 0.01,
              }}
              onTouchOutside={() => setDialogVisible(false)}>
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
                      setInputVisible(false);
                      _disconnectDevice();
                    }}
                  />
                </View>
              </View>
            </Dialog>
            <TouchableOpacity
              style={styles.leftCam}
              // onPress={() => playFrontCam(true)}
            >
              <Image
                source={require('../../assets/images/globe.jpg')}
                style={{
                  height: portrait ? height * 0.5 : width * 0.5,
                  width: width,
                }}
                blurRadius={15}
              />
              <Image
                source={require('../../assets/images/globe.jpg')}
                style={{
                  height: portrait ? height * 0.2 : width * 0.2,
                  width: width,
                  position: 'absolute',
                }}
              />
              <Icon
                name={'play-outline'}
                color={'white'}
                size={portrait ? width * 0.2 : height * 0.2}
                style={{
                  position: 'absolute',
                  backgroundColor: '#00000027',
                  borderRadius: portrait ? width * 0.02 : height * 0.02,
                }}
              />
              {/* <Text
                style={{
                  bottom: portrait ? height * 0.42 : width * 0.11,
                  fontSize: portrait ? height * 0.05 : width * 0.05,
                  color: 'black',
                }}>
                Left Cam
              </Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rightCam}
              // onPress={() => playBackCam(true)}
            >
              <Image
                source={require('../../assets/images/building.jpg')}
                style={{
                  height: portrait ? height * 0.5 : width * 0.5,
                  width: width,
                  position: 'absolute',
                }}
                blurRadius={15}
              />
              <Image
                source={require('../../assets/images/building.jpg')}
                style={{
                  height: portrait ? height * 0.2 : width * 0.2,
                  width: width,
                  position: 'absolute',
                }}
              />
              <Icon
                name={'play-outline'}
                color={'white'}
                size={portrait ? width * 0.2 : height * 0.2}
                style={{
                  position: 'absolute',
                  backgroundColor: '#00000027',
                  borderRadius: portrait ? width * 0.02 : height * 0.02,
                }}
              />
              {/* <Text
                style={{
                  top: portrait ? height * 0.14 : width * 0.14,
                  fontSize: portrait ? height * 0.05 : width * 0.05,
                  color: 'black',
                }}>
                Right Cam
              </Text> */}
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              flexDirection: portrait ? 'column' : 'row',
              bottom: portrait ? height * 0.05 : width * 0.04,
            }}>
            <Dialog
              visible={dialogVisible}
              contentStyle={{justifyContent: 'center', alignItems: 'center'}}
              overlayStyle={{
                paddingHorizontal: portrait ? width * 0.2 : height * 0.55,
              }}
              // title="Custom Dialog"
              dialogStyle={{
                backgroundColor: '#1C212D',
                borderRadius: height * 0.01,
              }}
              onTouchOutside={() => setDialogVisible(false)}>
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
                      setInputVisible(false);
                      _disconnectDevice();
                    }}
                  />
                </View>
              </View>
            </Dialog>
            {/* <View style={styles.leftCam}>
              <View
              style={{
                // top: height * -0.02,
                right: portrait ? width * 0.0 : width * -0.15,
                width: portrait ? width * 0.75 : width * 0.5,
                height: portrait ? height * 0.46 : height * 0.77,
                backgroundColor: '#abc212',
                // right: width * 0.0,
                // width: width * 0.75 ,
                // height: height * 0.46 ,
                // transform: [{rotate: '90deg'}],
              }}
              >
                <WebView
                  showsVerticalScrollIndicator={false}
                  style={{
                    // top: height * -0.001,
                    // transform: [{rotate: '90deg'}],
                    // width: portrait ? width * 1.5 : width * 0.7,
                    width: portrait ? width * 1.5 : width * 0.7,
                  }}
                  source={{uri: 'https://wir-aim.github.io/AWS-Stream/'}}
                />
              </View>
              <Video
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={!pausedCam1}
                ref={videoPlayer}
                resizeMode={'contain'}
                onFullScreen={isFullScreen}
                source={require('../../assets/videos/MyVideo00.webm')}
                style={styles.mediaPlayer}
                volume={1}
              />
            </View> */}
            <View style={styles.rightCam}>
              <View
              // style={{
              //   // top: height * -0.02,
              //   left: width * 0.0,
              //   width: portrait ? width * 0.75 : width * 0.5,
              //   height: portrait ? height * 0.46 : height * 0.77,
              //   backgroundColor: '#ff5000',
              //   // transform: [{rotate: '-90deg'}],
              // }}
              >
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
                    iconSize={portrait ? width * 0.045 : height * 0.045}
                    style={styles.moreButton}
                    onPress={() => goToOffStream()}
                  />
                </View>
                <WebView
                  showsVerticalScrollIndicator={false}
                  style={{
                    // top: portrait ? height * -0.02 : height * 0,
                    // right: portrait ? width * 0.75 : width * 0.35,
                    width: portrait ? width * 1 : width * 1,
                  }}
                  source={{uri: 'http://192.168.0.104:3000/'}}
                />
              </View>
              {/* <Video
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={!pausedCam2}
                ref={videoPlayer}
                resizeMode={'contain'}
                onFullScreen={isFullScreen}
                source={require('../../assets/videos/MyVideo00.webm')}
                style={styles.mediaPlayer}
                volume={1}
              /> */}
            </View>
          </View>
        )}
        {btnToggle === false ? (
          <View style={styles.buttonsContainer}>
            <Button
              iconName={'power'}
              iconColor={'white'}
              iconSize={portrait ? width * 0.04 : height * 0.04}
              style={styles.moreButton}
              onPress={() => {
                // rec_On.set(!rec_On.get());
                handlePowerOff();
              }}
            />
            <GradientButton
              iconName={'play'}
              iconColor={btnToggle == false ? 'white' : 'red'}
              iconSize={portrait ? width * 0.08 : height * 0.08}
              style={styles.recordButton}
              onPress={() => {
                // rS.set(false);
                // cS.set(false);
                // _readAgain();
                // setBtnToggle(!btnToggle);
                goToStream();
                // handleBothCam()
              }}
            />
            <Button
              iconName={'square'}
              iconColor={'red'}
              iconSize={portrait ? width * 0.04 : height * 0.04}
              style={styles.moreButton}
              onPress={() => {
                // recordBothFn();
                handleRecOff();
              }}
            />
          </View>
        ) : null}
      </View>
    </Footer>
  );
}

export default index;
