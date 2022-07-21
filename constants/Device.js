
import { Dimensions, Platform } from 'react-native';
import Constants from 'expo-constants';

export default {

    windowWidth: Dimensions.get('window').width,
    windowHeight: Dimensions.get('window').height,
    screenWidth: Dimensions.get('screen').width,
    screenHeight: Dimensions.get('screen').height,
    platform: Platform.OS,
    version: Platform.Version,
    gameTitle: 'LUDO',
    deviceId: Constants.installationId,
    isTab: (Dimensions.get('screen').width /  Dimensions.get('screen').height) > 0.6,
}