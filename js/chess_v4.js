class Master{
    constructor() {
        this.color = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,1,2,1,2,1,2,1,2,0],
            [0,2,1,2,1,2,1,2,1,0],
            [0,1,2,1,2,1,2,1,2,0],
            [0,2,1,2,1,2,1,2,1,0],
            [0,1,2,1,2,1,2,1,2,0],
            [0,2,1,2,1,2,1,2,1,0],
            [0,1,2,1,2,1,2,1,2,0],
            [0,2,1,2,1,2,1,2,1,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        this.imgW = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.loadImgW = [true,false,false,false,false,false,false];
        this.imgB = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.loadImgB = [true,false,false,false,false,false,false];
        this.ctx = canvas.getContext('2d');
        this.size = Math.min(screen.width,screen.height)/16;

        this.turn = true;
        this.isHold = false;
        this.pickPiece;
        this.enpassFlag = false;
        this.enpass = new Pos();

        this.castW = [true,true,true];
        this.castB = [true,true,true];
    }
    setImg() {
        for(let i = 1;i < 7;i++) {
            this.imgW[i].src = 'assets/img/white/00' + i + '.png';
            this.imgB[i].src = 'assets/img/black/00' + i + '.png';
        }
    }
    draw() {
        push();
        let s = this.size;
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                switch(this.color[y][x]) {
                    case 0: this.ctx.fillStyle = '#915f3d'; break;
                    case 1: this.ctx.fillStyle = '#e0b882'; break;
                    case 2: this.ctx.fillStyle = '#b5804a'; break;
                }
                this.ctx.fillRect(s*x,s*y,s,s);
            }
        }
        pop();
    }
    initTiles(field = pieces.moveTiles) {
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                field[y][x] = 0;
            }
        }
    }
    calcAll(turn,field = pieces.tiles,move = pieces.moveTiles) {
        let term,F;
        if(turn) { term = (i) => (0 < i); F = -1; }
        else { term = (i) => (i < 0); F = 1; }
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(term(field[y][x])) {
                    pieces.calcMove(x,y,field,move,false);
                }
            }
        }
    }
    findKing(turn,field = pieces.tiles) {
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if((turn && field[y][x] == 1) || (!turn && field[y][x] == -1)) {
                    return new Pos(x,y);
                }
            }
        }
        console.error("入力されたデータが見つかりません");
    }
    checkmate() {
        /**
         * 一マスずつ相手駒を探す
         * 見つけたら動ける範囲を全探索する(moveで行って帰らせる)
         * チェックフラグが折れる状況がなければtrueを返す
         */
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(isArmy(x,y)) {
                    let P = new Pos(x,y);
                    let move = new Tile();
                    move = move.tiles;
                    console.log(pieces.tiles);
                    // ↓ここ
                    pieces.calcMove(P.x,P.y,pieces.tiles,move);
                    for(let ny = 1;ny < 9;ny++) {
                        for(let nx = 1;nx < 9;nx++) {
                            if(move[ny][nx] != 0) {
                                let field = Object.assign({},pieces.tiles);
                                master.pickpiece = new Pos(P.x,P.y);
                                pieces.move(nx,ny,field);
                                let tmp = new Tile();
                                tmp = tmp.tiles;
                                this.calcAll(master.turn,field,tmp);
                                console.log(master.turn,field);
                                let K = this.findKing(!master.turn,field);
                                if(isEmpty(K.x,K.y,tmp)) return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
}

class Pieces{
    constructor() {
        this.tiles = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,-3,-4,-5,-2,-1,-5,-4,-3,0],
            [0,-6,-6,-6,-6,-6,-6,-6,-6,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,6,6,6,6,6,6,6,6,0],
            [0,3,4,5,2,1,5,4,3,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        /** 
         * 0.空白
         * 1.キング
         * 2.クイーン
         * 3.ルーク
         * 4.ビショップ
         * 5.ナイト
         * 6.ポーン
        */
       this.moveTiles = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
       ];
       this.moveList = [
            [],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1)],
            [new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(-1,-2),new Pos(1,-2),new Pos(-2,-1),new Pos(2,-1),new Pos(-2,1),new Pos(2,1),new Pos(-1,2),new Pos(1,2)],
            [new Pos(0,-1)]
       ];
       this.moveType = [false,false,true,true,true,false,false];
    }
    draw() {
        let s = master.size;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                let type = this.tiles[y][x],img;
                if(type == 0) continue;
                if(0 < type) img = master.imgW[type];
                else img = master.imgB[-type];
                master.ctx.drawImage(img,s*x,s*y,s,s);
            }
        }
    }
    drawMove() {
        push();
        let s = master.size;
        let P = master.pickPiece;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                let M = this.moveTiles[y][x];
                if(M == 0 || M == 6) continue;
                if(isEven(M)) master.ctx.fillStyle = '#cfa01f';
                else master.ctx.fillStyle = '#77c9be';
                master.ctx.fillRect(s*x,s*y,s,s);
            }
        }
        master.ctx.fillStyle = '#e65a50';
        master.ctx.fillRect(s*P.x,s*P.y,s,s);
        pop();
    }
    calcMove(x,y,field = this.tiles,move = this.moveTiles,nor = true) {
        if(isEmpty(x,y,field)) return false;
        let F = 1;
        if(field[y][x] < 0) F = -1;
        let tile = field[y][x] * F;
        // 駒処理
        if(tile == 6) {
            // ポーン処理
            let P = new Pos(x,y-F);
            if(!(isField(P.x,P.y))) return false;
            // 移動
            if(isEmpty(P.x,P.y,field) && nor) {
                if((0 < F && P.y == 1) || (F < 0 && P.y == 8)) move[P.y][P.x] = 9;
                else move[P.y][P.x] = 1;
                if(isEmpty(P.x,P.y-F,field) && ((0 < F && y == 7) || (F < 0 && y == 2))) {
                    move[P.y-F][P.x] = 3;
                }
            }
            // 敵襲
            let L = new Pos(P.x-1,P.y);
            let R = new Pos(P.x+1,P.y);
            let E = master.enpass;
            if(isField(L.x,L.y) && isEnemy(L.x,L.y)) {
                if((0 < F && L.y == 1) || (F < 0 && L.y == 8)) move[L.y][L.x] = 8;
                else move[L.y][L.x] = 2;
            }
            if(isField(R.x,R.y) && isEnemy(R.x,R.y)) {
                if((0 < F && R.y == 1) || (F < 0 && R.y == 8)) move[R.y][R.x] = 8;
                else move[R.y][R.x] = 2;
            }
            // アンパッサン
            if(master.enpassFlag) {
                if(E.equal(L.x,L.y)) move[L.y][L.x] = 4;
                if(E.equal(R.x,R.y)) move[L.y][L.x] = 4;
            }
        } else {
            // 他駒処理
            this.moveList[tile].forEach(E => {
                let P = new Pos(x+E.x,y+E.y);
                do {
                    if(isField(P.x,P.y) && !(isArmy(P.x,P.y))) {
                        if(isEnemy(P.x,P.y)) {
                            move[P.y][P.x] = 2;
                            break;
                        } else {
                            move[P.y][P.x] = 1;
                        }
                        P.x += E.x;
                        P.y += E.y;
                    } else {
                        break;
                    }
                } while(this.moveType[tile]);
            });
        }
        if(field[y][x] == 1) {
            if(master.turn && master.castW[1]) {
                if(master.castW[0] && isEmpty(2,8,field) && isEmpty(3,8,field) && isEmpty(4,8,field)) {
                    let tmp = new Tile().tiles;
                    master.calcAll(!master.turn,field,tmp);
                    if(isEmpty(2,8,tmp) && isEmpty(3,8,tmp) && isEmpty(4,8,tmp)) move[8][3] = 5;
                }
                if(master.castW[2] && isEmpty(6,8,field) && isEmpty(7,8,field)) {
                    let tmp = new Tile().tiles;
                    master.calcAll(!master.turn,field,tmp);
                    if(isEmpty(6,8,tmp) && isEmpty(7,8,tmp)) move[8][7] = 7;
                }
            } else if(!master.turn && master.castB[1]) {
                if(master.castB[0] && isEmpty(2,1,field) && isEmpty(3,1,field) && isEmpty(4,1,field)) {
                    let tmp = new Tile().tiles;
                    master.calcAll(!master.turn,field,tmp);
                    if(isEmpty(2,1,tmp)&& isEmpty(3,1,tmp) && isEmpty(4,1,tmp)) move[1][3] = 5;
                }
                if(master.castB[2] && isEmpty(6,1,field) && isEmpty(7,1,field)) {
                    let tmp = new Tile().tiles;
                    master.calcAll(!master.turn,field,tmp);
                    if(isEmpty(6,1,tmp) && isEmpty(7,1,tmp)) move[1][7] = 7;
                }
            }
        }
    }
    move(x,y,field = this.tiles) {
        let P = master.pickPiece;
        field[y][x] = field[P.y][P.x];
        field[P.y][P.x] = 0;
    }
}

