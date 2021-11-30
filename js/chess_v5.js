class Master {
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
        this.imgW = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.loadImgW = [false,false,false,false,false,false,false];
        this.imgB = [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.loadImgB = [false,false,false,false,false,false,false];
        this.ctx = canvas.getContext('2d');
        this.size = screen.width <= 640 ? screen.width / 10 : Math.min(screen.width,screen.height)/16;
        this.saveData = [];
        this.config = {
            kingSafety: true
        }
    }
    setImg() {
        this.imgW[0].src = 'img/x.png'
        this.imgB[0].src = 'img/x.png'
        for(let i = 1; i < 7; i++) {
            this.imgW[i].src = 'img/white/00' + i + '.png';
            this.imgB[i].src = 'img/black/00' + i + '.png';
        }
    }
    setCanvas() {
        canvas.width = this.size*10;
        canvas.height = this.size*10;
    }
    draw() {
        let s = this.size;
        for(let y = 0; y < 10; y++) {
            for(let x = 0; x < 10; x++) {
                switch(this.color[y][x]) {
                    case 0: this.ctx.fillStyle = '#915f3d'; break;
                    case 1: this.ctx.fillStyle = '#e0b882'; break;
                    case 2: this.ctx.fillStyle = '#b5804a'; break;
                }
                this.ctx.fillRect(s*x,s*y,s,s);
            }
        }
    }
    static makeTiles() {
        let tiles = [
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
        return tiles;
    }
    static save() {
        let tiles = this.makeTiles();
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                tiles[y][x] = game.board[y][x];
            }
        }
        let f = game.flag;
        let cast=f.cast,promo=f.promo,enpass=f.enpass,turn=f.turn;
        let flag = {
            cast: new Map(),
            promo: new Map(),
            enpass: new Map(),
            winner: new Map(),
            turn: turn
        };
        flag.cast.set(true,[...cast.get(true)]);
        flag.cast.set(false,[...cast.get(false)]);
        flag.promo.set(true,[promo.get(true)[0],new Pos(promo.get(true)[1].x,promo.get(true)[1].y)]);
        flag.promo.set(false,[promo.get(false)[0],new Pos(promo.get(false)[1].x,promo.get(false)[1].y)]);
        flag.enpass.set(true,[enpass.get(true)[0],new Pos(enpass.get(true)[1].x,enpass.get(true)[1].y)]);
        flag.enpass.set(false,[enpass.get(false)[0],new Pos(enpass.get(false)[1].x,enpass.get(false)[1].y)]);
        let data = {
            flag: flag,
            tiles: tiles
        };
        return data;
    }
    static load(data,reload = false) {
        // こっちでも同じことやる
        game.board = this.makeTiles();
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                game.board[y][x] = data.tiles[y][x];
            }
        }
        let df = data.flag;
        let flag = {
            cast: new Map(),
            promo: new Map(),
            enpass: new Map(),
            winner: new Map(),
            turn: data.flag.turn,
        };
        flag.cast.set(true,[...df.cast.get(true)]);
        flag.cast.set(false,[...df.cast.get(false)]);
        flag.promo.set(true,[df.promo.get(true)[0],new Pos(df.promo.get(true)[1].x,df.promo.get(true)[1].y)]);
        flag.promo.set(false,[df.promo.get(false)[0],new Pos(df.promo.get(false)[1].x,df.promo.get(false)[1].y)]);
        flag.enpass.set(true,[df.enpass.get(true)[0],new Pos(df.enpass.get(true)[1].x,df.enpass.get(true)[1].y)]);
        flag.enpass.set(false,[df.enpass.get(false)[0],new Pos(df.enpass.get(false)[1].x,df.enpass.get(false)[1].y)]);
        flag.winner.set(true,[false]);
        flag.winner.set(false,[false]);
        game.flag = flag;
        if(reload) drawF();
    }
}

