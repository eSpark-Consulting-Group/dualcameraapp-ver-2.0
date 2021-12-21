import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  UIManager,
  Platform,
  StatusBar,
  LayoutAnimation,
  BackHandler,
  Share,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
// import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import {DatePicker, Picker} from 'react-native-wheel-datepicker';
import {Storage} from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob';
import {create} from 'apisauce';
import Toast from 'react-native-simple-toast';
import RNFS from 'react-native-fs';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Menu} from 'react-native-paper';
import styles from './style';
import useUpdateEffect from '../../hooks/useUpdateEffect';
import ProgressBar from 'react-native-progress/Bar';
import {
  Header,
  Footer,
  GradientButton,
  CustumStatusBar,
  MyDialog,
} from '../../components';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {PLAYER_STATES} from 'react-native-media-controls';
import Orientation from 'react-native-orientation-locker';
import VideoPlayer from 'react-native-video-controls';
import {useDimensions} from '@react-native-community/hooks';
import Loader from '../../components/Loader';
import {useFocusEffect} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';

import RNBackgroundDownloader from 'react-native-background-downloader';

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

let ios = false;

if (Platform.OS === 'ios') {
  ios = true;
}

function Videos(props) {
  const net = NetInfo.useNetInfo();
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const flatListRef1 = useRef();
  const {colors, font} = useTheme();
  const [rec_Videos, setRec_Videos] = useState([]);
  const [iosPicker, setIosPicker] = useState(ios);
  const [loader, setLoader] = useState(true);
  const [netFlag, setNetFlag] = useState(false);
  const [gotItemKey, setGotItemKey] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0);
  const [downloadFailed, setDownloadFailed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getFileOnly(true, selectDate);
      addDays(
        selectDate.toString().slice(0, 8) +
          '00' +
          selectDate.toString().slice(10),
      );
      handleScrolling(selectDate);
      return () => {
        setSelectDate(new Date());
        setSelectYear(d.getFullYear());
        setSelectMonth(months[d.getMonth()]);
      };
    }, []),
  );

  const handleScrolling = async date => {
    try {
      setTimeout(() => {
        flatListRef1.current.scrollToIndex({
          viewPosition: 0.5,
          index: date.getDate() > 3 ? date.getDate() - 1 : 0,
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
          // const dataArr = data.reverse(); //TODO: If you want to show videos in descending order
          setRec_Videos(res?.data?.info);
        } else {
          console.log('gya');
        }
      })
      .catch(e => {
        console.log('Error While Fetching Videos', e);
      });
  };

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  let d = new Date();

  const days = function (month, year) {
    return new Date(year, month, 0).getDate();
  };

  const goToDate = val => {
    console.log(clc.bgGreenBright(clc.black('XXXX', val)));
    if (net.isConnected) {
      console.log(clc.yellowBright('chala??'));
      setLoader(true);
      const updateDate = new Date(val);
      setSelectDate(updateDate);
      getFileOnly(true, updateDate);
      setLoader(true);
      handleScrolling(updateDate);
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const addDays = val => {
    console.log('val=====>', val);
    const date = new Date(val);
    let datesCollection = [];
    let newDate = date;

    for (var i = 1; i <= days(date.getMonth() + 2, date.getFullYear()); i++) {
      newDate = new Date(date.getTime() + i * 1000 * 60 * 60 * 24);
      datesCollection.push({
        fullDate: `${newDate}`,
        date: `${newDate.getDate()}`,
        day: `${newDate.toDateString().slice(0, 3)}`,
      });
    }
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
  const [selectDate, setSelectDate] = useState(d);
  const [selectYear, setSelectYear] = useState(d.getFullYear());
  const [selectMonth, setSelectMonth] = useState(months[d.getMonth()]);
  const [editYear, setEditYear] = useState(selectYear);
  const [editMonth, setEditMonth] = useState(selectMonth);
  const [editDate, setEditDate] = useState(selectDate);
  const [dates, setDates] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [videoPath, setVideoPath] = useState('');
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pausedCam1, setPausedCam1] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const globalTask = useRef(null);

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
    setTimeout(() => {
      setSelectDate(editDate);
      setSelectMonth(editMonth);
      setSelectYear(editYear);
      goToDate(editDate);
      handleScrolling(editDate);
      console.log('Edit date', editDate);
    }, 340);
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
              downloadFs(res?.data, '/' + value);
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
      overwrite: true,
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
    openIosProgess();
    const {dirs} = RNFetchBlob.fs;
    const iosFolder = dirs.DocumentDir;
    let task = RNBackgroundDownloader.download({
      id: name.slice(12),
      url: url,
      destination: iosFolder + name.slice(12),
    });
    globalTask.current = task;
    task.begin(expectedBytes => {
      console.log(`Going to download ${expectedBytes} bytes!`);
    });
    task.progress(percent => {
      console.log(`Downloaded: ${percent * 100}%`);
      console.log('..lll', percent);
      const decimalProgress = Number.parseFloat(percent.toPrecision(1));
      setIsStarted(true);
      setProgressStatus(decimalProgress);
    });
    task.done(() => {
      console.log('Download is done!');
      Toast.show('Download Successful', Toast.SHORT);
      console.log('Video Name', name.slice(12));
      closeIosProgress();
      setTimeout(() => {
        RNFetchBlob.ios.openDocument(iosFolder + name.slice(12));
      }, 400);
    });
    task.error(error => {
      console.log('Download canceled due to error: ', error);
      setDownloadFailed(true);
    });
  };

  const cancelDownload = async () => {
    try {
      await globalTask.current.cancel(err => {
        console.log('Cancelled Download');
        Toast.show('Download Cancelled', Toast.SHORT);
        setDownloadFailed(false);
      });
    } catch (e) {
      console.log('ERRRPR', e);
    }
  };

  const shareVideo = async value => {
    if (net.isConnected) {
      api
        .get(`https://tinyurl.com/api-create.php?url=${value}`)
        .then(res => share(res.data));

      const share = url => {
        console.log('Share this', url);
        Share.share({
          message: `Use a Hls Player to watch with this link ${url} link is valid for 12 hours`,
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

  const openIosProgess = () => {
    setDialogVisible(true);
  };

  const closeIosProgress = () => {
    setDialogVisible(false);
    setIsStarted(false);
    setDownloadFailed(false);
    setProgressStatus(0);
  };

  console.log('<<<<<<XYZ>>>>>>', Number(selectDate.toISOString().slice(5, 7)));
  // console.log('net status ka bta', netFlag);
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
          <MyDialog
            dialogVisible={dialogVisible}
            dialogStyle={{
              backgroundColor: '#1C212D',
              borderRadius: height * 0.01,
            }}
            animate="fade"
            content={
              <View>
                <ProgressBar
                  width={width * 0.5}
                  progress={progressStatus} //? in numbers Integer
                  indeterminate={!isStarted}
                  useNativeDriver
                  color={
                    downloadFailed ? 'rgb(170, 14, 14)' : 'rgba(0,122,255,1)'
                  }
                  borderColor={
                    downloadFailed ? 'rgb(170, 14, 14)' : 'rgba(0,122,255,1)'
                  }
                />
                <GradientButton
                  title={'Cancel Download'}
                  style={styles.doneButton}
                  onPress={() => {
                    cancelDownload();
                    closeIosProgress();
                  }}
                />
              </View>
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
              snapToAlignment="center"
              onScrollToIndexFailed={info => {
                console.log('TTTTTTBBBBBBBB???', info);
                setTimeout(() => {
                  flatListRef1.current?.scrollToIndex({
                    viewPosition: 0.5,
                    index: info.index,
                    animated: true,
                  });
                }, 500);
              }}
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
            ) : !net.isConnected || typeof rec_Videos.length == 'undefined' ? (
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
                        locations={Platform.OS == 'ios' ? null : [0.0, 3]}
                        style={styles.videoCardLinear}>
                        <View style={{position: 'absolute', top: 8, right: 8}}>
                          <Menu
                            contentStyle={{backgroundColor: '#1C212D'}}
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
