import { StyleSheet, Dimensions, Platform } from 'react-native';
import { Fonts } from '../../utils/fonts';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
    width: width,
    backgroundColor: '#202427',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    marginTop: height * 0.02,
    marginBottom: height * 0.15,
  },
  listContainer: {
    flexDirection: 'row',
    height: height * 0.1,
    width: width * 0.95,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: 'white',
    paddingHorizontal: height * 0.02,
    borderRadius: height * 0.01,
    shadowColor: '#25AAE1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: height * 0.1,
    elevation: height * 0.003,
    marginVertical: height * 0.01,
  },
  listContainerDropdown: {
    height: height * 0.1,
    width: width * 0.95,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'white',
    paddingHorizontal: height * 0.02,
    borderRadius: height * 0.01,
    shadowColor: '#25AAE1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: height * 0.1,
    elevation: height * 0.003,
    marginVertical: height * 0.01,
  },
  listInnerDropdown: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: height * 0.01,
  },
  dropDownTextInput: {
    flex: 1,
    fontSize: width * 0.04,
    fontFamily: Fonts.Lato,
    color: '#22343E',
    borderRadius: 4,
    paddingLeft: 10,
    borderBottomWidth: 0,
    backgroundColor: 'white',
  },
  dropDownButton: {
    backgroundColor: '#22343E',
    padding: height * 0.01,
    marginLeft: height * 0.02,
  },
  fontContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listFont: {
    color: 'white',
    fontSize: height * 0.02,
    fontFamily: Fonts.Lato,
    marginLeft: height * 0.01,
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
  blAndClDialogContainer: {
    backgroundColor: '#1C212D',
    borderRadius: height * 0.01,
  },
  blAndClDialogInner: {
    height: height * 0.12,
    justifyContent: 'space-between',
  },
  blAndClCloseBtn: {
    position: 'absolute',
    zIndex: 1,
    right: 1,
    top: 1,
  },
  blutoothPinDialogContainer: {
    backgroundColor: '#1C212D',
    borderRadius: height * 0.01,
  },
  blutoothPinDialogInner: {
    height: width * 0.3,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bluetoothDialogHeading: {
    fontSize: width * 0.05,
    color: '#ffffff',
    textAlign: 'center',
  },
  pinTextInputContainer: {
    height: height * 0.1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: height * 0.01,
    borderRadius: height * 0.01,
  },
  pinTextInput: {
    width: height * 0.4,
    height: height * 0.06,
  },
  bluetoothDialogBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: height * 0.03,
  },
});

export default styles;