class Game {
    constructor() {
        this.board = [
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
        this.moveList = [     
            [null,false,true,true,true,false,false],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1)],
            [new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(-1,-2),new Pos(1,-2),new Pos(-2,-1),new Pos(2,-1),new Pos(-2,1),new Pos(2,1),new Pos(-1,2),new Pos(1,2)],
            [new Pos(0,-1)]
        ];
       this.flag = {
            cast: new Map(),
            promo: new Map(),
            enpass: new Map(),
            winner: new Map(),
            turn: true
        };
    }
    setFlag() {
        this.flag.cast.set(true,[true,true,true]);
        this.flag.cast.set(false,[true,true,true]);
        this.flag.promo.set(true,[false,new Pos()]);
        this.flag.promo.set(false,[false,new Pos()]);
        this.flag.enpass.set(true,[false,new Pos()]);
        this.flag.enpass.set(false,[false,new Pos()]);
        this.flag.winner.set(true,[false]);
        this.flag.winner.set(false,[false]);
    }
    draw() {
        let s = master.size;
        for(let y = 1; y < 9; y++) {
            for(let x = 1; x < 9; x++) {
                let color = this.board[y][x],img;
                if(color == 0) continue;
                if(0 < color) img = master.imgW[color];
                else img = master.imgB[-color];
                master.ctx.drawImage(img,s*x,s*y,s,s);
            }
        }
    }
    drawX(from) {
        let s = master.size;
        let img = master.imgW[0];
        master.ctx.drawImage(img,s*from.x,s*from.y,s,s);
    }
    drawW() {
        let size = master.size;
        master.ctx.font = size * 1.6 + "px serif";
        master.ctx.fillStyle = "#e65a50";
        if(this.flag.winner.get(true)[0]) master.ctx.fillText("White Win!",size,size*5.5);
        else if(this.flag.winner.get(false)[0])master.ctx.fillText("Black Win!",size,size*5.5);
    }
    drawR() {
        let size = master.size;
        master.ctx.font = size * 0.6 + "px serif";
        master.ctx.fillStyle = "#ffffff";
        master.ctx.fillText("If you want to play more games",size*0.6,size*2.2);
        master.ctx.fillText("Press the key [Shift + R]",size*1.6,size*3.2);
    }
    drawPromo() {
        let img,s = master.size;
        master.ctx.fillStyle = '#ffffff';
        master.ctx.fillRect(s,s*4,s*8,s*2);
        for(let i = 2;i < 6;i++) {
            if(!this.flag.turn) img = master.imgW[i];
            else img = master.imgB[i];
            master.ctx.drawImage(img,s*(i-2)*2+s,s*4,s*2,s*2);
        }
    }
    calcMove(from,tiles = Master.makeTiles(),stack = false) {
        // tilesに移動できる場所を書き込む
        if(isEmpty(this.board,from)) return tiles;
        let t = -1,turn = this.flag.turn,type = Math.abs(this.board[from.y][from.x]);
        if(0 < this.board[from.y][from.x]) t = 1;

        if(type == 6) {
            let p = new Pos(from.x,from.y-t);
            if(!isField(p)) return tiles;

            if(isEmpty(this.board,p) && !stack) {
                if((turn && p.y == 1) || (!turn && p.y == 8)) tiles[p.y][p.x] = 9;
                else tiles[p.y][p.x] = 1;
                if(isEmpty(this.board,new Pos(p.x,p.y-t)) && ((turn && from.y == 7) || (!turn && from.y == 2))) {
                    tiles[p.y-t][p.x] = 3;
                }
            }
            let l = new Pos(p.x-1,p.y);
            let r = new Pos(p.x+1,p.y);
            if(isField(l) && (isEnemy(l) || stack)) {
                if((turn && l.y == 1) || (!turn && l.y == 8)) tiles[l.y][l.x] = 8;
                else tiles[l.y][l.x] = 2;
            }
            if(isField(r) && (isEnemy(r) || stack)) {
                if((turn && r.y == 1) || (!turn && r.y == 8)) tiles[r.y][r.x] = 8;
                else tiles[r.y][r.x] = 2;
            }
            if(this.flag.enpass.get(turn)[0]) {
                let e = this.flag.enpass.get(turn)[1];
                if(e.isEqual(l)) tiles[l.y][l.x] = 4;
                if(e.isEqual(r)) tiles[r.y][r.x] = 4;
            }
        } else {
            this.moveList[type].forEach(e => {
                let p = new Pos(from.x,from.y);
                do {
                    p.x += e.x;
                    p.y += e.y;
                    if(isField(p) && !(isArmy(p))) {
                        if(isEnemy(p)) {
                            tiles[p.y][p.x] = 2;
                            break;
                        } else {
                            tiles[p.y][p.x] = 1;
                        }
                    } else {
                        break;
                    }
                } while(this.moveList[0][type]);
            });
        }
        if(type == 1 && !stack) {
            let calc = this.calcAll(!turn);
            console.log("↓ calc ↓");
            console.log(calc);
            // キャスリング処理
            if(this.flag.cast.get(turn)[1]) {
                if(this.flag.cast.get(turn)[0]) {
                    // クイーンサイド
                    if(turn && isEmpty(this.board,new Pos(2,8),new Pos(3,8),new Pos(4,8))) {
                        if(isEmpty(calc,new Pos(2,8),new Pos(3,8),new Pos(4,8))) tiles[8][3] = 7;
                    }
                    if(!turn && isEmpty(this.board,new Pos(2,1),new Pos(3,1),new Pos(4,1))) {
                        if(isEmpty(calc,new Pos(2,1),new Pos(3,1),new Pos(4,1))) tiles[1][3] = 7;
                    }
                }
                if(this.flag.cast.get(turn)[2]) {
                    // キングサイド
                    if(turn && isEmpty(this.board,new Pos(6,8),new Pos(7,8))) {
                        if(isEmpty(calc,new Pos(6,8),new Pos(7,8))) tiles[8][7] = 5;
                    }
                    if(!turn && isEmpty(this.board,new Pos(6,1),new Pos(7,1))) {
                        if(isEmpty(calc,new Pos(6,1),new Pos(7,1))) tiles[1][7] = 5;
                    }
                }
            }
            // 死地飛び込み回避
            if(master.config.kingSafety) {
                for(let y = -1;y < 2;y++) {
                    for(let x = -1;x < 2;x++) {
                        if(x == 0 && y == 0) continue;
                        let nx = from.x + x,ny = from.y + y;
                        if(isField(new Pos(nx,ny)) && !isEmpty(calc,new Pos(nx,ny))) tiles[ny][nx] = 6;
                    }
                }
            }
        }
        return tiles;
    }
    calcAll(turn = this.flag.turn) {
        let term,tiles = Master.makeTiles();
        if(turn) term = (i) => (0 < i);
        else term = (i) => (i < 0);
        for(let y = 1; y < 9; y++) {
            for(let x = 1; x < 9; x++) {
                if(term(this.board[y][x])) {
                    tiles = this.calcMove(new Pos(x,y),tiles,true);
                }
            }
        }
        return tiles;
    }
    move(from,to,tiles = cursor.moveTiles,turn = this.flag.turn) {
        // ここに特殊処理全部記述
        let type = tiles[to.y][to.x],t=-1;
        if(turn) t = 1;
        let piece = this.modify(from,to);
        switch (type) {
            case 3:// ポーンの二マス移動
                this.flag.enpass.get(turn)[0] = true;
                this.flag.enpass.get(turn)[1] = new Pos(to.x,to.y+1);
                break;
            case 4:// アンパッサン
                let e = this.flag.enpass[1];
                this.board[e.y+t][e.x] = 0;
                break;
            case 5:// キングサイドキャスリング
                if(turn) { this.board[8][8] = 0; this.board[8][6] = 3; }
                else { this.board[1][8] = 0; this.board[1][6] = -3; }
                break; 　
            case 7:// クイーンサイドキャスリング
                if(turn) { this.board[8][1] = 0; this.board[8][4] = 3; }
                else { this.board[1][1] = 0; this.board[1][4] = -3; }
                break;
            case 8:// プロモーション(敵駒アリ)
            case 9:// プロモーション(敵駒ナシ)
                this.flag.promo.get(turn)[0] = true;
                this.flag.promo.get(turn)[1] = new Pos(to.x,to.y);
                break;
        }
        if(from.isEqual(new Pos(1,8))) this.flag.cast.get(true)[0] = false;
        if(from.isEqual(new Pos(5,8))) this.flag.cast.get(true)[1] = false;
        if(from.isEqual(new Pos(8,8))) this.flag.cast.get(true)[2] = false;
        
        if(from.isEqual(new Pos(1,1))) this.flag.cast.get(false)[0] = false;
        if(from.isEqual(new Pos(5,1))) this.flag.cast.get(false)[1] = false;
        if(from.isEqual(new Pos(8,1))) this.flag.cast.get(false)[2] = false;

        this.flag.enpass.get(!turn)[0] = false;
        return piece;
    }
    modify(from,to) {
        // 移動処理のみ
        let piece = this.board[to.y][to.x];
        this.board[to.y][to.x] = this.board[from.y][from.x];
        this.board[from.y][from.x] = 0;
        return piece;
    }
    isCheck() {
        let king,tiles = this.calcAll(),turn = this.flag.turn,flag = true;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if((this.board[y][x] == 1 && !turn) || (this.board[y][x] == -1 && turn)) {
                    // 相手のキングの位置を取得
                    king = new Pos(x,y);
                    flag = false;
                }
            }
        }
        if(flag) { 
            console.error("\"KING\"の位置情報が存在しません");
            return true;
        }
        // console.log(king);
        // console.log(tiles);
        if(isEmpty(tiles,king)) return false;
        return true;
    }
    isCheckmate() {
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                // 敵駒を動かす
                if(isArmy(new Pos(x,y))) {
                    let data = Master.save();
                    console.log("=====================");
                    console.log("from: <" + x + "," + y + ">");
                    console.log("↓ data ↓");
                    console.log(data);
                    master.saveData.push(data);
                    this.flag.turn = !this.flag.turn;
                    let tiles = this.calcMove(new Pos(x,y));
                    this.flag.turn = !this.flag.turn;
                    console.log("↓ tiles ↓");
                    console.log(tiles);
                    for(let ny = 1;ny < 9;ny++) {
                        for(let nx = 1;nx < 9;nx++) {
                            if(!isEmpty(tiles,new Pos(nx,ny))) {
                                // 移動可能マスであれば
                                this.move(new Pos(x,y),new Pos(nx,ny),tiles,!this.flag.turn);

                                console.log("to: <" + nx + "," + ny + ">");
                                console.log("↓ board ↓");
                                console.log(this.board);
                                if(this.isCheck()) continue;
                                // チェックされていなかったら
                                Master.load(data);
                                return false;
                            }
                        }
                    }
                    Master.load(data);
                }
            }
        }
        return true;
    }
}

