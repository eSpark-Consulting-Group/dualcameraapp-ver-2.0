import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './passModalStyle';
import {Button, GradientButton, MyInput, MyErrorMsg} from '../components';
import {useTheme} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clc from 'cli-color';
import {BASE_URL} from '../services/WebServices';
import {create} from 'apisauce';
import {BarPasswordStrengthDisplay} from 'react-native-password-strength-meter';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');
const api = create({baseURL: BASE_URL});

const Stack = createStackNavigator();
function PassModal({navigation}) {
  const net = NetInfo.useNetInfo();
  const {colors, font} = useTheme();
  const [loading, setLoading] = useState(false);
  const [keysData, setKeysData] = useState([
    {
      key: '1',
      view: false,
      input: '',
      placeholder: 'Your Current Password...',
      error: 'Invalid Current Password',
      invisible: true,
    },
    {
      key: '2',
      view: false,
      input: '',
      placeholder: 'Your New Password...',
      error: 'Invalid New Password',
      invisible: true,
    },
    {
      key: '3',
      view: false,
      input: '',
      placeholder: 'Confirm Password...',
      error: 'Invalid Confirm Password',
      invisible: true,
    },
  ]);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      console.log('Got the token successfully');
      const tokenObj = {'x-auth-token': token};
      console.log('Token object', tokenObj);
      api.setHeaders(tokenObj);
    }
  };

  // Password Inputs onchange event
  const handlePasswords = (text, index) => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].input = text; // replace text with whatever you want to change it to
    setKeysData(newArr);
    // console.log('data--->', keysData);
  };

  // Submit Funtion of password change
  const handleSubmitPasswords = () => {
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
    });
    const emptyInputs = keysData.filter(item => item.input === ''); // returns an array
    const matchInputs = keysData[1].input === keysData[2].input; // checks if new pass and confirm pass is a match
    const validateInputs = keysData[1].input.length < 6;
    const currPass = keysData[0].input;
    const newPass = keysData[1].input;

    if (!emptyInputs.length) {
      // first add the functionality of check current password is it current
      if (!matchInputs) {
        Toast.show("Password isn't match", Toast.SHORT);
      } else {
        if (validateInputs) {
          console.log('not 6 characters');
          Toast.show(
            'new Password should be at least 6 characters',
            Toast.SHORT,
          );
        } else {
          console.log(clc.xterm(154)('Now we can call api finally'));
          handleUpdatePassword(currPass, newPass);
        }
      }
    } else {
      console.log('input not properly filled');
    }
  };

  // Make inputs visible or invisible
  const setPassVisible = index => {
    let newArr = [...keysData]; // copying the old datas array
    newArr[index].invisible = !newArr[index].invisible; // replace value with whatever you want to change it to
    setKeysData(newArr);
    // console.log('data--->', keysData);
  };

  const handleUpdatePassword = (currPass, newPass) => {
    if (net.isConnected) {
      setLoading(true);
      const clearArr = keysData.map(data => {
        return {...data, input: ''};
      });
      console.log(
        clc.xterm(69)(
          JSON.stringify({
            currentPassword: currPass,
            newPassword: newPass,
          }),
        ),
      );
      api
        .put('api/auth/updatePassword', {
          currentPassword: currPass,
          newPassword: newPass,
        })
        .then(response => {
          if (response.ok) {
            console.log('It Worked', response.data);
            Toast.show('Password updated Successfully');
            setLoading(false);
            setKeysData(clearArr); //? clears inputs values
            navigation.goBack();
          } else {
            console.log('Kia Response Aya:', response);
            setKeysData(clearArr); //? clears inputs values
            Toast.show('Old Password Incorrect');
            setLoading(false);
          }
        })
        .catch(e => {
          console.log('Error on Put Request', e);
          setLoading(false);
        });
    } else {
      Toast.show('Check Your Mobile internet Connection', Toast.SHORT);
    }
  };

  const inlineStyles = StyleSheet.create({
    btnTextStyle: {
      color: '#fff',
      fontFamily: font,
      fontSize: width * 0.05,
    },
  });

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={{flex: 1}}
        keyboardVerticalOffset={-100}
        behavior="position">
        <SafeAreaView style={styles.container}>
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
              <Icon
                name="md-lock-open-outline"
                size={height * 0.15}
                color="#25AAE1"
              />
            </View>

            {/* Headings */}
            <View style={styles.headingsContainer}>
              <Text style={[styles.textStyle, {fontFamily: font}]}>
                Change Password
              </Text>
              <Text style={[styles.subtitle, {fontFamily: font}]}>
                Make sure you remember your password
              </Text>
            </View>
            {/* Inputs */}
            <View style={styles.inputsContainer}>
              {keysData &&
                keysData.map((data, index) => (
                  <View key={data.key}>
                    <MyInput
                      value={data.input}
                      colors={colors}
                      onChangeText={text => handlePasswords(text, index)}
                      placeholder={data.placeholder}
                      fontF={font}
                      secureTextEntry={data.invisible}
                      autoCorrect={false}
                      inputText="Password"
                      leftIcon={
                        <Icon name="key" size={width * 0.05} color="#525252" />
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
                    {data.key == 2 ? (
                      data.input.length >= 6 ? (
                        <View
                          style={{
                            height: height * 0.05,
                          }}>
                          <BarPasswordStrengthDisplay
                            password={data.input}
                            width={width * 0.87}
                            minLength={6}
                          />
                        </View>
                      ) : (
                        <View />
                      )
                    ) : (
                      <View />
                    )}
                    {data.view ? (
                      <MyErrorMsg errorMsg={data.error} fontF={font} />
                    ) : (
                      <View />
                    )}
                  </View>
                ))}
            </View>
            {/* Confirm button */}
            <View style={styles.bottomContainer}>
              <GradientButton
                loading={loading}
                title="Change Password"
                onPress={handleSubmitPasswords}
                style={styles.btnStyle}
                textStyle={inlineStyles.btnTextStyle}
              />
            </View>
          </View>
        </SafeAreaView>
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
