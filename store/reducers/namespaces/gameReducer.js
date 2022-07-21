import * as nameSpaces from '../../../constants/NameSpaces';
import Player from '../../../models/Player';
import * as gameActions from '../../actions/gameactions';
import { XMPP } from '../../../screens/StartupScreen';

const initialState = {
    //colorCode:null,
    currentIndex:null,
    gameInfoReceived: false,
    level: null,
    gameId: null,
    turnTime: null,
    gameStartTime: null,
    players: {},
    winner:null,
    winnerId:null,
    winChips:0,
    quitGame: null,
    rotation:0,
    gender: 'B',
    //gameState: 'initialise',
    changeMarker:'r1',
    //initialiseBoard: true,
    myPlayerId : null,
    isRolling: false,
    movePawn: false,
    diceVal: 3,
    cellVal: null,
    pawnId: null,
    pawnPlayerIndex: null,
    currentPlayerId:null,
    myIndex: null,
    collision: null,
    cellRange: null,
    pawnCollisionAT: 50,
    pawnMoveAT: 300,
    remTurnTime:0,
    potAmount:0,
    // sameCellArr:null,
    // sameCellVal:null,
    // sameCellIndex:null,
    errorPawnId: null,
    errorCellId:null,
    safeCells:{},
    movablePawns:[]
    
};



