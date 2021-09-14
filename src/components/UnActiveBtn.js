import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const {width, height} = Dimensions.get('window');

export default function UnActiveBtn({onPress, colors, text, fontF}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.boxContainer,
          {
            backgroundColor: colors.background,
            borderWidth: height * 0.002,
            borderColor: colors.card,
          },
        ]}>
        <Text
          style={[styles.textStyle, {color: colors.text, fontFamily: fontF}]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#1B1B1B',
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.1,
    width: width * 0.22,
    borderRadius: height * 0.005,
    opacity: 0.8,
  },
  textStyle: {
    color: '#fff',
    opacity: 0.85,
    fontSize: height * 0.03,
  },
});
