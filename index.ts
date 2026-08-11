/**
 * @format
 */
import {AppRegistry, LogBox} from 'react-native';
import App from './src/screens/Splash';
// import App from './App';
import {configureAmplify} from './services';

configureAmplify();
LogBox.ignoreAllLogs();

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
