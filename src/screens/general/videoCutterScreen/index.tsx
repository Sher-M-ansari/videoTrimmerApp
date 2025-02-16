import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Pressable,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import { showEditor } from 'react-native-video-trim';
import { RF } from '../../../theme/responsive';
import { COLORS } from '../../../theme/colors';
import Video from 'react-native-video';
import { GoBack } from '../../../utils/nav.service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';

const VideoCutterScreen = ({ route }: any) => {
  const { videoUri } = route?.params;
  const videoRef = useRef<Video>(null);
  const urlAvailable = useRef(false);
  const [localUrl, setLocalUrl] = useState<string | null>(null);
  const [isPlay, setIsPlay] = useState(true);

  const handleEditorEvents = useCallback(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules?.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event?.name) {
        case 'onFinishTrimming':
          urlAvailable.current = true;
          setIsPlay(true);
          setLocalUrl(event.outputPath);
          break;
        case 'onCancel':
          if (!urlAvailable.current) GoBack();
          break;
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!videoUri) {
      GoBack();
      return;
    }

    showEditor(videoUri, {});
    const cleanup = handleEditorEvents();
    return () => {
      cleanup();
      videoRef.current?.pause();
    };
  }, [videoUri, handleEditorEvents]);

  const saveVideoToDownloads = useCallback(async (outputPath: string) => {
    try {
      const hasPermission = await requestExternalStoragePermission();
      if (!hasPermission) return;

      const downloadsPath = RNFS.DownloadDirectoryPath ||
        `${RNFS.ExternalStorageDirectoryPath}/Download`;

      const originalFilename = outputPath.split('/').pop();
      if (!originalFilename) throw new Error('Invalid filename');

      const destPath = `${downloadsPath}/${originalFilename}`;
      const fileExists = await RNFS.exists(destPath);
      const finalPath = fileExists
        ? `${downloadsPath}/${Date.now()}_${originalFilename}`
        : destPath;

      await RNFS.copyFile(outputPath, finalPath);

      if (__DEV__) {
        console.log('Video saved to:', finalPath);
      }
      ToastAndroid.show('Video saved to Downloads!', ToastAndroid.LONG);
    } catch (err) {
      if (__DEV__) {
        console.error('Error saving video:', err);
      }
      ToastAndroid.show('Error saving video!', ToastAndroid.LONG);
    }
  }, []);

  const requestExternalStoragePermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage to save videos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      if (__DEV__) console.warn(err);
      return false;
    }
  }, []);

  const handleDownload = useCallback(() => {
    if (localUrl) {
      saveVideoToDownloads(localUrl);
    }
  }, [localUrl, saveVideoToDownloads]);

  return (
    <Pressable style={styles.mainView}>
      {localUrl && (
        <>
          <Video
            source={{ uri: localUrl }}
            controls
            paused={isPlay}
            ref={videoRef}
            resizeMode="contain"
            onEnd={() => setIsPlay(true)}
            style={StyleSheet.absoluteFill}
          />
          <Pressable
            onPress={handleDownload}
            style={styles.downloadButton}
          >
            <MaterialIcons
              name="download-for-offline"
              size={RF(50)}
              color={COLORS.DARK_YELLOW}
            />
          </Pressable>
        </>
      )}
    </Pressable>
  );
};

export default VideoCutterScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: COLORS.BLACK
  },
  downloadButton: {
    right: 15,
    top: RF(50),
    position: 'absolute',
    alignItems: "center",
    justifyContent: "center",
  },
});