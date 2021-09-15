/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './src/screens/Splash';
// import App from './App';
import {configureAmplify} from './services';

configureAmplify();

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
