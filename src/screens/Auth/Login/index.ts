import React, {useState} from 'react';
import {
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {useDimensions} from '@react-native-community/hooks';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  MyInput,
  MyErrorMsg,
  MySubTitle,
  GradientButton,
} from '../../../components';
import {BASE_URL} from '../../../services/WebServices';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import io from 'socket.io-client';
import NetInfo from '@react-native-community/netinfo';

import {Fonts} from '../../../utils/fonts';

import {ScrollView} from 'react-native';
import Loader from '../../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clc from 'cli-color';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
});

const Login = ({navigation}) => {
  const net = NetInfo.useNetInfo();
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const {colors, font} = useTheme();
  const [topicUrl, setTopicUrl] = useState('');
  const [topicMsg, setTopicMsg] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);

  const [passVisible, setPassVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const isHermes = () => !!global.HermesInternal;

  const socketHandle = (key, msg) => {
    if (key) setActivityIndicator(true);
    setTopicUrl(key);
    setTopicMsg(msg);
    const socket = io(
      'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/',
    );
    socket.emit(key, msg);
    socket.on(key, arg => {
      console.log('Login Screen----------', arg);
      setActivityIndicator(false);
      navigation.navigate('Draw');
    });
  };

  const setLogInStatus = async (email, created_date, token) => {
    try {
      await AsyncStorage.setItem('isLogged', '1');
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('created_date', created_date);
      await AsyncStorage.setItem('token', token);
    } catch (error) {
      console.log('Error when setting', error);
    }
  };

  const handleLogin = (email, password) => {
    if (net.isConnected) {
      setLoading(true);
      axios
        .post(`${BASE_URL}api/auth/login`, {
          email,
          password,
          device_token: '11111',
        })
        .then(function (response) {
          setLoading(false);
          console.log(clc.xterm(172)(JSON.stringify(response.data.token)));
          console.log(clc.greenBright(JSON.stringify(response.data.data)));
          const created_date = response.data.data.created_at.slice(0, 10);
          const token = response.data.token;
          setLogInStatus(email, created_date, token);
          socketHandle('pi_cm3/application/', 'on');
        })
        .catch(function (error) {
          setLoading(false);

          if (error.response) {
            // Request made and server responded
            Toast.show(error.response.data.message, Toast.SHORT);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            Toast.show('Wifi not connected', Toast.SHORT);
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    } else {
      Toast.show('Check your Mobile Internet Connection', Toast.SHORT);
    }
  };

  const styles = StyleSheet.create({
    container: {
      height: Platform.OS == 'ios' ? height * 1 : height * 1,
      width: width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1B1B1B',
      marginVertical: portrait ? height * 0 : height * 0.04,
    },
    logoStyle: {
      width: portrait ? height * 0.15 : width * 0.15,
      height: portrait ? height * 0.15 : width * 0.15,
      borderColor: '#0f35bd',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: height * 0.002,
      borderRadius: height * 0.2,
      marginVertical: height * 0.02,
      bottom: portrait ? height * 0.05 : height * -0.01,
    },
    textStyle: {
      color: '#fff',
      opacity: 0.85,
      fontSize: portrait ? width * 0.05 : height * 0.05,
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
      width: portrait ? width * 0.9 : height * 0.9,
      opacity: 0.5,
      marginBottom: portrait ? height * 0.05 : height * 0.01,
    },
    btnStyle: {
      width: portrait ? width * 0.9 : height * 0.9,
      height: height * 0.07,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: portrait ? width * 0.02 : height * 0.02,
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

  console.log('ahiasd', isHermes());
  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={-400}
        behavior="height">
        <View style={[styles.container, {backgroundColor: colors.background}]}>
          <StatusBar backgroundColor="#1B1B1B" barStyle="light-content" />
          {activityIndicator ? <Loader /> : null}
          <View style={styles.logoStyle}>
            <Text
              style={[
                styles.textStyle,
                {color: colors.text, fontFamily: font},
              ]}>
              Logo here
            </Text>
          </View>
          <MySubTitle text="Sign In to Your Cloud Account" fontF={font} />
          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={values => {
              console.log(values);
              handleLogin(values.email, values.password);
            }}
            validationSchema={validationSchema}>
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
            }) => (
              <>
                <MyInput
                  colors={colors}
                  onChangeText={handleChange('email')}
                  onBlur={() => setFieldTouched('email')}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  inputText="Email"
                  fontF={font}
                  leftIcon={
                    <Icon
                      name="mail"
                      size={portrait ? width * 0.05 : height * 0.05}
                      color="#525252"
                    />
                  }
                />
                {touched.email ? (
                  <MyErrorMsg errorMsg={errors.email} fontF={font} />
                ) : (
                  <View
                    style={{height: portrait ? width * 0.04 : height * 0.04}}
                  />
                )}
                <MyInput
                  colors={colors}
                  onChangeText={handleChange('password')}
                  placeholder="Enter password"
                  onBlur={() => setFieldTouched('password')}
                  fontF={font}
                  secureTextEntry={passVisible}
                  autoCorrect={false}
                  inputText="Password"
                  leftIcon={
                    <Icon
                      name="key"
                      size={portrait ? width * 0.05 : height * 0.05}
                      color="#525252"
                    />
                  }
                  rightIcon={
                    <Icon
                      name="eye"
                      size={portrait ? width * 0.05 : height * 0.05}
                      color={!passVisible ? '#fff' : '#525252'}
                      onPress={() => setPassVisible(!passVisible)}
                    />
                  }
                />
                {touched.password ? (
                  <MyErrorMsg errorMsg={errors.password} fontF={font} />
                ) : (
                  <View
                    style={{height: portrait ? width * 0.04 : height * 0.04}}
                  />
                )}
                <View style={styles.msgStyle}></View>
                <GradientButton
                  loading={loading}
                  title="Continue"
                  onPress={handleSubmit}
                  style={styles.btnStyle}
                  textStyle={{
                    color: '#fff',
                    fontFamily: Fonts.Lato,
                    fontSize: portrait ? width * 0.05 : height * 0.05,
                  }}
                />
              </>
            )}
          </Formik>
          <View
            style={{
              flexDirection: 'row',
              marginTop: portrait ? height * 0.05 : height * 0.05,
              width: width * 1,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: Fonts.Lato,
                fontSize: portrait ? width * 0.04 : height * 0.04,
                marginRight: width * 0.01,
              }}>
              Don't have an account?
            </Text>
            <Text
              onPress={() => {
                navigation.push('SignUp');
              }}
              style={{
                color: colors.text,
                fontFamily: Fonts.Lato,
                fontSize: portrait ? width * 0.05 : height * 0.05,
                bottom: height * 0.005,
                textDecorationLine: 'underline',
              }}>
              SignUp
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default Login;
