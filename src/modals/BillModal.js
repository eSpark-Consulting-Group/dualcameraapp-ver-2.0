import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './billingModalStyle';
import {
  Button,
  GradientButton,
  MyInput,
} from '../components';
import { useTheme } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

// 


const { width, height } = Dimensions.get("window");
const Stack = createStackNavigator();

function BillModal({ navigation }) {
  const { colors, font } = useTheme();
  const [loading, setLoading] = useState(false);

  // Password Inputs onchange event
  const handlePasswords = (value) => {
  }

  // Submit Funtion of password change
  const handleSubmitPasswords = (value, index) => {
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
              <Image
                source={require('../assets/images/twilio.png')}
                style={{
                  height: height * 0.08,
                  width: width * .5,
                }}
              />
            </View>

            {/* Headings */}
            <View style={styles.headingsContainer}>
              <Text
                style={[
                  styles.textStyle,
                  { fontFamily: font },
                ]}>
                Billing Process
              </Text>
            </View>
            {/* Inputs */}
            <View style={styles.inputsContainer}>
              <MyInput
                colors={colors}
                // value="12345"
                onChangeText={(e) => handlePasswords(e)}
                placeholder={'Amount...'}
                // onBlur={() => setFieldTouched('password')}
                fontF={font}
                inputText="text"
                leftIcon={
                  <Icon
                    name="card"
                    size={height * 0.03}
                    color="#fff"
                  />
                }
              />
              {/* {data.view ? (
                <MyErrorMsg errorMsg={data.error} fontF={font} />
              ) : (
                <View />
              )} */}
            </View>
            
            {/* Confirm button */}
            <View style={styles.bottomContainer}>
              <GradientButton
                loading={loading}
                title="Pay Now"
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
    </ScrollView >
  );
}

export default function BillStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Bill" component={BillModal} />
    </Stack.Navigator>
  );
}

