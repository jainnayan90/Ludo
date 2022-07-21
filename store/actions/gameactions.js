export const WAITFORRESPONSE = 'WAITFORRESPONSE';
export const RESPONSERECEIVED = 'RESPONSERECEIVED';
export const RESET_GAME_SCREEN = 'RESET_GAME_SCREEN';
export const RESET_COLLISION = 'RESET_COLLISION';
export const RESET_SAMECELL_ARR = 'RESET_SAMECELL_ARR';
export const QUIT_GAME = 'QUIT_GAME';
export const RESET_ERROR_PAWN = 'RESET_ERROR_PAWN';

export const waitForResponse = (namespace, pid) => {
    return {type: WAITFORRESPONSE, namespace:namespace, pid:pid};
}

export const responseReceived = (namespace, pid) => {
    return {type: RESPONSERECEIVED, namespace:namespace, pid};
}

export const resetGameScreen = () => {
    return {type: RESET_GAME_SCREEN};
}