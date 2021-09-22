import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * 1 : height * 1,
    width: width * 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1B1B',
  },
  logoStyle: {
    width: height * 0.15,
    height: height * 0.15,
    borderColor: '#0f35bd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: height * 0.002,
    borderRadius: height * 0.2,
    marginVertical: height * 0.02,
    bottom: height * 0.05,
  },
  textStyle: {
    color: '#fff',
    opacity: 0.85,
    fontSize: width * 0.05,
  },
  loginBtnContainer: {
    flexDirection: 'row',
    width: width * 0.75,
    height: height * 0.15,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
  },
  msgStyle: {
    alignItems: 'flex-end',
    width: width * 0.9,
    opacity: 0.5,
    marginBottom: height * 0.05,
  },
  btnStyle: {
    width: width * 0.9,
    height: height * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.02,
    elevation: height * 0.01,
  },
  gradientStyle: {
    width: width * 0.9,
    height: height * 0.07,
    borderRadius: width * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
