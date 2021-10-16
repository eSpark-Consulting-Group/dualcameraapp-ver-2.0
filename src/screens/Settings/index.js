import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  AppState,
  LayoutAnimation,
  UIManager,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput as PaperInput} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '@react-navigation/native';
import {
  Footer,
  Header,
  CustumStatusBar,
  GradientButton,
  Loader,
} from '../../components';
import CheckBox from '@react-native-community/checkbox';
import {stringToBytes, bytesToString} from 'convert-string';
import {Dialog} from 'react-native-simple-dialogs';
import Icon from 'react-native-vector-icons/Ionicons';

import SystemSetting from 'react-native-system-setting';
import BleManager from 'react-native-ble-manager';
import NetInfo from '@react-native-community/netinfo';
import {useDimensions} from '@react-native-community/hooks';
import Toast from 'react-native-simple-toast';
import io from 'socket.io-client';
import styles from './style';
import ClipBoard from '@react-native-community/clipboard';
import usePrevious from '../../hooks/usePrevious';

import useUpdateEffect from '../../hooks/useUpdateEffect';
import {useState as uS} from '@hookstate/core';
import {
  toggle1MPs,
  toggle2MPs,
  toggle5MPs,
  toggle8MPs,
  checkVal,
  cS,
  rS,
  fbPinFlag,
  ytPinFlag,
} from '../../states';
import clc from 'cli-color';
import useTimeout from '../../hooks/useTimeout';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import useAsync from '../../hooks/useAsync';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const awsUrl =
  'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/';

const socket = io(awsUrl);

