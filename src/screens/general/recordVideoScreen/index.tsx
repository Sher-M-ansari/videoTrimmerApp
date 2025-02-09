import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { useNavigation } from '@react-navigation/native';

const RecordVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<typeof Camera>(null);
  const navigation = useNavigation();

  const handleRecordButtonPress = async () => {
    if (isRecording) {
      const videoUrl = await cameraRef.current?.stopRecording();
      Alert.alert('Video Recorded', `Your video URL is: ${videoUrl}`);
      navigation.navigate('VideoCutterScreen' as never, { videoUrl } as never);
    } else {
      try {
        const video = await cameraRef.current?.recordAsync();
        console.log(video);
      } catch (error) {
        console.error("here is error",error);
      }
    }
    setIsRecording(!isRecording);
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        cameraType="back" as any
        captureMode="video"
        flashMode="auto"
        focusMode="on"
        zoomMode="on"
      />
      <TouchableOpacity style={styles.button} onPress={handleRecordButtonPress}>
        <Text style={styles.buttonText}>{isRecording ? "Stop Recording" : "Start Recording"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    width: '90%',
    padding: 15,
    marginBottom: 30,
    borderRadius: 10,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecordVideoScreen;