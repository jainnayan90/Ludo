import Device from './Device';


// export const boardDimension = Device.screenWidth * 0.8;
// export const topBottomHeight = (Device.screenHeight - boardDimension) * 0.5;

// export const marginGame = (Device.screenWidth  - boardDimension)/2;

// export const blockDimension = (boardDimension/16);
// export const pawnWidth = blockDimension * 1.1;
// export const pawnHeight = (pawnWidth / 95)  * 128;



const isTab = Device.isTab;//(Device.screenWidth /  Device.screenHeight) > 0.6;

export const  boardDimension = isTab ? 600 : 350;
const blockWidth = boardDimension/15;
const startClassicX = isTab ? 234 : 137;
const startClassicY = isTab ? 499 : 292; 



export const pawnsSizeMap = {
    1:isTab ? 50 : 29,
    2:isTab ? 40 : 21,
    // 3:isTab ? 30 : 18,
    // 4:isTab ? 20 : 13
}


export const initialPositions = {
    1:{
        0:isTab ? [45, 420, 50] : [25, 245, 29],
        1:isTab ? [45, 485, 50] : [25, 283, 29],
        2:isTab ? [115, 420, 50] : [67, 245, 29],
        3:isTab ? [115, 485, 50] : [67, 283, 29]
    },
    2:{
        0:isTab ? [48, 30, 50] : [28, 18, 29],
        1:isTab ? [48, 100, 50] :[28, 58, 29],
        2:isTab ? [115, 30, 50] : [67, 18, 29],
        3:isTab ? [115, 100, 50] : [67, 58, 29],
    },
    3:{
        0:isTab ? [435, 35, 50] : [253, 22, 29],
        1:isTab ? [435, 100, 50] : [253, 58, 29],
        2:isTab ? [505, 35, 50] : [293, 22, 29],
        3:isTab ? [505, 100, 50] : [293, 58, 29],
    },
    4:{    
        0:isTab ? [432, 423, 50] : [253, 247, 29],
        1:isTab ? [432, 488, 50] : [253, 285, 29],
        2:isTab ? [500, 423, 50] : [290, 247, 29],
        3:isTab ? [500, 488, 50] : [290, 285, 29],
    }
};
export const boardMap = {
    1:[0, 0],
    2:[0, 1],
    3:[0, 2],
    4:[0, 3],
    5:[0, 4],
    6:[-1, 5],
    7:[-2, 5],
    8:[-3, 5],
    9:[-4, 5],
    10:[-5, 5],
    11:[-6, 5],
    12:[-6, 6],
    13:[-6, 7],
    14:[-5, 7],
    15:[-4, 7],
    16:[-3, 7],
    17:[-2, 7],
    18:[-1, 7],
    19:[0, 8],
    20:[0, 9],
    21:[0, 10],
    22:[0, 11],
    23:[0, 12],
    24:[0, 13],
    25:[1, 13],
    26:[2, 13],
    27:[2, 12],
    28:[2, 11],
    29:[2, 10],
    30:[2, 9],
    31:[2, 8],
    32:[3, 7],
    33:[4, 7],
    34:[5, 7],
    35:[6, 7],
    36:[7, 7],
    37:[8, 7],
    38:[8, 6],
    39:[8, 5],
    40:[7, 5],
    41:[6, 5],
    42:[5, 5],
    43:[4, 5],
    44:[3, 5],
    45:[2, 4],
    46:[2, 3],
    47:[2, 2],
    48:[2, 1],
    49:[2, 0],
    50:[2, -1],
    51:[1, -1],
    52:[0, -1],
    '1h1':[1, 0],
    '1h2':[1, 1],
    '1h3':[1, 2],
    '1h4':[1, 3],
    '1h5':[1, 4],
    '1h6':[1, 5],
    '2h1':[-5, 6],
    '2h2':[-4, 6],
    '2h3':[-3, 6],
    '2h4':[-2, 6],
    '2h5':[-1, 6],
    '2h6':[0, 6],
    '3h1':[1, 12],
    '3h2':[1, 11],
    '3h3':[1, 10],
    '3h4':[1, 9],
    '3h5':[1, 8],
    '3h6':[1, 7],
    '4h1':[7, 6],
    '4h2':[6, 6],
    '4h3':[5, 6],
    '4h4':[4, 6],
    '4h5':[3, 6],
    '4h6':[2, 6],
}

