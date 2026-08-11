import {StyleSheet, Dimensions} from 'react-native';

import {Fonts} from '../../utils/fonts';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181a1d',
  },
  imgBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    borderWidth: height * 0.005,
    borderColor: 'yellow',
    width: height * 0.2,
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: height * 0.2,
  },
  textStyle: {
    fontSize: height * 0.05,
    fontFamily: Fonts.LatoBold,
    color: '#ffffff',
    marginVertical: height * 0.2,
  },
});

export default styles;
