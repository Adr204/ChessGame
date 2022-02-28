class Master  /* ゲームの補助 */{
    constructor() {
        this.config = {
            isPhone: navigator.userAgent.match(/iPhone|Android.+Mobile/),
            kingSafety: true,
            useKeyboard: false,
            pause: true
        };
        this.log = [];
        this.size = 1;
    }
    set size(num) {
        this.displaySize = this.config.isPhone ? 
                            screen.width/16*num : 
                            Math.min(screen.height,screen.width)/16*num;
    }
    get size() {
        return this.displaySize;
    }
    save(from,to) {

    }
    restore(...data) {
        
    }
    load() {

    }
    print() {

    }
}

class Render /* 描画系統 */{
    constructor() {
        this.canvas = document.getElementById('default');
        this.ctx = this.canvas.getContext('2d');
        this.assets = {
            image: {
                white: [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()],
                black: [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()]
            },
            sound: {

            }
        };
        this.loaded = {
            image: {
                white: [false,false,false,false,false,false,false],
                black: [false,false,false,false,false,false,false]
            },
            sound: {

            }
        };
    }
    get load() {
        return this.loaded.image.white.every(v => v) && this.loaded.image.black.every(v => v);
    }
    setup() {
        // 画像へのパス
        this.assets.image.white[0].src = './assets/img/x.png';
        this.assets.image.black[0].src = './assets/img/x.png';
        for(let c=0; c<2; c++) {
            for(let i=1; i<7; i++) {
                let color = c ? 'white' : 'black';
                this.assets.image[color][i].src = './assets/img/'+color+'/00'+i+'.png';
            }
        }
        // キャンバスのサイズ変更
        this.canvas.width =  master.size*10;
        this.canvas.height = master.size*10;
        this.loadImg();
        let loadWait = setInterval(() => {
            if(this.load) {
                master.config.pause = false;
                clearInterval(loadWait);
            }
        },100);
        return this.load;
    }
    loadImg() {
        // 画像のロード待機
        for(let i=0; i<7; i++) {
            let W = this.assets.image.white[i];
            let B = this.assets.image.black[i];
            W.onload = () => {
                this.ctx.drawImage(W,0,0,0,0);
                this.loaded.image.white[this.assets.image.white.indexOf(W)] = true;
            }
            B.onload = () => {
                this.ctx.drawImage(B,0,0,0,0);
                this.loaded.image.black[this.assets.image.black.indexOf(B)] = true;
            }
        }
    }
    rendBoard() {
        this.drawTiles();
        if(ui.isPick) this.drawMoveTiles(ui.movableTiles,ui.pickItem);
        this.drawBoard(chess.board);
        this.drawCursor(ui.cursor);
        this.drawPromotion();
        this.drawMessage();
    }
    drawCursor(to) {
        let s = master.size;
        this.ctx.strokeStyle = '#3d88da';
        this.ctx.lineWidth = '4.0';
        this.ctx.strokeRect(s*to.x,s*to.y,s,s);
    }
    drawTiles() {
        let s = master.size;
        for(let y=0; y<10; y++) {
            for(let x=0; x<10; x++) {
                if(x == 0 || x == 9 || y == 0 || y == 9) this.ctx.fillStyle = '#915f3d';
                else this.ctx.fillStyle = (x + y) % 2 == 0 ? '#e0b882' : '#b5804a';
                this.ctx.fillRect(s*x,s*y,s,s);
            }
        }
    }
    drawMoveTiles(tiles,from) {
        let s = master.size;
        for(let y=1; y<9; y++) {
            for(let x=1; x<9; x++) {
                if(tiles[y][x] == 0) continue;
                this.ctx.fillStyle = 0 < tiles[y][x] ? '#cfa01f' : '#37c9be';
                master.ctx.fillRect(s*x,s*y,s,s);
                if(tiles[y][x] == 6) this.drawPiece(0,new Pos(x,y));
            }
        }
        this.ctx.fillStyle = '#e65a50';
        this.ctx.fillRect(s*from.x,s*from.y,s,s);
    }
    drawPromotion() {

    }
    drawMessage() {
        // フラグを参照して表示する形式にしようかと
    }
    drawBoard(tiles) {
        for(let y=1; y<9; y++) {
            for(let x=1; x<9; x++) {
                if(tiles[y][x] == 0) continue;
                this.drawPiece(tiles[y][x],new Pos(x,y));
            }
        }
    }
    drawPiece(type,to) {
        let s = master.size;
        let color = 0 < type ? 'white' : 'black';
        let image = this.assets.image[color][Math.abs(type)];
        this.ctx.drawImage(image,s*to.x,s*to.y,s,s);
    }
}

