import React, { 
        useEffect, 
        useState
    } from 'react';
import { 
        View, 
        StyleSheet,
        ShadowPropTypesIOS
    } from 'react-native';
import Svg, { 
        Image,
        Text
    } from 'react-native-svg';
import { useSelector, useDispatch } from 'react-redux';
import Device from '../constants/Device';
import * as Facebook from 'expo-facebook';
import HttpRequest from '../HttpRequests';
import * as authActions from '../store/actions/auth';
// import { NS_PLAY_ONLINE, GAMESERVER} from '../constants/NameSpaces';
// import { XMPP } from '../screens/StartupScreen'; 
// import * as gameActions from '../store/actions/gameactions';

import * as AuthScreenDImensions from '../constants/AuthScreenDimensions';
import { ForeignObject } from 'react-native-svg';
import AuthModal from '../components/UI/Modal/AuthModal';
import BasicModal from '../components/UI/Modal/BasicModal';
const elementsMap = AuthScreenDImensions.elementsMap;

const logoImage = require('../assets/images/logo.png');
const facebookImage = require('../assets/images/facebook.png');
const guestImage = require('../assets/images/guest.png');



const AuthScreen = (props) => {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const isAuth = useSelector(state => state.auth.authToken);
    const forceLogout = useSelector(state => state.auth.forceLogout);
    const [messageModal, setMessageModal] = useState(forceLogout);
    

    const facebookLoginHandler = async () => {
        // setError(null);
        // setIsLoading(true);
        try{
            await Facebook.initializeAsync('2642071886114112');
            const result = await Facebook.logInWithReadPermissionsAsync({
                permissions: ['public_profile']
            });
            const {
                type,
                token
              } = result 
            let URL = "https://graph.facebook.com/me?fields=id,name,picture&access_token=" + token;
            let resData = await HttpRequest.absGet(URL);
            if (!resData.error){
                

                await dispatch(authActions.facebookLogin(
                    "fb_" + resData.id, 
                    token, 
                    resData.picture.data.url, 
                    resData.name
                ));
                
                props.navigation.navigate('Startup')
            }else{
                
                
                // setError(err.message);
                // setIsLoading(false);
                
            }
        }catch(err){
            // setError(err.message);
            // setIsLoading(false);
            
            
        };
        
    }

    useEffect(() => {
        if (isAuth){
            props.navigation.navigate('Startup');
        }
    }, [dispatch] );

    const avatarModal = 
        <ForeignObject>
            <AuthModal
                
                visible={showModal}
                avatarText={"Select an avatar"}
                inputText={"Nickname"}
                cancelText="Back"
                cancelFunc={() => setShowModal(false)}
                okayText="Login"
                okayFunc={() => setShowModal(false)}
                navigation={props.navigation}
            />
        </ForeignObject>

    
    const messageModalEl = 
        // forceLogout ?   
        <ForeignObject>
            <BasicModal
                okayFunc={() => {
                    setMessageModal(false);
                    //dispatch({type: authActions.CLEAR_FORCE_LOGOUT});
                }}
                visible={messageModal}
                text={"You have logged in from some other location."}
                okayText="OK"
            />
        </ForeignObject> 

    return (
        <View style={styles.container}>
            <Svg width={Device.screenWidth} height={Device.screenHeight} viewBox={elementsMap.viewBox}>
                <Image
                    x={elementsMap.logo.x}
                    y={elementsMap.logo.y}
                    href={logoImage}
                    width={elementsMap.logo.width}
                    height={elementsMap.logo.height}
                />

                <Image
                    x={elementsMap.facebook.x}
                    y={elementsMap.facebook.y}
                    href={facebookImage}
                    width={elementsMap.facebook.width}
                    height={elementsMap.facebook.height}
                    onPressOut = {() => facebookLoginHandler()}
                />
                <Image
                    x={elementsMap.guest.x}
                    y={elementsMap.guest.y}
                    href={guestImage}
                    width={elementsMap.guest.width}
                    height={elementsMap.guest.height}
                    onPressOut = {() => {
                        setShowModal(true)
                    }}
                />
                <Text 
                    fill='white'
                    stroke='white'
                    fontSize={elementsMap.guestText.fontsize}
                    fontWeight='bold'
                    x={elementsMap.guestText.x}
                    y={elementsMap.guestText.y}
                    textAnchor='middle'>
                        Guest Login
                </Text>

                {showModal ? avatarModal : null}
                {messageModalEl}

                {/* <ForeignObject 
                    x={elementsMap.buttonsContainer.x} 
                    y={elementsMap.buttonsContainer.y} 
                    width={elementsMap.buttonsContainer.width} 
                    height={elementsMap.buttonsContainer.height}>
                    <View style={styles.MainContainer}>
                        <TouchableOpacity style={styles.FacebookStyle} activeOpacity={0.5}>
                            <ImageBackground
                                source={facebookImage}
                                style={styles.ImageIconStyle}
                                resizeMode='contain'
                            />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyle}> Login Using Facebook </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.GooglePlusStyle} activeOpacity={0.5}>
                            <ImageBackground
                                
                                source={{
                                uri:
                                    'https://raw.githubusercontent.com/AboutReact/sampleresource/master/google-plus.png',
                                }}
                                style={styles.ImageIconStyle}
                            />
                            <View style={styles.SeparatorLine} />
                            <Text style={styles.TextStyle}> Login Using Google Plus </Text>
                        </TouchableOpacity>
                    </View>
                        
                </ForeignObject> */}
            </Svg>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#39b4ce',
    },
    screen: {
        flex:1,
        width: Device.screenWidth,
        height:Device.screenHeight,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#39b4ce'
    },
    // MainContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     // margin: 10,
    //   },
    //   GooglePlusStyle: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#dc4e41',
    //     borderWidth: 0.5,
    //     borderColor: '#fff',
    //     height: 40,
    //     width: 220,
    //     borderRadius: 5,
    //     margin: 5,
    //   },
    //   FacebookStyle: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     backgroundColor: '#485a96',
    //     borderWidth: 0.5,
    //     borderColor: '#fff',
    //     height: 40,
    //     width: 220,
    //     borderRadius: 5,
    //     margin: 5,
    //   },
    //   ImageIconStyle: {
    //     padding: 10,
    //     margin: 5,
    //     height: 25,
    //     width: 25,
    //     resizeMode: 'stretch',
    //   },
    //   TextStyle: {
    //     color: '#fff',
    //     marginBottom: 4,
    //     marginRight: 20,
    //   },
    //   SeparatorLine: {
    //     backgroundColor: '#fff',
    //     width: 1,
    //     height: 40,
    //   },
});

export default AuthScreen;