class Cursor{
    constructor() {
        this.x = 5;
        this.y = 8;
    }
    draw() {
        push();
        let s = master.size;
        master.ctx.strokeStyle = '#3d88da';
        master.ctx.lineWidth = '4.0';
        master.ctx.strokeRect(s*this.x,s*this.y,s,s);
        pop();
    }
    move(x,y) {
        if(isField(this.x+x,this.y+y)) {
            this.x += x;
            this.y += y;
        }
    }
    isPick() {
        if(isArmy(this.x,this.y)) return true;
        return false;
    }
    isPut() {
        let P = master.pickPiece;
        let M = pieces.moveTiles[this.y][this.x];
        if(this.x == P.x && this.y == P.y) {
            master.isHold = false;
            return false;
        } else if(M != 0 && M != 6) {
            return true;
        }
        return false;
    }
}

class Pos{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    equal(x,y) {
        if(this.x == x && this.y == y) return true;
        return false;
    }
}

class Tile{
    constructor() {
        this.tiles = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
    }
}

function process() {
    let C = new Pos(cursor.x,cursor.y);
    if(master.isHold) {
        let P = new Pos(master.pickPiece.x,master.pickPiece.y);
        let type = pieces.tiles[P.y][P.x];
        if(cursor.isPut()) {
            pieces.move(C.x,C.y);
            master.enpassFlag = false;
            switch(pieces.moveTiles[C.y][C.x]) {
                case 3:
                    if(master.turn) master.enpass = new Pos(C.x,C.y+1);
                    else master.enpass = new Pos(C.x,C.y-1);
                    master.enpassFlag = true;
                    break;
                case 4:
                    let E  = master.enpass;
                    if(master.turn) pieces.tiles[E.y+1][E.x] = 0;
                    else pieces.tiles[E.y-1][E.x] = 0;
                    break;
                case 5:
                    if(master.turn) {
                        pieces.tiles[8][8] = 0;
                        pieces.tiles[8][6] = 3;
                    } else {
                        pieces.tiles[1][8] = 0;
                        pieces.tiles[1][6] = -3;
                    }
                    break;
                case 7:
                    if(master.turn) {
                        pieces.tiles[8][1] = 0;
                        pieces.tiles[8][4] = 3;
                    } else {
                        pieces.tiles[1][1] = 0;
                        pieces.tiles[1][4] = -3;
                    }
                    break;
                case 8:
                case 9:
                    // プロモーションの画面を表示する
                    break;
                default:
                    break;
            }
            switch(type) {
                case -3:
                    if(P.equal(1,1)) master.castB[0] = false;
                    if(P.equal(8,1)) master.castB[2] = false;
                    break;
                case -1:
                    master.castB[1] = false;
                    break;
                case 1:
                    master.castW[1] = false;
                    break;
                case 3:
                    if(P.equal(1,8)) master.castW[0] = false;
                    if(P.equal(8,8)) master.castW[2] = false;
                    break;
            }
            // 記録

            // チェック処理
            master.initTiles();
            master.calcAll(master.turn);
            let K = master.findKing(!master.turn);
            if(pieces.moveTiles[K.y][K.x] == 2) {
                console.log("CHECK!!!");
                if(master.checkmate()) console.log("CHECK MATE!!!!!!!");
            }
            master.isHold = false;
            master.turn = !master.turn;
        }
    } else {
        if(cursor.isPick()) {
            master.pickPiece = new Pos(C.x,C.y);
            master.initTiles();
            pieces.calcMove(C.x,C.y);
            master.isHold = true;
        }
    }
}

