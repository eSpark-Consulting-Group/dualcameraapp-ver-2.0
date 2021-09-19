import React, {useState} from 'react';
import {
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import {useDimensions} from '@react-native-community/hooks';
import {
  MyInput,
  MyTitle,
  MyErrorMsg,
  MySubTitle,
  GradientButton,
} from '../../../components';
import {Fonts} from '../../../utils/fonts';

import styles from './style';
import {BASE_URL} from '../../../services/WebServices';

import io from 'socket.io-client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import {ScrollView} from 'react-native';
import Toast from 'react-native-simple-toast';
import clc from 'cli-color';

// const {width, height} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Password do not match')
    .required('Confirm password is required'),
});

const SignUp = ({navigation}) => {
  const {colors, font} = useTheme();
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [passVisible, setPassVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);

  const socketHandle = (key, msg) => {
    if (key) setActivityIndicator(true);

    const socket = io(
      'http://dualcamera-env.eba-qm4igdiu.ap-south-1.elasticbeanstalk.com/',
    );
    socket.emit(key, msg);
    socket.on(key, arg => {
      console.log('Sign Up Screen----------', arg);
      setActivityIndicator(false);
      navigation.navigate('Draw');
    });
  };

  const setLogInStatus = async (email, created_date) => {
    try {
      await AsyncStorage.setItem('isLogged', '1');
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('created_date', created_date);
    } catch (error) {
      console.log('Error when setting', error);
    }
  };

  const handleRegister = (email, password) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}api/auth`, {
        email,
        password,
      })
      .then(function (response) {
        console.log(response);
        console.log(clc.greenBright(response.data.data));
        const created_date = response.data.data.created_at.slice(0, 10);
        setLogInStatus(email, created_date);
        setLoading(false);
        socketHandle('pi_cm3/application/', 'on');
      })
      .catch(function (error) {
        setLoading(false);
        Toast.show('Error while Register Account', Toast.SHORT);
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const styles = StyleSheet.create({
    container: {
      height: Platform.OS == 'ios' ? height * 1 : height * 1,
      width: width * 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1B1B1B',
      marginVertical: portrait ? height * 0 : height * 0.08,
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
      width: width * 0.9,
      opacity: 0.5,
      marginBottom: height * 0.05,
    },
    btnStyle: {
      width: portrait ? width * 0.9 : height * 0.9,
      height: height * 0.07,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: portrait ? width * 0.02 : height * 0.02,
      elevation: height * 0.01,
    },
  });
  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={-400}
        behavior="height">
        <View style={[styles.container, {backgroundColor: colors.background}]}>
          <StatusBar backgroundColor="#1B1B1B" barStyle="light-content" />
          <View style={styles.logoStyle}>
            <Text
              style={[
                styles.textStyle,
                {color: colors.text, fontFamily: font},
              ]}>
              Logo here
            </Text>
          </View>
          <MySubTitle text="Set Up Your Cloud Account" fontF={font} />
          <Formik
            initialValues={{email: '', password: '', confirmPassword: ''}}
            onSubmit={values => {
              console.log(values);
              handleRegister(values.email, values.password);
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
                  placeholder="Email"
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
                  onBlur={() => setFieldTouched('password')}
                  placeholder="Password"
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
                />
                {touched.password ? (
                  <MyErrorMsg errorMsg={errors.password} fontF={font} />
                ) : (
                  <View
                    style={{height: portrait ? width * 0.04 : height * 0.04}}
                  />
                )}
                <MyInput
                  colors={colors}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={() => setFieldTouched('confirmPassword')}
                  placeholder="Re-Type Password"
                  fontF={font}
                  secureTextEntry={passVisible}
                  autoCorrect={false}
                  inputText="Re-Type Password"
                  leftIcon={
                    <Icon
                      name="key"
                      size={portrait ? width * 0.05 : height * 0.05}
                      color="#525252"
                    />
                  }
                />
                {touched.confirmPassword ? (
                  <MyErrorMsg errorMsg={errors.confirmPassword} fontF={font} />
                ) : (
                  <View
                    style={{height: portrait ? width * 0.04 : height * 0.04}}
                  />
                )}
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
              Already have an account?
            </Text>
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{
                color: colors.text,
                fontFamily: Fonts.Lato,
                fontSize: portrait ? width * 0.05 : height * 0.05,
                bottom: height * 0.005,
                textDecorationLine: 'underline',
              }}>
              Login
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default SignUp;