class Cursor {
    constructor() {
        this.pos = new Pos(5,8);
        this.moveTiles = Master.makeTiles();
        this.isHold = false;
        this.holdPiece;
    }
    draw() {
        let s = master.size;
        master.ctx.strokeStyle = '#3d88da';
        master.ctx.lineWidth = '4.0';
        master.ctx.strokeRect(s*this.pos.x,s*this.pos.y,s,s);
    }
    drawMove() {
        let s = master.size;
        let p = this.holdPiece;
        for(let y = 1; y < 9; y++) {
            for(let x = 1; x < 9; x++) {
                let m = this.moveTiles[y][x];
                if(m == 0) continue;
                if(isEven(m)) master.ctx.fillStyle = '#cfa01f';
                else master.ctx.fillStyle = '#37c9be';
                master.ctx.fillRect(s*x,s*y,s,s);
                if(m == 6) game.drawX(new Pos(x,y));
            }
        }
        master.ctx.fillStyle = '#e65a50';
        master.ctx.fillRect(s*p.x,s*p.y,s,s);
    }
    move(x,y) {
        if(isField(new Pos(this.pos.x+x,this.pos.y+y))) {
            this.pos.x += x;
            this.pos.y += y;
        }
    }
    isPick() {
        if(isArmy(this.pos)) return true;
        return false;
    }
    isPut() {
        let P = this.holdPiece;
        let M = this.moveTiles[this.pos.y][this.pos.x];
        if(this.pos.isEqual(P)) {
            this.isHold = false;
            drawF();
            return false;
        } else if(M != 0 && M != 6) {
            return true;
        }
        return false;
    }
}

