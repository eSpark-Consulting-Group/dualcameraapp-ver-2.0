import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  Image,
  UIManager,
  Platform,
  StatusBar,
  LayoutAnimation,
  BackHandler,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import {DatePicker} from 'react-native-wheel-datepicker';
import DP from 'react-native-date-picker';
import {Storage} from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob';
import {create} from 'apisauce';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
// import styles from './style';
import {useTheme} from '@react-navigation/native';
import {Fonts} from '../../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Menu} from 'react-native-paper';
import styles from './style';
import useUpdateEffect from '../../hooks/useUpdateEffect';

import {
  MyButton,
  Header,
  Button,
  Footer,
  GradientButton,
  CustumStatusBar,
} from '../../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import Orientation from 'react-native-orientation-locker';
import VideoPlayer from 'react-native-video-controls';
import {useDimensions} from '@react-native-community/hooks';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';

var clc = require('cli-color');

var baseURL = 'https://tinyurl.com/api-create.php?url=';

var awsURL =
  'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com';

const api = create({
  baseURL: baseURL,
});

const aws = create({
  baseURL: awsURL,
});

var currentKey = '';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const level = {
  empty: 'battery-empty',
  batt1: 'battery-1',
  batt2: 'battery-2',
  batt3: 'battery-3',
  full: 'battery-full',
};

let ios = false;

if (Platform.OS === 'ios') {
  ios = true;
}

