import Device from './Device';


const isTab = Device.isTab;


//isTab ? {x:, y:, width:, height:} : {x:, y:, width:, height:},

export const elementsMap = {
    viewBox: isTab ? "0 0 834 1112" : "0 0 375 812",
    logo: isTab ? {x:90, y:190, width:650, height:400} : {x:30, y:110, width:300, height:250},
    facebook: isTab ? {x:180, y:650, width: 450, height: 122} : {x:70, y:410, width: 220, height: 60},
    guest: isTab ? {x:180, y:765, width: 450, height: 122} : {x:70, y:475, width: 220, height: 60},
    guestText:isTab ? {x:390, y:835, fontsize:40} : {x:175, y:510, fontsize:22},
    
}