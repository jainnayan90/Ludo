import { Audio } from 'expo-av';
import React, {useEffect, useState, useCallback } from 'react';
import { 
    View,  
    StyleSheet,
    Animated
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as BoardDimensions from '../constants/BoardDimensions';
import Device from  '../constants/Device';

import Svg, { Image, G, Text, Rect } from 'react-native-svg';


const {ValueXY} = Animated;

const elementsMap = BoardDimensions.elementsMap;

const boyWin = require('../assets/images/boy-head-win.png');
const girlWin = require('../assets/images/girl-head-win.png');
const confeti = require('../assets/images/confeti.png');
//const closeIcon = require('../assets/images/close-icon.png');
const youWon = require('../assets/images/you-won.png');
const coinReward = require('../assets/images/coin-reward.png');

let winningSound = null;
let losingSound = null;


const WinnerScreen = (props) => {
    const winnerId = useSelector(state => state.gameInfo.winnerId);
    const myPlayerId = useSelector(state => state.gameInfo.myPlayerId);
    const players = useSelector(state => state.gameInfo.players);
    const winChips = useSelector(state => state.gameInfo.winChips);
    

    useEffect(() => {
        setTimeout(() => {
            props.navigation.navigate('MainScreen');
        }, 3000);
    }, []);

    useEffect(() => {
        console.log('in load sounds................', myPlayerId, winnerId);
        const loadSounds = async () =>{
            try{
                if (myPlayerId == winnerId) {
                    winningSound = new Audio.Sound();
                    await winningSound.loadAsync(
                        require("../assets/sounds/winning_sound.wav")
                    );
                    await winningSound.playAsync();
                }else{
                    losingSound = new Audio.Sound();
                    await losingSound.loadAsync(
                        require("../assets/sounds/losing_sound.wav")
                    );
                    await losingSound.playAsync();
                }
                
            }catch(err){
                console.log("load sound error........", err);
            }
        }
        loadSounds();
    }, []);



    return (
        <View style={styles.container}>
            <Svg width={Device.screenWidth} height={Device.screenHeight} viewBox={elementsMap.viewBox}>
                {myPlayerId == winnerId ?
                    <Image
                        x={elementsMap.confeti.x}
                        y={elementsMap.confeti.y}
                        href={confeti}
                        width={elementsMap.confeti.width}
                        height={elementsMap.confeti.height}
                    /> : null}
                {myPlayerId == winnerId ?
                    <Image
                        x={elementsMap.resultLabel.x}
                        y={elementsMap.resultLabel.y}
                        href={youWon}
                        width={elementsMap.resultLabel.width}
                        height={elementsMap.resultLabel.height}
                    /> :
                    <Text 
                        fill='transparent'
                        stroke='white'
                        strokeWidth={elementsMap.resultLabel.strokeWidth}
                        fontSize={elementsMap.resultLabel.fontsize}
                        x={elementsMap.resultLabel.lx}
                        y={elementsMap.resultLabel.ly}
                        textAnchor='middle'>
                            {"YOU LOST"}
                    </Text>
                }
                <Image
                    x={elementsMap.resultAvatar.x}
                    y={elementsMap.resultAvatar.y}
                    href={boyWin}
                    width={elementsMap.resultAvatar.width}
                    height={elementsMap.resultAvatar.height}
                />
                {myPlayerId == winnerId ?
                    <G>
                        <Image
                            x={elementsMap.resultcoin.x}
                            y={elementsMap.resultcoin.y}
                            href={coinReward}
                            width={elementsMap.resultcoin.width}
                            height={elementsMap.resultcoin.height}
                        />
                        <Text 
                            fill='white'
                            stroke='white'
                            strokeWidth={elementsMap.chipsText.strokeWidth}
                            fontSize={elementsMap.chipsText.fontsize}
                            x={elementsMap.chipsText.x}
                            y={elementsMap.chipsText.y}
                            textAnchor='middle'>
                                {`\$${winChips}`}
                        </Text>
                        
                    </G>
                    :null}
            </Svg>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#39b4ce',
    },
  });

export default WinnerScreen;