export const elementsMap = {
    viewBox: isTab ? "0 0 834 1112" : "0 0 375 812",
    timer:{
        width:isTab ? 190 : 112, 
        height:isTab ? 124 : 72, 
        perimeter:isTab ? 628 : 368, 
        strokewidth: isTab ? 10 : 6,
        1: isTab ? {x:125, y:870, stroke:'#f05465'} : {x:16, y:600, stroke:'#f05465'},
        2: isTab ? {x:125, y:120, stroke:'#159c5d'} : {x:16, y:140, stroke:'#159c5d'},
        3: isTab ? {x:520, y:120, stroke:'#faef2c'} : {x:248.5, y:140, stroke:'#faef2c'},
        4: isTab ? {x:520, y:870, stroke:'#2481ca'} : {x:248.5, y:600, stroke:'#2481ca'}
    },
    levelBox:isTab ? {x:130, y:10, width:200, height:80} : {x:20, y:30, width:125, height:100},
    levelLabel:isTab ? {x:180, y:80, fontsize:30, rotation:-4 } : {x:50, y:95, fontsize:16, rotation:-4},
    levelValue:isTab ? {x:285, y:65, fontsize:50} : {x:115, y:85, fontsize:20},
    coinsBox:isTab ? {x:500, y:10, width:250, height:90} : {x:244.5, y:30, width:125, height:100},
    coinsValue:isTab ? {x:590, y:65, fontsize:30} : {x:280, y:90, fontsize:18},
    p1:isTab ? {x:135, y:865, width:170, tx:220, ty:974, fontsize:25} : {x:22.5, y:570, width:100, tx:72, ty:662, fontsize:15},
    p2:isTab ? {x:135, y:115, width:170, tx:220, ty:225, fontsize:25} : {x:22.5, y:110, width:100, tx:72, ty:202, fontsize:15},
    p3:isTab ? {x:530, y:115, width:170, tx:610, ty:225, fontsize:25} : {x:254.5, y:110, width:100, tx:305, ty:202, fontsize:15},
    p4:isTab ? {x:530, y:865, width:170, tx:610, ty:974, fontsize:25} : {x:254.5, y:570, width:100, tx:305, ty:662, fontsize:15},
    board:isTab ? {x:117, y:256, originX:300, originY:300} : {x:12.5, y:231, originX:175, originY:175},
    pawns:isTab ? {x:117, y:256, originX:300, originY:300} : {x:12.5, y:231, originX:175, originY:175},
    dice:isTab ? {x: 358, y:865, width:120, height:120} : {x: 153, y:600, width:70, height:70},
    confeti:isTab ? {x:50, y:100, width:700, height: 700} : {x:30, y:100, width:320, height: 380},
    resultLabel:isTab ? {x:120, y:400, width:600, height: 600, fontsize:90, lx:420, ly:700, strokeWidth:9} : 
        {x:30, y:340, width:320, height: 320, fontsize:60, lx:175, ly:540, strokeWidth:6},
    resultAvatar:isTab ? {x:250, y:300, width:300, height: 300} : {x:70, y:150, width:240, height: 380},
    resultcoin:isTab ? {x:300, y:750, width:250, height: 300} : {x:100, y:550, width:170, height: 200},
    quitIcon:isTab? {x:500, y:1005, width:95, height: 95} : {x:210, y:690, width:75, height: 70},
    chipsText:isTab? {x:430, y:925, fontsize:70, strokeWidth:6} : {x:190, y:660, fontsize:45, strokeWidth:2},
    pawndiffX: isTab ? 5 : 7,
    pawndiffY: isTab ? 10 : 6,
    midvaldiffX: isTab ? 6 : 4,
    turnArrow:isTab ? {x:500, y:1005, width:95, height: 95} : {x:152, y:680, width:70, height:70},
    soundImage: isTab ? {x:90, y:980, width:60, height:60} : {x:30, y:700, width:45, height:45},
}
export const indexMap = {
    '0': {1:1, 2:2, 3:3, 4:4},
    '-90': {1:4, 2:1, 3:2, 4:3},
    '-180':{1:3, 2:4, 3:1, 4:2},
    '-270':{1:2, 2:3, 3:4, 4:1}
}

export const timerIndexMap = {
    '0': {1:1, 2:2, 3:3, 4:4},
    '-90': {1:2, 2:3, 3:4, 4:1},
    '-180':{1:3, 2:4, 3:1, 4:2},
    '-270':{1:4, 2:1, 3:2, 4:3}
}

export const getXY = (block) => {
    //console.log('printing block**********  ', block);
    let XY = boardMap[block];
    return {x:startClassicX + (XY[0] * blockWidth),  y:startClassicY + (-1 * XY[1] * blockWidth)}
}