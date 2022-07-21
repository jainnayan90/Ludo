import { Audio } from 'expo-av';
import React, { 
                useEffect, 
                useState
            } from 'react';
import { 
    View, 
    StyleSheet,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import Svg, { 
        Image, 
        G, 
        Text
    } from 'react-native-svg';
import { useSelector, useDispatch } from 'react-redux';
import Device from '../constants/Device';
import { NS_PLAY_ONLINE, NS_CHANGE_AVATAR, GAMESERVER} from '../constants/NameSpaces';
import { XMPP } from '../screens/StartupScreen'; 
import Colors from '../constants/Colors';
import * as gameActions from '../store/actions/gameactions';
//import pushNotification from '../pushNotification';
import * as MainScreenDImensions from '../constants/MainScreenDimensions';
import MyImage from '../components/UI/MyImage';
import * as authActions from '../store/actions/auth';
// import RotateExample from '../components/dice/diceIm';
// import { StackActions, NavigationActions } from 'react-navigation';

const elementsMap = MainScreenDImensions.elementsMap;

const soundOn = require('../assets/images/soundon.png');
const soundOff = require('../assets/images/soundoff.png');
const coinsBox = require('../assets/images/coins.png');
//const settingsIcon = require('../assets/images/settings-icon.png');
const logoutIcon = require('../assets/images/logout.png');
const boyWin = require('../assets/images/boy-head-win.png');
const girlWin = require('../assets/images/girl-head-win.png');
const logoImage = require('../assets/images/logo.png');
const twoPlayers = require('../assets/images/2players.png');
const threePlayers = require('../assets/images/3players.png');
// let avatarImage = null;
let backgroundMusic = null;




const MainScreen = (props) => {

    const xml = require('@xmpp/xml');
    const playerInfo = useSelector(state => state.startup.playerInfo);
    const dispatch = useDispatch();

    const sentPlayRequest = useSelector(state => state.mainscreen.sentPlayRequest);
    const playRequestResponse = useSelector(state => state.mainscreen.playRequestResponse);

    const gameInfoReceived = useSelector(state => state.gameInfo.gameInfoReceived);
    
    const avatar = useSelector(state => state.auth.avatar);
    const facebookImage = useSelector(state => state.auth.facebookImage);
    const userType = useSelector(state => state.auth.userType);
    const [soundStatus, setSoundStatus] = useState(false);

    
    const [avatarImage, setAvatarImage] = useState(() => {
        if (userType == "facebook"){
            return {uri: facebookImage};
        }else{
            if (avatar == "B"){
                return boyWin;
            }else{
                return girlWin;
            }
        }
    });
    
    // useEffect(() => {
    //     if (userType == "facebook"){
    //         console.log('1111');
    //         setAvatarImage({uri: facebookImage});
    //     }else{
    //         if (avatar == "B"){
    //             console.log('22222');
    //             setAvatarImage(boyWin);
    //         }else{
    //             console.log('333');
    //             setAvatarImage(girlWin);
    //         }
    //     }
    //     console.log('##########^^^^^^^^^^   ', avatar == "B", userType, avatar, Device.platform, avatarImage);
    // }, [avatar]);
    

    useEffect(() => {
        debugger;
        const loadBackgroundMusic = async () =>{
            try{
                //Audio.setAudioModeAsync()
                backgroundMusic = new Audio.Sound();
                await backgroundMusic.loadAsync(
                    require("../assets/sounds/background_sound.wav")
                );
                await backgroundMusic.setIsLoopingAsync(true);
                
                var soundData = await AsyncStorage.getItem('soundData');
                if(!soundData){
                    await backgroundMusic.playAsync();
                    setSoundStatus(true);
                    true;
                }else{
                    const transformedData = JSON.parse(soundData);
                    if (transformedData.soundOn){
                        await backgroundMusic.playAsync();
                        setSoundStatus(true);
                        true;
                    }else{
                        await backgroundMusic.setVolumeAsync(0);
                        setSoundStatus(false);
                    }
                }
            }catch(err){
                //console.log("playyyyyy sound error........", err);
            }
        }
        loadBackgroundMusic();
    }, [dispatch]);

    
    useEffect(() => {
        dispatch({type: gameActions.RESET_GAME_SCREEN});
        //console.log('calling push notifications........')
        //pushNotification();
    }, [dispatch]);

    useEffect(() => {
        //console.log('##############     ', sentPlayRequest, playRequestResponse, gameInfoReceived)
        const goToMainScreen = async () => { 
            if(sentPlayRequest && playRequestResponse && gameInfoReceived){
                //dispatch({type: 'RESET_MAIN_SCREEN'});
                await backgroundMusic.stopAsync();
                props.navigation.navigate('GameScreen');
                
            }
        };
        goToMainScreen();
    }, [sentPlayRequest, playRequestResponse, gameInfoReceived]);

    const get_chips_value = (coins) => {
        var coinsVal = null;
        if (coins/10000000 >= 1){
            coinsVal = (coins/10000000).toString().substr(0,3) +' Cr';
        }else if (coins/100000 >= 1){
            coinsVal = (coins/100000).toString().substr(0,3) +' L';
        }else if (coins/10000 >= 1){
            coinsVal = (coins/10000).toString().substr(0,3) +' K';
        }else{
            coinsVal = coins.toString();
        }
        return coinsVal
    };


    const coinsEl = 
        <G>
            <Image
                x={elementsMap.coinsBox.x}
                y={elementsMap.coinsBox.y}
                href={coinsBox}
                width={elementsMap.coinsBox.width}
                height={elementsMap.coinsBox.height}
            />

            <Text 
                fill='white'
                stroke='white'
                fontSize={elementsMap.coinsValue.fontsize}
                fontWeight='bold'
                x={elementsMap.coinsValue.x}
                y={elementsMap.coinsValue.y}
                textAnchor='middle'>
                    {get_chips_value(playerInfo.chips)}
            </Text>
        </G>
    const profileImageEl = 
        <MyImage
            x={(userType == "facebook" || avatar == "B") ?  elementsMap.profileImageB.x : elementsMap.profileImageG.x}
            y={(userType == "facebook" || avatar == "B") ?  elementsMap.profileImageB.y : elementsMap.profileImageG.y}
            width={(userType == "facebook" || avatar == "B") ?  elementsMap.profileImageB.width : elementsMap.profileImageG.width}
            height={(userType == "facebook" || avatar == "B") ?  elementsMap.profileImageB.height : elementsMap.profileImageG.height}
            borderRadius={(userType == "facebook" || avatar == "B") ?  elementsMap.profileImageB.borderRadius : elementsMap.profileImageG.borderRadius}
            image={avatarImage}
        />
        //console.log('!!!!!!!!!!! ', NS_CHANGE_AVATAR);
    return (sentPlayRequest) ? ( 
            <View style={styles.screen }>
                <ActivityIndicator size='large' color={Colors.primary} />
                <Text style={{fontSize:30}}>Connecting...</Text>
            </View>
        ) :
        (
            <View style={styles.container}>
                
                <Svg width={Device.screenWidth} height={Device.screenHeight} viewBox={elementsMap.viewBox}>
                    {/* {DiceIm} */}
                    {profileImageEl}

                    {coinsEl}
                    
                    <Text 
                        fill='white'
                        stroke='white'
                        fontSize={elementsMap.nameLabel.fontsize}
                        x={elementsMap.nameLabel.x}
                        y={elementsMap.nameLabel.y}
                        textAnchor='start'
                        strokeWidth={elementsMap.nameLabel.strokeWidth}
                    >
                            {playerInfo.name}   
                    </Text>

                    <Text 
                        fill='white'
                        stroke='white'
                        fontSize={elementsMap.levelLabel.fontsize}
                        x={elementsMap.levelLabel.x}
                        y={elementsMap.levelLabel.y}
                        textAnchor='start'
                        strokeWidth={elementsMap.levelLabel.strokeWidth}
                    >
                            {`Level: ${playerInfo.level}`}   
                    </Text> 

                    <Image
                        x={elementsMap.logout.x}
                        y={elementsMap.logout.y}
                        href={logoutIcon}
                        width={elementsMap.logout.width}
                        height={elementsMap.logout.height}
                        onPressOut={async () => {
                            await dispatch(authActions.logout());
                            XMPP.disconnect();
                            // props.navigation.dispatch(StackActions.reset({
                            //     index: 0,
                            //     actions: [NavigationActions.navigate({ routeName: 'Startup' })],
                            //   }))
                            
                            await backgroundMusic.setVolumeAsync(0);
                            props.navigation.navigate('Auth');
                        }}
                    />

                    <Image
                        x={elementsMap.logo.x}
                        y={elementsMap.logo.y}
                        href={logoImage}
                        width={elementsMap.logo.width}
                        height={elementsMap.logo.height}
                    />

                    <Image
                        x={elementsMap.soundImage.x}
                        y={elementsMap.soundImage.y}
                        href={soundStatus ? soundOn : soundOff}
                        width={elementsMap.soundImage.width}
                        height={elementsMap.soundImage.height}
                        onPressOut={async () => {
                            try{
                                if (soundStatus == true){
                                    await backgroundMusic.setVolumeAsync(0);
                                    AsyncStorage.setItem(
                                        'soundData', 
                                        JSON.stringify({
                                            soundOn: false,
                                        })
                                    )
                                    setSoundStatus(false);
                                }else{
                                    await backgroundMusic.setVolumeAsync(1);
                                    AsyncStorage.setItem(
                                        'soundData', 
                                        JSON.stringify({
                                            soundOn: true,
                                        })
                                    )
                                    await backgroundMusic.playAsync();
                                    setSoundStatus(true);
                                }
                            }catch(err){

                            }
                        }}
                    />

                    <Image
                        x={elementsMap.twoPlayers.x}
                        y={elementsMap.twoPlayers.y}
                        href={twoPlayers}
                        width={elementsMap.twoPlayers.width}
                        height={elementsMap.twoPlayers.height}
                        onPressOut={() => {
                            const id = XMPP.get_random_id(NS_PLAY_ONLINE);
                            const packet = xml(
                                "iq",
                                {id: id, to: GAMESERVER, type: "get"},
                                xml("query", {xmlns: NS_PLAY_ONLINE},
                                xml("mode", {}, "two_player")
                                )
                            )
                            //console.log(packet);
                            XMPP.sendStanza(packet);
                            dispatch({type: NS_PLAY_ONLINE, iq_type: "get"});
                            //props.navigation.navigate('MainScreen');
                        }}
                    />

                    <Image
                        x={elementsMap.threePlayers.x}
                        y={elementsMap.threePlayers.y}
                        href={threePlayers}
                        width={elementsMap.threePlayers.width}
                        height={elementsMap.threePlayers.height}
                        onPressOut={() => {
                            const id = XMPP.get_random_id(NS_PLAY_ONLINE);
                            const packet = xml(
                                "iq",
                                {id: id, to: GAMESERVER, type: "get"},
                                xml("query", {xmlns: NS_PLAY_ONLINE},
                                xml("mode", {}, "three_player")
                                )
                            )
                            //console.log(packet);
                            XMPP.sendStanza(packet);
                            dispatch({type: NS_PLAY_ONLINE, iq_type: "get"});
                            //props.navigation.navigate('MainScreen');
                            
                        }}
                    />

                    <Image
                        x={eval(`elementsMap.userAvatar${avatar}.x`)}
                        y={eval(`elementsMap.userAvatar${avatar}.y`)}
                        href={avatar == "B" ? boyWin : girlWin}
                        width={eval(`elementsMap.userAvatar${avatar}.width`)}
                        height={eval(`elementsMap.userAvatar${avatar}.height`)}
                        onPressOut={async () => {
                            try{
                                const id = XMPP.get_random_id(NS_CHANGE_AVATAR);
                                //console.log('!!!!!!!!!!! ', NS_CHANGE_AVATAR, id);
                                let packet = null;
                                
                                const userData = await AsyncStorage.getItem('authData');
                                const transformedData = JSON.parse(userData);
                                if (avatar == "B"){
                                    transformedData.avatar = "G";
                                    packet = xml(
                                        "iq",
                                        {id: id, to: GAMESERVER, type: "set"},
                                        xml("query", {xmlns: NS_CHANGE_AVATAR},
                                        xml("avatar", {}, "G"),
                                        )
                                    );
                                    //console.log("#####", packet);
                                    XMPP.sendStanza(packet); 
                                    if (userType == "guest"){
                                        
                                        setAvatarImage(girlWin);
                                    }
                                }else{
                                    transformedData.avatar = "B";
                                    packet = xml(
                                        "iq",
                                        {id: id, to: GAMESERVER, type: "set"},
                                        xml("query", {xmlns: NS_CHANGE_AVATAR},
                                        xml("avatar", {}, "B"),
                                        )
                                    );
                                    //console.log("#####", packet);
                                    XMPP.sendStanza(packet); 
                                    if (userType == "guest"){
                                        setAvatarImage(boyWin);
                                    }
                                }
                                await dispatch(authActions.updateUserData(transformedData));
                            }catch(err){
                                
                            }
                        }}
                    />

                        
                </Svg>
            </View>

        )
};


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
});

export default MainScreen;