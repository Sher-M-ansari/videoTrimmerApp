import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import { Alert, LogBox, PermissionsAndroid, Platform } from 'react-native';
import { COLORS } from './src/theme/colors';
import Routes from './src/screens';
import { navigationRef } from './src/utils/nav.service';
import { Camera } from 'react-native-vision-camera';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
const App = () => {
  const checkExistingPermissions = async () => {
    try {
      let cameraStatus;
      let micStatus;

      if (Platform.OS === 'android') {
        cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
        micStatus = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
      } else {
        cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
        micStatus = await check(PERMISSIONS.IOS.MICROPHONE);
      }

      return {
        camera: cameraStatus === RESULTS.GRANTED,
        mic: micStatus === RESULTS.GRANTED,
        allGranted: cameraStatus === RESULTS.GRANTED && micStatus === RESULTS.GRANTED
      };
    } catch (error) {
      console.error('Permission check error:', error);
      return { camera: false, mic: false, allGranted: false };
    }
  };

  useEffect(() => {
    checkExistingPermissions();
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs();
  }, []);
  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{ colors: { background: COLORS.BLACK } }}>
      <Routes />
    </NavigationContainer>
  );
};

export default App;

