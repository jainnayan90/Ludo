import * as nameSpaces from '../../../constants/NameSpaces';

const initialState = {
    sentPlayRequest: false,
    playRequestResponse: false
};

export default (state=initialState , action) => {
    switch(action.type){
        case nameSpaces.NS_PLAY_ONLINE:
            if (action.iq_type === "get"){
                return {
                    ...state,
                    sentPlayRequest: true
                };
            }else if(action.stanza.iq["$"]["type"] === "result"){
                return {
                    ...state,
                    playRequestResponse: true
                };
            }
        case nameSpaces.NS_JOIN_ACTIVE_GAME:
            if (action.iq_type === "get"){
                return {
                    ...state,
                    sentPlayRequest: true
                };
            }else if(action.stanza.iq["$"]["type"] === "result"){
                return {
                    ...state,
                    playRequestResponse: true
                };
            }
        case 'RESET_MAIN_SCREEN':
            return {
                ...state,
                sentPlayRequest: false,
                playRequestResponse: false
            }
    };
    return state;
};
