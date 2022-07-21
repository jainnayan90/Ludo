const deltaMap = {
    1: {1: 0, 2: 13, 3: 26, 4: 39},
    2: {2: 0, 3: 13, 4: 26, 1: 39},
    3: {3: 0, 4: 13, 1: 26, 2: 39},
    4: {4: 0, 1: 13, 2: 26, 3: 39}
}

class Player {

    constructor(player){
        this.chips = parseInt(player.chips[0]);
        this.id = player.id[0];
        this.imageUrl = player.imageUrl[0];
        this.level = parseInt(player.level[0]);
        this.name = player.name[0].substr(0, 8);
        this.turn = false;
        this.index = isNaN(player.index[0]) ? player.index[0] : parseInt(player.index[0]);
        this.markers = player.markers[0].marker;
        this.gender = player.gender[0];
    }
};

export default Player;