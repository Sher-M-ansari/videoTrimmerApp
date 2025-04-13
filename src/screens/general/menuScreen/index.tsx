import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RF } from '../../../theme/responsive';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../../theme/colors';
import FastImage from 'react-native-fast-image';
import { ROUTES } from '../../../utils/routes';

const MenuScreen = () => {
  const [videoUri, setVideoUri] = useState<any>(null);
  const navigation = useNavigation();

  const chooseVideoFromGallery = () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'high',
      saveToPhotos: true,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled video picker');
      } else if (response.errorCode) {
        console.log('Error: ', response.errorCode);
        Alert.alert('Error', 'There was an issue picking the video.');
      } else {
        setVideoUri(response?.assets[0]?.uri);
        navigation.navigate(ROUTES.VIDEOCUTTERSCREEN, {
          videoUri: response?.assets[0]?.uri,
        });
      }
    });
  };
  const recordNewVideo = () => {
    navigation.navigate(ROUTES.RECORDVIDEOSCREEN)
  }

  return (
    <LinearGradient
      colors={['#FFD700', '#191919']}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <FastImage
          source={require('../../../assets/app_Icon.webp')}
          style={styles.logoImage}
        />
        <Text style={styles.title}>
          <Text style={styles.proTextTitle}>DeepCut</Text>
        </Text>
        <Text style={styles.title}>
          <Text style={styles.videoText}>Video </Text>
          <Text style={styles.cutterText}>Cutter</Text>
          <Text style={styles.proText}> Pro</Text>
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={chooseVideoFromGallery}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.outlineButton]} onPress={recordNewVideo}>
          <Text style={[styles.buttonText, styles.outlineButtonText]}>
            Record New Video
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RF(50),
  },
  logo: {
    backgroundColor: '#FFD700',
    width: RF(120),
    height: RF(120),
    borderRadius: RF(60),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RF(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  icon: {
    fontSize: RF(40),
    color: '#191919',
  },
  title: {
    fontSize: RF(20),
    fontWeight: 'bold',
    marginTop: RF(10),
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  videoText: {
    color: '#FFD700',
  },
  cutterText: {
    color: COLORS.whiteFF,
  },
  proText: {
    color: '#FF8C00',
  },
  proTextTitle: {
    fontSize: RF(40),
    color: '#FF8C00',
  },
  buttonsContainer: {
    width: '100%',
    position: 'absolute',
    bottom: RF(30),
    paddingHorizontal: RF(20),
  },
  button: {
    backgroundColor: COLORS.whiteFF,
    padding: RF(15),
    borderRadius: RF(8),
    alignItems: 'center',
    marginBottom: RF(15),
  },
  buttonText: {
    color: COLORS.TEXT_COLOR,
    fontSize: RF(16),
    fontWeight: 'bold',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: RF(2),
    borderColor: COLORS.whiteFF,
  },
  outlineButtonText: {
    color: COLORS.whiteFF,
  },
  logoImage: { borderRadius: RF(100), width: RF(140), height: RF(140) },
});

export default MenuScreen;
