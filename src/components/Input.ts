import React, {useRef} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';

export default function Inp({
  colors,
  keyboardType,
  placeholder,
  onChangeText,
  autoCorrect,
  secureTextEntry,
  leftIcon,
  rightIcon,
  fontF,
  value,
  onBlur,
}) {
  const textInputRef = useRef(null);

  const click = () => {
    textInputRef.current.focus();
  };
  const {width, height} = useDimensions().window;
  const portrait = width < height;

  const styles = StyleSheet.create({
    textInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: portrait ? width * 0.05 : height * 0.05,
      width: portrait ? width * 0.9 : height * 0.9,
      backgroundColor: '#3a3a3c',
      height: height * 0.08,
      borderRadius: height * 0.01,
      elevation: height * 0.01,
    },
    inputStyle: {
      position: 'absolute',
      left: width * 0.13,
    },
  });
  return (
    <TouchableWithoutFeedback onPress={() => click()}>
      <View style={styles.textInputContainer}>
        {leftIcon}
        <View style={styles.inputStyle}>
          <TextInput
            ref={textInputRef}
            value={value}
            onBlur={onBlur}
            autoCompleteType="off"
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize="none"
            placeholderTextColor="#8b8b91"
            underlineColorAndroid="transparent"
            keyboardType={keyboardType}
            autoCorrect={autoCorrect || false}
            secureTextEntry={secureTextEntry}
            style={{
              width: width * 0.65,
              flex: 1,
              fontSize: portrait ? width * 0.04 : height * 0.04,
              fontFamily: fontF,
              borderColor: 'transparent',
              color: colors.text,
            }}
            textAlignVertical="center"
          />
        </View>
        <View>{rightIcon}</View>
      </View>
    </TouchableWithoutFeedback>
  );
}
