import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './billingModalStyle';
import {Button, GradientButton, MyInput} from '../components';
import {useTheme} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {Card, Avatar} from 'react-native-paper';

const {width, height} = Dimensions.get('window');
const Stack = createStackNavigator();

function BillModal({navigation}) {
  const {colors, font} = useTheme();
  const [loading, setLoading] = useState(false);

  // Password Inputs onchange event
  const handlePasswords = value => {};

  // Submit Funtion of password change
  const handleSubmitPasswords = (value, index) => {};

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Button
            iconName={'chevron-back'}
            iconColor={'white'}
            iconSize={width * 0.045}
            style={styles.moreButton}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={[
              styles.textStyle,
              {
                fontFamily: font,
                top: height * 0.025,
                marginLeft: width * 0.05,
              },
            ]}>
            Billing Information
          </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={[styles.subtitle, {marginLeft: width * 0.1}]}>
            YOUR BILLS
          </Text>
          <TouchableOpacity
            style={{justifyContent: 'center', alignSelf: 'center'}}>
            <Card style={styles.cardStyle}>
              <Card.Title
                title="Twilio"
                left={props => (
                  <Avatar.Image
                    {...props}
                    size={height * 0.05}
                    style={{backgroundColor: 'transparent'}}
                    source={require('../assets/images/twilio.png')}
                  />
                )}
                right={props => (
                  <Avatar.Icon
                    {...props}
                    icon="chevron-right"
                    color="#fff"
                    size={height * 0.05}
                    style={{backgroundColor: 'transparent'}}
                  />
                )}
                titleStyle={{color: '#fff'}}
              />
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            style={{justifyContent: 'center', alignSelf: 'center'}}>
            <Card style={styles.cardStyle}>
              <Card.Title
                title="Amazon Web Services"
                left={props => (
                  <Image
                    {...props}
                    style={{width: width * 0.084, height: height * 0.035}}
                    source={require('../assets/images/aws-logo.png')}
                  />
                )}
                right={props => (
                  <Avatar.Icon
                    {...props}
                    icon="chevron-right"
                    color="#fff"
                    size={height * 0.05}
                    style={{backgroundColor: 'transparent'}}
                  />
                )}
                titleStyle={{color: '#fff'}}
              />
            </Card>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

export default function BillStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Bill" component={BillModal} />
    </Stack.Navigator>
  );
}
