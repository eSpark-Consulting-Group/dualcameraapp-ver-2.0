import React, {useState, useLayoutEffect, useRef, useEffect} from 'react';
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
import {DatePicker} from 'react-native-wheel-datepicker';
import {Storage} from 'aws-amplify';
import RNFetchBlob from 'rn-fetch-blob';
import {create} from 'apisauce';
import Toast from 'react-native-simple-toast';

// import styles from './style';
import {useTheme} from '@react-navigation/native';
import {Fonts} from '../../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {Menu} from 'react-native-paper';

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
import RNPickerSelect from 'react-native-picker-select';
import {useDimensions} from '@react-native-community/hooks';
import Loader from '../../components/Loader';

var clc = require('cli-color');

var baseURL = 'https://tinyurl.com/api-create.php?url=';

const api = create({
  baseURL: baseURL,
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

function Videos(props) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const flatListRef = useRef();
  const flatListRef1 = useRef();
  const {colors, font} = useTheme();
  const [rec_Videos, setRec_Videos] = useState([]);
  const [iosPicker, setIosPicker] = useState(false);
  const [loader, setLoader] = useState(true);
  const [gotItemKey, setGotItemKey] = useState('');

  const getFileOnly = val => {
    setRec_Videos([]);
    console.log(clc.xterm(154)('date kia:', val));
    const dateArr = selectDate.toISOString().slice(0, 10);
    // console.log('date bata', val);
    Storage.list(`abbas/${val}`)
      .then(data => {
        if (data.length !== 0) {
          const dataArr = data.reverse();
          // data.shift();
          // setVidData(data.reverse());
          setRec_Videos(dataArr);
          setLoader(false);
          // console.log('fetched', dataArr);
        } else {
          setLoader(false);
          console.log('gya');
        }
      })
      .catch(err => {
        setLoader(false);
        console.log('error fetching video');
      });
  };

  useEffect(() => {
    setLoader(true);
    addDays(
      selectDate.toString().slice(0, 8) +
        '00' +
        selectDate.toString().slice(10),
    );
    getFileOnly(selectDate.toISOString().slice(0, 10));
    setTimeout(() => {
      flatListRef1.current.scrollToIndex({
        index: selectDate.getDate() > 3 ? selectDate.getDate() - 2.9 : 0,
        animated: true,
      });
    }, 2000);

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackToDo,
    );
    return () => {
      console.log('chala video unmount videos');
      backHandler.remove();
    };
  }, []);

  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  let d = new Date();

  const days = function (month, year) {
    return new Date(year, month, 0).getDate();
  };

  const goToDate = val => {
    console.log('chala??');
    setLoader(true);
    const updateDate = new Date(val);
    setSelectDate(updateDate);
    getFileOnly(updateDate.toISOString().slice(0, 10));
    setLoader(true);
    flatListRef1.current.scrollToIndex({
      index: updateDate.getDate() > 3 ? updateDate.getDate() - 2.9 : 0,
      animated: true,
    });
  };

  const addDays = val => {
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
        Orientation.lockToPortrait();
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

  const doneBtn = () => {
    FnModalVisible(false);
    setSelectDate(editDate);
    setSelectMonth(editMonth);
    setSelectYear(editYear);
    goToDate(editDate);
    flatListRef1.current.scrollToIndex({
      index: editDate.getDate() > 3 ? editDate.getDate() - 2.9 : 0,
    });
  };

  const FnModalVisible = visible => {
    setModalVisible(visible);
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
        goToDate(selectDate);
      }, 2000);
      setTimeout(() => {
        if (portrait) {
          onFullScreen();
        } else {
          setIsFullScreen(!isFullScreen);
        }
        setTimeout(() => {
          Orientation.unlockAllOrientations();
        }, 30);
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
          locations={[0.0, 3]}
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

  const playVideos = value => {
    console.log('video ka link', value);
    currentKey = value;
    Storage.get(value)
      .then(data => {
        setVideoPath({uri: `${data}`});
      })
      .catch(err => {
        console.log('error fetching video');
      });
    setVideoPlaying(true);
    onFullScreen();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
      setPlay(true);
  };

  const downloadVideo = value => {
    Storage.get(value)
      .then(data => {
        api
          .get(`https://tinyurl.com/api-create.php?url=${data}`)
          .then(res => download(res.data, value));
      })
      .catch(err => {
        console.log('error fetching video');
        Toast.show('error while downloading...', Toast.SHORT);
      });
    const download = (url, name) => {
      Toast.show('Download In Progress...', Toast.SHORT);
      let videoURL = url;
      let dirs = RNFetchBlob.fs.dirs;
      RNFetchBlob.config({
        // response data will be saved to this path if it has access right.
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: dirs.DownloadDir + value.toString().slice(5),
        },
      })
        .fetch('GET', videoURL, {
          //some headers ..
        })
        .then(res => {
          // the path should be dirs.DocumentDir + 'path-to-file.anything'
          console.log('The file saved to ', res.path());
        });
    };
  };

  const shareVideo = async value => {
    await Storage.get(value, {expires: 10000})
      .then(data => {
        api
          .get(`https://tinyurl.com/api-create.php?url=${data}`)
          .then(res => share(res.data));
      })
      .catch(err => {
        console.log('error fetching video');
      });
    const share = url => {
      console.log('Share this', url);
      Share.share({
        message: `clicking on the link to watch ${value} ${url}`,
      })
        .then(result => console.log(result))
        .catch(errorMsg => console.log(errorMsg));
    };
    //If response is not in text then in error
  };

  const deleteVideo = async value => {
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
      await Storage.remove(val);
      goToDate(selectDate);
    };
  };

  const playNext = () => {
    let vidIndex = rec_Videos.findIndex(({key}) => key == currentKey); //todo: what index is the current video on the data array
    let newIndex = vidIndex + 1;
    console.log(clc.xterm(216)('length kia ha', rec_Videos.length));
    console.log(clc.xterm(216)('Video the array me index', vidIndex));
    console.log(clc.xterm(216)('Video the array me new index', newIndex));
    if (newIndex < rec_Videos.length) {
      let nextVidKey = rec_Videos[newIndex].key;
      console.log(
        clc.greenBright('video ka link play next me? Current', currentKey),
      );
      console.log(
        clc.yellowBright('video ka link play next me? Next', nextVidKey),
      );
      currentKey = nextVidKey;
      Storage.get(nextVidKey)
        .then(data => {
          setVideoPath({uri: `${data}`});
        })
        .catch(err => {
          console.log('error fetching video');
        });
      setVideoPlaying(true);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
        setPlay(true);
    } else {
      playFrontCam(false);
      setPlayerState(PLAYER_STATES.ENDED);
      setPlay(!play);
      num = 1;
      currentKey = '';
    }
  };

  const expandOptions = item => {
    if (gotItemKey == '') {
      setGotItemKey(item.key);
    }
  };

  const styles = StyleSheet.create({
    container: {
      height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
      width: width,
      backgroundColor: '#202427',
    },
    yearButton: {
      height: portrait ? height * 0.06 : width * 0.05,
      width: width * 1,
      backgroundColor: '#1B1F22',
      elevation: height * 0.01,
      justifyContent: 'center',
      alignItems: 'center',
    },
    yearText: {
      color: '#0179B0',
      fontFamily: Fonts.LatoBold,
      fontSize: portrait ? height * 0.03 : width * 0.03,
      textAlign: 'center',
    },
    dateDataList: {
      flex: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dateContainer: {
      height: portrait ? height * 0.1 : width * 0.08,
      width: width * 1,
      backgroundColor: '#1C212D',
      elevation: height * 0.01,
      justifyContent: 'center',
    },
    dateButton: {
      width: width * 0.17,
      height: portrait ? height * 0.07 : width * 0.05,
      margin: portrait ? height * 0.01 : width * 0.01,
      borderRadius: portrait ? height * 0.005 : width * 0.05,
      shadowColor: '#0179B0',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: width * 0.01,
      elevation: height * 0.007,
    },
    dateButtonLinear: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: portrait ? height * 0.001 : width * 0.001,
      borderColor: '#363B40',
      borderRadius: portrait ? height * 0.005 : width * 0.005,
    },
    dateText: {
      color: 'white',
      fontFamily: Fonts.LatoBold,
      fontSize: portrait ? height * 0.015 : width * 0.015,
      textAlign: 'center',
    },
    recordedVideoContainer: {
      height: portrait ? height * 0.7 : width * 0.7,
      width: width * 1,
      marginTop: portrait ? height * 0.01 : height * 0.01,

      paddingBottom: portrait ? height * 0.06 : width * 0.4,
      alignItems: 'center',
    },
    recordedVideoList: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    videoCardContainer: {
      width: portrait ? width * 0.45 : width * 0.46,
      height: portrait ? height * 0.25 : height * 0.4,
      margin: portrait ? height * 0.0135 : width * 0.0135,
      borderWidth: portrait ? width * 0.001 : height * 0.001,
      borderColor: '#ffffff0c',
      borderRadius: portrait ? width * 0.01 : height * 0.01,
      shadowColor: 'white',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: width * 0.008,
      elevation: width * 0.01,
    },
    videoCardLinear: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: width * 0.001,
      borderColor: '#363B40',
      borderRadius: portrait ? width * 0.01 : height * 0.01,
    },
    videos: {
      width: width * 0.45,
      height: height * 0.25,
      borderRadius: height * 0.01,
      position: 'absolute',
      opacity: 0.9,
    },
    videoTime: {
      color: 'white',
      fontFamily: Fonts.Lato,
      fontSize: portrait ? height * 0.015 : width * 0.015,
      textAlign: 'center',
      position: 'absolute',
      bottom: height * 0.015,
      width: portrait ? width * 0.448 : width * 0.458,
      height: portrait ? height * 0.02 : width * 0.02,
      backgroundColor: '#20272ecc',
    },
    backgroundVideo: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      borderRadius: portrait ? width * 0.01 : height * 0.01,
    },
    rightCam: {
      height: Platform.OS == 'ios' ? height * 0.43 : height * 0.46,
      width: width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
      backgroundColor: '#202427',
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
    moreButton: {
      borderRadius: width * 0.2,
      height: width * 0.11,
      width: width * 0.11,
      elevation: width * 0.005,
    },
    backgroundVideoFullScreen: {
      height: screenHeight,
      width: screenWidth,
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
    toolbar: {
      marginTop: 30,
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 5,
    },

    // Modal
    modalContainer: {
      backgroundColor: '#20242700',
      maxHeight: portrait ? height * 0.34 : width * 0.34,
      maxWidth: width * 0.7,
      left: width * 0.1,
      top: portrait ? height * -0.0 : height * -0.0,
    },
    modalInner: {
      backgroundColor: '#202427',
      height: portrait ? height * 0.34 : width * 0.34,
      width: width * 0.7,
      elevation: height * 0.008,
      shadowColor: 'white',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      borderBottomLeftRadius: height * 0.01,
      borderBottomRightRadius: height * 0.01,
    },
    cancelButtonContainer: {
      width: width * 0.7,
      height: portrait ? height * 0.03 : width * 0.03,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    cancelButton: {
      width: portrait ? height * 0.04 : width * 0.04,
      height: portrait ? height * 0.04 : width * 0.04,
      borderRadius: height * 0.1,
    },
    modalBodyContainer: {
      width: width * 0.7,
      height: portrait ? height * 0.22 : width * 0.22,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    modalFooterContainer: {
      height: portrait ? height * 0.09 : width * 0.09,
      width: width * 0.7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneButton: {
      width: width * 0.3,
      height: portrait ? height * 0.05 : width * 0.05,
      borderRadius: height * 0.005,
    },
  });

  return play == true ? (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#202427" barStyle="default" hidden={true} />
      <VideoPlayer
        onBack={() => {
          playFrontCam(false);
          num = 1;
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
          <Text style={styles.yearText}>{selectMonth + ' ' + selectYear}</Text>
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
              keyExtractor={item => item.size}
              contentContainerStyle={styles.recordedVideoList}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <View style={styles.videoCardContainer}>
                    <LinearGradient
                      colors={['#363B40', '#212428']}
                      start={{x: 0.0, y: 0.05}}
                      end={{x: 0.0, y: 1.0}}
                      locations={[0.0, 3]}
                      style={styles.videoCardLinear}>
                      <View style={{position: 'absolute', top: 8, right: 8}}>
                        <Menu
                          contentStyle={{backgroundColor: '#1C212D'}}
                          style={{width: width * 0.25}}
                          visible={item.key == gotItemKey ? true : false}
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
                            titleStyle={{color: '#fff'}}
                            onPress={() => {
                              downloadVideo(item.key);
                              setGotItemKey('');
                            }}
                            title="Download"
                          />
                          <Menu.Item
                            titleStyle={{color: '#fff'}}
                            onPress={() => {
                              shareVideo(item.key);
                              setGotItemKey('');
                            }}
                            title="Share"
                          />
                          <Menu.Item
                            titleStyle={{color: '#fff'}}
                            onPress={() => {
                              deleteVideo(item.key);
                              setGotItemKey('');
                            }}
                            title="Delete"
                          />
                        </Menu>
                      </View>
                      <TouchableOpacity
                        activeOpacity={0.2}
                        onPress={() => playVideos(item.key)}>
                        <Icon
                          name={'play-outline'}
                          color={'white'}
                          size={portrait ? width * 0.2 : height * 0.2}
                        />
                      </TouchableOpacity>
                      <Text style={styles.videoTime}>
                        {item.key.match(/\d+.\d+.\d+.\d+.\d+.\d+/g)}
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: width * 0.7,
                }}>
                <View>
                  <Text style={{color: 'white', fontSize: width * 0.04}}>
                    Day
                  </Text>
                  <RNPickerSelect
                    style={{
                      inputIOS: {color: 'white'},
                      viewContainer: {
                        alignItems: 'center',
                        marginTop: height * 0.02,
                      },
                    }}
                    placeholder={{label: '21', value: null}}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={value => console.log(value)}
                    items={[
                      {label: '20', value: '20'},
                      {label: '20', value: '20'},
                      {label: '21', value: '21'},
                      {label: '22', value: '22'},
                    ]}
                  />
                </View>
                <View>
                  <Text style={{color: 'white', fontSize: width * 0.04}}>
                    Month
                  </Text>
                  <RNPickerSelect
                    style={{
                      inputIOS: {color: 'white'},
                      viewContainer: {
                        alignItems: 'center',
                        marginTop: height * 0.02,
                      },
                    }}
                    placeholder={{label: 'May', value: null}}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={value => console.log(value)}
                    items={[
                      {label: 'May', value: 'May'},
                      {label: 'Jun', value: 'Jun'},
                      {label: 'Jul', value: 'Jul'},
                    ]}
                  />
                </View>
                <View>
                  <Text style={{color: 'white', fontSize: width * 0.04}}>
                    Year
                  </Text>
                  <RNPickerSelect
                    style={{
                      inputIOS: {color: 'white'},
                      viewContainer: {
                        alignItems: 'center',
                        marginTop: height * 0.02,
                      },
                    }}
                    placeholder={{label: '2021', value: null}}
                    useNativeAndroidPickerStyle={false}
                    onValueChange={value => console.log(value)}
                    items={[
                      {label: '2021', value: '2021'},
                      {label: '2022', value: '2022'},
                      {label: '2023', value: '2023'},
                    ]}
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
                    marginBottom: portrait ? height * 0.02 : width * 0.02,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: portrait ? width * 0.04 : height * 0.04,
                    }}>
                    Month
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: portrait ? width * 0.04 : height * 0.04,
                    }}>
                    Year
                  </Text>
                </View>
                <DatePicker
                  style={{
                    height: portrait ? height * 0.18 : width * 0.18,
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
  );
}

export default Videos;