let master,pieces,cursor;
function setup() {
    master = new Master();
    master.setImg();
    pieces = new Pieces();
    cursor = new Cursor();
    createCanvas(master.size * 10,master.size * 10);
    // 初手で画像が読み込めないことがあるため待機
    for(let i = 1;i < 7;i++) {
        let imgW = master.imgW[i],imgB = master.imgB[i];
        imgW.onload = function() {
            master.ctx.drawImage(imgW,0,0,0,0);
            master.loadImgW[master.imgW.indexOf(imgW)] = true;
        }
        imgB.onload = function() {
            master.ctx.drawImage(imgB,0,0,0,0);
            master.loadImgB[master.imgB.indexOf(imgB)] = true;
        }
    }
    // 画像の読み込みが完了したら入力処理を開始する
    let loadWait = setInterval(() => {
        if(master.loadImgW.every(v => v) && master.loadImgB.every(v => v)) {
            addEventListener('keydown', function(e) {
                console.log(e.key);
                if(e.key == 'ArrowUp') {
                    cursor.move(0,-1);
                } else if(e.key == 'ArrowDown') {
                    cursor.move(0,1);
                } else if(e.key == 'ArrowRight') {
                    cursor.move(1,0);
                } else if(e.key == 'ArrowLeft') {
                    cursor.move(-1,0);
                } else if(e.key == 'Enter') {
                    process();
                }
                drawF();
            });
            canvas.addEventListener('click',(e) => {
                let rect = canvas.getBoundingClientRect();
                let x = Math.floor((e.clientX - rect.left)/((rect.width)/10));
                let y = Math.floor((e.clientY - rect.top)/((rect.height)/10));
                if(isField(x,y)) {
                    cursor.x = x;
                    cursor.y = y;
                    process();
                }
                drawF();
            });
            clearInterval(loadWait);
        }
    },100);
}

function drawF() {
    master.draw();
    if(master.isHold) pieces.drawMove();
    pieces.draw();
    cursor.draw();
}

const isField = (x,y) => (0 < Math.min(x,y) && Math.max(x,y) <= 8);
const isEmpty = (x,y,field = pieces.tiles) => (field[y][x] == 0);
const isArmy = (x,y,field = pieces.tiles,T = master.turn) => (!(isEmpty(x,y)) && (0 < field[y][x] == T));
const isEnemy = (x,y,field = pieces.tiles,T = master.turn) => (!(isEmpty(x,y)) && (0 < field[y][x] != T));
const isEven = num => (typeof num == 'number' || num instanceof Number) && num % 2 === 0;