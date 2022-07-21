import {AsyncStorage} from 'react-native';
import HttpRequest from '../../HttpRequests';

export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const UPDATE_AVATAR = 'UPDATE_AVATAR';
export const LOGOUT = 'LOGOUT';
export const CLEAR_FORCE_LOGOUT = 'CLEAR_FORCE_LOGOUT';


export const authenticate = (userId, authToken, avatar, userType) => {
    return {type: AUTHENTICATE, userId: userId, authToken: authToken, avatar:avatar, userType:userType};
}

export const logout =  () => {
    
    AsyncStorage.removeItem('authData');
    AsyncStorage.removeItem('soundData');
    return {type: LOGOUT}
}

export const forceLogout = () => {
    return async dispatch => 
    {
        //console.log("in force logout.........")
        await AsyncStorage.removeItem('authData');
        dispatch({type: LOGOUT, force:true})
    }
    
}

export const login = (username, password, avatar, name) => {
    //console.log('****', username, password, avatar, name)
    return async dispatch  => {
        try{
            const resData = await HttpRequest.post(
                        '/auth/signin', 
                        JSON.stringify({
                            username,
                            password,
                            name,
                            avatar
                        })
                    );
            //console.log('auth data *************** ', resData);
            if (resData.success){
                HttpRequest.authToken = resData.authToken;
                dispatch({
                    type: AUTHENTICATE, 
                    authToken:resData.authToken, 
                    userId: resData.userId, 
                    avatar:avatar,
                    userType: "guest"
                });
                saveDataToStorage(resData.authToken, resData.userId, avatar, 'guest');
            }else{
                throw resData.error
            }
        }catch (err){
            throw err; 
        }
    };
};


export const facebookLogin = (username, token, avatar, name) => {
    return async dispatch  => {
        try{
            let gender = "B";
            console.log('avatar ***********', avatar);
            avatar = escape(avatar);
            console.log('avatar *********222222222**', avatar);

            const resData = await HttpRequest.post(
                        '/auth/facebook_signin', 
                        JSON.stringify({
                            username:username,
                            token:token,
                            name:name,
                            gender:gender,
                            avatar:avatar
                        })
                    );
            HttpRequest.authToken = token;
            if (resData.success){
                dispatch({
                    type: AUTHENTICATE, 
                    authToken:token, 
                    userId: username, 
                    avatar: "B",
                    facebookImage: avatar,
                    userType: "facebook"
                });
                saveDataToStorage(token, username, avatar, "facebook");
            }else{
                throw resData.error; 
            }
        }catch (err){
            throw err; 
        }
    };
};

export const updateUserData = (newData) => {
    return async dispatch  => {
        try{
            dispatch({
                type: UPDATE_AVATAR, 
                avatar: newData.avatar,
            });
            AsyncStorage.setItem(
                'authData', 
                JSON.stringify(newData)
            )
            
        }catch (err){
            throw err; 
        }
    };
};

const saveDataToStorage = (authToken, userId, avatar, userType) => {
    AsyncStorage.setItem(
        'authData', 
        JSON.stringify({
            authToken: authToken,
            userId: userId,
            avatar:"B",
            facebookImage:avatar,
            userType: userType
        })
    )
};
