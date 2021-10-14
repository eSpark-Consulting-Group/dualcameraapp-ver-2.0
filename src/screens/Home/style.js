import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../utils/fonts';

const { height, width } = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'column',

    height: Platform.OS == 'ios' ? height * 0.43 : height * 0.77,
    // width: orientationState ? height * 1 : width * 1,
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

export default styles;