class Pos {
    constructor(x=-1,y=-1) {
        this.x = x;
        this.y = y;
    }
    isEqual(...to) {
        if(to.some(p => this.x == p.x && this.y == p.y)) return true;
        return false;
    }
}

class step {
    constructor(from,to,type) {
        this.from = from; 
        this.to = to;
        this.type = type;
    }
    // ステップ毎に保存しておいて読み込んだ時に盤面表示できるような機能を作る
    // 情報について
    // 1.ステップのみを保存しシミュレートする
    // 2.その時の盤面の情報まで保存し、残りは捨てる
    // 3.棋譜のフォーマットに直す
}

let canvas,master,game,cursor;
function setup() {
    // Class生成処理
    canvas = document.getElementById('default');
    master = new Master();
    master.setImg();
    master.setCanvas();
    game = new Game();
    game.setFlag();
    cursor = new Cursor();
    
    // 画像読み込み処理
    for(let i = 0; i < 7; i++) {
        let imgW = master.imgW[i];
        let imgB = master.imgB[i];
        imgW.onload = function() {
            master.ctx.drawImage(imgW,0,0,0,0);
            master.loadImgW[master.imgW.indexOf(imgW)] = true;
        }
        imgB.onload = function() {
            master.ctx.drawImage(imgB,0,0,0,0);
            master.loadImgB[master.imgB.indexOf(imgB)] = true;
        }
    }

    // addEventListener
    let loadWait = setInterval(() => {
        if(master.loadImgW.every(v => v) && master.loadImgB.every(v => v)) {
            drawF();
            addEventListener('keydown',(e) => {
                switch (e.key) {
                    case 'ArrowUp':
                        cursor.move(0,-1);
                        break;
                    case 'ArrowDown':
                        cursor.move(0,1);
                        break;
                    case 'ArrowRight':
                        cursor.move(1,0);
                        break;
                    case 'ArrowLeft':
                        cursor.move(-1,0);
                        break;
                    case 'Enter':
                        Main();
                        break;
                    case 'R':
                        location.reload();
                    default:
                        console.log(e.key);
                        break;
                }
                drawF();
            });
            document.addEventListener('click',(e) => {

                let rect = canvas.getBoundingClientRect();
                let x = Math.floor((e.clientX - rect.left) / ((rect.width) / 10));
                let y = Math.floor((e.clientY - rect.top) / ((rect.height) / 10));
                if(isField(new Pos(x,y))) {
                    cursor.pos = new Pos(x,y);
                    Main();
                }
                drawF();
            });
            clearInterval(loadWait);
        }
    },100);
}