function Settings({props, navigation}) {
  const net = NetInfo.useNetInfo();
  const {reset, clear} = useTimeout(() => {
    console.log(clc.bgBlue('asdadasdadad'));
    Toast.show('Device has internet issues', Toast.SHORT);
    setActivityIndicator(false);
    setDialogVisible(false);
    setLoader(false);
    setSuccessRes(false);
    setSuccessStrm(false);
  }, 10000);
  const {reset: resetBle, clear: clearBle} = useTimeout(() => {
    Toast.show('Error while searching Device, Try Again', Toast.SHORT);
    console.log('Device not Found!');
    setLoader(false);
    setPinFlag(false);
    setPowerFlag(false);
    setBattFlag(false);
    setTimeout(() => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    }, 800);
  }, 10000);
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const {colors, font} = useTheme();

  const toggle1MP = uS(toggle1MPs); //!
  const toggle2MP = uS(toggle2MPs); //!
  const toggle5MP = uS(toggle5MPs); //!
  const toggle8MP = uS(toggle8MPs); //!

  const fb_pin = uS(fbPinFlag);
  const yt_pin = uS(ytPinFlag);

  const [activityIndicator, setActivityIndicator] = useState(false);
  const [wifiToggle, setWifiToggle] = useState(false);

  const [bleToggle, setBleToggle] = useState(false);

  const checkValue = uS(checkVal); //!

  const [randPin, setRandPin] = useState('123456');
  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const previousTopicMsg = usePrevious(topicMsg);
  const previousTopicUrl = usePrevious(topicUrl);
  const [loader, setLoader] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(false);
  const [pinView, setPinView] = useState(false);
  const [battFlag, setBattFlag] = useState(false);
  const [pinFlag, setPinFlag] = useState(false);
  const [powerFlag, setPowerFlag] = useState(false);
  const [battLvl, setBattLvl] = useState('N/A');
  const [successRes, setSuccessRes] = useState(false);
  const [successStrm, setSuccessStrm] = useState(false);
  const [fbKey, setFbKey] = useState('');
  const [ytKey, setYtKey] = useState('');

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
      key: 1,
      name: '480p',
      view: toggle1MP.get(),
    },
    {
      type: '2MP',
      key: 2,
      name: '576p',
      view: toggle2MP.get(),
    },
    {
      type: '5MP',
      key: 3,
      name: '720p',
      view: toggle5MP.get(),
    },
    {
      type: '8MP',
      key: 4,
      name: '1080p',
      view: toggle8MP.get(),
    },
  ]);

  const [streamingData, setStreamingData] = useState([
    {
      type: 'cl',
      key: '1',
      name: 'Cloud Storage {Default}',
      view: checkVal.get() == 'cl' ? true : false,
      disable: false,
    },
    {
      type: 'local',
      key: '2',
      name: 'Local Storage (SD card)',
      view: checkVal.get() == 'local' ? true : false,
      disable: false,
    },
    {
      type: 'yt',
      key: '3',
      name: 'YouTube LIVE',
      view: checkVal.get() == 'yt' ? true : false,
      disable: yt_pin.get(),
    },
    {
      type: 'fb',
      key: '4',
      name: 'FaceBook LIVE',
      view: checkVal.get() == 'fb' ? true : false,
      disable: fb_pin.get(),
    },
  ]);
  const [bleName, setBleName] = useState('');
  const [bleId, setBleId] = useState('');
  const [pin, setPin] = useState('');
  const [devPin, setDevPin] = useState('');
  const [serID, setSerID] = useState('');
  const [resulationIndex, setResulationIndex] = useState('');
  const [resulationType, setResulationType] = useState('');
  const [streamIndex, setStreamIndex] = useState('');
  const [streamType, setStreamType] = useState('');
  const [charID, setCharID] = useState('');

  if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  const camOn = uS(cS);
  const recOn = uS(rS);

  console.log('check recording?', recOn.get());

  const socketHandle = (key, msg) => {
    if (key) setActivityIndicator(true);
    setTopicUrl(key);
    setTopicMsg(msg);
    socket.emit(key, msg);
    reset();
    console.log('chala socket');
    socket.on(key, arg => {
      console.log('socket=/storage/cloud----------', arg);
      setTimeout(() => {
        socket.off(key);
      }, 800);
    });
  };

  const sendResolution = () => {
    if (toggle1MP.get()) {
      return '1';
    }
    if (toggle2MP.get()) {
      return '2';
    }
    if (toggle5MP.get()) {
      return '3';
    }
    if (toggle8MP.get()) {
      return '4';
    } else {
      return 'resError';
    }
  };

  const sendStreamLocation = () => {
    if (checkValue.get() == 'cl') {
      return 'cl';
    }
    if (checkValue.get() == 'local') {
      return 'lo';
    }
    if (checkValue.get() == 'yt') {
      return 'yt';
    }
    if (checkValue.get() == 'fb') {
      return 'fb';
    } else {
      return 'streamError';
    }
  };

  const iotResponse = () => {
    socket.on('iotResponse/', arg => {
      if (arg === 'pwr_on') {
        setTimeout(() => {
          socketHandle('pi_cm3/cam_res/', sendResolution());
        }, 200);
        setTimeout(() => {
          socketHandle('pi_cm3/streaming/', sendStreamLocation());
        }, 400);
      }
      if (arg === 'success') {
        console.log('AYA RESPONSE SUCCESS', clc.blueBright(arg));
        setActivityIndicator(false);
        setSuccessRes(true);
        setSuccessStrm(true);
      } else if (arg.slice(0, 4) === 'batt') {
        let val;
        val = battLvl;
        if (val != arg.slice(5)) {
          setBattLvl(arg.slice(5));
          changeLayoutBattery(false);
          console.log('change battery');
        }
        setDialogVisible(false);
        setActivityIndicator(false);
        console.log('batt Recieving_____', arg.slice(5));
        clear();
      }
      console.log('getiotresponse use effect settings----------', arg);
      clear();
      setTimeout(() => {
        socket.off('iotResponse/');
      }, 800);
    });
  };

  useUpdateEffect(() => {
    iotResponse();
  }, [iotResponse]);

  useUpdateEffect(() => {
    console.log(clc.redBright('chala khrabai'));
    if (successRes) {
      handleResulutionAtResponse(resulationType, resulationIndex);
    }
  }, [successRes, resulationType, resulationIndex]);

  useUpdateEffect(() => {
    console.log(clc.cyanBright('chala khrabai 2'));
    if (successStrm) {
      handleResponseTimeStreamingChanging(streamType, streamIndex);
    }
  }, [successStrm, streamIndex, streamType]);

  useUpdateEffect(() => {
    if (previousTopicUrl !== topicUrl && previousTopicMsg !== topicMsg) {
      socketHandle(topicUrl, topicMsg);
      console.log(clc.xterm()('Chala socketHandle use Update Effect me'));
    }
  }, [topicUrl, topicMsg]);

  useEffect(() => {
    clearBle();
    clear();
    setActivityIndicator(false);

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
    checkBluetooth();
    checkWifi();
    checkData();
    return () => {
      setPinFlag(false);
      setBattFlag(false);
      setPowerFlag(false);
      console.log('chala unmount??');
      AppState.removeEventListener('change');
      socket.removeAllListeners();
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
    };
  }, []);

  const storeItems = async () => {
    console.log('Kya mila isko? 480p', toggle1MP.get());
    console.log('Kya mila isko? 500p', toggle2MP.get());
    console.log('Kya mila isko? 720p', toggle5MP.get());
    console.log('Kya mila isko? 1080p', toggle8MP.get());
    console.log('Kya mila isko? streaming', checkValue.get());
    try {
      await AsyncStorage.setItem('mp1', toggle1MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('mp2', toggle2MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('mp5', toggle5MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('mp8', toggle8MP.get() == true ? '1' : '0');
      await AsyncStorage.setItem('fb_pin', fb_pin.get() == false ? '1' : '0');
      await AsyncStorage.setItem('yt_pin', yt_pin.get() == false ? '1' : '0');
      await AsyncStorage.setItem('checkValue', checkValue.get());
    } catch (e) {
      console.log('koi error aya storing me', e);
    }
  };

  const handleResulutionAtResponse = (type, indexx) => {
    console.log('type--->', type);
    console.log('indexx--->', indexx);
    console.log(clc.green('resulationIndex ____>', resulationIndex));
    console.log(clc.green('resulationType _____>', resulationType));

    if (type == '1MP') {
      toggle1MP.set(true);
      toggle2MP.set(false);
      toggle5MP.set(false);
      toggle8MP.set(false);
    }
    if (type == '2MP') {
      toggle1MP.set(false);
      toggle2MP.set(true);
      toggle5MP.set(false);
      toggle8MP.set(false);
    }
    if (type == '5MP') {
      toggle1MP.set(false);
      toggle2MP.set(false);
      toggle5MP.set(true);
      toggle8MP.set(false);
    }
    if (type == '8MP') {
      toggle1MP.set(false);
      toggle2MP.set(false);
      toggle5MP.set(false);
      toggle8MP.set(true);
    }
    if (successRes) {
      resulationData.map((data, index) => {
        if (index == indexx) {
          let newArr = [...resulationData]; // copying the old datas array
          newArr[index].view = true; // replace value with whatever you want to change it to
          setResulationData(newArr);
        } else {
          let newArr = [...resulationData]; // copying the old datas array
          newArr[index].view = false; // replace value with whatever you want to change it to
          setResulationData(newArr);
        }
      });
      setSuccessRes(false);
    }
  };
  const changeResolution = (type, indexx) => {
    console.log('type--->', type);
    setResulationIndex(indexx);
    setResulationType(type);
    if (net.isConnected) {
      if (camOn.get()) {
        if (type == '1MP') {
          if (!toggle1MP.get()) {
            socketHandle('pi_cm3/cam_res/', '1');
          }
        }
        if (type == '2MP') {
          if (!toggle2MP.get()) {
            socketHandle('pi_cm3/cam_res/', '2');
          }
        }
        if (type == '5MP') {
          if (!toggle5MP.get()) {
            socketHandle('pi_cm3/cam_res/', '3');
          }
        }
        if (type == '8MP') {
          if (!toggle8MP.get()) {
            socketHandle('pi_cm3/cam_res/', '4');
          }
        }
      }
      if (!camOn.get()) {
        if (type == '1MP') {
          toggle1MP.set(true);
          toggle2MP.set(false);
          toggle5MP.set(false);
          toggle8MP.set(false);
        }
        if (type == '2MP') {
          toggle1MP.set(false);
          toggle2MP.set(true);
          toggle5MP.set(false);
          toggle8MP.set(false);
        }
        if (type == '5MP') {
          toggle1MP.set(false);
          toggle2MP.set(false);
          toggle5MP.set(true);
          toggle8MP.set(false);
        }
        if (type == '8MP') {
          toggle1MP.set(false);
          toggle2MP.set(false);
          toggle5MP.set(false);
          toggle8MP.set(true);
        }

        resulationData.map((data, index) => {
          if (index == indexx) {
            let newArr = [...resulationData]; // copying the old datas array
            newArr[index].view = true; // replace value with whatever you want to change it to
            setResulationData(newArr);
          } else {
            let newArr = [...resulationData]; // copying the old datas array
            newArr[index].view = false; // replace value with whatever you want to change it to
            setResulationData(newArr);
          }
        });
      }
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

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

  const alertForPowerOff = () => {
    Alert.alert('POWER OFF Device', 'Device will be powered off', [
      {
        text: 'YES',
        style: 'default',
        onPress: () => {
          setPowerFlag(true);
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => console.log('Pressed Cancel on Turn off Power DEvice'),
      },
    ]);
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

  const checkData = () => {
    console.log(clc.greenBright('data', net.type));
  };

  const checkBatteryLvl = () => {
    console.log('check battery lvl', batteryLevel);
    batteryLevel == false ? setBattFlag(true) : changeLayoutBattery(true);
    console.log('check batter', battFlag);
  };

  useUpdateEffect(() => {
    if (pinFlag) {
      console.log('chalala PIN LALA');
      generatePin();
    }
    if (powerFlag) {
      console.log('chalala POWER OFF LALA');
      setDialogVisible(true);
    }
    if (battFlag) {
      console.log('chalala BATTERY LALA');
      checkBattLvl();
    }
  }, [pinFlag, powerFlag, battFlag]);

  const generatePin = () => {
    if (camOn.get()) {
      Alert.alert(
        'Generate Pin',
        'Are you sure want to generate new pin, old will be discarded',
        [
          {
            text: 'OK',
            style: 'default',
            onPress: () => {
              byBlueT();
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setPinFlag(false);
              console.log('Cancel Pin generate');
            },
          },
        ],
      );
    } else {
      Toast.show('Device is Turned Off', Toast.SHORT);
      setPinFlag(false);
    }
  };

  const checkBattLvl = () => {
    if (camOn.get()) {
      setDialogVisible(true);
    } else {
      Toast.show('Device is Turned Off', Toast.SHORT);
    }
  };

  //!-------------------------------------------------------------------------------------------------------------------#FF5000

  const byCloud = () => {
    if (net.isConnected) {
      if (battFlag) {
        socketHandle('pi_cm3/batt/', 'get');
        console.log('Batt by Cloud'); //todo: Do battery level check byCloud here
        setBattFlag(false);
      } else if (powerFlag) {
        console.log('By cloud Chala');
        setDialogVisible(false);
        socketHandle('pi_cm3/device/', 'off');
        setPowerFlag(false);
        console.log('kuch nhi hoa');
      }
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const readFromDevice = (macId, serId, charId) => {
    BleManager.read(macId, serId, charId)
      .then(readData => {
        // Success code
        const stringData = bytesToString(readData);
        console.log('Read: ' + stringData);
        if (pinFlag) {
          if (stringData) {
            console.log(clc.redBright('kia hai pin generated:', stringData));
            setPinFlag(false);
            setRandPin(stringData); //todo:  Work on this when ready to read from device
            setTimeout(() => {
              changeLayoutPin();
              _disconnectDevice(macId);
            }, 800);
          }
        } else if (powerFlag) {
          if (stringData) {
            setDevPin(stringData);
            setLoader(false);
          }
          setInputVisible(true);
        }
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        Toast.show('Error while pin reading', Toast.SHORT);
        console.log('Read pr error', error);
        setPinFlag(false);
        setBattFlag(false);
        setPowerFlag(false);
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
          serId = 'a002'; //? service id
          let wcharId = 'c304';
          setSerID(serId); //? service id
          setCharID(wcharId); //? write characteristic id
          console.log('aya service', serId);
          console.log('aya', charId);
          console.log('pin Flag', pinFlag);
          console.log('batt Flag', battFlag);
          console.log('power Flag', powerFlag);
          if (pinFlag) {
            console.log(clc.greenBright('XXX-pin Flag-XXX'));
            writeToDevice(macId, serId, 'c304');
          } else if (battFlag) {
            console.log(clc.greenBright('XXX-battery check Flag-XXX'));
            notificationRead(macId, serId, 'c305');
          } else if (powerFlag) {
            console.log(clc.greenBright('XXX-Power off pin Verification-XXX'));
            readFromDevice(macId, serId, charId);
          }
        }, 800);
      })
      .catch(e => {
        console.log('Error aya retrieve me', e);
        setPinFlag(false);
        setBattFlag(false);
        setPowerFlag(false);
      });
  };

  const notificationRead = (macId, serId, charId) => {
    BleManager.startNotification(macId, serId, charId)
      .then(() => {
        // Success code
        console.log('Notification started');
        bleManagerEmitter.addListener(
          'BleManagerDidUpdateValueForCharacteristic',
          ({value, peripheral, characteristic, service}) => {
            // Convert bytes array to string
            const data = bytesToString(value);
            setBattLvl(data);
            console.log(
              `Recieved ${data} for characteristic ${characteristic}`,
            );
            setBattFlag(false);
            setLoader(false);
            changeLayoutBattery(true);
            setTimeout(() => {
              StopNotify(macId, serId, charId);
            }, 400);
          },
        );
      })
      .catch(error => {
        // Failure code
        console.log('Error at Start Notification', error);
      });
  };

  const StopNotify = async (macId, serId, charId) => {
    try {
      await BleManager.stopNotification(macId, serId, charId);
      console.log('Stopped Notification');
      bleManagerEmitter.removeAllListeners(
        'BleManagerDidUpdateValueForCharacteristic',
      );
      setTimeout(() => {
        _disconnectDevice(macId);
      }, 1000);
    } catch (error) {
      console.log('Error at Stop Notification', error);
      setPinFlag(false);
      setBattFlag(false);
      setPowerFlag(false);
      Toast.show('Error to get Battery Level', Toast.SHORT);
    }
  };

  const writeToDevice = (macId, pinSerId, pinCharId) => {
    if (pinFlag) {
      let stringData = 'PIN_CHANGE';
      console.log('new pin generate write');
      const bytesData = stringToBytes(stringData);
      BleManager.write(macId, pinSerId, pinCharId, bytesData)
        .then(() => {
          // Success code
          setLoader(false);
          console.log('Write SuccessFully');
          Toast.show('Successful!', Toast.SHORT);
          setTimeout(() => {
            readFromDevice(macId, pinSerId, 'c301');
          }, 1000);
        })
        .catch(error => {
          // Failure code
          setLoader(false);
          console.log('Error aya write me', error);
          Toast.show('Command Send Unsuccessful!', Toast.SHORT);
          setPinFlag(false);
          setBattFlag(false);
          setPowerFlag(false);
        });
    } else if (powerFlag) {
      let stringData = 'CAM_0';
      console.log('power off chala ble se');
      const bytesData = stringToBytes(stringData);
      BleManager.write(bleId, serID, charID, bytesData)
        .then(() => {
          // Success code
          setLoader(false);
          console.log('Write SuccessFully');
          camOn.set(false);
          recOn.set(false);
          Toast.show('Successful!', Toast.SHORT);
          setInputVisible(false);
          setPowerFlag(false);
          setTimeout(() => {
            _disconnectDevice(macId);
          }, 1000);
        })
        .catch(error => {
          // Failure code
          setLoader(false);
          Toast.show('Command Send Unsuccessful!', Toast.SHORT);
          setPinFlag(false);
          setBattFlag(false);
          setPowerFlag(false);
        });
    }
  };

  const _disconnectDevice = macId => {
    if (macId != '' || bleId != '') {
      console.log(clc.blueBright('kia hai isme'), clc.yellowBright(macId));
      console.log(clc.blueBright('kia hai isme state'), clc.redBright(bleId));
      BleManager.disconnect(typeof macId == 'undefined' ? bleId : macId)
        .then(() => {
          // Success code
          console.log('Disconnected Device Successfully');
          setBleId('');
          setBleName('');
        })
        .catch(error => {
          // Failure code
          console.log('Error aya Disconnect me', error);
          setPinFlag(false);
          setBattFlag(false);
          setPowerFlag(false);
        });
    } else {
      console.log('Nothing to disconnect');
    }
  };

  const _connectToDevice = macId => {
    console.log('aya mac', macId);
    setTimeout(() => {
      bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral');
    }, 800);
    BleManager.connect(macId)
      .then(() => {
        clearBle();
        retrieveServices(macId);
        console.log('Connected Device');
      })
      .catch(error => {
        // Failure code
        setLoader(false);
        console.log('Error at Connecting: ', error);
        Toast.show('Error, Try Again', Toast.SHORT);
        setPinFlag(false);
        setBattFlag(false);
        setPowerFlag(false);
      });
  };

  const _scanAndGet = () => {
    let blN = '';
    let blId = '';
    BleManager.scan([], 10, true).then(() => {
      resetBle();
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
        setPinFlag(false);
        setBattFlag(false);
        setPowerFlag(false);
      }
    });
  };

  const validatePin = () => {
    if (pin == devPin) {
      writeToDevice();
      setPin('');
      setLoader(true);
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

  const handleResponseTimeStreamingChanging = (type, indexx) => {
    console.log('strem runs++++++++++>', type);
    console.log('strem runs++++++++++++>', indexx);
    if (net.isConnected) {
      if (type == 'cl') {
        checkValue.set('cl');
      }
      if (type == 'local') {
        checkValue.set('local');
      }
      if (type == 'yt') {
        checkValue.set('yt');
      }
      if (type == 'fb') {
        checkValue.set('fb');
      }
      if (successStrm) {
        streamingData.map((data, index) => {
          if (index == indexx) {
            let newArr = [...streamingData]; // copying the old datas array
            newArr[index].view = true; // replace value with whatever you want to change it to
            setStreamingData(newArr);
          } else {
            let newArr = [...streamingData]; // copying the old datas array
            newArr[index].view = false; // replace value with whatever you want to change it to
            setStreamingData(newArr);
          }
        });
        setSuccessStrm(false);
      }
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const handleStreamingChanging = (type, indexx) => {
    // console.log('cl runs', type);
    setStreamType(type);
    setStreamIndex(indexx);
    if (net.isConnected) {
      if (camOn.get()) {
        if (type === 'cl') {
          if (checkValue.get() !== 'cl') {
            socketHandle('pi_cm3/streaming/', 'cl');
          }
        }
        if (type === 'local') {
          if (checkValue.get() !== 'local') {
            socketHandle('pi_cm3/streaming/', 'lo');
          }
        }
        if (type === 'yt') {
          if (checkValue.get() !== 'yt') {
            socketHandle('pi_cm3/streaming/', 'yt');
          }
        }
        if (type === 'fb') {
          if (checkValue.get() !== 'fb') {
            socketHandle('pi_cm3/streaming/', 'fb');
          }
        }
      }
      if (!camOn.get()) {
        if (type === 'cl') {
          if (checkValue.get() !== 'cl') {
            checkValue.set('cl');
            console.log('cl runs');
          }
        }
        if (type === 'local') {
          if (checkValue.get() !== 'local') {
            checkValue.set('local');
            console.log('local runs');
          }
        }
        if (type === 'yt') {
          if (checkValue.get() !== 'yt') {
            checkValue.set('yt');
            console.log('yt runs');
          }
        }
        if (type === 'fb') {
          if (checkValue.get() !== 'fb') {
            checkValue.set('fb');
            console.log('fb runs');
          }
        }
        streamingData.map((data, index) => {
          if (index == indexx) {
            let newArr = [...streamingData]; // copying the old datas array
            newArr[index].view = true; // replace value with whatever you want to change it to
            setStreamingData(newArr);
          } else {
            let newArr = [...streamingData]; // copying the old datas array
            newArr[index].view = false; // replace value with whatever you want to change it to
            setStreamingData(newArr);
          }
        });
      }
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
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
    console.log(clc.yellowBright('valuevalue--->', camOn.get()));

    if (net.isConnected) {
      if (type == 'fb' && value.length == 38) {
        // console.log('type--->', type);
        setFbKey(value);
        if (camOn.get()) {
          socketHandle('pi_cm3/fb_key/', value);
        }
        Toast.show('Please wait, Checking Key', Toast.LONG);

        setTimeout(() => {
          streamingData.map((data, index) => {
            if (data.type == 'fb') {
              let newArr = [...streamingData]; // copying the old datas array
              newArr[index].disable = false; // replace value with whatever you want to change it to
              fb_pin.set(false);
              setStreamingData(newArr);
            }
          });
          console.log('streamingData--->', streamingData);
        }, 100);
      } else if (type == 'yt' && value.length == 24) {
        // console.log('type--->', type);
        setYtKey(value);
        if (camOn.get()) {
          socketHandle('pi_cm3/yt_key/', value);
        }
        Toast.show('Please wait, Checking Key', Toast.LONG);

        setTimeout(() => {
          streamingData.map((data, index) => {
            if (data.type == 'yt') {
              let newArr = [...streamingData]; // copying the old datas array
              newArr[index].disable = false; // replace value with whatever you want to change it to
              yt_pin.set(false);
              setStreamingData(newArr);
            }
          });
        }, 100);
      } else {
        Toast.show('Invalid Key', Toast.SHORT);
      }
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const changeLayoutBattery = flag => {
    setLoader(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); //! put this up when you are ready to drop down view
    if (!flag) {
      setBatteryLevel(true);
    } else {
      setBatteryLevel(!batteryLevel);
    }
  };

  const changeLayoutPin = () => {
    setLoader(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPinView(!pinView);
  };

  const copyPin = () => {
    ClipBoard.setString(randPin.toString());
    Toast.show('Copied Pin to ClipBoard', Toast.SHORT);
  };

  const handleInput = (value, index) => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].input = value; // replace value with whatever you want to change it to
    setKeysData(newArr);
    console.log('data--->', keysData);
  };

  const getResponse = () => {
    if ('device responded') {
    } else {
      setTimeout(() => {
        setActivityIndicator(false);
        Toast.show(
          'Device not responded! Please check your device connection',
          Toast.LONG,
        );
      }, 15000);
    }
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
          contentStyle={{justifyContent: 'center', alignItems: 'center'}}
          overlayStyle={{paddingHorizontal: width * 0.2}}
          dialogStyle={styles.blAndClDialogContainer}
          onTouchOutside={() => setDialogVisible(false)}>
          <Icon
            name="close"
            color="#003CC2"
            onPress={() => {
              setDialogVisible(false);
              setBattFlag(false);
              setPowerFlag(false);
              setPinFlag(false);
            }}
            size={portrait ? height * 0.04 : width * 0.04}
            style={styles.blAndClCloseBtn}
          />
          <View style={styles.blAndClDialogInner}>
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
          overlayStyle={{paddingHorizontal: width * 0.2}}
          dialogStyle={styles.blutoothPinDialogContainer}>
          <View style={styles.blutoothPinDialogInner}>
            <Text style={styles.bluetoothDialogHeading}>Device Found</Text>
            <View style={styles.pinTextInputContainer}>
              <PaperInput
                label="Enter Pin"
                value={pin}
                onChangeText={text => {
                  setPin(text);
                }}
                mode="outlined"
                outlineColor="#003CC2"
                selectionColor="#003CC2"
                secureTextEntry
                style={styles.pinTextInput}
                theme={{
                  colors: {
                    primary: '#003CC2',
                    underlineColor: 'transparent',
                  },
                }}
              />
            </View>
            <View style={styles.bluetoothDialogBtnContainer}>
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
                  setPowerFlag(false);
                }}
              />
            </View>
          </View>
        </Dialog>
        <KeyboardAwareScrollView>
          <View style={styles.inner}>
            <Header
              colors={colors}
              fontF={font}
              title="Resolution"
              iconName={'tv-outline'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <View style={{marginTop: portrait ? width * 0.03 : height * 0.03}}>
              {resulationData &&
                resulationData.map((data, index) => (
                  <>
                    <TouchableOpacity
                      disabled={recOn.get()}
                      activeOpacity={0.7}
                      style={styles.listContainer}
                      onPress={() => {
                        recOn.get() ? null : changeResolution(data.type, index);
                      }}>
                      <View style={styles.fontContainer}>
                        <CheckBox
                          disabled={true}
                          value={data.view}
                          tintColors={{
                            true: recOn.get() ? '#999999' : '#25AAE1',
                          }}
                        />
                        <Text style={styles.listFont}>
                          {data.name} {data.name == '720p' && ' {default}'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ))}
            </View>
            <Header
              colors={colors}
              fontF={font}
              title="Streaming Location"
              iconName={'md-radio'}
              iconColor={'white'}
              iconSize={portrait ? height * 0.035 : width * 0.035}
            />
            <View style={{marginTop: portrait ? width * 0.03 : height * 0.03}}>
              {streamingData &&
                streamingData.map((data, index) => (
                  <>
                    <TouchableOpacity
                      disabled={recOn.get()}
                      activeOpacity={0.7}
                      style={styles.listContainer}
                      onPress={() => {
                        recOn.get()
                          ? null
                          : data.disable
                          ? Toast.show('Key Requied', Toast.SHORT)
                          : handleStreamingChanging(data.type, index);
                      }}>
                      <View style={styles.fontContainer}>
                        <CheckBox
                          disabled={true}
                          value={data.view}
                          tintColors={{
                            true:
                              recOn.get() || data.disable
                                ? '#999999'
                                : '#25AAE1',
                          }}
                        />
                        <Text style={styles.listFont}>
                          {data.name} {data.name == '720p' && ' {default}'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ))}
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
                  disabled={recOn.get()}
                  style={[
                    styles.listContainerDropdown,
                    {height: !data.view ? height * 0.1 : height * 0.18},
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
                        value={data.input}
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
                {height: !pinView ? height * 0.1 : height * 0.18},
              ]}
              onPress={() => {
                !pinView ? setPinFlag(true) : changeLayoutPin();
              }}>
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
                <View
                  style={[
                    styles.listInnerDropdown,
                    {paddingHorizontal: width * 0.02},
                  ]}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: font,
                      fontSize: height * 0.03,
                      marginLeft: 5,
                    }}>
                    {randPin}
                  </Text>
                  <GradientButton
                    title={'Copy'}
                    unfilled={true}
                    style={styles.dropDownButton}
                    onPress={copyPin}
                  />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.listContainerDropdown,
                {height: !batteryLevel ? height * 0.1 : height * 0.18},
              ]}
              onPress={checkBatteryLvl}
              // onPress={() =>
              //   !batteryLevel ? setBattFlag(true) : changeLayoutBattery()
              // }
            >
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
                    {battLvl}%
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
                camOn.get()
                  ? alertForPowerOff()
                  : Toast.show('Device is already turned off', Toast.SHORT)
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
          {/* </KeyboardAvoidingView> */}
        </KeyboardAwareScrollView>
      </View>
    </Footer>
  );
}

export default Settings;
