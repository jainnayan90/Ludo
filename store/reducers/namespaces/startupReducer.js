import * as nameSpaces from '../../../constants/NameSpaces';
import { AsyncStorage } from 'react-native';

const initialState = {
    activeGameId: null,
    fetchedActiveGame: false,
    playerInfo: {},
    playerInfoReceived: false,
};

export default (state=initialState , action) => {
    let queryObj = null;
    let playerInfo = null;
    switch(action.type){
        case nameSpaces.NS_ACTIVEGAME:
            const activeGame = action.stanza.iq.query[0].game_id[0];
            return {
                ...state,
                activeGameId: activeGame,
                fetchedActiveGame: true,
                playerInfo: { ...state.playerInfo }
            };
        
        case nameSpaces.NS_PLAYERINFO:
            queryObj = action.stanza.iq.query[0];
            console.log("***********     ", queryObj);
            playerInfo = {
                user_id: queryObj.user_id[0],
                chips: queryObj.chips[0],
                image_url: queryObj.image_url[0],
                name: queryObj.name[0].substring(0, 10),
                level: queryObj.level[0]
            }
            return {
                ...state,
                playerInfo: playerInfo,
                playerInfoReceived: true
            };
        case nameSpaces.NS_UPDATE_CHIPS:
            queryObj = action.stanza.iq.query[0];
            //console.log('***********       ', queryObj);

            playerInfo = {...state.playerInfo};
            playerInfo.chips = queryObj.chips[0];
            playerInfo.level = queryObj.level[0];
            return {
                ...state,
                playerInfo: playerInfo,
                playerInfoReceived: true
            };
        case nameSpaces.NS_DEVICE_TOKEN:
            if (action.stanza.iq["$"]["type"] === "result" ){
                AsyncStorage.setItem('pushInfoUpdated', 'updated');
            };
            return state;

        case 'RESET_STARTUP_SCREEN':
            return initialState;
    };
    return state;
};
