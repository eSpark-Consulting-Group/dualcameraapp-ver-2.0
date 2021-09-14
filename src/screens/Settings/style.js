import {StyleSheet, Dimensions} from 'react-native';
import {Fonts} from '../../utils/fonts';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: Platform.OS == 'ios' ? height * 0.86 : height * 1,
    width: width * 1,
    // flexDirection: 'column',
    backgroundColor: '#202427',
    justifyContent: 'center',
  },
  inner: {
    flex: 1,
    // justifyContent:'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  listContainer: {
    flexDirection: 'row',
    height: height * 0.1,
    width: width * 0.95,
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderBottomWidth: height * 0.001,
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
  fontContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listFont: {
    color: 'white',
    fontSize: width * 0.04,
    fontFamily: Fonts.Lato,
    marginLeft: width * 0.01,
  },
});

export default styles;
