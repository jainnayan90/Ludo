import { 
    AUTHENTICATE, 
    LOGOUT, 
    CLEAR_FORCE_LOGOUT, 
    UPDATE_AVATAR
} from "../actions/auth";

const initialState = {
    authToken: null,
    userId: null,
    avatar:"B",
    userType:null,
    forceLogout:false,
    facebookImage:null
}


export default (state=initialState , action) => {
     switch(action.type){
        case  AUTHENTICATE:
            return {
                authToken: action.authToken,
                userId: action.userId,
                avatar:action.avatar,
                userType: action.userType,
                facebookImage: action.facebookImage
            };
        case LOGOUT:
            //console.log("in  logout clearing state.........")
            return {
                ...initialState,
                forceLogout: action.force,
            };
        case CLEAR_FORCE_LOGOUT:
            //console.log("in  logout clearing state.........")
            return {
                ...state,
                forceLogout: false,
            };
        case UPDATE_AVATAR:
            return{
                ...state,
                avatar: action.avatar
            }
     }
     return state;
};