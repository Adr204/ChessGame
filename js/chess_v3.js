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
            [0,0,0,0,0,0,0,0,0,0],
        ];
        this.loadImgW = [true,false,false,false,false,false,false];
        this.loadImgB = [true,false,false,false,false,false,false];
        this.imgW = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.imgB = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.size = Math.min(screen.width,screen.height)/16;
        this.canvas = document.getElementById('target');
        this.ctx = canvas.getContext('2d');
        this.turn = true;
        this.isHold = false;
        this.pickPiece;
        this.enpassFlag = false;
        this.enpass = new Pos();
        this.castW = [true,true,true];
        this.castB = [true,true,true];
        this.promoFlag = false;
        this.promo = new Pos();
    }
    drawField() {
        let s = this.size;
        push();
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
    check(turn,field) {
        if(field == undefined) field = pieces.tiles;
        let term,KING,F,tmp = Object.assign({},pieces.moveTiles);
        console.log(tmp);
        pieces.initMoveTiles(field);
        if(turn) { term = (i) => (0 < i); F = -1; } 
        else { term = (i) => (i < 0); F = 1; }
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(term(field[y][x])) {
                    pieces.calcMoveTiles(x,y,false,field);
                } else if(field[y][x] == F) {
                    KING = new Pos(x,y);
                }
            }
        }
        pieces.moveTiles = tmp;
        if(KING == undefined) return false;
        if(pieces.moveTiles[KING.y][KING.x] == 2) return true;
        return false;
    }
    checkmate() {
        let field = Object.assign({},pieces.tiles);
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(isArmy(x,y)) {
                    let P = new Pos(x,y);
                    pieces.initMoveTiles(field);
                    pieces.calcMoveTiles(P.x,P.y,false,field);
                    for(let y_ = 1;y_ < 9;y_++) {
                        for(let x_ = 1;x_ < 9;x_++) {
                            if(pieces.moveTiles[y_][x_] != 0) {
                                master.pickPiece = new Pos(x_,y_);
                                pieces.move(P.x,P.y,field);
                                if(this.check(!(master.turn),field) == false) return false; 
                                master.pickPiece = P;
                                pieces.move(x_,y_,field);
                                // moveじゃなくてcopyした別の使う
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    setupImg() {
        for(let i = 1;i < 7;i++) {
            this.imgW[i].src = "assets/img/white/00" + i + ".png";
            this.imgB[i].src = "assets/img/black/00" + i + ".png";
        }
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
            [0,0,0,0,0,0,0,0,0,0],
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
            [0,0,0,0,0,0,0,0,0,0],
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
        let s = master.size,type;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                type = this.tiles[y][x];
                if(type == 0) continue;
                let img;
                if(0 < type) img = master.imgW[type];
                else img = master.imgB[-type];
                master.ctx.drawImage(img,s*x,s*y,s,s);
            }
        }
    }
    drawMoveTiles() {
        push();
        let s = master.size;
        let pick = master.pickPiece;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                let M = this.moveTiles[y][x];
                if(M == 0 || M == 6) continue;
                // switch (this.moveTiles[y][x]) {
                //     case 1: master.ctx.fillStyle = '#77c9be'; break;
                //     case 2: master.ctx.fillStyle = '#cfa01f'; break;
                //     case 3: master.ctx.fillStyle = '#77c9be'; break;
                //     case 4: master.ctx.fillStyle = '#cfa01f'; break;
                //     case 5: master.ctx.fillStyle = '#77c9be'; break;
                //     case 6: master.ctx.fillStyle = '#77c9be'; break;
                // }
                if(isEven(M)) master.ctx.fillStyle = '#cfa01f';
                else master.ctx.fillStyle = '#77c9be';
                master.ctx.fillRect(s*x,s*y,s,s);
            }
        }
        master.ctx.fillStyle = '#e65a50';
        master.ctx.fillRect(s*pick.x,s*pick.y,s,s);
        pop();
    }
    calcMoveTiles(x,y,nor = true,field) {
        if(field == undefined) field = this.tiles;
        if(field[y][x] == 0) return false;
        let F = 1;
        if(field[y][x] < 0) F = -1;
        let tile = field[y][x] * F;
        if(tile == 6) {
            // ポーンの特殊処理
            let P = new Pos(x,y-F);
            if(!(isField(P.x,P.y))) return;
            if(field[P.y][P.x] == 0 && nor) {
                this.moveTiles[P.y][P.x] = 1;
                if(((0 < F && P.y == 1) || (F < 0 && P.y == 8))) this.moveTiles[P.y][P.x] = 9;
                if(field[P.y-F][P.x] == 0 && ((0 < F && y == 7) || (F < 0 && y == 2))) {
                    this.moveTiles[P.y-F][P.x] = 3;
                }
            }
            let L = new Pos(P.x-1,P.y),R = new Pos(P.x+1,P.y),E = master.enpass;
            if(isField(L.x,L.y) && isEnemy(L.x,L.y)) this.moveTiles[L.y][L.x] = 2;
            if(((0 < F && L.y == 1) || (F < 0 && L.y == 8))) this.moveTiles[P.y][P.x] = 8;
            if(isField(R.x,R.y) && isEnemy(R.x,R.y)) this.moveTiles[R.y][R.x] = 2;
            if(((0 < F && R.y == 1) || (F < 0 && R.y == 8))) this.moveTiles[P.y][P.x] = 8;
            if(master.enpassFlag && L.x == E.x && L.y == E.y) this.moveTiles[L.y][L.x] = 4;
            if(master.enpassFlag && R.x == E.x && R.y == E.y) this.moveTiles[R.y][R.x] = 4;
        } else {
            // 一般駒
            this.moveList[tile].forEach(E => {
                let P = new Pos(x+E.x,y+E.y);
                do {
                    if(isField(P.x,P.y) && !(isArmy(P.x,P.y))) {
                        if(isEnemy(P.x,P.y)) {
                            this.moveTiles[P.y][P.x] = 2;
                            break;
                        } else {
                            this.moveTiles[P.y][P.x] = 1;
                        }
                        P.x += E.x;
                        P.y += E.y;
                    } else {
                        break;
                    }
                } while(this.moveType[tile]);
            });
        }
        // キャスリング処理
        if(field[y][x] == 1) {
            if(master.turn && master.castW[1]) {
                // キングサイドキャスリング
                if(master.castW[0]) {
                    if(field[8][2] == 0 && field[8][3] == 0 && field[8][4] == 0) {
                        let tmp = Object.assign({},this.moveTiles);
                        master.check(!master.turn,field);
                        if(this.moveTiles[8][2] == 0 && field[8][3] == 0 && field[8][4] == 0) {
                            tmp[8][3] = 5;
                        }
                        this.moveTiles = tmp;
                    }
                }
                // クイーンサイドキャスリング
                if(master.castW[2]) {
                    if(field[8][6] == 0 && field[8][7] == 0) {
                        let tmp = Object.assign({},this.moveTiles);
                        master.check(!master.turn,field);
                        if(this.moveTiles[8][6] == 0 && this.moveTiles[8][7] == 0) {
                            tmp[8][7] = 7;
                        }
                        this.moveTiles = tmp;
                    }
                }
            } else if(master.castB[1]) {

            }
        }
    }
    move(x,y,field) {
        if(field == undefined) field = this.tiles;
        let piece = master.pickPiece;
        let R = {type: this.moveTiles[y][x],piece: this.tiles[piece.y][piece.x],B: new Pos(piece.x,piece.y),A: new Pos(x,y)};
        field[y][x] = field[piece.y][piece.x];
        field[piece.y][piece.x] = 0;
        return R;
    }
    initMoveTiles(field) {
        if(field == undefined) field = this.moveTiles;
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                field[y][x] = 0;
            }
        }
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
    pick() {
        if(isArmy(this.x,this.y)) return true;
        return false;
    }
    put() {
        if(this.x == master.pickPiece.x && this.y == master.pickPiece.y) {
            master.isHold = false;
            return false;
        } else if(pieces.moveTiles[this.y][this.x] != 0) {
            return true;
        }
        return false;
    }
}

