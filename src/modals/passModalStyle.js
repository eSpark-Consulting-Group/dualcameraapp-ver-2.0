import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  headerContainer: {
    width: width * 1,
    height: height * 0.07,
    justifyContent: 'center',
    paddingLeft: height * 0.01,
    // backgroundColor:"blue"
  },
  moreButton: {
    borderRadius: width * 0.2,
    height: width * 0.11,
    width: width * 0.11,
    elevation: width * 0.005,
    top: height * 0.02,
  },
  bodyContainer: {
    width: width * 1,
    height: height * 0.87,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:"red"
  },
  textStyle: {
    color: '#25AAE1',
    fontSize: height * 0.05,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: height * 0.022,
    textAlign: 'center',
  },
  logoContainer: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingsContainer: {
    height: height * 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputsContainer: {
    height: height * 0.35,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomContainer: {
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnStyle: {
    width: width * 0.9,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.02,
    elevation: height * 0.01,
  },
});

export default styles;
