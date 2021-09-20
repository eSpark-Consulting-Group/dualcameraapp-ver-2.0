import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Fonts} from '../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';
import {useDimensions} from '@react-native-community/hooks';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  iconName,
  iconSize,
  iconColor,
  activeOpacity,
  unfilled,
  loading,
}) => {
  const {width, height} = useDimensions().window;
  const portrait = width < height;

  const styles = StyleSheet.create({
    submitBtn: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: height * 0.01,
      shadowColor: 'white',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },
    submitBtnLinear: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: height * 0.01,
      borderWidth: height * 0.002,
      borderColor: '#0179B0',
    },
    submitBtnText: {
      fontFamily: Fonts.Lato,
      fontSize: portrait ? width * 0.04 : height * 0.04,
      color: 'white',
      margin: height * 0.01,
    },
  });
  return (
    <TouchableOpacity
      disabled={loading}
      activeOpacity={activeOpacity ? activeOpacity : 0.6}
      onPress={onPress}
      style={[
        styles.submitBtn,
        style,
        {elevation: !unfilled == true ? height * 0.005 : null},
      ]}>
      {!unfilled == true ? (
        <LinearGradient
          colors={['#003CC2', '#0179B0']}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={[styles.submitBtnText, textStyle]}>{title}</Text>
              )}
              <Icon name={iconName} color={iconColor} size={iconSize} />
            </View>
          ) : (
            <Icon name={iconName} color={iconColor} size={iconSize} />
          )}
        </LinearGradient>
      ) : !title == '' ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={[styles.submitBtnText, textStyle]}>{title}</Text>
          <Icon name={iconName} color={iconColor} size={iconSize} />
        </View>
      ) : (
        <Icon name={iconName} color={iconColor} size={iconSize} />
      )}
    </TouchableOpacity>
  );
};

export default Button;