class Rec{
    constructor() {
        this.recArray = [];
    }
    push(B,A) {

    }
    output() {

    }
}

class Pos {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    equal(x,y) {
        if(this.x == x && this.y == y) return true;
        else return false;
    }
}

let master,pieces,cursor;

function setup() {
    master = new Master();
    master.setupImg();
    createCanvas(master.size * 10,master.size * 10);
    pieces = new Pieces();
    cursor = new Cursor();
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
    let loadWait = setInterval(() => {
        if(master.loadImgW.every(value => value) && master.loadImgB.every(value => value)) {
            addEventListener('keydown', function(e) {
                if(e.key == 'ArrowUp') {
                    cursor.move(0,-1);
                } else if(e.key == 'ArrowDown') {
                    cursor.move(0,1);
                } else if(e.key == 'ArrowRight') {
                    cursor.move(1,0);
                } else if(e.key == 'ArrowLeft') {
                    cursor.move(-1,0);
                } else if(e.key == 'Enter') {
                    touch();
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
                    touch();
                }
                drawF();
            });
            clearInterval(loadWait);
        }
    },100);
}

function touch() {
    if(master.isHold) {
        if(cursor.put()) {
            // ここにチェック処理や書き込み処理を入れる
            let move = pieces.move(cursor.x,cursor.y);
            master.enpassFlag = false;
            switch (move.type) {
                case 1:
                    break;
                case 2:
                    break;
                case 3: // 二マス移動
                    if(master.turn) master.enpass = new Pos(cursor.x,cursor.y+1);
                    else master.enpass = new Pos(cursor.x,cursor.y-1);
                    master.enpassFlag = true;
                    break;
                case 4: // アンパッサン
                    let E = master.enpass
                    if(master.turn) pieces.tiles[E.y+1][E.x] = 0;
                    else pieces.tiles[E.y-1][E.x] = 0;
                    break;
                case 5: // キングサイドキャスリング
                    pieces.tiles[8][8] = 0;
                    pieces.tiles[8][6] = 3;
                    break;
                case 7: // クイーンサイドキャスリング
                    pieces.tiles[8][1] = 0;
                    pieces.tiles[8][4] = 3;
                    break;
                case 8:

                    break;
                case 9:

                    break;
                default:
                    break;
            }
            // キャスリングフラグリセット
            if(master.turn) {
                if(move.piece == 3) {
                    if(move.B.equal(1,8)) master.castW[0] = false;
                    if(move.B.equal(8,8)) master.castW[2] = false;
                } else if(move.piece == 1) {
                    master.castW[0] = false;
                }
            } else {
                if(move.piece == 3) {
                    if(move.B.equal(1,1)) master.castB[0] = false;
                    if(move.B.equal(8,1)) master.castB[2] = false;
                } else if(move.piece == 1) {
                    master.castB[1] = false;
                }
            }
            // 所持フラグ
            master.isHold = false;
            // チェック処理
            if(master.check(master.turn)) console.log("check!");
            // if(master.checkmate()) alert("チェックメイト!");
            // プロモーション判定
            
            // 手番入れ替え
            master.turn = !master.turn;
            // 棋譜書き込み
            // master.record();
        }
    } else {
        if(cursor.pick()) {
            master.pickPiece = new Pos(cursor.x,cursor.y);
            pieces.initMoveTiles();
            pieces.calcMoveTiles(cursor.x,cursor.y);
            master.isHold = true;
        }
    }
}

function drawF() {
    master.drawField();
    if(master.isHold) pieces.drawMoveTiles();
    pieces.draw();
    cursor.draw();
}

// 複数回呼び出すif文条件置き場
const isField = (x,y) => (0 < Math.min(x,y) && Math.max(x,y) <= 8);
const isEmpty = (x,y) => (pieces.tiles[y][x] == 0);
const isArmy = (x,y) => (!(isEmpty(x,y)) && (0 < pieces.tiles[y][x] == master.turn));
const isEnemy = (x,y) => (!(isEmpty(x,y)) && (0 < pieces.tiles[y][x] != master.turn));
const isEven = num => (typeof num === "number" || num instanceof Number) && num % 2 === 0;