function Videos(props) {
  const net = NetInfo.useNetInfo();
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const {colors, font} = useTheme();
  const [rec_Videos, setRec_Videos] = useState([]);
  const [iosPicker, setIosPicker] = useState(ios);
  const [loader, setLoader] = useState(true);
  const [netFlag, setNetFlag] = useState(false);
  const [gotItemKey, setGotItemKey] = useState('');

  useFocusEffect(
    useCallback(() => {
      getFileOnly(true, selectDate);
      handleScrolling(selectDate);
      return () => {
        setSelectDate(new Date());
      };
    }, []),
  );

  const handleScrolling = async date => {
    try {
      setTimeout(() => {
        flatListRef1.current.scrollToIndex({
          index: date.getDate() > 3 ? date.getDate() - 3 : 0,
          animated: true,
        });
      }, 2000);
    } catch (e) {
      console.log('Scrolling Error', e);
    }
  };

  useEffect(() => {
    console.log('MAsla');
    getFileOnly(true, selectDate);
    console.log(clc.redBright('Kya ha network ka status', netFlag));
    addDays(
      selectDate.toString().slice(0, 8) +
        '00' +
        selectDate.toString().slice(10),
    );
    // setTimeout(() => {
    //   flatListRef1.current.scrollToIndex({
    //     index: selectDate.getDate() > 3 ? selectDate.getDate() - 2.9 : 0,
    //     animated: true,
    //   });
    // }, 2000);
    handleScrolling(selectDate);
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackToDo,
    );
    console.log('working');
    return () => {
      console.log('chala video unmount videos');
      backHandler.remove();
    };
  }, []);

  useUpdateEffect(() => {
    const subs = props.navigation.addListener('blur', () => {
      setModalVisible(false);
      console.log(clc.yellowBright('Chala bta'));
    });
    return () => {
      subs;
    };
  }, [props.navigation]);

  const getFileOnly = (val, dateVal) => {
    setRec_Videos([]);
    setNetFlag(false);
    setLoader(val);
    const properDate =
      dateVal.getDate().toString().length === 1
        ? '0' + dateVal.getDate()
        : dateVal.getDate();
    const properMonth = dateVal.getMonth() + 1;
    console.log(
      clc.xterm(154)(
        'Chala Get Videos',
        `${properMonth}/${properDate}/${dateVal.getFullYear()}`,
      ),
    );
    // const dateArr = selectDate.toISOString().slice(0, 10);
    // Storage.list('individuals/')
    //   .then(
    //     data => {
    //       console.log('XXX', data);
    //     },
    //     // data.shift();
    //     // setVidData(data.reverse());
    //     // setRec_Videos(dataArr);
    //     // setLoader(false);
    //     // console.log('fetched', dataArr);
    //   )
    //   .catch(err => {
    //     // setLoader(false);
    //     console.log('error fetching video (get files)');
    //   });
    aws
      .get(
        '/api/video/getVideoInfo' +
          `?date=${properMonth}/${properDate}/${dateVal.getFullYear()}`,
      )
      .then(res => {
        console.log('kia', res?.data?.info);
        setTimeout(() => {
          setLoader(false);
        }, 800);
        if (res?.data?.info.length !== 0) {
          // const dataArr = data.reverse();
          // data.shift();
          // setVidData(data.reverse());
          setRec_Videos(res?.data?.info);
          // console.log('fetched', dataArr);
        } else {
          // setLoader(false);
          console.log('gya');
        }
      })
      .catch(e => {
        console.log('Error While Fetching Videos', e);
      });
  };

  // useEffect(() => {
  // console.log(clc.redBright('Kya ha network ka status', netFlag));
  // addDays(
  //   selectDate.toString().slice(0, 8) +
  //     '00' +
  //     selectDate.toString().slice(10),
  // );
  // setTimeout(() => {
  //   flatListRef1.current.scrollToIndex({
  //     index: selectDate.getDate() > 3 ? selectDate.getDate() - 2.9 : 0,
  //     animated: true,
  //   });
  // }, 2000);
  // const backHandler = BackHandler.addEventListener(
  //   'hardwareBackPress',
  //   onBackToDo,
  // );
  // return () => {
  //   console.log('chala video unmount videos');
  //   backHandler.remove();
  // };
  // }, []);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  let d = new Date();

  const days = function (month, year) {
    return new Date(year, month, 0).getDate();
  };

  const goToDate = val => {
    if (net.isConnected) {
      console.log(clc.yellowBright('chala??'));
      setLoader(true);
      const updateDate = new Date(val);
      setSelectDate(updateDate);
      getFileOnly(true, updateDate);
      setLoader(true);
      // flatListRef1.current.scrollToIndex({
      //   index: updateDate.getDate() > 3 ? updateDate.getDate() - 2.9 : 0,
      //   animated: true,
      // });
      handleScrolling(updateDate);
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const getDaysInMonth = (month, year) =>
    new Array(31)
      .fill('')
      .map((v, i) => new Date(year, month, i + 1))
      .filter(v => v.getMonth() === month);

  const addDays = val => {
    // console.log('val=====>', val);
    const date = new Date(val);
    let datesCollection = [];
    let newDate = date;
    const dt = new Date();
    const m = dt.getMonth();
    const y = dt.getFullYear();

    // console.log(getDaysInMonth(m, y));

    for (var i = 1; i <= days(date.getMonth() + 2, date.getFullYear()); i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      datesCollection.push({
        fullDate: `${newDate}`,
        date: `${newDate.getDate()}`,
        day: `${newDate.toDateString().slice(0, 3)}`,
      });
    }
    // console.log('whatn oi', datesCollection);
    setDates(datesCollection);
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [play, setPlay] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [selectYear, setSelectYear] = useState(d.getFullYear());
  const [selectMonth, setSelectMonth] = useState(months[d.getMonth()]);
  const [selectDate, setSelectDate] = useState(new Date());
  const [editYear, setEditYear] = useState(selectYear);
  const [editMonth, setEditMonth] = useState(selectMonth);
  const [editDate, setEditDate] = useState(selectDate);
  const [dates, setDates] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [videoPath, setVideoPath] = useState('');
  const [isBuffering, setIsBuffering] = useState(true);
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pausedCam1, setPausedCam1] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  console.log('Date Bata');

  const onBackToDo = () => {
    setTimeout(() => {
      if (isFullScreen) {
        playFrontCam(false);
      }
    }, 30);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    return true;
  };

  const onFullScreen = () => {
    if (!isFullScreen) {
      Orientation.lockToLandscape();
    } else {
      if (Platform.OS === 'ios') {
        Orientation.lockToLandscape();
      }
      Orientation.lockToPortrait();
    }
    setIsFullScreen(!isFullScreen);
  };

  const changeDate = val => {
    const getMonth = val.toString().slice(4, 7);
    const getYear = val.toString().slice(11, 15);
    const getFullDate = val.toString();
    setEditMonth(getMonth);
    setEditDate(new Date(getFullDate));
    setEditYear(getYear);
    addDays(val.toString().slice(0, 8) + '00' + val.toString().slice(10));
  };

  const changeMonthIOS = val => {
    const getMonth = months[val - 1];
    const getFullDate =
      selectDate.toString().slice(0, 4) +
      getMonth +
      ' ' +
      selectDate.toString().slice(8, 10) +
      selectDate.toString().slice(10);
    setEditMonth(getMonth);
    setEditDate(new Date(getFullDate));
    setSelectDate(new Date(getFullDate));
    setSelectMonth(getMonth);
    addDays(
      selectDate.toString().slice(0, 4) +
        getMonth +
        ' ' +
        '00' +
        selectDate.toString().slice(10),
    );
    console.log(
      'check date',
      selectDate.toString().slice(0, 4) +
        getMonth +
        ' ' +
        selectDate.toString().slice(8, 10) +
        selectDate.toString().slice(10),
    );
  };

  const changeYearIOS = val => {
    console.log(
      'Check Values',
      selectDate.toString().slice(0, 10) +
        ' ' +
        val +
        selectDate.toString().slice(15),
    );
    const getYear = val;
    const getFullDate =
      selectDate.toString().slice(0, 10) +
      ' ' +
      val +
      selectDate.toString().slice(15);
    setEditDate(new Date(getFullDate));
    setEditYear(getYear);
    setSelectDate(new Date(getFullDate));
    setSelectYear(getYear);
    addDays(
      selectDate.toString().slice(0, 8) +
        '00 ' +
        val +
        selectDate.toString().slice(15),
    );
    console.log(
      'check date',
      selectDate.toString().slice(0, 8) +
        '00' +
        ' ' +
        val +
        selectDate.toString().slice(15),
    );
  };

  const doneBtn = () => {
    FnModalVisible(false);
    setSelectDate(editDate);
    setSelectMonth(editMonth);
    setSelectYear(editYear);
    goToDate(editDate);
    // flatListRef1.current.scrollToIndex({
    //   index: editDate.getDate() > 3 ? editDate.getDate() - 2.9 : 0,
    // });
    handleScrolling(editDate);
    console.log('Edit date', editDate);
  };

  const FnModalVisible = visible => {
    if (net.isConnected) {
      setModalVisible(visible);
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const onProgress = data => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };
  const onLoadStart = data => setIsLoading(true);
  const onEnd = () => {
    console.log('khatam hogai video');
    playNext();
  };

  const playFrontCam = (condition, value) => {
    if (condition == true) {
      setVideoPlaying(true);
      onFullScreen();
      setVideoPath(value);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlay(!play);
    } else {
      setTimeout(() => {
        if (portrait) {
          onFullScreen();
          setTimeout(() => {
            goToDate(selectDate);
          }, 80);
        } else {
          //* if landscape
          setIsFullScreen(!isFullScreen);
        }
        // setTimeout(() => {
        //   Orientation.unlockAllOrientations();
        // }, 30);
      }, 30);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setPlay(!play);
    }
  };

  const dateList = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.dateButton}
        onPress={() => goToDate(item.fullDate)}>
        <LinearGradient
          colors={['#363B40', '#212428']}
          start={{x: 0.0, y: 0.05}}
          end={{x: 0.0, y: 1.0}}
          style={styles.dateButtonLinear}>
          <Text
            style={[
              styles.dateText,
              {
                color: item.date == selectDate.getDate() ? 'white' : '#0179B0',
              },
            ]}>
            {item.date}
            {'\n'}
            {item.day}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const convertDate = (val, flag) => {
    const milli = parseInt(val) * 1000;
    const d = new Date(milli);
    return flag ? milli : d.toLocaleString().replace(',', '');
    // return milli;
  };

  const fetchUrl = (startTime, endTime, flag, id) => {
    const conST = convertDate(startTime, true);
    const conET = convertDate(endTime, true);
    aws
      .post('/api/video/getVideos', {
        startTime: conST,
        endTime: conET,
      })
      .then(res => {
        console.log('aya', res?.data);
        if (res?.data?.success) {
          if (flag === 'play') playVideos(`${res?.data?.info}`, id, flag); //* We have the url link in this response
          if (flag === 'playN') playVideos(`${res?.data?.info}`, id, flag);
          if (flag === 'share') shareVideo(`${res?.data?.info}`); //* We have the url link in this response
        } else {
          Toast.show('Video Does not Exist', Toast.SHORT);
        }
      })
      .catch(e => {
        console.log('Error while generate Link', e);
        Toast.show('Failed to Find Recorded Video', Toast.SHORT);
      });
  };

  const playVideos = (value, id, flag) => {
    if (net.isConnected) {
      console.log('video ka link', value);
      currentKey = id;
      setVideoPath({uri: value});
      // #TODO: Fix this later
      // Storage.get(value)
      //   .then(data => {
      //     setVideoPath({uri: `${data}`});
      //   })
      //   .catch(err => {
      //     console.log('error fetching video');
      //   });
      setVideoPlaying(true);
      if (flag !== 'playN') onFullScreen();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlay(true);
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const downloadVideo = value => {
    if (net.isConnected) {
      Storage.get(value)
        .then(data => {
          console.log('aayaa', data);
          console.log('aayaa', value);
          api
            .get(`https://tinyurl.com/api-create.php?url=${data}`)
            .then(res => {
              // download(res.data, value.slice(25));
              downloadFs(res.data, '/' + value);
              console.log('MilaaXX', res.data);
            });
        })
        .catch(err => {
          console.log('error fetching video', err);
          Toast.show('error while downloading...', Toast.SHORT);
        });
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const downloadFs = async (url, name) => {
    if (Platform.OS == 'android') {
      try {
        const path = RNFS.ExternalStorageDirectoryPath + name;
        const rootPath = RNFS.ExternalStorageDirectoryPath;
        const result = await RNFS.readdir(rootPath);
        console.log('+++++====', result);
        if (!result.some(item => item.toLowerCase() === 'individuals')) {
          //! Did not find folder individuals
          await RNFS.mkdir(rootPath + '/individuals');
          console.log('Created Directory Successfully');
          setTimeout(() => {
            // const testPath =
            //   RNFS.ExternalStorageDirectoryPath + '/individuals/test.txt';
            downloadAndroid(url, name, path);
          }, 400);
        } else {
          //! found folder individuals
          console.log('Found Directory Successfully');
          downloadAndroid(url, name, path);
        }
      } catch (e) {
        console.log('Error Fs', e);
      }
    } else if (Platform.OS == 'ios') {
      try {
        downloadIos(url, name);
      } catch (e) {
        console.log('IOS AYA EROOR', e);
      }
    }
  };

  const downloadAndroid = (url, name, path) => {
    Toast.show('Download In Progress...', Toast.SHORT);
    console.log('Path is......zczc', path);
    const config = {
      fileCache: true,
      // android only options, these options be a no-op on IOS
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true, // <-- this is the only thing required
        notification: true,
        mediaScannable: true,
        title: name.slice(13),
        // File description (not notification description)
        // description: 'A video File',
        mime: 'video/mp4',
        path: path,
        // mime: '/',
      },
    };
    RNFetchBlob.config(config)
      .fetch('GET', url, {
        //some headers ..
      })
      .progress((recieved, total) => {
        console.log('PROGRESS', recieved / total);
      })
      .then(res => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        // console.log('KOK', res.path());
        // RNFetchBlob.ios.openDocument(res.data);
        // console.log('File Downloaded on iOS');
        console.log('Downloaded at', path);
        RNFetchBlob.android.actionViewIntent(res.path(), 'video/mp4');
        Toast.show('Downloaded in the Individuals Folder', Toast.SHORT);
      })
      .catch(e => {
        console.log('What happened', e);
      });
  };

  const downloadIos = (url, name) => {
    Toast.show('Download In Progress...', Toast.SHORT);
    const {dirs} = RNFetchBlob.fs;
    const iosFolder = dirs.LibraryDir + '/CloudStorage';
    const config = {
      fileCache: true,
      path: iosFolder + name,
      IOSBackgroundTask: true,
      indicator: true,
    };
    RNFetchBlob.config(config)
      .fetch('GET', url, {
        //some headers ..
      })
      .progress((recieved, total) => {
        console.log('PROGRESS', recieved / total);
      })
      .then(res => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('KOK', res.path());
        RNFetchBlob.ios.openDocument(res.data);
        console.log('File Downloaded on iOS');
      })
      .catch(e => {
        console.log('What happened', e);
      });
  };

  const shareVideo = async value => {
    if (net.isConnected) {
      api
        .get(`https://tinyurl.com/api-create.php?url=${value}`)
        .then(res => share(res.data));

      const share = url => {
        console.log('Share this', url);
        Share.share({
          message: `Use a Hls Player to watch with this link ${url}`,
        })
          .then(result => console.log(result))
          .catch(errorMsg => console.log(errorMsg));
      };
      //If response is not in text then in error
    } else {
      Toast.show('Check Your Mobile Internet Connection', Toast.SHORT);
    }
  };

  const deleteVideo = async value => {
    if (net.isConnected) {
      Alert.alert('Delete Video', 'Are sure you want to delete', [
        {
          text: 'Ok',
          style: 'default',
          onPress: () => deleted(value),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
      const deleted = async val => {
        const res = await aws.delete('/api/video/deleteById/' + val);
        if (res?.data?.success) {
          console.log('Deleted Successfully');
          goToDate(selectDate);
        }
        if (!res?.data?.success) {
          Toast.show('Video File not Deleted', Toast.SHORT);
        }
      };
    } else {
      Toast.show('Check Your internet Connection', Toast.SHORT);
    }
  };

  const playNext = () => {
    let vidIndex = rec_Videos.findIndex(({_id}) => _id == currentKey); //todo: what index is the current video on the data array
    let newIndex = vidIndex + 1;
    console.log(clc.xterm(216)('length kia ha', rec_Videos.length));
    console.log(clc.xterm(216)('Video the array me index', vidIndex));
    console.log(clc.xterm(216)('Video the array me new index', newIndex));
    if (newIndex < rec_Videos.length) {
      let nextVidKey = rec_Videos[newIndex]._id;
      console.log(clc.yellowBright('Current Index?', currentKey));
      console.log(clc.greenBright('Next Index?', nextVidKey));
      currentKey = nextVidKey;
      let result = rec_Videos.filter(item => {
        return item._id === nextVidKey;
      });
      // console.log('reess', result);
      const {startTime, endTime, _id} = result[0];
      console.log('ST', startTime);
      console.log('ET', endTime);
      console.log('id', _id);
      fetchUrl(startTime, endTime, 'playN', _id);
      setVideoPlaying(true);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlay(true);
    } else {
      playFrontCam(false);
      setPlayerState(PLAYER_STATES.ENDED);
      setPlay(!play);
      currentKey = '';
    }
  };

  const expandOptions = item => {
    if (gotItemKey == '') {
      setGotItemKey(item._id);
    }
  };

  console.log('net status ka bta', netFlag);
  return play == true ? (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#202427" barStyle="default" hidden={true} />
      <VideoPlayer
        onBack={() => {
          playFrontCam(false);
          currentKey = '';
        }}
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        ref={videoPlayer}
        resizeMode={'cover'}
        isFullScreen={isFullScreen}
        source={videoPath}
        videoStyle={styles.backgroundVideo}
        paused={pausedCam1}
        volume={10}
      />
    </View>
  ) : (
    <>
      <Footer props={props} screen="video">
        <CustumStatusBar />
        <View style={styles.container}>
          <Header
            colors={colors}
            fontF={font}
            title="Cloud Library"
            iconName="cloud-print"
            iconColor="white"
            iconMaterial
            iconSize={portrait ? height * 0.035 : width * 0.035}
            extraContent={
              <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Icon name="ios-menu" color="#fff" size={height * 0.045} />
              </TouchableOpacity>
            }
          />
          <TouchableOpacity
            style={styles.yearButton}
            onPress={() => FnModalVisible(true)}>
            <Text style={styles.yearText}>
              {selectMonth + ' ' + selectYear}
            </Text>
          </TouchableOpacity>
          <View style={styles.dateContainer}>
            <FlatList
              style={{flex: 0}}
              data={dates}
              ref={flatListRef1}
              initialScrollIndex={scrollIndex}
              removeClippedSubviews={false}
              horizontal={true}
              keyExtractor={item => item.date}
              initialNumToRender={dates.length}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateDataList}
              renderItem={({item}) => dateList(item)}
            />
          </View>
          <View style={styles.recordedVideoContainer}>
            {loader ? (
              <Loader />
            ) : !net.isConnected ? (
              <View style={{flex: 1}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: width * 0.04,
                    textAlign: 'center',
                  }}>
                  No Internet Connection
                </Text>
              </View>
            ) : rec_Videos.length == 0 ? (
              <View style={{flex: 1}}>
                <Text style={{color: 'white', fontSize: width * 0.04}}>
                  No Recordings Found
                </Text>
              </View>
            ) : (
              <FlatList
                data={rec_Videos}
                numColumns={2}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.recordedVideoList}
                showsVerticalScrollIndicator={false}
                style={{marginBottom: height * 0.025}}
                renderItem={({item}) => {
                  return (
                    <View style={styles.videoCardContainer}>
                      <LinearGradient
                        colors={['#363B40', '#212428']}
                        start={{x: 0.0, y: 0.05}}
                        end={{x: 0.0, y: 1.0}}
                        locations={Platform.OS == 'ios' ? [] : [0.0, 3]}
                        style={styles.videoCardLinear}>
                        <View style={{position: 'absolute', top: 8, right: 8}}>
                          <Menu
                            contentStyle={{backgroundColor: '#1C212D'}}
                            // style={{width: width * 0.25}}
                            visible={item._id == gotItemKey ? true : false}
                            onDismiss={() => {
                              setGotItemKey('');
                              console.log('on Dismiss pressed');
                            }}
                            anchor={
                              <TouchableOpacity
                                activeOpacity={0.5}
                                onPress={() => {
                                  expandOptions(item);
                                }}>
                                <Icon
                                  name={'md-caret-down-sharp'}
                                  color={'white'}
                                  size={portrait ? width * 0.05 : height * 0.05}
                                />
                              </TouchableOpacity>
                            }>
                            <Menu.Item
                              titleStyle={{
                                color:
                                  item.downloadUrl != '' ? '#fff' : '#959595',
                              }}
                              onPress={() => {
                                if (item.downloadUrl == '') {
                                  Toast.show(
                                    'Video is currently Uploading, Download not Available Yet',
                                    Toast.SHORT,
                                  );
                                  setGotItemKey('');
                                } else {
                                  downloadVideo(item.downloadUrl);
                                  setGotItemKey('');
                                }
                              }}
                              title="Download"
                            />
                            <Menu.Item
                              // disabled={true}
                              titleStyle={{color: '#fff'}}
                              onPress={() => {
                                fetchUrl(
                                  item.startTime,
                                  item.endTime,
                                  'share',
                                  item._id,
                                );
                                setGotItemKey('');
                              }}
                              title="Share"
                            />
                            <Menu.Item
                              titleStyle={{color: '#fff'}}
                              onPress={() => {
                                deleteVideo(item._id);
                                setGotItemKey('');
                              }}
                              title="Delete"
                            />
                          </Menu>
                        </View>
                        <TouchableOpacity
                          activeOpacity={0.2}
                          onPress={() =>
                            fetchUrl(
                              item.startTime,
                              item.endTime,
                              'play',
                              item._id,
                            )
                          }>
                          <Icon
                            name={'play-outline'}
                            color={'white'}
                            size={portrait ? width * 0.2 : height * 0.2}
                          />
                        </TouchableOpacity>
                        <Text style={styles.videoTime}>
                          {convertDate(item.startTime)}
                        </Text>
                      </LinearGradient>
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
        <Modal
          animationIn="slideInDown"
          animationOut="slideOutUp"
          swipeDirection="right"
          backdropColor="black"
          backdropOpacity={0.7}
          onSwipeComplete={() => setModalVisible(false)}
          isVisible={modalVisible}
          style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <View style={styles.cancelButtonContainer}>
              <GradientButton
                iconName={'close'}
                iconColor={'white'}
                unfilled={true}
                iconSize={portrait ? height * 0.03 : width * 0.03}
                style={styles.cancelButton}
                onPress={() => FnModalVisible(false)}
              />
            </View>
            <View style={styles.modalBodyContainer}>
              {iosPicker == true ? (
                <View>
                  <View
                    style={{
                      position: 'absolute',
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: width * 0.67,
                      zIndex: 1,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.04,
                      }}>
                      Month
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.04,
                      }}>
                      Year
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: width * 0.7,
                      height: height * 0.2,
                    }}>
                    <Picker
                      itemStyle={{color: '#fff'}}
                      style={{
                        width: width * 0.3,
                        backgroundColor: '#202427',
                      }}
                      selectedValue={Number(
                        selectDate.toISOString().slice(5, 7),
                      )}
                      pickerData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                      onValueChange={value => changeMonthIOS(value)}
                    />
                    <Picker
                      itemStyle={{color: '#fff'}}
                      style={{width: width * 0.3, backgroundColor: '#202427'}}
                      selectedValue={Number(
                        selectDate.toISOString().slice(0, 4),
                      )}
                      pickerData={[
                        2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027,
                        2028, 2029, 2030, 2031,
                      ]}
                      onValueChange={value => changeYearIOS(value)}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      width: width * 0.67,
                      marginBottom: height * 0.02,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.04,
                      }}>
                      Month
                    </Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: width * 0.04,
                      }}>
                      Year
                    </Text>
                  </View>
                  <DatePicker
                    style={{
                      height: height * 0.18,
                      backgroundColor: '#202427',
                    }}
                    date={selectDate}
                    textSize={20}
                    textColor="white"
                    mode="date"
                    order="M-Y"
                    onDateChange={value => changeDate(value)}
                  />
                </View>
              )}
            </View>
            <View style={styles.modalFooterContainer}>
              <GradientButton
                title={'Done'}
                iconName={'checkmark-done'}
                iconColor={'white'}
                iconSize={portrait ? height * 0.02 : width * 0.02}
                style={styles.doneButton}
                onPress={doneBtn}
              />
            </View>
          </View>
        </Modal>
      </Footer>
    </>
  );
}

export default Videos;