class Chess /* チェス本体 */{
    constructor() {
        this.board = new Tiles(true);
        this.motion = [
            // [0]は動き方(進み続けるか一マスだけか)
            // [1~6]はそれぞれの駒が動ける座標
            [null,false,true,true,true,false,false],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1)],
            [new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(-1,-2),new Pos(1,-2),new Pos(-2,-1),new Pos(2,-1),new Pos(-2,1),new Pos(2,1),new Pos(-1,2),new Pos(1,2)],
            [new Pos(0,-1)]
        ];
        this.flag = {
            castling: {
                // ルーク,キングがキャスリングしたかどうか
                true: [true, true, true],
                false: [true, true, true]
            },
            enpassan: {
                // アンパッサンで取れる駒を保存
                true: [false, new Pos()],
                false: [false, new Pos()]
            },
            promotion: {
                // プロモーションした駒を保存
                true: [false, new Pos()],
                false: [false, new Pos()]
            },
            winner: null,
            turn: true
        }
    }
    check(to,tiles) {
        // Kに限らず相手から狙われてるかどうかの判別ができるようにする
        let color = 0 < tiles[to.y][to.x] ? 'white' : 'black';
        let tile = new Tiles();
        tile.forEach(line => {
            line.forEach(v => {
            });
        });
    }
    checkmate(to,tiles) {
        
    }
    calc(from,tiles = new Tiles()) {
        
        return tiles;
    }
    action(from,to) {
        let move = this.calc(from)[to.y][to.x];
        if(move == 0 || move == 6) return false;
        this.move(from,to);
        let turn = this.flag.turn;
        let f = this.flag.turn ? 1 : -1;
        // 特殊処理
        switch(move) {
            case 3 :
                // [ポーン]2マス移動
                this.flag.enpassan[turn][0] = true;
                this.flag.enpassan[turn][1] = new Pos(to.x,to.y-f);
                break;
            case 4 :
                // [ポーン]アンパッサン
                let e = this.flag.enpassan[turn][1];
                this.board[e.y+t][e.x] = 0;
                break;
            case 5 :
                // キングサイドキャスリング
                if(turn) {}
                else {}
                break;
            case 7 :
                // クイーンサイドキャスリング
                if(turn) {}
                else {}
                break;
            case 8 :
            case 9 :
                // [ポーン]プロモーション
                this.flag.promotion[turn][0] = true;
                this.flag.promotion[turn][1] = new Pos(to.x,to.y);
        }
        // 勝利フラグとか
    }
    move(from,to) {
        let r = this.board[to.y][to.x];
        this.board[to.y][to.x] = this.board[from.y][from.x];
        this.board[from.y][from.x] = 0;
        return r;
    }

}

class Pos /* 座標を扱いやすくする */{
    constructor(x=-1,y=-1) {
        this.x = x;
        this.y = y;
    }
    equal(...p) {
        return p.some(v => v.x == this.x && v.y == this.y);
    }
    limit() {
        if((0 < this.x && this.x < 9) && (0 < this.y && this.y < 9)) return true;
        return false;
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
    }
    sub(p) {
        this.x -= p.x;
        this.y -= p.y;
    }
    move(p) {
        console.log(p);
        if(!this.limit(this.add(p))) this.sub(p);
    }
    copy(flip=false) {
        let f = flip ? -1 : 1;
        return new Pos(this.x,this.y*f);
    }
}

