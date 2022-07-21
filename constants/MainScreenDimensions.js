import Device from './Device';


const isTab = Device.isTab;


//isTab ? {x:, y:, width:, height:} : {x:, y:, width:, height:},

export const elementsMap = {
    viewBox: isTab ? "0 0 834 1112" : "0 0 375 812",
    coinsBox: isTab ? {x:600, y:50, width:210, height:200} : {x:240, y:50, width:120, height:120},
    coinsValue: isTab ? {x:660, y:165, fontsize:35} : {x:275, y:120, fontsize:20},
    profileImageB: isTab ? {x:40, y:110, width:100, height:100, borderRadius:15} : 
                        {x:20, y:85, width:60, height:60, borderRadius:10},
    profileImageG: isTab ? {x:40, y:110, width:100, height:100, borderRadius:15} : 
    {x:5, y:75, width:75, height:75, borderRadius:10},
    logout: isTab ? {x:710, y:980, width:80, height:80} : {x:300, y:700, width:45, height:45},
    nameLabel: isTab ? {x:160, y:160, fontsize:45, strokeWidth:3} : {x:90, y:110, fontsize:25, strokeWidth:2},
    levelLabel: isTab ? {x:160, y:190, fontsize:25, strokeWidth:1} : {x:95, y:130, fontsize:15, strokeWidth:1},
    logo: isTab ? {x:90, y:220, width:650, height:400} : {x:30, y:150, width:300, height:250},
    twoPlayers: isTab ? {x:130, y:630, width:250, height:250} : {x:40, y:400, width:140, height:140},
    threePlayers: isTab ? {x:450, y:630, width:250, height:250} : {x: 190, y:400, width:140, height:140},
    soundImage: isTab ? {x:90, y:980, width:60, height:60} : {x:30, y:700, width:45, height:45},
    userAvatarB: isTab ? {x:350, y:980, width:60, height:60} : {x:155, y:693, width:60, height:60},
    userAvatarG: isTab ? {x:350, y:980, width:60, height:60} : {x:150, y:685, width:75, height:75},
}