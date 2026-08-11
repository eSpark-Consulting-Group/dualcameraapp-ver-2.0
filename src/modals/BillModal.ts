import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import styles from './billingModalStyle';
import {Button} from '../components';
import {useTheme} from '@react-navigation/native';
import {Card, Avatar} from 'react-native-paper';

const {width, height} = Dimensions.get('window');
const Stack = createStackNavigator();

function BillModal({navigation}) {
  const {colors, font} = useTheme();
  const [loading, setLoading] = useState(false);

  const directToTwilio = () => {
    if (Linking.canOpenURL('https://www.twilio.com/pricing')) {
      Linking.openURL('https://www.twilio.com/pricing');
    } else {
      alert('Cannot open URL');
    }
  };

  const directToAws = () => {
    if (Linking.canOpenURL('https://aws.amazon.com/pricing/')) {
      Linking.openURL('https://aws.amazon.com/pricing/');
    } else {
      alert('Cannot open URL');
    }
  };

  const inlineStyles = StyleSheet.create({
    titleStyle: {
      fontFamily: font,
      top: height * 0.025,
      marginLeft: width * 0.05,
    },
    imgStyle: {width: height * 0.05, height: height * 0.032},
  });

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
          <Text style={[styles.textStyle, inlineStyles.titleStyle]}>
            Billing Information
          </Text>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={[styles.subtitle, {marginLeft: width * 0.1}]}>
            YOUR BILLS
          </Text>
          <TouchableOpacity
            onPress={directToTwilio}
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
            onPress={directToAws}
            style={{justifyContent: 'center', alignSelf: 'center'}}>
            <Card style={styles.cardStyle}>
              <Card.Title
                title="AWS Cloud"
                left={props => (
                  <Image
                    {...props}
                    style={inlineStyles.imgStyle}
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
