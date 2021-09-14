import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Batt from 'react-native-vector-icons/FontAwesome';
import Back from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-media-controls';
import {LivePlayer} from 'react-native-live-stream';
import AWS from 'aws-sdk';
import {Storage} from 'aws-amplify';

import {WebView} from 'react-native-webview';

import styles from './style';

const {width, height} = Dimensions.get('window');

const level = {
  empty: 'battery-empty',
  batt1: 'battery-1',
  batt2: 'battery-2',
  batt3: 'battery-3',
  full: 'battery-full',
};

var options = {
  accessKeyId: 'AKIAV5QNMTVXF4IL7DXJ',
  secretAccessKey: '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',
  region: 'ap-south-1',
};
var kinesisVideo = new AWS.KinesisVideo(options);
var kinesisVideoArchivedContent = new AWS.KinesisVideoArchivedMedia(options);

var streamingURL = '';
const Stream = ({navigation}) => {
  const [fileUrl, setFileUrl] = useState([]);
  const [streamURL, setStreamURL] = useState(
    'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
  );
  const [test, setTest] = useState([]);
  // useEffect(() => {
  //   runVideo('Sarim');
  // }, []);

  const getFileOnly = () => {
    Storage.list('videos/')
      .then(data => {
        setFileUrl(data);
      })
      .catch(err => {
        console.log('error fetching video');
      });

    console.log('Show your URL', fileUrl);
    const map = fileUrl.map(key => key.key);
    console.log('Keys kia milli', map);
  };

  const handleVideo = url => {
    var res = url.split('?');
    // .m3u8

    fetch('GET', url)
      // .progress((received, total) => {
      //   console.log('progress', received / total);
      // })
      .then(resp => {
        // const path = resp.path();
        console.log('resp success:-', resp);
        // RNFetchBlob.fs.readStream(path, 'utf8').then((stream) => {
        //   let data = '';
        //   stream.open();
        //   stream.onData((chunk) => {
        //     data += chunk;
        //   });
        //   stream.onEnd(() => {
        //     console.log('readStream::-', data);
        //   });
        // });
      })
      .catch(err => {
        console.log('trackAppointmentStatus::-', err);
      });

    console.log('🚀 ~ file: index.js ~ line 45 ~ handleVideo ~ url', res[0]);

    setTest(url);
  };

  const runVideo = testing => {
    // Step 2: Get a data endpoint for the stream
    kinesisVideo.getDataEndpoint(
      {
        StreamName: 'RPi-DualCam',
        APIName: 'GET_HLS_STREAMING_SESSION_URL',
      },
      function (err, response) {
        if (err) {
          return console.error('Error while getting video', err);
        }
        console.log('Data endpoint: ' + JSON.stringify(response));
        kinesisVideoArchivedContent.endpoint = new AWS.Endpoint(
          response.DataEndpoint,
        );
        var playbackMode = 'LIVE'; // 'LIVE' or 'ON_DEMAND'
        var fragmentSelectorType = 'SERVER_TIMESTAMP'; // 'SERVER_TIMESTAMP' or 'PRODUCER_TIMESTAMP'
        const SESSION_EXPIRATION_SECONDS = 60 * 60;

        kinesisVideoArchivedContent.getHLSStreamingSessionURL(
          {
            StreamName: 'RPi-DualCam',
            //StreamARN: "arn:aws:kinesisvideo:us-east-1:635420739373:stream/mr-pinchers-dot-org/1561848963391",
            PlaybackMode: playbackMode,
            HLSFragmentSelector: {
              FragmentSelectorType: fragmentSelectorType,
              TimestampRange:
                playbackMode === 'LIVE'
                  ? undefined
                  : {
                      //            StartTimestamp: startTimestamp,
                      //            EndTimestamp: endTimestamp
                    },
            },
            Expires: parseInt(SESSION_EXPIRATION_SECONDS),
          },
          function (err, response) {
            if (err) {
              return console.error('Darn', err);
            }
            console.log('response.HLSStreamingSessionURL', response);
            // fetch('Web URL HERE', {
            //   method: 'GET',
            //   //Request Type
            // })
            //   .then(data => data.json())
            //   .then(sssssssssss => console.log('111111111111', sssssssssss))
            //   .catch(errrr => {
            //     console.log(
            //       '🚀 ~ file: index.js ~ line 90 ~ Stream ~ errrr',
            //       errrr,
            //     );
            //   });
            setTest(`${response.HLSStreamingSessionURL}`);
            // handleVideo(response.HLSStreamingSessionURL);
            setStreamURL('');
            console.log(
              'HLS Streaming Session URL: ' + response.HLSStreamingSessionURL,
            );
            console.log('JSON!!!!!!!!!!!!' + JSON.stringify(response));
          },
        );
      },
    );
  };

  const {colors, font} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headers}>
        <Back
          name="chevron-left"
          size={height * 0.05}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Batt name={level.batt2} size={height * 0.05} color={colors.text} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, {fontFamily: font, color: colors.text}]}>
          Left Cam
        </Text>
        <Back
          name="play-circle-o"
          size={height * 0.05}
          color={colors.text}
          onPress={getFileOnly}
        />
        {/* <View
          style={{width: 500, height: height * 0.4, backgroundColor: 'yellow'}}>
          <WebView
            showsVerticalScrollIndicator={false}
            style={{height: height * 0.4}}
            source={{uri: 'http://192.168.1.183:3000/'}}
          />
        </View> */}
      </View>
    </View>
  );
};

export default Stream;
