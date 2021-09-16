import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './passModalStyle';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  MyHeader,
  Button,
  Footer,
  GradientButton,
  MyInput,
  Loader,
  MyErrorMsg
} from '../components';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

// 


const { width, height } = Dimensions.get("window");

const Stack = createStackNavigator();
function PassModal({ navigation }) {
  const { colors, font } = useTheme();
  const [loading, setLoading] = useState(false);
  const [keysData, setKeysData] = useState([
    {
      key: '1',
      view: false,
      input: '',
      placeholder: 'Your Current Password...',
      error: 'Invalid Current Password',
      invisible: true
    },
    {
      key: '2',
      view: false,
      input: '',
      placeholder: 'Your New Password...',
      error: 'Invalid New Password',
      invisible: true
    },
    {
      key: '3',
      view: false,
      input: '',
      placeholder: 'Confirm Password...',
      error: 'Invalid Confirm Password',
      invisible: true
    },
  ]);

  // Password Inputs onchange event
  const handlePasswords = (value, index) => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].input = value; // replace value with whatever you want to change it to
    setKeysData(newArr);
    // console.log('data--->', keysData);
  }

  // Submit Funtion of password change
  const handleSubmitPasswords = (value, index) => {
    keysData.map((data, index) => {
      if (data.input == '') {
        let newArr = [...keysData]; // copying the old datas array
        newArr[index].view = true; // replace value with whatever you want to change it to
        setKeysData(newArr);
        // console.log('run')
      } else {
        let newArr = [...keysData]; // copying the old datas array
        newArr[index].view = false; // replace value with whatever you want to change it to
        setKeysData(newArr);
      }
    })
    const emptyInputs = keysData.filter((item) => item.input === '');
    const matchInputs = keysData[1].input === keysData[2].input;

    if (!emptyInputs.length) {

      // first add the functionality of check current password is it current 
      if (!matchInputs) {
        Toast.show("Password isn't match", Toast.SHORT);
      } else {
        Toast.show("Password Update", Toast.SHORT);
      }
    }
  }

  // Make inputs visible or invisible
  const setPassVisible = (index) => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].invisible = !newArr[index].invisible; // replace value with whatever you want to change it to
    setKeysData(newArr);
    // console.log('data--->', keysData);
  }

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={-400}
        behavior="padding">
        <View style={styles.container}>

          {/* Screen Header */}
          <View style={styles.headerContainer}>
            <Button
              iconName={'chevron-back'}
              iconColor={'white'}
              iconSize={width * 0.045}
              style={styles.moreButton}
              onPress={() => navigation.goBack()}
            />
          </View>

          {/* Screen Body */}
          <View style={styles.bodyContainer}>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Icon name="md-lock-open-outline" size={height * .15} color="#003CC2" />
            </View>

            {/* Headings */}
            <View style={styles.headingsContainer}>
              <Text
                style={[
                  styles.textStyle,
                  { fontFamily: font },
                ]}>
                Change Password
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { fontFamily: font, },
                ]}>
                Make sure you remember your password
              </Text>
            </View>
            {/* Inputs */}
            <View style={styles.inputsContainer}>
              {
                keysData &&
                keysData.map((data, index) => (
                  <>
                    <MyInput
                      colors={colors}
                      // value="12345"
                      onChangeText={(e) => handlePasswords(e, index)}
                      placeholder={data.placeholder}
                      // onBlur={() => setFieldTouched('password')}
                      fontF={font}
                      secureTextEntry={data.invisible}
                      autoCorrect={false}
                      inputText="Password"
                      leftIcon={
                        <Icon
                          name="key"
                          size={width * 0.05}
                          color="#525252"
                        />
                      }
                      rightIcon={
                        <Icon
                          name="eye"
                          size={width * 0.05}
                          color={!data.invisible ? '#fff' : '#525252'}
                          onPress={() => setPassVisible(index)}
                        />
                      }
                    />
                    {data.view ? (
                      <MyErrorMsg errorMsg={data.error} fontF={font} />
                    ) : (
                      <View />
                    )}
                  </>
                ))
              }
            </View>
            {/* Confirm button */}
            <View style={styles.bottomContainer}>
              <GradientButton
                loading={loading}
                title="Change Password"
                onPress={handleSubmitPasswords}
                style={styles.btnStyle}
                textStyle={{
                  color: '#fff',
                  fontFamily: font,
                  fontSize: width * 0.05,
                }}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default function PassStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Pass" component={PassModal} />
    </Stack.Navigator>
  );
}

