import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  iconName,
  iconSize,
  iconColor,
  activeOpacity,
}) => {
  console.log('AyAS', style.width);
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity ? activeOpacity : 0.6}
      onPress={onPress}
      style={[styles.submitBtn, style]}>
      <LinearGradient
        colors={['#363B40', '#212428']}
        start={{x: 0.0, y: 0.05}}
        end={{x: 0.0, y: 1.0}}
        locations={[0.0, 3]}
        style={[
          styles.submitBtnLinear,
          {
            height: style.height,
            width: style.width,
            borderRadius: style.borderRadius,
          },
        ]}>
        {!title == '' ? (
          <Text style={[styles.submitBtnText, textStyle]}>{title}</Text>
        ) : (
          <Icon name={iconName} color={iconColor} size={iconSize} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: height * 0.01,
    borderColor: '#ffffff0c',
  },
  submitBtnLinear: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: height * 0.01,
    borderWidth: height * 0.002,
    borderColor: '#363B40',
  },
  submitBtnText: {
    fontFamily: Fonts.Lato,
    fontSize: height * 0.02,
    color: 'white',
    margin: height * 0.01,
  },
});

export default Button;
