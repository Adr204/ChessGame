class Master {
    // こっちは棋譜とかの補助機能
    constructor() {
        this.chessBoard = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 2, 1, 2, 1, 2, 1, 2, 0],
            [0, 2, 1, 2, 1, 2, 1, 2, 1, 0],
            [0, 1, 2, 1, 2, 1, 2, 1, 2, 0],
            [0, 2, 1, 2, 1, 2, 1, 2, 1, 0],
            [0, 1, 2, 1, 2, 1, 2, 1, 2, 0],
            [0, 2, 1, 2, 1, 2, 1, 2, 1, 0],
            [0, 1, 2, 1, 2, 1, 2, 1, 2, 0],
            [0, 2, 1, 2, 1, 2, 1, 2, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.img = {
            white: [null, new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            black: [null, new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()],
            wload: [true, false, false, false, false, false, false],
            bload: [true, false, false, false, false, false, false]
        };
        this.size = navigator.userAgent.match(/iPhone|Android.+Mobile/) ? 
                    screen.width / 10 : 
                    Math.min(screen.width, screen.height) / 16;
        this.ctx = canvas.getContext('2d');
        this.data = [];
        this.config = {
            kingSafety: true,
            useNumkey: false,
            boardFlip: false,
        };
    }
    setImg() {
        let C = color;
        this.img[C(true)].src  = 'assets/img/x.png';
        this.img[C(false)].src = 'assets/img/x.png';
        for (let c = 0; c < 2; c++) {
            for (let i = 1; i < 7; i++) {
                this.img[C(c)][i].src = 'assets/img/' + C(c) + '/00' + i + '.jpg';
            }
        }
    }
    setCanvas() {
        canvas.width = this.size * 10;
        canvas.height = this.size * 10;
    }
    access(from) {
        let p = this.config.boardFlip ? new Pos(9-from.x,9-from.y).copy() : from.copy();
        return p;
    }
    static save() {

    }
    static load() {

    }
}

class Game {
    // こっちはチェスの機能のみを詰める感じ
    constructor() {
        this.board = Tile.new(true);
        this.move = Tile.new();
        this.motion = [
            [null, false/* K */, true/* Q */, true/* R */, true/* B */, false/* K */, false/* P */],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1), new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1), new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1)],
            [new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(-1, -2), new Pos(1, -2), new Pos(-2, -1), new Pos(2, -1), new Pos(-2, 1), new Pos(2, 1), new Pos(-1, 2), new Pos(1, 2)],
            [new Pos(0, -1)]
        ];
        this.flag = {
            cast: { white: [true, true, true], black: [true, true, true] },
            promo: { white: [false, new Pos()], black: [false, new Pos()] },
            enpass: { white: [false, new Pos()], black: [false, new Pos()] },
            winner: null,
            turn: true
        };
    }
    calc(from,tiles = new Tile()) {
        if(isEmpty(this.board,from)) return tiles;
        let item = this.board[from.y][from.x],type = abs(item),t = 0 < item ? 1 : -1;
        let stack = tiles == new Tile() ? true : false;
        
        if(type == 6) {
            let p = new Pos(from.x,from.y-t);
            if(!isField(p)) return tiles;

            if(isEmpty(this.board,p) && !stack) {

            }
        } else {

        }
    }
    move(from,to) {

    }
}

// 場合によっては別に描画用で作る
/* class Render {
    constructor() {
        
    }
} */

class UI {
    constructor() {
        this.pos = new Pos(0, 0);
        this.holdItem;
        this.isHold = false;
    }
    cursor(to) {
        this.pos.add(to);
    }
    pick() {
        this.holdItem = this.pos.copy();
    }
    put() {
        let ac = master.access;
        game.move(ac(this.holdItem),ac(this.pos));
    }
}

class Tile {
    constructor(basic = false) {
        let tile = Tile.new(basic);
        for(let i = 0; i < 10; i++) this[i] = tile[i];
    }
    static new(basic = false) {
        return basic ?
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, -3, -4, -5, -2, -1, -5, -4, -3, 0],
                [0, -6, -6, -6, -6, -6, -6, -6, -6, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 6, 6, 6, 6, 6, 6, 6, 6, 0],
                [0, 3, 4, 5, 2, 1, 5, 4, 3, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ] :
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
    }
    copy() {
        let _tile = new Tile();
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                _tile[y][x] = this[y][x];
            }
        }

        return _tile;
    }
    flip(tile) {
        // そのままチェス盤回すイメージ
        let _tile = new Tile();
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                _tile[9-y][9-x] = this[y][x];
            }
        }

        return _tile;
    }
}

class Pos {
    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }
    isField() {
        if(this.x < 1) this.x = 0;
        if(this.x > 8) this.x = 8;
        if(this.y < 1) this.y = 0;
        if(this.y > 8) this.y = 8;
    }
    equal(to) {
        if (this.x == to.x && this.y == to.y) return true;
        return false;
    }
    add(to, flip = false) {
        this.x += to.x;
        this.y += to.y * (flip ? -1 : 1);
    }
    copy() {
        return new Pos(this.x,this.y);
    }
}
let canvas = document.getElementById('default'), master = new Master(), game = new Game(), ui = new UI();
function setup() {

}

function argError(...arg) {
    // かっこよくエラー出力したかったのだ
    console.error(arg);
    throw new TypeError("Argument types are different");
}

const isField = (p) => (0 < Math.min(p.x, p.y) && Math.max(p.x, p.y) <= 8);
const isEmpty = (tiles, ...p) => (p.every(v => tiles[v.y][v.x] == 0));
const color = (turn) => turn ? 'white' : 'black';
// const isPhone = () => navigator.userAgent.match(/iPhone|Android.+Mobile/) ? true : false;
// const isArmy = (p,turn = game.flag.turn) => (!(isEmpty(game.board,p)) && (0 < game.board[p.y][p.x] == turn));
// const isEnemy = (p,turn = game.flag.turn) => (!(isEmpty(game.board,p)) && (0 < game.board[p.y][p.x] != turn));
// const isEven = num => (typeof num == 'number' || num instanceof Number) && num % 2 === 0;
// class実体をどこに置くか
// UIどうするか(スタートメニューとか)
// どのタイミングで棋譜の保存をするか
// データ置き場の整理