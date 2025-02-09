import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import {COLORS} from './src/theme/colors';
import Routes from './src/screens';
import {navigationRef} from './src/utils/nav.service';
const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{colors: {background: COLORS.BLACK}}}>
      <Routes/>
    </NavigationContainer>
  );
};

export default App;

