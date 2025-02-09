import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  NativeEventEmitter,
  NativeModules,
  Alert,
  Pressable,
  View,
  Text,
} from 'react-native';
import { showEditor } from 'react-native-video-trim';
import { RF } from '../../../theme/responsive';
import { COLORS } from '../../../theme/colors';
import Video from 'react-native-video';
import { GoBack } from '../../../utils/nav.service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
const VideoCutterScreen = ({ route }: any) => {
  const { videoUri } = route?.params;
  let urlAvailable: any = null;
  const videoRef = useRef(null);
  const [localUrl, setLocalUrl] = useState<any>(null);
  const [isPlay, setIsPlay] = useState<any>(true);
  const [isEnded, setIsEnded] = useState(false);
  useEffect(() => {
    if (videoUri) {
      showEditor(videoUri, {});
    } else {
      GoBack();
    }
    const eventEmitter = new NativeEventEmitter(NativeModules?.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', event => {
      switch (event?.name) {
        case 'onFinishTrimming': {
          urlAvailable = true;
          setIsPlay(true);
          setLocalUrl(event);

          break;
        }
        case 'onLoad': {
          // on media loaded successfully
          // console.log('onLoadListener', event);
          break;
        }
        case 'onShow': {
          // console.log('onShowListener', event);
          break;
        }
        case 'onHide': {
          // console.log('onHide', event);
          break;
        }
        case 'onStartTrimming': {
          // console.log('onStartTrimming', event);
          break;
        }
        case 'onFinishTrimming': {
          // console.log('onFinishTrimming', event);
          break;
        }
        case 'onCancelTrimming': {
          // console.log('onCancelTrimming', event);
          break;
        }
        case 'onCancel': {
          if (urlAvailable === null) {
            GoBack();
          }
          // console.log('onCancel', event,urlAvailable);
          break;
        }
        case 'onError': {
          // console.log('onError', event);
          break;
        }
        case 'onLog': {
          // console.log('onLog', event);
          break;
        }
        case 'onStatistics': {
          // console.log('onStatistics', event);
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const trimVideo = (videoUri: any) => {
    showEditor(videoUri, {});
  };
  const onButtonPress = () => {
    if (localUrl?.duration > 2137) {
      trimVideo(localUrl?.outputPath);
    } else {
      Alert.alert(
        'Video is too short',
        'Please select a video that is at least 5 seconds long to trim it.',
      );
    }
  };
  const playPause = () => {
    if (isEnded) {
      videoRef?.current?.seek(0);
      setIsPlay(!isPlay);
      setIsEnded(false);
    } else {
      setIsPlay(!isPlay);
    }
  };
  console.log(">>localUrl && localUrl?.outputPath", localUrl && localUrl?.outputPath)
  const saveVideoToVideoCutterFolder = async (outputPath) => {
    try {
      // Define the external folder path (e.g., Downloads/VideoCutter)
      const folderPath = `${RNFS.ExternalStorageDirectoryPath}/VideoCutter`;

      // Check if folder exists, if not create it
      const folderExists = await RNFS.exists(folderPath);
      if (!folderExists) {
        await RNFS.mkdir(folderPath);
        console.log('Folder created:', folderPath);
      }

      // Define the destination path for the video
      const fileName = outputPath.split('/').pop(); // Extract file name
      const destinationPath = `${folderPath}/${fileName}`;

      // Copy the video to the new folder
      await RNFS.copyFile(outputPath, destinationPath);
      console.log('Video saved at:', destinationPath);

      return destinationPath;
    } catch (error) {
      console.error('Error saving video:', error.message);
    }
  };
  return (
    <Pressable
      disabled={localUrl === null}
      // onPress={() => playPause()}
      style={[styles.mainView]}>
      {localUrl && localUrl?.outputPath?.length > 0 && (
        <Video
          source={{ uri: localUrl?.outputPath }}
          controls={true}
          playWhenInactive={false}
          paused={isPlay}
          ref={videoRef}
          resizeMode="contain"
          onEnd={() => {
            setIsEnded(true);
            setIsPlay(true);
          }}
          style={{ flex: 1, backgroundColor: 'brown', height: '100%', width: '100%', position: "absolute" }}
          onError={(e: any) => console.log('Error VIDEO', e)}
        // style={StyleSheet.absoluteFill}
        />
      )}
      {localUrl && localUrl?.outputPath?.length > 0 && <Pressable onPress={() => {
        console.log(">>>HERE IS DATA", localUrl, localUrl?.outputPath)
        saveVideoToVideoCutterFolder(localUrl?.outputPath)
      }} style={{ right: 15, top: 30, position: 'absolute', alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <MaterialIcons name="download-for-offline" size={RF(50)} color={COLORS.DARK_YELLOW} />
      </Pressable>}
    </Pressable>
  );
};
export default VideoCutterScreen;

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'pink'
  },
  subHeading: {
    color: COLORS.DARK_YELLOW,
    fontSize: RF(16),
    marginTop: RF(1),
    textAlign: 'center',
  },
  previewTxt: { fontSize: RF(20), color: COLORS.DARK_YELLOW },
  btnView1: {
    marginHorizontal: RF(20),
    backgroundColor: COLORS.DARK_YELLOW,
    height: RF(60),
    width: RF(60),
    borderRadius: RF(100),
    padding: RF(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    position: 'absolute',
    backgroundColor: COLORS.DARK_YELLOW,
    height: RF(60),
    width: RF(60),
    borderRadius: RF(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnsView: {
    height: RF(100),
    width: '100%',
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  topView: {
    flexDirection: 'row',
    position: 'absolute',
    top: 70,
    width: '62%',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginHorizontal: RF(25),
  },
  crossView: {
    backgroundColor: COLORS.DARK_YELLOW,
    borderRadius: RF(20),
    padding: RF(10),
  },
  previewTxtView: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: RF(16),
  },
});