class Tiles /* まんま */{
    constructor(b = false) {
        if(b) {
            this[0] = [0,0,0,0,0,0,0,0,0,0];
            this[1] = [0,-3,-4,-5,-2,-1,-5,-4,-3,0];
            this[2] = [0,-6,-6,-6,-6,-6,-6,-6,-6,0];
            this[3] = [0,0,0,0,0,0,0,0,0,0];
            this[4] = [0,0,0,0,0,0,0,0,0,0];
            this[5] = [0,0,0,0,0,0,0,0,0,0];
            this[6] = [0,0,0,0,0,0,0,0,0,0];
            this[7] = [0,6,6,6,6,6,6,6,6,0];
            this[8] = [0,3,4,5,2,1,5,4,3,0];
            this[9] = [0,0,0,0,0,0,0,0,0,0];
        } else {
            this[0] = [0,0,0,0,0,0,0,0,0,0];
            this[1] = [0,0,0,0,0,0,0,0,0,0];
            this[2] = [0,0,0,0,0,0,0,0,0,0];
            this[3] = [0,0,0,0,0,0,0,0,0,0];
            this[4] = [0,0,0,0,0,0,0,0,0,0];
            this[5] = [0,0,0,0,0,0,0,0,0,0];
            this[6] = [0,0,0,0,0,0,0,0,0,0];
            this[7] = [0,0,0,0,0,0,0,0,0,0];
            this[8] = [0,0,0,0,0,0,0,0,0,0];
            this[9] = [0,0,0,0,0,0,0,0,0,0];
        }
    }
    copy(flip = false) {
        let tiles;
        for(let y=0; y<10; y++) {
            for(let x=0; x<10; x++) {
                if(flip) tiles[9-y][9-x] = this[y][x];
                else tiles[y][x] = this[y][x];
            }
        }
        return tiles;
    }
}

class UI /* 入力とか */{
    constructor() {
        this.movableTiles = new Tiles();
        this.cursor = new Pos(8,8);
        this.pickItem = new Pos();
        this.isPick = false;
    }
    setup() {
        document.addEventListener('keydown', (e) => ui.input(e.key));
        render.canvas.addEventListener('click', (e) => {
            let rect = render.canvas.getBoundingClientRect();
            let x = Math.floor((e.clientX - rect.left) / (rect.width / 10));
            let y = Math.floor((e.clientY - rect.top) / (rect.height / 10));
            
            ui.click(new Pos(x,y));
        },);
    }
    input(key) {
        let p;
        switch(key) {
            case 'R' :
                location.reload();
            case 'Enter' :
                this.enter();
            case 'ArrowUp' :
                p = new Pos(0,-1); break;
            case 'ArrowDown' :
                p = new Pos(0,1); break;
            case 'ArrowLeft' :
                p = new Pos(-1,0); break;
            case 'ArrowRight' :
                p = new Pos(1,0); break;
            default :
                console.log(key);    
                break;                   
        }
        this.cursor.move(p);
    }
    click(to) {
        this.cursor = to;
        this.enter(to);
    }
    enter(to) {
        if(master.config.pause) return false;
        if(this.isPick) this.put(to);
        else this.pick(to);
    }
    pick(to) {
        if(isArmy(to,chess.board,chess.flag.turn)) {
            this.pickItem = to;
            this.movableTiles = chess.calc(to);
        }
    }
    put(to) {
        let n = this.movableTiles[to.y][to.x];
        if(n != 0 && n != 6) {
            chess.action(this.pickItem,to);
        }
    }
}

let master,render,chess,ui;
function setup() {
    ui = new UI();
    chess = new Chess();
    master = new Master();
    render = new Render();
    ui.setup();
    render.setup();
    render.rendBoard();
}

function mainloop() {
    /**
     * 入力
     * Chess.action()
     * 動作保存
     * 描画
     */
}

setup();

const isEmpty = (tiles,...p) => (p.every(v => tiles[v.y][v.x] == 0));
const isArmy = (to,tiles,turn) => (isEmpty(tiles,to) && 0 < tiles[to.y][to.x] == turn);
const isEnemy = (to,tiles,turn) => (isEmpty(tiles,to) && 0 > tiles[to.y][to.x] == turn);