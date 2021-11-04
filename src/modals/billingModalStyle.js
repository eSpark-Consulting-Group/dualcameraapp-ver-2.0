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
    paddingLeft: width * 0.01,
    flexDirection: 'row',
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
    alignItems: 'flex-start',
    paddingVertical: width * 0.1,
  },
  cardStyle: {
    width: width * 0.8,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#1B1B1B',
    borderWidth: width * 0.004,
    borderColor: '#17698c',
    margin: width * 0.01,
    paddingHorizontal: width * 0.02,
  },
  textStyle: {
    color: '#25AAE1',
    fontSize: width * 0.085,
    textAlign: 'center',
  },
  subtitle: {
    color: '#828282',
    fontSize: width * 0.06,
    textAlign: 'center',
  },
  logoContainer: {
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingsContainer: {
    height: height * 0.1,
    justifyContent: 'space-around',
    textAlign: 'center',
    alignItems: 'center',
  },
  inputsContainer: {
    height: height * 0.12,
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
