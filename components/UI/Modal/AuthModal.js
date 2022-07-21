import React, {useState}  from 'react';
import {
    StyleSheet, 
    View, 
    Text, 
    ImageBackground,
    TouchableOpacity,
    TextInput,
    Image
} from 'react-native';
// import { Item } from 'react-navigation-header-buttons';
import Device from '../../../constants/Device';
import Modal from "react-native-modal";
import {useDispatch} from 'react-redux';
import Constants from 'expo-constants';

// const isTab = Device.isTab;
import * as authActions from '../../../store/actions/auth';
const backgroundIMG = require('../../../assets/images/blue-vertical.png');
const greenButton = require('../../../assets/images/green-button.png');
const greyButton = require('../../../assets/images/grey-button.png');

const boyAvatar = require('../../../assets/images/boy-head-win.png');
const girlAvatar = require('../../../assets/images/girl-head-win.png');
const md5 = require('js-md5/src/md5');

const AuthModal = (props) => {
    const dispatch = useDispatch();
    const [avatar, setAvatar] = useState("B");
    const [nickName, setNickName] = useState("");


    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    
    const loginHandler = async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(authActions.login(md5(Constants.deviceId), Constants.deviceId, avatar, nickName));
            //await dispatch(authActions.login("nayan", "nayan", avatar, nickName));
            props.navigation.navigate('Startup');
        }catch(err){
            setError(err.message);
            setIsLoading(false);
        };
        
    }

    // const onChangeText = (text) => {
    //     // if(text.trim().length > 0){
    //         setName(text)
    //     // }
    // };


    return(
        <Modal
                isVisible={props.visible}
                hasBackdrop={true}
                backdropColor="black"
                backdropOpacity={0.7}
                coverScreen={true}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionInTiming={800}
                backdropTransitionOutTiming={800}
                // children={quitModalChildren}
                onBackdropPress={props.cancelFunc}
            >
                 <ImageBackground 
                        source={backgroundIMG}
                        style={styles.backIMG}
                        resizeMode='contain'
                    >
                        <View style={styles.mainContainer}>
                            <View style={styles.imageContainer}>
                                <Text style={styles.messageContent}>{props.avatarText}</Text>
                                <View style={styles.avatarContainer}>
                                    <TouchableOpacity 
                                        style={avatar == "B" ? 
                                            styles.avatarTouchableActive : styles.avatarTouchable} 
                                        activeOpacity={0.8}
                                        onPressOut={() => {
                                            setAvatar("B")
                                        }}
                                    >
                                        <Image
                                            source={boyAvatar}
                                            style={styles.avatar}
                                            resizeMode='contain'
                                            
                                            
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={avatar == "G" ? 
                                            styles.avatarTouchableActive : styles.avatarTouchable}
                                        activeOpacity={0.8}
                                        onPressOut={() => {
                                            setAvatar("G")
                                        }}
                                    >
                                        <Image
                                            source={girlAvatar}
                                            style={styles.avatar}
                                            resizeMode='contain'
                                        />
                                    </TouchableOpacity>
                                </View>

                                
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.messageContent}>{props.inputText}</Text>
                                <TextInput 
                                style={styles.input} 
                                value={nickName} 
                                onChangeText={text => setNickName(text)} 
                                />
                            </View>
                            
                            <View style={styles.buttonContainer}>
                                {props.okayFunc ?
                                    <TouchableOpacity 
                                        style={styles.mainTouchable} 
                                        activeOpacity={0.5}
                                        onPressOut={() => loginHandler()}
                                        >

                                        <ImageBackground
                                            style={styles.alertMessageButtonStyle}
                                            source = {greenButton}
                                            resizeMode='contain'>
                                                <Text 
                                                    style={styles.alertMessageButtonTextStyle}> 
                                                    {props.okayText} </Text>
                                        </ImageBackground>

                                    </TouchableOpacity> :null
                                }
                                {props.cancelFunc ?
                                    <TouchableOpacity 
                                        style={styles.mainTouchable} 
                                        activeOpacity={0.5}
                                        onPressOut={props.cancelFunc}
                                        >

                                        <ImageBackground
                                            style={styles.alertMessageButtonStyle}
                                            source = {greyButton}
                                            resizeMode='contain'>
                                                <Text 
                                                    style={styles.alertMessageButtonTextStyle}> 
                                                    {props.cancelText} </Text>
                                        </ImageBackground>

                                    </TouchableOpacity> :null
                                }                               
                            </View>
                        </View>
                    </ImageBackground>
            </Modal>
            
    )

};

const styles = StyleSheet.create({
    backIMG: {
        width: Device.screenWidth * 0.7,//Math.min(Device.screenWidth * 0.8, Device.screenHeight * 0.8),
        height: (Device.screenWidth * 0.7) * 1.5,//Math.min(Device.screenWidth * 0.8, Device.screenHeight * 0.8),
        marginHorizontal: Math.min(Device.screenWidth * 0.10, Device.screenHeight * 0.10)
        
    },
    mainContainer: {
        justifyContent:'center',
        alignItems: 'center',
        flex:1,
        width:"100%",
        height:"100%",
        marginTop:"5%"
        
    },
    imageContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex:4,    
        height:"50%",
        width:"100%"
    },
    inputContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex:4,  
        height:"15%",
        width:"100%" ,
    },
    messageContent: {
        width:"100%",
        height:"20%",
        textAlign:"center",
        fontSize: Math.min(Device.screenWidth, Device.screenHeight) * 0.05,
        fontFamily: 'open-sans-bold',
    
        // paddingTop:"10%",
        
    },
    buttonContainer: {
        flex:2,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        height:"20%",
        width:"80%"
        
        
    },
    mainTouchable:{
        width:"40%",
        height:"40%",
        justifyContent:'center',
        alignItems:'center',
        // paddingHorizontal: 10        
        
        
    },
    alertMessageButtonStyle: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    alertMessageButtonTextStyle: {
        fontSize:(Device.screenWidth < 500 ? 
            parseInt(Device.screenHeight * 0.02) : parseInt(Device.screenHeight * 0.03)),
        paddingBottom: (Device.screenHeight < 900) ?  5 : 10,
        fontFamily: 'open-sans-bold',
        color: 'black'
    },
    avatarContainer: {
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        width: "100%",
        height: "80%",
        paddingRight:"10%",
        // paddingBottom:"10%"
    },
    avatarTouchableActive: {
        width:"60%",
        height:"60%"
    },
    avatarTouchable: {
        width:"40%",
        height:"40%"
    },
    input: {
        width:"80%",
        height:"20%",
        borderColor: 'gray', 
        borderWidth: 3,
        borderRadius:6,
        padding:3
    },
    avatar: {
        width:"100%",
        height:"100%"
    }
    
  });
  


export default AuthModal;