import { StyleSheet } from 'react-native';
import { COLORS } from './colors';
import { RF } from './responsive';
import { SIZING } from './sizing';
import { SPACING } from './spacing';
import { FONTS } from './fonts';

export const GST = StyleSheet.create({
  ...SPACING,
  ...SIZING,

  WEIGHT900: {
    // fontWeight: '900',
    fontFamily: FONTS.EXTRA_BOLD

  },
  WEIGHT800: {
    // fontWeight: '800'
    fontFamily: FONTS.EXTRA_BOLD
  },
  WEIGHT700: {
    fontFamily: FONTS.BOLD
    // fontWeight: '700'
  },
  WEIGHT600: {
    // fontWeight: '600'
    fontFamily: FONTS.SEMI_BOLD
  },
  WEIGHT500: {
    // fontWeight: '500'
    fontFamily: FONTS.MEDIUM
  },
  WEIGHT400: {
    fontFamily: FONTS.REGULAR
    // fontWeight: '400'
  },
  WEIGHTBOLD: {
    // fontWeight:'bold'
    fontFamily: FONTS.BOLD
  },






});
