import React, {useState}  from 'react';
import {
    StyleSheet, 
    View, 
    Text, 
    ImageBackground,
    TouchableOpacity,
    Image
} from 'react-native';
import { Item } from 'react-navigation-header-buttons';
import Device from '../../../constants/Device';
import Modal from "react-native-modal";
// const isTab = Device.isTab;

const backgroundIMG = require('../../../assets/images/blue.png');
const greenButton = require('../../../assets/images/green-button.png');
const greyButton = require('../../../assets/images/grey-button.png');


const BasicModal = (props) => {

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
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageContent}>{props.text}</Text>
                            </View>
                            
                            <View style={styles.buttonContainer}>
                                {props.okayFunc ?
                                    <TouchableOpacity 
                                        style={styles.mainTouchable} 
                                        activeOpacity={0.5}
                                        onPressOut={props.okayFunc}
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
        width: Math.min(Device.screenWidth * 0.7, Device.screenHeight * 0.7),
        height: Math.min(Device.screenWidth * 0.7, Device.screenHeight * 0.7),
        marginHorizontal: Math.min(Device.screenWidth * 0.1, Device.screenHeight * 0.1)
        
    },
    mainContainer: {
        justifyContent:'center',
        alignItems: 'center',
        flex:1,
        
    },
    messageContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex:4,
        
        
    },
    messageContent: {
        fontSize: Math.min(Device.screenWidth, Device.screenHeight) * 0.05,
        fontFamily: 'open-sans-bold'
    },
    buttonContainer: {
        flex:2,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        
        
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
    }
    
  });
  


export default BasicModal;