function drawF() {
    master.draw();
    if(cursor.isHold) cursor.drawMove();
    game.draw();
    cursor.draw();
    if(game.flag.promo.get(!game.flag.turn)[0]) game.drawPromo();
    if(game.flag.winner.get(true)[0] || game.flag.winner.get(false)[0]) {
        game.drawW();
        game.drawR();
    }
}

function Main() {
    // ループするメインの処理を書く
    if(game.flag.promo.get(!game.flag.turn)[0]) {
        let p = game.flag.promo.get(!game.flag.turn)[1],f = 1;
        if(game.flag.turn) f = -1;
        if(cursor.pos.isEqual(new Pos(1,4),new Pos(2,4),new Pos(1,5),new Pos(2,5))) game.board[p.y][p.x] = 2 * f;
        if(cursor.pos.isEqual(new Pos(3,4),new Pos(4,4),new Pos(3,5),new Pos(4,5))) game.board[p.y][p.x] = 3 * f;
        if(cursor.pos.isEqual(new Pos(5,4),new Pos(6,4),new Pos(5,5),new Pos(6,5))) game.board[p.y][p.x] = 4 * f;
        if(cursor.pos.isEqual(new Pos(7,4),new Pos(8,4),new Pos(7,5),new Pos(8,5))) game.board[p.y][p.x] = 5 * f;
        game.flag.promo.get(!game.flag.turn)[0] = false;
        return;
    }
    if(cursor.isHold) {
        if(cursor.isPut()) {
            let piece = game.move(cursor.holdPiece,cursor.pos);
            if(Math.abs(piece) == 1) {
                // 勝利画面へ推移
                cursor.isHold = false;
                if(piece == -1) game.flag.winner.get(true)[0] = true;
                else game.flag.winner.get(false)[0] = true;
                return 0;
            }
            // チェック処理
            // チェックしてるかどうか
            if(game.isCheck()) {
                if(game.isCheckmate()) {
                    alert("checkmate");
                } else {
                    console.log("check");
                }
            }
            cursor.isHold = false;
            game.flag.turn = !game.flag.turn;
            return;
        }
    }
    if(cursor.isPick()) {
        cursor.holdPiece = cursor.pos;
        cursor.isHold = true;
        cursor.moveTiles = game.calcMove(cursor.holdPiece);
    }
}

const isField = (p) => (0 < Math.min(p.x,p.y) && Math.max(p.x,p.y) <= 8);
const isEmpty = (tiles,...p) => (p.every(v => tiles[v.y][v.x] == 0));
const isArmy = (p,turn = game.flag.turn) => (!(isEmpty(game.board,p)) && (0 < game.board[p.y][p.x] == turn));
const isEnemy = (p,turn = game.flag.turn) => (!(isEmpty(game.board,p)) && (0 < game.board[p.y][p.x] != turn));
const isEven = num => (typeof num == 'number' || num instanceof Number) && num % 2 === 0;