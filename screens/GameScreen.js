import React, {useEffect, useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { 
    View,  
    StyleSheet,
    Animated,
    Easing,
    AppState,
    AsyncStorage
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as BoardDimensions from '../constants/BoardDimensions';
import Device from  '../constants/Device';
import * as gameActions from '../store/actions/gameactions';
import Svg,{ 
    Image, 
    G, 
    Text, 
    Rect,
} from 'react-native-svg';

// import Dice from '../components/dice/dice';

import {NS_PLAYER_DICE_ROLL, NS_PLAYER_PAWN_MOVE, NS_QUIT_GAME} from '../constants/NameSpaces';
import { XMPP } from './StartupScreen';
import BasicModal from '../components/UI/Modal/BasicModal';
// import Modal from "react-native-modal";
import { ForeignObject } from 'react-native-svg';
import SquareTimer from '../components/UI/SquareTimer';
// import { set } from 'react-native-reanimated';

const {ValueXY, Value} = Animated;

const backgroundIMG = require('../assets/images/board.png');
const pawnYellowB = require('../assets/images/boy-yellow.png');
const pawnYellowG = require('../assets/images/girl-yellow.png');
const pawnGreenB = require('../assets/images/boy-green.png');
const pawnGreenG = require('../assets/images/girl-green.png');
const pawnRedB = require('../assets/images/boy-red.png');
const pawnRedG = require('../assets/images/girl-red.png');
const pawnBlueB = require('../assets/images/boy-blue.png');
const pawnBlueG = require('../assets/images/girl-blue.png');
const levelBox = require('../assets/images/level-box.png');
const girlBox = require('../assets/images/girl-box.png');
const boyBox = require('../assets/images/boy-box.png');
const avatarBox = require('../assets/images/boy-box.png');
const coinsBox = require('../assets/images/coins.png');
const closeIcon = require('../assets/images/close-icon.png');

const diceOne = require('../assets/images/dice-one.png');
const diceTwo = require('../assets/images/dice-two.png');
const diceThree = require('../assets/images/dice-three.png');
const diceFour = require('../assets/images/dice-four.png');
const diceFive = require('../assets/images/dice-five.png');
const diceSix = require('../assets/images/dice-six.png');
const soundOn = require('../assets/images/soundon.png');
const soundOff = require('../assets/images/soundoff.png');

const arrowUp = require('../assets/images/arrow_up.png');

const diceFaces = [diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix];

const boardDimension = BoardDimensions.boardDimension;
const elementsMap = BoardDimensions.elementsMap;
const indexMap = BoardDimensions.indexMap;
const timerIndexMap = BoardDimensions.timerIndexMap;
const pawnsSizeMap = BoardDimensions.pawnsSizeMap;
import DiceIm from '../components/dice/diceIm';


const initialPositions = BoardDimensions.initialPositions;
//const boardMap = BoardDimensions.boardMap;

let y1 = false;
let y2 = false;
let y3 = false;
let y4 = false;
let r1 = false;
let r2 = false;
let r3 = false;
let r4 = false;
let b1 = false;
let b2 = false;
let b3 = false;
let b4 = false;
let g1 = false;
let g2 = false;
let g3 = false;
let g4 = false;

let y1W = false;
let y2W = false;
let y3W = false;
let y4W = false;
let r1W = false;
let r2W = false;
let r3W = false;
let r4W = false;

const timerDuration = 100;
let timer = null;
let movingPawn = false;

// let rollVal = new Value(0);
// Animated.timing(rollVal, {
//     toVal: 1,
//     duration:10000,
//     easing: Easing.linear
// }).start();

let tapSound = null;
let biteSound = null;
let homeSound = null;
const loadSounds = async () =>{
    try{
        tapSound = new Audio.Sound();
        await tapSound.loadAsync(
            require("../assets/sounds/tap.wav")
        );
        biteSound = new Audio.Sound();
        await biteSound.loadAsync(
            require("../assets/sounds/bite_sound.wav")
        );
        homeSound = new Audio.Sound();
        await homeSound.loadAsync(
            require("../assets/sounds/home_sound.wav")
        );
        // var soundData = await AsyncStorage.getItem('soundData');
        // if(!soundData){
        //     true;
        // }else{
        //     const transformedData = JSON.parse(soundData);
        //     if (transformedData.soundOn){
        //         true;
        //     }else{
        //         //await backgroundMusic.setVolumeAsync(0);
        //         setSoundStatus(false);
        //     }
        // }
    }catch(err){
        //console.log("load sound error........", err);
    }
}
loadSounds();

const animationsQueue = [];
const playingPlayers = [];


const getSameCellPawns = (cellId, mPawnId, pawnPositions, oldPawn) => {
    let cellArr = [];
    let pawnsMap = {};
    let differentPawns = 0;
    let pawnsCount = 0;
    //console.log("@@@@@@@@@@@ mpawnID>...............", mPawnId);
    //console.log('%%%%%%%%%%%%%%%% positions', cellId, pawnPositions);
    for (let pawnId in pawnPositions){
        if (pawnPositions[pawnId] == cellId){
            pawnsCount += 1;
            if (mPawnId){
                if (pawnsMap[pawnId[0]] == undefined){
                    differentPawns += 1;
                    pawnsMap[pawnId[0]] = 1
                }else{
                    pawnsMap[pawnId[0]] = pawnsMap[pawnId[0]] + 1;
                }
                
            }
            cellArr = cellArr.concat(pawnId);
        }
    }
    //console.log("@@@@@@@@@@@differentPawns>...............", pawnsMap, differentPawns, pawnsCount);
    if (differentPawns == 2 && pawnsCount == 2){
        if(oldPawn ){
            return [mPawnId]
        }
        return []
    }
    // if (pawnsCount == 2){
    //     return [pawnId]
    // }
    return cellArr;
};

const animateSameCellPawns = (cellId, sameCellArr, pawnPositions) => {
    //let sameCellArr = getSameCellPawns(cellId, pawnId, pawnPositions);
    if (sameCellArr != []){
        let newCellVal = cellId;
        //console.log("!!!!!!!!!!!!!!!...........", cellId, pawnPositions);
        let toVal = BoardDimensions.getXY(newCellVal);
        const animArr = [];
        
        let diffX = elementsMap.pawndiffX;
        let midVal = parseInt(sameCellArr.length/2);
        let currentX = toVal.x;
        let currentY = toVal.y;
        let sizeVal = null;
        let diffY = 0;
        let midValDiffX = 0;
        
        if (sameCellArr.length > 1) {
            sizeVal = pawnsSizeMap[2];
            diffY = elementsMap.pawndiffY;
            midValDiffX = elementsMap.midvaldiffX;
        }else{
            diffY = 0;
            sizeVal = pawnsSizeMap[1];
            midValDiffX=0;
        }
        //console.log('##############    ', currentX, currentY, diffX, midVal)
        for(let index in sameCellArr ){
            let currDiff = (parseInt(index) - midVal) * diffX;
            let newX = currentX + currDiff + midValDiffX;
            let newY = currentY + diffY;
            //console.log('##############$$$$$$    ', newX);
            animArr.push(Animated.timing(eval(sameCellArr[index]), {
                toValue: {x:newX, y:newY},
                // speed:30,
                duration:10,
                useNativeDriver: true
                // easing: Easing.bounce
                
            }));
            animArr.push(Animated.spring(eval(sameCellArr[index] + 'W'), {
                toValue: {x:sizeVal, y:sizeVal}, 
                // friction: 1,
                // tension:20,
                duration:10,
                useNativeDriver: true
                // speed:30
            }));
        }
        return animArr;
    }
    return []
};


const createAnimArray = (pawnId, updatedPositionMap, pawnPositions, safeCells) => {
    let oldCellPawns = [];
    //console.log('************ old', pawnPositions[pawnId] , pawnPositions[pawnId] != "0", pawnPositions[pawnId] != 0);
    if (pawnPositions[pawnId] != "0" || pawnPositions[pawnId] != 0){
        oldCellPawns = getSameCellPawns(pawnPositions[pawnId], false, updatedPositionMap, false);
    }
    let oldPawn = oldCellPawns.length > 0 ? true : false;

    let newCellPawns = [];
    if(safeCells[updatedPositionMap[pawnId]]){
        newCellPawns = getSameCellPawns(updatedPositionMap[pawnId], false, updatedPositionMap, false);
    }else{
        newCellPawns = getSameCellPawns(updatedPositionMap[pawnId], pawnId, updatedPositionMap, oldPawn);
    }
    
    let newAnimArr = [];

    if (newCellPawns.length > 1 || oldCellPawns.length > 0){
        newAnimArr = animateSameCellPawns(updatedPositionMap[pawnId], newCellPawns, updatedPositionMap);
    }
    if(oldCellPawns.length > 0){
        newAnimArr = newAnimArr.concat(animateSameCellPawns(pawnPositions[pawnId], oldCellPawns, updatedPositionMap));
    }
    return newAnimArr;
}

let runningAnim = false;
let soundsMap = {}

const startAnimation = async () => {
    //console.log('in animation...............', animationsQueue.length, runningAnim);
    if (animationsQueue.length > 0 && runningAnim == false){
        runningAnim = true;
        const currentAnim = animationsQueue.shift();

        if (currentAnim != undefined){
            //let soundsMap = {}
            if (currentAnim.type == "non-sequence"){
                
                const runAnimation =  async (animArr) => {
                    // console.log("@@@@@@@@@@@@@    ", tapSound);
                    if (animArr.length == 0){
                        runningAnim = false;
                        setTimeout(() => startAnimation(), 30);
                        return ;
                    }
                    const anim = animArr.shift();
                    if (soundsMap["tapSound"]){
                        await tapSound.replayAsync();
                    }else{
                        if(Device.platform == "android"){
                            await tapSound.replayAsync();
                        }
                        await tapSound.replayAsync();
                        soundsMap["tapSound"] = true
                    }
                    
                    anim.start(() => {                            
                        runAnimation(animArr);
                    })
                };
                runAnimation(currentAnim.anim);
                
            }else{
                if(currentAnim.key == "collision"){
                    if (soundsMap["biteSound"]){
                        await biteSound.replayAsync();
                    }else{
                        if(Device.platform == "android"){
                            await biteSound.replayAsync();
                        }
                        await biteSound.replayAsync();
                        soundsMap["biteSound"] = true
                    }
                    
                }
                currentAnim.anim.start(() => {
                    // setRunningAnim(false);
                    runningAnim = false
                    setTimeout(() => startAnimation(), 30);
                });
            }
        }
    }
    return;
};
let currentDiceFace = diceThree;

const SvgComponent = (props) => {
    const xml = require('@xmpp/xml');      
    const gameId = useSelector(state => state.gameInfo.gameId);
    const [pawnsMap, setPawnsMap] = useState({});
    const dispatch = useDispatch();
    const rotation = useSelector(state => state.gameInfo.rotation);;
    const players = useSelector(state => state.gameInfo.players);
    const currentPlayerId = useSelector(state => state.gameInfo.currentPlayerId);
    const myPlayerId = useSelector(state => state.gameInfo.myPlayerId);
    
    const currentIndex = useSelector(state => state.gameInfo.currentIndex);
    // const [timerPlayerIndex, setTimerPlayerIndex] = useState(currentIndex);
    
    const AnimatedImage = Animated.createAnimatedComponent(Image);
    
    // const AnimatedRect = Animated.createAnimatedComponent(Rect);
    //const [activateTimer, setActivateTimer]  = useState(false);
    const diceVal = useSelector(state => state.gameInfo.diceVal);
    const isRolling = useSelector(state => state.gameInfo.isRolling);
    const movePawn = useSelector(state => state.gameInfo.movePawn);
    const seconds = useSelector(state => state.gameInfo.turnTime);
    const oneStrokeDist = elementsMap.timer.perimeter * timerDuration/(seconds * 1000);
    const cellVal = useSelector(state => state.gameInfo.cellVal);
    const pawnId = useSelector(state => state.gameInfo.pawnId);
    const myIndex = useSelector(state => state.gameInfo.myIndex);
    const winner = useSelector(state => state.gameInfo.winner);
    const pawnPlayerIndex = useSelector(state => state.gameInfo.pawnPlayerIndex);
    const collision = useSelector(state => state.gameInfo.collision);
    const cellRange = useSelector(state => state.gameInfo.cellRange);
    const remTurnTime = useSelector(state => state.gameInfo.remTurnTime);
    // const [remainingTime, setRemainingTime] = useState(remTurnTime);
    const quitGame = useSelector(state => state.gameInfo.quitGame);
    const potAmount = useSelector(state => state.gameInfo.potAmount);
    const pawnCollisionAT = useSelector(state => state.gameInfo.pawnCollisionAT);
    const pawnMoveAT = useSelector(state => state.gameInfo.pawnMoveAT);
    // const avatar = useSelector(state => state.auth.avatar);
    const facebookImage = useSelector(state => state.auth.facebookImage);
    const userType = useSelector(state => state.auth.userType);
    // const sameCellArr = useSelector(state => state.gameInfo.sameCellArr);
    // const sameCellVal = useSelector(state => state.gameInfo.sameCellVal);
    // const sameCellIndex = useSelector(state => state.gameInfo.sameCellIndex);
    const errorPawnId = useSelector(state => state.gameInfo.errorPawnId);
    const errorCellId = useSelector(state => state.gameInfo.errorCellId);
    //const [animationsQueue, setAnimationsQueue] = useState([]);
    // const [runningAnim, setRunningAnim] = useState(false);
    // const [executeAnim, setExecuteAnim] = useState(false);
    const level = useSelector(state => state.gameInfo.level);
    // const movablePawns = useSelector(state => state.gameInfo.movablePawns)
    const [quitModal, setQuitModal] = useState(false);
    // const [soundsMap, setSoundsMap] = useState({});
    const [pawnPositions, setPawnPositions]  = useState({});
    const [diceRolled, setDiceRolled] = useState(false);  
    // const [sameCellSizeMap, setSameCellSizeMap] = useState({});
    const safeCells = useSelector(state => state.gameInfo.safeCells)
    const [appState, setAppState] = useState(AppState.currentState);
    // const isRollingRef = useRef(isRolling);
    // isRollingRef.current = isRolling;
    const [soundStatus, setSoundStatus] = useState(true);
    // const [avatarKey, setAvatarKey] = useState(() => {
    //     if (avatar == "B"){
    //         return "B";
    //     }else{
    //         return "G";
    //     }
    // });
    

    const currentPlayerIdRef = useRef(currentPlayerId);
    currentPlayerIdRef.current = currentPlayerId;

    // const sameCellSizeMapRef = useRef(sameCellSizeMap);
    // sameCellSizeMapRef.current = sameCellSizeMap;

    const movePawnRef = useRef(movePawn);
    movePawnRef.current = movePawn;

    // const soundStatusRef = useRef(soundStatus);
    // soundStatusRef.current = soundStatus;

    // const soundsMapRef = useRef(soundsMap);
    // soundsMapRef.current = soundsMap;

    const pawnPositionsRef = useRef(pawnPositions);
    pawnPositionsRef.current = pawnPositions;

    const diceValRef = useRef(diceVal);
    diceValRef.current = diceVal;

    const movingPawnRef = useRef(movingPawn);
    movingPawnRef.current = movingPawn;



    // let [currentDiceFace, setCurrentDiceFace] = useState(diceThree);

    const get_chips_value = (coins) => {
        var coinsVal = null;
        if (coins/10000000 >= 1){
            coinsVal = (coins/10000000).toString().substr(0,4) +' Cr';
        }else if (coins/100000 >= 1){
            coinsVal = (coins/100000).toString().substr(0,4) +' L';
        }else if (coins/10000 >= 1){
            coinsVal = (coins/10000).toString().substr(0,4) +' K';
        }else{
            coinsVal = coins.toString();
        }
        return coinsVal
    };

    


    const pawnClicked = (key) => {

        if(movePawnRef.current && !movingPawnRef.current && currentPlayerIdRef.current == myPlayerId){
            movingPawn = true;
            let currentVal = pawnPositionsRef.current[key];
            let overResultPos = false;
            if (isNaN(currentVal)){
                let indexVal = parseInt(currentVal[currentVal.length - 1]);
                if((indexVal + diceValRef.current) > 6 ){
                    overResultPos = true;
                }
            }
            //console.log("in pawnclicked...myPawnPositionsRef..... key ..........", myPawnPositionsRef.current);
            if (parseInt(pawnPositionsRef.current[key]) == 0 && parseInt(diceValRef.current) != 6){
                return;
            }else if(pawnPositionsRef.current[key].indexOf("h6") != -1){
                return;
            }else if(overResultPos){
                return;
            }else{
                let animArr = [];
                let currentIndex = null;
                for(let pInd in Object.keys(players)){
                    if (players[Object.keys(players)[pInd]]["id"] == myPlayerId){
                        currentIndex = Object.keys(players)[pInd]
                        break;
                    }
                }
                let endDiceVal = currentVal == 0 ? 1 : diceValRef.current;
                
                //console.log('@@@@@@@@@@@@@    ', currentVal);
                for(let incr=1; incr<=endDiceVal;incr++){
                    let toVal = null;
                    if(isNaN(currentVal)){
                        let indexVal = parseInt(currentVal[currentVal.length - 1]);
                        indexVal = indexVal + 1;
                        currentVal = currentVal.substring(0, 2) + indexVal;
                    }else{
                        currentVal = parseInt(currentVal) + 1;
                        if (currentVal == 52){
                            currentVal =  "1h1";
                        }
                        
                    }
                    //console.log('***********    ', currentVal);
                    toVal = BoardDimensions.getXY(currentVal);
                    animArr.push(
                        Animated.timing(eval(key), {
                            toValue: toVal,
                            duration: pawnMoveAT,
                            easing: Easing.bounce,
                            useNativeDriver: true
                            // bounciness:20
                            
                        })
                    )
                }
                let updatedPositionMap = {...pawnPositionsRef.current};
                updatedPositionMap[key] = currentVal.toString();

                let allAnimArr = [];
                let newAnimArr = createAnimArray(key, updatedPositionMap, pawnPositionsRef.current, safeCells);
                
                let newAnimMap = {key:"sameCell", anim:Animated.parallel(newAnimArr)}

                allAnimArr.push({key:"pawnmove", anim:animArr, type: "non-sequence"});
                newAnimArr.length > 0 ? allAnimArr.push(newAnimMap) : false;

                animationsQueue.push(...allAnimArr);
                startAnimation();
                // setExecuteAnim(prevState => !prevState);

                let oldCellVal = pawnPositionsRef.current[key];
                if (oldCellVal.length == 3){
                    oldCellVal = pawnPositionsRef.current[key].substring(1);
                }else{
                    oldCellVal = pawnPositionsRef.current[key];
                }


                // let sizeAnimArr = []
                // console.log('*************** sameCellSizeMapRef.current ', sameCellSizeMapRef.current);
                // for (let sKey in sameCellSizeMapRef.current){
                //     let origSize = sameCellSizeMapRef.current[sKey]["size"];
                //     let origPosition = sameCellSizeMapRef.current[sKey]["cell"];
                //     console.log('*************** sameCellSizeMapRef.current ', origSize, origPosition, oldCellVal, currentVal.toString());
                //     if (origPosition != oldCellVal || origPosition != currentVal.toString()){
                //         sizeAnimArr.push(Animated.spring(eval(sKey + 'W'), {
                //             toValue: {x:origSize, y:origSize}, 
                //             // friction: 1,
                //             // tension:20,
                //             duration:10,
                //             useNativeDriver: true
                //         }));
                //     }
                // }
                // if (sizeAnimArr.length >0 ){
                //     allAnimArr.push({key:"afterTurn", anim:Animated.parallel(sizeAnimArr)});
                // }
                
                
                // setSameCellSizeMap({});


                const id = XMPP.get_random_id(NS_PLAYER_PAWN_MOVE);
                const packet = xml(
                    "iq",
                    {id: id, to: gameId, type: "set"},
                    xml("query", {xmlns: NS_PLAYER_PAWN_MOVE},
                    xml("pawn_id", {}, key),
                    xml("cell_id", {}, oldCellVal)
                    )
                );
                movingPawn = false;
                XMPP.sendStanza(packet); 
                //console.log("%%%%%%%%%%%%%%%......", updatedPositionMap),
                setPawnPositions(updatedPositionMap);
            }
        }
       // }
    };

    useEffect(() => {
        const setSound = async() => {
            var soundData = await AsyncStorage.getItem('soundData');
            if(!soundData){
                true;
            }else{
                const transformedData = JSON.parse(soundData);
                if (transformedData.soundOn){
                    true;
                }else{
                    await tapSound.setVolumeAsync(0);
                    await biteSound.setVolumeAsync(0);
                    setSoundStatus(false);
                }
            }
        }
        setSound();
    }, []);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);
    
        return () => {
          AppState.removeEventListener("change", _handleAppStateChange);
        };
      }, []);
    
    const _handleAppStateChange = nextAppState => {
        // if (appState.match(/inactive|background/) && nextAppState === "active") {
        //   console.log("App has come to the foreground!");
        // }

        console.log('\n\n...................', appState, nextAppState);
        if (nextAppState == 'active' ){
            console.log('in navigate');
            XMPP.disconnect();
            setTimeout(() => {
                timerEL = null;
                dispatch({type: 'RESET_STARTUP_SCREEN'});
                dispatch({type: 'RESET_MAIN_SCREEN'});
                props.navigation.navigate('Startup');
            }, 300);
            
            //AppState.removeEventListener("change", _handleAppStateChange);
            
        }
        setAppState(nextAppState);
    };
    

    
    //console.log('\n\n...................', appState);
    useEffect(() => {
        let updatedPawnsMap = {};
        let sameCellMap = {};
        let markers = [];
        let valDiffMap = {};
        let pawnPositionsNew = {} 

        for (let pIndex in players){
            playingPlayers[indexMap[rotation][pIndex] - 1 ] = players[pIndex]; 
            markers = players[pIndex]["markers"];
            for (let pID in markers){
                //let toVal = null;
                let cellId = null;
                let key = markers[pID]["key"][0];
                let val = isNaN(markers[pID]["val"][0]) ? markers[pID]["val"][0] :parseInt(markers[pID]["val"][0]);
                if (val === 0){
                    true;
                }else{
                    if(isNaN(val)){
                        let homeIndex = indexMap[rotation][pIndex];
                        cellId = homeIndex.toString() + val;
                    }else{
                        //const playerDelta = Math.abs((52 - Math.abs(myIndex - pIndex) * 13));
                        const playerDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pIndex]) * 13;
                        let newCellVal = val + playerDelta;
                        if(newCellVal > 52) {
                            newCellVal = Math.abs(newCellVal - 52);
                        }
                        cellId = newCellVal;
                    }
                }

                if (val != 0){
                    if (sameCellMap[cellId] != undefined){
                        sameCellMap[cellId].push(`${key}`)
                    }else{
                        sameCellMap[cellId] = [`${key}`]
                    }
                }
            }
        }

        delete sameCellMap["null"];
        let diffX = elementsMap.pawndiffX;
        for(let cellId in sameCellMap ){
            if (sameCellMap[cellId].length > 1){
                let midVal = parseInt(sameCellMap[cellId].length/2);
                for(let index in sameCellMap[cellId]){
                    let key = sameCellMap[cellId][index];
                    let currDiff = (parseInt(index) - midVal) * diffX;
                    //console.log('##############@@@@@@@@@    ', sameCellMap[toVal][index].x, currDiff);
                    let newX = currDiff;
                    valDiffMap[key] = newX
                }
            }
        }
        


        for (let pIndex in players){
            playingPlayers[indexMap[rotation][pIndex] - 1 ] = players[pIndex]; 
            markers = players[pIndex]["markers"];
            for (let pID in markers){
                let toVal = null;
                let cellId = null;
                let key = markers[pID]["key"][0];
                let val = isNaN(markers[pID]["val"][0]) ? markers[pID]["val"][0] :parseInt(markers[pID]["val"][0]);
                //console.log('@@@@@@@@@@@@@@@@@@@ ', key, markers[pID]["val"][0]);
                if(isNaN(markers[pID]["val"][0])){
                    pawnPositionsNew[markers[pID]["key"][0]] = indexMap[rotation][pIndex] + markers[pID]["val"][0];
                }else{
                    if (val == 0 || val == "0"){
                        pawnPositionsNew[markers[pID]["key"][0]] = "0";
                    }else{                    
                        const plyDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pIndex]) * 13;
                        let nCellVal = parseInt(markers[pID]["val"][0]) + plyDelta;
                        if(nCellVal > 52) {
                            nCellVal = Math.abs(nCellVal - 52);
                        }
                        pawnPositionsNew[markers[pID]["key"][0]] = nCellVal.toString();
                    }
                }
                
                if (val === 0){
                    toVal = {x:initialPositions[indexMap[rotation][pIndex]][pID][0],
                                y: initialPositions[indexMap[rotation][pIndex]][pID][1]}
                }else{
                    //console.log('####################      ', myIndex, '    ', pIndex);
                    if(isNaN(val)){
                        let homeIndex = indexMap[rotation][pIndex];
                        cellId = homeIndex.toString() + val;
                        toVal = BoardDimensions.getXY(cellId);
                    }else{
                        //const playerDelta = Math.abs((52 - Math.abs(myIndex - pIndex) * 13));
                        const playerDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pIndex]) * 13;
                        let newCellVal = val + playerDelta;
                        if(newCellVal > 52) {
                            newCellVal = Math.abs(newCellVal - 52);
                        }
                        cellId = newCellVal;
                        //console.log('####################      ', myIndex, '    ', pIndex, '  ', newCellVal, '  ', val);
                        toVal = BoardDimensions.getXY(newCellVal);
                    }
                }
                
                let source = false;

                if(key.startsWith('y')){
                    source = eval("pawnYellow" + players[pIndex]["gender"]);
                }else if(key.startsWith('g')){
                    source = eval("pawnGreen" + players[pIndex]["gender"]);
                }else if(key.startsWith('r')){
                    source = eval("pawnRed" + players[pIndex]["gender"]);
                }else{
                    source = eval("pawnBlue" + players[pIndex]["gender"]);
                }


                //console.log("printing key........... ", key, valDiffMap[key])
                let xDiff = valDiffMap[key] != undefined ? valDiffMap[key] + elementsMap.midvaldiffX : 0;
                let yDiff = valDiffMap[key]  != undefined ? elementsMap.pawndiffY : 0;
                eval(`${key} = new ValueXY({x:${toVal.x + xDiff}, y: ${toVal.y + yDiff}});`);
                let sizeKey = valDiffMap[key]  != undefined ? 2 : 1
                eval(`${key}W = new ValueXY({x:${pawnsSizeMap[sizeKey]}, y:${pawnsSizeMap[sizeKey]}});`);
                
                updatedPawnsMap[`${key}C`] = 
                    
                    <AnimatedImage
                        x={eval(`${key}.x`)}
                        y={eval(`${key}.y`)}
                        href = {source}
                        width={eval(`${key}W.x`)}
                        height={eval(`${key}W.y`)}
                        onPressIn={pIndex == myIndex ? () => pawnClicked(key): null}
                    />
            
            }
        }

        //console.log("%%%%%%%%%%%%%%%......111111", pawnPositionsNew);
        setPawnPositions(pawnPositionsNew);
        setPawnsMap(updatedPawnsMap);
    }, [players])
    //console.log(rotation, '    ', playingPlayers);

    // useEffect(() => {
        
    //     // setTimerPlayerIndex(currentIndex);
    //     setMovingPawn(false);
        
    // }, [currentIndex, seconds, remTurnTime]);

    

    useEffect(() => {
        if (winner){
            setTimeout(() => {
                // setTimerPlayerIndex(0);
                props.navigation.navigate('WinnerScreen');
            }, 200);
        }
    }, [winner]);

    useEffect(() => {
        dispatch({type: 'RESET_MAIN_SCREEN'});
    }, [dispatch]);

    

    useEffect(() => {
        try{
            if (diceVal === 1){
                currentDiceFace = diceOne;
            }else if (diceVal === 2){
                currentDiceFace = diceTwo;
            }else if (diceVal === 3){
                currentDiceFace = diceThree;
            }else if (diceVal === 4){
                currentDiceFace = diceFour;
            }else if (diceVal === 5){
                currentDiceFace = diceFive;
            }else if (diceVal === 6){
                currentDiceFace = diceSix;
            }
            //console.log("in dice face ..........", currentIndex, myIndex, movablePawns);
            // if (currentIndex == myIndex && movablePawns.length > 1){
            //     check_and_update_pawns_size(movablePawns);
            // }

            setDiceRolled(false)

        }catch(err){
            //console.log(err)
        }
    }, [diceVal]);


    useEffect(() => {
        // console.log('in pawn move     ')
        
        if (cellVal != null && pawnId != null){
            let cellArray = cellRange.split(",");
            
            let animArr = [];
            for (let itemInd in cellArray){
                let cellVal = cellArray[itemInd];
                let newCellVal = null;
                if (isNaN(cellVal)){
                    const homeIndex = indexMap[rotation][pawnPlayerIndex];
                    newCellVal = homeIndex.toString() + cellVal;
                }else{
                    //const playerDelta = Math.abs((52 - Math.abs(myIndex - pawnPlayerIndex) * 13));
                    const playerDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pawnPlayerIndex]) * 13;
                    newCellVal = parseInt(cellVal) + playerDelta;
                    if(newCellVal > 52) {
                        newCellVal = Math.abs(newCellVal - 52);
                    }
                }
            
                let toVal = BoardDimensions.getXY(newCellVal);
                animArr.push(Animated.timing(eval(pawnId), {
                    toValue: toVal,
                    duration: pawnMoveAT,
                    easing: Easing.bounce,
                    useNativeDriver: true
                    
                }));
            }
            
            
            // }

            updatedPositionMap = {...pawnPositions};
            let oldCellVal = updatedPositionMap[pawnId];
            if (updatedPositionMap[pawnId] != undefined){
                if(isNaN(cellVal)){
                    updatedPositionMap[pawnId] = indexMap[rotation][pawnPlayerIndex] + cellVal;
                }else{
                    if (cellVal == "0" || cellVal == "0"){
                        updatedPositionMap[pawnId] = "0"
                    }else{
                        let playerDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pawnPlayerIndex]) * 13;
                        let newCellVal = parseInt(cellVal) + playerDelta;
                        if(newCellVal > 52) {
                            newCellVal = Math.abs(newCellVal - 52);
                        }
                        updatedPositionMap[pawnId] = newCellVal.toString();
                    }
                }
                //console.log("%%%%%%%%%%%%%%%......2222222", updatedPositionMap),
                setPawnPositions(updatedPositionMap);
            }
            // console.log('##############.................', updatedPositionMap[pawnId], oldCellVal, pawnPlayerIndex);

           
            let allAnimArr = [];
            let newAnimArr = createAnimArray(pawnId, updatedPositionMap, pawnPositions, safeCells);

            let newAnimMap = {key:"sameCell", anim:Animated.parallel(newAnimArr)}

            allAnimArr.push({key:"pawnmove", anim:animArr, type: "non-sequence"});
            newAnimArr.length > 0 ? allAnimArr.push(newAnimMap) : false;
            animationsQueue.push(...allAnimArr);
            
            
            startAnimation();
            
        }
        // setTimerPlayerIndex(0);
    }, [cellVal, pawnId, pawnPlayerIndex]);


    useEffect(() => {
        //console.log("in collision...........", collision);
        if (collision != null){

            let cellArray = collision.collisionRange.split(",");
            const pIndex = collision.pawnPlayerIndex;
            const pawnId = collision.pawnId;
            const pID = parseInt(pawnId[1]) - 1;
            const toValInitial = {x:initialPositions[indexMap[rotation][pIndex]][pID][0],
                 y: initialPositions[indexMap[rotation][pIndex]][pID][1]}
            let animArr = [];
            for (let itemInd in cellArray){
                let cellVal = cellArray[itemInd];
                let newCellVal = null;
                
                //const playerDelta = Math.abs((52 - Math.abs(myIndex - pIndex) * 13));
                const playerDelta = Math.abs(indexMap[rotation][myIndex] - indexMap[rotation][pIndex]) * 13;
                newCellVal = parseInt(cellVal) + playerDelta;
                if(newCellVal > 52) {
                    newCellVal = Math.abs(newCellVal - 52);
                }
                let toVal = BoardDimensions.getXY(newCellVal);
                animArr.push(Animated.timing(eval(pawnId), {
                    toValue: toVal,
                    duration: pawnCollisionAT,
                    useNativeDriver: true
                }));
            }
            //console.log('logging intital value ', toValInitial);
            animArr.push(Animated.spring(eval(pawnId), {
                toValue: toValInitial,
                duration: pawnCollisionAT,
                useNativeDriver: true
            }));
            //console.log("in colission to val", toValInitial);
            //console.log('in animation...............', animationsQueue.length, runningAnim);
            animationsQueue.push({key:"collision", anim:Animated.sequence(animArr)});
            startAnimation();
            // setExecuteAnim(prevState => !prevState);
            
            dispatch({type: gameActions.RESET_COLLISION});

            updatedPositionMap = {...pawnPositions};
            if (updatedPositionMap[pawnId] != undefined){
                updatedPositionMap[pawnId] = "0"
                //console.log("%%%%%%%%%%%%%%%......3333333333", updatedPositionMap),
                setPawnPositions(updatedPositionMap);
            }
        }
    }, [collision]);


    useEffect(() => {
        if (quitGame != null) {
            if (quitGame.type == "result"){
                setTimeout(() => {
                    // setTimerPlayerIndex(0);
                    props.navigation.navigate('WinnerScreen');
                }, 200);
                
            }else if(quitGame.type == "set"){
                //const playerId = quitGame.playerId;
                debugger;
                const playerIndex = quitGame.playerIndex;
                const markers = players[playerIndex]["markers"];
                let updatedPawnsMap = {...pawnsMap};
                for (let pID in markers){
                    let key = markers[pID]["key"][0];
                    updatedPawnsMap[`${key}C`] = null;
                }
                playingPlayers[indexMap[rotation][playerIndex] - 1 ] = undefined;
                // playingPlayers[playerIndex] = undefined;
                setPawnsMap(updatedPawnsMap);
            }
            dispatch({type: gameActions.QUIT_GAME});
        }
    }, [quitGame]);

    useEffect(() => {
        if (errorPawnId && errorCellId){
            let animArr = [];
            let newPositions = {...pawnPositions};
            newPositions[errorPawnId] = errorCellId.toString();
            let toVal = null;
            if (errorCellId == 0 || errorCellId == "0"){
                let pID = parseInt(errorPawnId[1]) - 1;
                toVal = {x:initialPositions[indexMap[rotation][currentIndex]][pID][0],
                    y: initialPositions[indexMap[rotation][currentIndex]][pID][1]}
            }else{
                toVal = BoardDimensions.getXY(errorCellId);
            }
            
            setPawnPositions(newPositions);
            animArr.push(Animated.spring(eval(errorPawnId), {
                toValue: toVal,
                duration: 100,
                useNativeDriver: true
            }));


            let allAnimArr = [];
            let newAnimArr = createAnimArray(errorPawnId, newPositions, pawnPositions, safeCells);
            
            let newAnimMap = {key:"sameCell", anim:Animated.parallel(newAnimArr)}

            // animationsQueue.push({key:"errorPawnMove", anim:Animated.sequence(animArr)});
            allAnimArr.push({key:"errorPawnMove", anim:Animated.sequence(animArr)});
            newAnimArr.length > 0 ? allAnimArr.push(newAnimMap) : false;
            animationsQueue.push(...allAnimArr);

            // setExecuteAnim(prevState => !prevState);
            startAnimation();
            dispatch({type: gameActions.RESET_ERROR_PAWN});
            movingPawn = false;

        }
    }, [errorPawnId]);

    // useEffect(() => {
        
        
        
    // }, [isRolling]);

    const range = (start, end) => {
        return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
    }

    // const check_and_update_pawns_size = (movablePawns) => {
    //     console.log("in check and update pawn size", movablePawns);
    //     let animArr = [];
    //     let sizeMap = {};
    //     for (ind in movablePawns){
    //         let key = movablePawns[ind];
    //         sizeVal = pawnsSizeMap[1];
    //         if (eval(key + 'W').x != sizeVal){
    //             animArr.push(Animated.spring(eval(key + 'W'), {
    //                 toValue: {x:sizeVal, y:sizeVal}, 
    //                 // friction: 1,
    //                 // tension:20,
    //                 duration:10,
    //                 useNativeDriver: true
    //             }));
    //             sizeMap[key] = {size: eval(key + 'W').x, cell: pawnPositions[key]}
    //         }
    //     }
    //     if (animArr.length >0 ){
    //         setSameCellSizeMap(sizeMap);
    //         animationsQueue.push({key:"beforeTurn", anim:Animated.parallel(animArr)});
    //         startAnimation();
    //     }
    // }
    const levelEL = 
        <G>
            <Image
                x={elementsMap.levelBox.x}
                y={elementsMap.levelBox.y}
                href={levelBox}
                width={elementsMap.levelBox.width}
                height={elementsMap.levelBox.height}
            />

            <Text 
                fill='white'
                stroke='white'
                fontSize={elementsMap.levelLabel.fontsize}
                x={elementsMap.levelLabel.x}
                y={elementsMap.levelLabel.y}
                textAnchor='middle'
                rotation={elementsMap.levelLabel.rotation}>
                    Level
            </Text>

            <Text 
                fill='white'
                stroke='white'
                fontSize={elementsMap.levelValue.fontsize}
                x={elementsMap.levelValue.x}
                y={elementsMap.levelValue.y}
                textAnchor='middle'>
                    {level}
            </Text>
        </G>

    const coinsEL = 
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
                    {get_chips_value(potAmount)}
            </Text>
        </G>
    // console.log("....................... \n\n\n", rotation);

    const timerEL = 
        <G>
            {playingPlayers[0] ? 
                <SquareTimer
                    stroke={elementsMap.timer[timerIndexMap[rotation][1]]['stroke']}
                    strokeWidth={elementsMap.timer.strokewidth}
                    x={elementsMap.timer[1]['x']}
                    y={elementsMap.timer[1]['y']}
                    width={elementsMap.timer.width}
                    height={elementsMap.timer.height}
                    perimeter={elementsMap.timer.perimeter}
                    seconds={seconds}
                    remTurnTime={remTurnTime}
                    activateTimer={((currentIndex == timerIndexMap[rotation][1]) && isRolling) || 
                        ((currentIndex == timerIndexMap[rotation][1]) && movePawn)}
                    oneStrokeDist={oneStrokeDist}

                />
            : null }
            {playingPlayers[1] ? 
                <SquareTimer
                    stroke={elementsMap.timer[timerIndexMap[rotation][2]]['stroke']}
                    strokeWidth={elementsMap.timer.strokewidth}
                    x={elementsMap.timer[2]['x']}
                    y={elementsMap.timer[2]['y']}
                    width={elementsMap.timer.width}
                    height={elementsMap.timer.height}
                    perimeter={elementsMap.timer.perimeter}
                    seconds={seconds}
                    remTurnTime={remTurnTime}
                    activateTimer={((currentIndex == timerIndexMap[rotation][2]) && isRolling) || 
                        ((currentIndex == timerIndexMap[rotation][2]) && movePawn)}
                    oneStrokeDist={oneStrokeDist}

                />
            : null }
            {playingPlayers[2] ? 
                <SquareTimer
                    stroke={elementsMap.timer[timerIndexMap[rotation][3]]['stroke']}
                    strokeWidth={elementsMap.timer.strokewidth}
                    x={elementsMap.timer[3]['x']}
                    y={elementsMap.timer[3]['y']}
                    width={elementsMap.timer.width}
                    height={elementsMap.timer.height}
                    perimeter={elementsMap.timer.perimeter}
                    seconds={seconds}
                    remTurnTime={remTurnTime}
                    activateTimer={((currentIndex == timerIndexMap[rotation][3]) && isRolling) || 
                        ((currentIndex == timerIndexMap[rotation][3]) && movePawn)}
                    oneStrokeDist={oneStrokeDist}

                />
            : null }
            {playingPlayers[3] ? 
                <SquareTimer
                    stroke={elementsMap.timer[timerIndexMap[rotation][4]]['stroke']}
                    strokeWidth={elementsMap.timer.strokewidth}
                    x={elementsMap.timer[4]['x']}
                    y={elementsMap.timer[4]['y']}
                    width={elementsMap.timer.width}
                    height={elementsMap.timer.height}
                    perimeter={elementsMap.timer.perimeter}
                    seconds={seconds}
                    remTurnTime={remTurnTime}
                    activateTimer={((currentIndex == timerIndexMap[rotation][4]) && isRolling) || 
                        ((currentIndex == timerIndexMap[rotation][4]) && movePawn)}
                    oneStrokeDist={oneStrokeDist}

                />
            : null }
        </G>

    const playersEl = 
        <G>
            {playingPlayers[0] ? 
            <G>
                <Image
                    x={elementsMap.p1.x}
                    y={elementsMap.p1.y}
                    href={userType == "facebook" ? avatarBox : playingPlayers[0].gender == "B" ? boyBox : girlBox}
                    width={elementsMap.p1.width}
                />
                {userType == "facebook" ?
                    <Image
                        x={elementsMap.p1.x}
                        y={elementsMap.p1.y}
                        href={{uri: playingPlayers[0].imageUrl}}
                        width={elementsMap.p1.width}
                    /> 
                :null}
                
                <Text 
                    fill='black'
                    stroke='black'
                    
                    fontSize={elementsMap.p1.fontsize}
                    x={elementsMap.p1.tx}
                    y={elementsMap.p1.ty}
                    textAnchor='middle'>
                        {playingPlayers[0].name}
                </Text> 
            </G>: null}

            {playingPlayers[1] ? 
            <G>
                <Image
                    x={elementsMap.p2.x}
                    y={elementsMap.p2.y}
                    href={userType == "facebook" ? avatarBox : playingPlayers[1].gender == "B" ? boyBox : girlBox}
                    width={elementsMap.p1.width}
                />
                {userType == "facebook" ?
                    <Image
                        x={elementsMap.p1.x}
                        y={elementsMap.p1.y}
                        href={{uri: playingPlayers[1].imageUrl}}
                        width={elementsMap.p1.width}
                    /> 
                :null}
                <Text 
                    fill='black'
                    stroke='black'
                    
                    fontSize={elementsMap.p2.fontsize}
                    x={elementsMap.p2.tx}
                    y={elementsMap.p2.ty}
                    textAnchor='middle'>
                        {playingPlayers[1].name}
                </Text> 
            </G>: null}


            {playingPlayers[2] ? 
            <G>
                <Image
                    x={elementsMap.p3.x}
                    y={elementsMap.p3.y}
                    href={userType == "facebook" ? avatarBox : playingPlayers[2].gender == "B" ? boyBox : girlBox}
                    width={elementsMap.p1.width}
                />
                {userType == "facebook" ?
                    <Image
                        x={elementsMap.p1.x}
                        y={elementsMap.p1.y}
                        href={{uri: playingPlayers[2].imageUrl}}
                        width={elementsMap.p1.width}
                    /> 
                :null}

                <Text 
                    fill='black'
                    stroke='black'
                    
                    fontSize={elementsMap.p3.fontsize}
                    x={elementsMap.p3.tx}
                    y={elementsMap.p3.ty}
                    textAnchor='middle'>
                        {playingPlayers[2].name}
                </Text> 
            </G>: null}

            {playingPlayers[3] ? 
            <G>
                <Image
                    x={elementsMap.p4.x}
                    y={elementsMap.p4.y}
                    href={userType == "facebook" ? avatarBox : playingPlayers[3].gender == "B" ? boyBox : girlBox}
                    width={elementsMap.p4.width}
                />

                {userType == "facebook" ?
                    <Image
                        x={elementsMap.p1.x}
                        y={elementsMap.p1.y}
                        href={{uri: playingPlayers[3].imageUrl}}
                        width={elementsMap.p1.width}
                    /> 
                :null}

                <Text 
                    fill='black'
                    stroke='black'
                    
                    fontSize={elementsMap.p4.fontsize}
                    x={elementsMap.p4.tx}
                    y={elementsMap.p4.ty}
                    textAnchor='middle'>
                        {playingPlayers[3].name}
                </Text> 
            </G>: null}
        </G>
    
    const boardEl = 
        <G x={elementsMap.board.x} y={elementsMap.board.y} 
            originX={elementsMap.board.originX} 
            originY={elementsMap.board.originY} 
            rotation={rotation}  >
            <Image
                href = {backgroundIMG} 
                width={boardDimension}
                height={boardDimension}
            />
                
        </G>


    
    const rollEl = 
         <DiceIm
            x={elementsMap.dice.x}
            y={elementsMap.dice.y}
            width={elementsMap.dice.width}
            height={elementsMap.dice.height}
            originX={elementsMap.dice.x + 35}
            originY={elementsMap.dice.y + 35}
            href={currentDiceFace}
            diceRolled={diceRolled}
            onClick = {() => {
                if(isRolling && currentPlayerId === myPlayerId){
                    

                    const id = XMPP.get_random_id(NS_PLAYER_DICE_ROLL);
                    const packet = xml(
                        "iq",
                        {id: id, to: gameId, type: "set"},
                        xml("query", {xmlns: NS_PLAYER_DICE_ROLL},
                        )
                    );
                    XMPP.sendStanza(packet); 
                    setDiceRolled(true);
                }
            }}
        />

    const arrowEl = 
        (isRolling && currentPlayerId === myPlayerId) ?
            <Image
                x={elementsMap.turnArrow.x}
                y={elementsMap.turnArrow.y}
                width={elementsMap.turnArrow.width}
                height={elementsMap.turnArrow.height}
                href={arrowUp}
            /> : null

    const quitIconEl = 
        <G >
            <Image
                x={elementsMap.quitIcon.x}
                y={elementsMap.quitIcon.y}
                href={closeIcon}
                width={elementsMap.quitIcon.width}
                height={elementsMap.quitIcon.height}
                onPressOut = {() => {
                    setQuitModal(true);

                }}
            />

        </G>

    const quitModalEl = 
        <ForeignObject>
            <BasicModal
                cancelFunc={() => setQuitModal(false)}
                visible={quitModal}
                text={"Do you want to quit?"}
                okayText="Yes"
                cancelText="No"
                okayFunc={() => {
                    const id = XMPP.get_random_id(NS_QUIT_GAME);
                    const packet = xml(
                        "iq",
                        {id: id, to: gameId, type: "set"},
                        xml("query", {xmlns: NS_QUIT_GAME}
                        )
                    );
                    XMPP.sendStanza(packet);
                }}
            />
        </ForeignObject>

    const soundEl = 
        <Image
            x={elementsMap.soundImage.x}
            y={elementsMap.soundImage.y}
            href={soundStatus ? soundOn : soundOff}
            width={elementsMap.soundImage.width}
            height={elementsMap.soundImage.height}
            onPressOut={async () => {
                //console.log("#####$$$$$$$$$$$$$$", soundStatus)
                try{
                    if (soundStatus == true){
                        await biteSound.setVolumeAsync(0);
                        await tapSound.setVolumeAsync(0);
                        AsyncStorage.setItem(
                            'soundData', 
                            JSON.stringify({
                                soundOn: false,
                            })
                        )
                        setSoundStatus(false);
                    }else{
                        await biteSound.setVolumeAsync(1);
                        await tapSound.setVolumeAsync(1);
                        AsyncStorage.setItem(
                            'soundData', 
                            JSON.stringify({
                                soundOn: true,
                            })
                        )
                        setSoundStatus(true);
                    }
                }catch(err){
                    console.log("#####$$$$$$$$$$$$$$11111", err)
                }
            }}
        />

    return (
        <View style={styles.container}>
            
                <Svg width={Device.screenWidth} height={Device.screenHeight} viewBox={elementsMap.viewBox}>
                  
                    {levelEL}

                    {coinsEL}
                    
                    {timerEL}
                    
                    {playersEl}
                    
                    {boardEl}

                    {rollEl}
                    {quitIconEl}
                    {arrowEl}
                    {soundEl}
                    

                    {quitModal ? quitModalEl : null}
                    
                    <G x={elementsMap.pawns.x} y={elementsMap.pawns.y} 
                        originX={elementsMap.pawns.originX} 
                        originY={elementsMap.pawns.originY}>
                        {pawnsMap['y1C'] ? pawnsMap['y1C'] : null}
                        {pawnsMap['y2C'] ? pawnsMap['y2C'] : null}
                        {pawnsMap['y3C'] ? pawnsMap['y3C'] : null}
                        {pawnsMap['y4C'] ? pawnsMap['y4C'] : null}
                        {pawnsMap['r1C'] ? pawnsMap['r1C'] : null}
                        {pawnsMap['r2C'] ? pawnsMap['r2C'] : null}
                        {pawnsMap['r3C'] ? pawnsMap['r3C'] : null}
                        {pawnsMap['r4C'] ? pawnsMap['r4C'] : null}  
                        {pawnsMap['g1C'] ? pawnsMap['g1C'] : null}
                        {pawnsMap['g2C'] ? pawnsMap['g2C'] : null}
                        {pawnsMap['g3C'] ? pawnsMap['g3C'] : null}
                        {pawnsMap['g4C'] ? pawnsMap['g4C'] : null}
                        {pawnsMap['b1C'] ? pawnsMap['b1C'] : null}
                        {pawnsMap['b2C'] ? pawnsMap['b2C'] : null}
                        {pawnsMap['b3C'] ? pawnsMap['b3C'] : null}
                        {pawnsMap['b4C'] ? pawnsMap['b4C'] : null}
                    </G>
                    
                   
                </Svg> 
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    
      backgroundColor: '#38bfed',
    },
    
    pawn: {
        width:"100%",
        height:"100%"
    },
    dice:{
        justifyContent: 'center',
        alignItems: 'center'
    }
    
  });

export default SvgComponent;