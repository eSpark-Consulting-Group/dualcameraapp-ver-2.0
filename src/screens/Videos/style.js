import {StyleSheet, Dimensions, Platform, StatusBar} from 'react-native';
import {Fonts} from '../../utils/fonts';

const {height, width} = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
    width: width,
    backgroundColor: '#202427',
  },
  yearButton: {
    height: height * 0.06,
    width: width * 1,
    backgroundColor: '#1B1F22',
    elevation: height * 0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearText: {
    color: '#0179B0',
    fontFamily: Fonts.LatoBold,
    fontSize: height * 0.03,
    textAlign: 'center',
  },
  dateDataList: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    height: height * 0.1,
    width: width * 1,
    backgroundColor: '#1C212D',
    elevation: height * 0.01,
    justifyContent: 'center',
  },
  dateButton: {
    width: width * 0.17,
    height: height * 0.07,
    margin: height * 0.01,
    borderRadius: height * 0.005,
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
    borderWidth: height * 0.001,
    borderColor: '#363B40',
    borderRadius: height * 0.005,
  },
  dateText: {
    color: 'white',
    fontFamily: Fonts.LatoBold,
    fontSize: height * 0.015,
    textAlign: 'center',
  },
  recordedVideoContainer: {
    height: height * 0.7,
    width: width * 1,
    marginTop: height * 0.01,

    paddingBottom: height * 0.06,
    alignItems: 'center',
  },
  recordedVideoList: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: height * 0.025,
  },
  videoCardContainer: {
    width: width * 0.45,
    height: height * 0.25,
    margin: height * 0.0135,
    borderWidth: width * 0.001,
    borderColor: '#ffffff0c',
    borderRadius: width * 0.01,
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
    borderRadius: width * 0.01,
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
    fontSize: height * 0.015,
    textAlign: 'center',
    position: 'absolute',
    bottom: height * 0.015,
    width: width * 0.448,
    height: height * 0.02,
    backgroundColor: '#20272ecc',
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderRadius: width * 0.01,
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
    maxHeight: height * 0.34,
    maxWidth: width * 0.7,
    left: width * 0.1,
    top: Platform.OS == 'ios' ? height * 0.018 : height * 0,
  },
  modalInner: {
    backgroundColor: '#202427',
    height: height * 0.34,
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
    height: height * 0.03,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    width: height * 0.04,
    height: height * 0.04,
    borderRadius: height * 0.1,
  },
  modalBodyContainer: {
    width: width * 0.7,
    height: height * 0.22,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  modalFooterContainer: {
    height: height * 0.09,
    width: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButton: {
    width: width * 0.3,
    height: height * 0.05,
    borderRadius: height * 0.005,
  },
});

export default styles;
