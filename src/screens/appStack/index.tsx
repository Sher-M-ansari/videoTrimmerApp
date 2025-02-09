import React from 'react';
import {StatusBar} from 'react-native';
import {ROUTES} from '../../utils/routes';
import MenuScreen from '../general/menuScreen';
import {createStackNavigator} from '@react-navigation/stack';
import VideoCutterScreen from '../general/videoCutterScreen';
import RecordVideoScreen from '../../screens/general/recordVideoScreen';
const Stack = createStackNavigator();
const AppStack = () => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={ROUTES.MENUSCREEN} component={MenuScreen} />
        <Stack.Screen
          name={ROUTES.VIDEOCUTTERSCREEN}
          component={VideoCutterScreen}
        />
        <Stack.Screen
          name={ROUTES.RECORDVIDEOSCREEN}
          component={RecordVideoScreen}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStack;
