import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { Camera, useCameraDevice, useCameraFormat } from 'react-native-vision-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const RecordVideoScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  const format = useCameraFormat(device, [
    { fps: 30 },
    { videoResolution: 'max' },
    { photoResolution: 'max' }
  ]);
  useEffect(() => {
    const requestPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const micPermission = await Camera.requestMicrophonePermission();

      if (cameraPermission !== 'granted' || micPermission !== 'granted') {
        Alert.alert(
          'Permission required',
          'Camera and microphone permissions are needed',
          [
            { text: 'Open Settings', onPress: () => Camera.openSettings() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    };

    requestPermissions();

    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (isRecording) {
      const startTime = Date.now() - recordingTime * 1000;
      intervalRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRecordingTime(0);
    };
  }, [isRecording]);
  useEffect(() => {
    return () => {
      if (isRecording) {
        camera.current?.stopRecording();
      }
    };
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    try {
      if (!device || !camera.current) return;

      setIsRecording(true);
      await camera.current.startRecording({
        onRecordingFinished: (video) => {
          if (!isMounted.current) return;
          navigation.navigate("VideoCutterScreen", { videoUri: video.path });
        },
        onRecordingError: (error) => {
          if (!isMounted.current) return;
          console.error('Recording error:', error);
          setIsRecording(false);
        },
        flash: 'off',
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  }, [device, navigation]);

  const stopRecording = useCallback(async () => {
    try {
      await camera.current?.stopRecording();
    } catch (error) {
      console.error('Failed to stop recording:', error);
    } finally {
      if (isMounted.current) {
        setIsRecording(false);
      }
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera device not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          video={true}
          audio={true}
          format={format}
          preset="high-quality"
        />
      )}

      {isRecording && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordingButton]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!device}
        >
          {isRecording && <View style={styles.innerRedCircle} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  recordingButton: {
    borderColor: 'red',
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  innerRedCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'red',
  },
  timerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});

export default RecordVideoScreen;