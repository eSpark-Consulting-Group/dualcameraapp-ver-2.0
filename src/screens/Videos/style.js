import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../utils/fonts'

const { height, width } = Dimensions.get('window');
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * .86 : height * 1,
    width: width,
    // flexDirection: 'column',
    backgroundColor: '#202427'
  },
  yearButton: {
    height: height * .06,
    width: width * 1,
    backgroundColor: '#1B1F22',
    elevation: height * .01,
    justifyContent: 'center',
    alignItems: 'center'
  },
  yearText: {
    color: '#0179B0',
    fontFamily: Fonts.LatoBold,
    fontSize: height * .03,
    textAlign: 'center'
  },
  dateDataList: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateContainer: {
    height: height * .1,
    width: width * 1,
    backgroundColor: '#1C212D',
    elevation: height * .01,
    justifyContent: 'center',

  },
  dateButton: {
    width: width * .17,
    height: height * .07,
    margin: height * .01,
    borderRadius: height * .005,
    shadowColor: "#0179B0",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: width * .01,
    elevation: height * .007,
  },
  dateButtonLinear: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: height * .001,
    borderColor: '#363B40',
    borderRadius: height * .005,

  },
  dateText: {
    color: 'white',
    fontFamily: Fonts.LatoBold,
    fontSize: height * .015,
    textAlign: 'center'
  },
  recordedVideoContainer: {
    height: height * .7,
    width: width * 1,
    marginTop: height * .03,
    paddingBottom: height * .06,
  },
  recordedVideoList: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  videoCardContainer: {
    width: width * .45,
    height: height * .25,
    margin: height * .0135,
    borderWidth: width * .001,
    borderColor: '#ffffff0c',
    borderRadius: width * .01,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: width * .008,
    elevation: width * .01
  },
  videoCardLinear: {
    flex: 1,
    // elevation: height * .01,
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: width * .001,
    borderColor: '#363B40',
    borderRadius: width * .01,
  },
  videos: {
    width: width * .45,
    height: height * .25,
    borderRadius: height * .01,
    position: 'absolute',
    opacity: .9
  },
  videoTime: {
    color: 'white',
    fontFamily: Fonts.Lato,
    fontSize: height * .015,
    textAlign: 'center',
    position: 'absolute',
    bottom: height * .015,
    width: width * .448,
    left: width * .001,
    height: height * .02,
    backgroundColor: '#20272ecc'
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderRadius: width * .01
  },
  rightCam: {
    height: Platform.OS == 'ios' ? height * .43 : height * .46,
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
    borderRadius: width * .2,
    height: width * .11,
    width: width * .11,
    elevation: width * .005,
  },
  backgroundVideoFullScreen: {
    height: screenHeight,
    width: screenWidth,
  },
  mediaControls: {
    width: screenHeight - 170,
    height: '100%',
    flex: 1,
    alignSelf: Platform.OS === 'android' ? screenHeight < 800 ? 'center' : 'flex-start' : 'center',
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
    maxHeight: height * .34,
    maxWidth: width * .7,
    left: width * .1,
    // bottom: height * .01,
    top: height * -.0,
    // alignSelf:'center',
    // elevation:height * .008,
    // shadowColor: "white",
    // shadowOffset: {
    //   width: 0,
    //   height: 2
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 8,
  },
  modalInner: {
    backgroundColor: '#202427',
    height: height * .34,
    width: width * .7,
    elevation: height * .008,
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderBottomLeftRadius: height * .01,
    borderBottomRightRadius: height * .01,
  },
  cancelButtonContainer: {
    width: width * .7,
    height: height * .03,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    width: height * .04,
    height: height * .04,
    borderRadius: height * .1,
  },
  modalBodyContainer: {
    width: width * .7,
    height: height * .22,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor:"red",
    alignItems: 'center'
  },
  modalFooterContainer: {
    height: height * .09,
    width: width * .7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneButton: {
    width: width * .3,
    height: height * .05,
    borderRadius: height * .005,
  },


});

export default styles;