export default (state=initialState , action) => {
    let query = null;
    let movePawn = false;
    let movablePawns = state.movablePawns;
    switch(action.type){
        // case 'BOARD_INITIALISATION':
        //     return {
        //         ...state,
        //         initialiseBoard: false                
        //     }

        // case 'INCR_R1':
        //     let key = action.key;
        //     let toVal=null;
        //     if (state.markers[key] === 'initialise'){
        //         toVal=1;
        //     }else{
        //         toVal = state.markers[key] + 3
        //     }
        //     console.log('..... in update marker', key, toVal)
        //     return {
        //         ...state,
        //         gameState:'play',
        //         changeMarker: key,
        //         markers:{
        //             ...state.markers,
        //             [key]:toVal,
        //         }
        //     }
        case nameSpaces.NS_GAME_INFO:
            
            query = action.stanza.iq.query[0];
            let rotation = 0;
            let myIndex = null;
            let safeCells = query.safe_cells[0].safe_cell;
            const myPlayerId = XMPP.fullJID();
            const playersArr =  query.players[0].player.map(player => {

                let mPlayer = new Player(player);
                if (mPlayer.id === myPlayerId){
                    rotation =  (1 - mPlayer.index ) * 90;
                    myIndex = mPlayer.index;
                }
                return  mPlayer
            });

            const players = {};

            for (let playerI in playersArr){

                let playerM = playersArr[playerI];
                players[playerM.index] = playerM;
            }
            
            let safeCellMap = {}
            safeCells.map((cell) => safeCellMap[cell] = true);
            return {
                ...state,
                rotation: rotation,
                gameInfoReceived: true,
                myIndex: myIndex,
                level: parseInt(query.level[0]),
                gameId: query.game_id[0],
                turnTime: parseInt(query.turn_time[0])/1000,
                gameStartTime: parseInt(query.game_start_time[0])/1000,
                players: players,
                //markers: markers,
                myPlayerId:myPlayerId,
                currentIndex: parseInt(query.turn_player_index[0]),
                //pawnPlayerIndex: parseInt(query.turn_player_index[0]),
                currentPlayerId: query.turn_player_id[0],
                isRolling: Boolean(query.is_rolling[0]),
                movePawn:Boolean(query.move_pawn[0]),
                pawnCollisionAT:parseInt(query.pawn_cat[0]),
                pawnMoveAT:parseInt(query.pawn_mat[0]),
                remTurnTime:parseInt(query.rem_turn_time[0])/1000,
                potAmount:parseInt(query.pot_amount[0]),
                safeCells: safeCellMap
                // currentPlayerId:
                
            };
        case nameSpaces.NS_GAME_PLAYERTURN:
            //console.log("in player turn............", );
            query = action.stanza.iq.query[0];
            return{
                ...state,
                currentPlayerId: query.turn_player_id[0],
                turnTime: parseInt(query.turn_time[0])/1000,
                currentIndex: query.turn_player_index[0],
                isRolling: true,
                movePawn: false,
                remTurnTime: parseInt(query.turn_time[0])/1000,
                //marker: query.marker[0]
            };
        
        case nameSpaces.NS_PLAYER_DICE_ROLL:
            
            let diceVal = state.diceVal;
            let isRolling = state.isRolling;
            
            movePawn = state.movePawn;
            //console.log('**************** in dice roll   ', action.stanza.iq);
            if (action.stanza.iq["$"]["type"] === "error" ){
                //console.log("in dice roll error  response error..........", query);
            }else if (action.stanza.iq["$"]["type"] !== "result" ){
                query = action.stanza.iq.query[0];
                diceVal = parseInt(query.dice_val[0]);  
                isRolling=false;
                movePawn=true;
                movablePawns = query.movable_pawns ? query.movable_pawns[0].split(",") : state.movablePawns;  
            }
            //console.log('$$$$$$$$$$$$$$$...........', movablePawns);
            return {
                ...state,
                isRolling: isRolling,
                diceVal: diceVal,
                movePawn:movePawn,
                movablePawns:movablePawns
            };
            // return state;

        case nameSpaces.NS_PLAYER_PAWN_MOVE:  
            let cellVal = state.cellVall;
            let pawnId = state.pawnId;
            let pawnPlayerIndex = state.pawnPlayerIndex;
            let cellRange = state.cellRange;
            let errorPawnId = state.errorPawnId;
            let errorCellId= state.errorCellId
            movePawn = state.movePawn
            if (action.stanza.iq["$"]["type"] === "error" ){
                // console.log("in pawn move  response error..........", action.stanza.iq.query[0]);
                query = action.stanza.iq.query[0];
                errorPawnId = query.pawn_id[0];
                errorCellId = query.cell_id[0];
                // cellVal = isNaN(query.cell_val[0]) ? query.cell_val[0] : parseInt(query.cell_val[0]);
                // pawnId = query.pawn_id[0];
                // pawnPlayerIndex = query.player_index[0];
                // cellRange = query.cell_range[0];
            }else if (action.stanza.iq["$"]["type"] === "result" ){
                //console.log("in pawn move  response result..........", query);
                movePawn = false;
            }else if (action.stanza.iq["$"]["type"] !== "result" ){
                query = action.stanza.iq.query[0];
                cellVal = isNaN(query.cell_val[0]) ? query.cell_val[0] : parseInt(query.cell_val[0]);
                pawnId = query.pawn_id[0];
                pawnPlayerIndex = query.player_index[0];
                cellRange = query.cell_range[0];
                movePawn=false;
            }
            
            return {
                ...state,
                cellVal: cellVal,
                pawnId: pawnId,
                pawnPlayerIndex: pawnPlayerIndex,
                cellRange:cellRange,
                errorPawnId: errorPawnId,
                errorCellId: errorCellId,
                movePawn:movePawn
                
            };
        case nameSpaces.NS_GAME_RESULT:
            
            query = action.stanza.iq.query[0];
            //console.log('\n\n\n\n\n', 'in game result   ', query);
            return {
                ...state,
                winner:true,
                winnerId:query.winner_player_id[0],
                winChips:parseInt(query.win_chips[0]),
                //winnerCombo: query.winner_combo[0],
                currentPlayerId: 'res'
            }

        case nameSpaces.NS_PLAYER_COLLISION:
            query = action.stanza.iq.query[0];
            return {
                ...state,
                collision: {
                    cellVal: parseInt(query.cell_id[0]),
                    pawnId: query.pawn_id[0],

                    pawnPlayerIndex: parseInt(query.player_index[0]),
                    pawnPlayerId: parseInt(query.player_id[0]),
                    collisionRange:query.collision_range[0]
                }
            }

        // case nameSpaces.NS_PLAYER_SAME_CELL:
        //     query = action.stanza.iq.query[0];
        //     //console.log('@@@@@@@@@@@@@@@@@@@@@@        ', query);
        //     return {
        //         ...state,
        //         sameCellArr:query.pawn_id,
        //         sameCellVal: isNaN(query.cell_id[0]) ? query.cell_id[0] : parseInt(query.cell_id[0]),
        //         sameCellIndex: parseInt(query.player_index[0]),
        //     };

        // case gameActions.RESET_SAMECELL_ARR:
        //     return {
        //         ...state,
        //         sameCellArr: null
        //     }
        
        case gameActions.RESET_COLLISION:
            return {
                ...state,
                collision: null
            }

        case gameActions.RESET_ERROR_PAWN:
            return {
                ...state,
                errorPawnId: null,
                errorCellId: null
            }
            
        case gameActions.RESET_GAME_SCREEN:
            return initialState;

        case nameSpaces.NS_QUIT_GAME:
            query = action.stanza.iq.query[0];
            let currentIndex = state.currentIndex;
            let quitGame = false;
            if (action.stanza.iq["$"]["type"] === "result" ){
                currentIndex = null;
                quitGame = {
                    type:"result"
                };
            }else if (action.stanza.iq["$"]["type"] === "error" ){
                quitGame = false;
            }else if (action.stanza.iq["$"]["type"] === "set" ){
                quitGame = {
                    type:"set",
                    playerId: query.player_id[0],
                    playerIndex:parseInt(query.player_index[0])
                }
            }
            return {
                ...state,
                quitGame:quitGame,
                currentIndex:currentIndex
            };
        case gameActions.QUIT_GAME:
            return {
                ...state,
                quitGame: null
            }

    };
    return state;
};
