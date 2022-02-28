/**
 * 場の状態を示す
 * 棋譜とかフラグとか
 * 変更可能
 */
class Master {
    constructor() {
        this.board = new Tiles('base');
        this.flag = {
            turn: true
        };
    }
    canPick(to) {
        if (this.board.at(to) == 0) return false;
        return 0 < this.board.at(to) && this.flag.turn;
    }
    /**
     * String型から変換して色々やる
     * @param {String} fromStr 
     * @param {String} toStr 
     */
    input(fromStr, toStr) {
        let from, to, grid = new Tiles('grid');
        for(let y = 1; y < 10; y++) {
            for(let x = 1; x < 10; x++) {
                if(grid[y][x] == fromStr) from = new Pos(x, y)
                if(grid[y][x] == toStr) to = new Pos(x, y);
            }
        }

    }
}

/**
 * チェス自体の動きを格納したもの
 * 変更不可
 */
class Chess {
    constructor() {
        this.motion = [
            [null, false, true, true, true, false, false],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1), new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1), new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(0, 1), new Pos(-1, 0), new Pos(1, 0), new Pos(0, -1)],
            [new Pos(-1, -1), new Pos(1, -1), new Pos(-1, 1), new Pos(1, 1)],
            [new Pos(-1, -2), new Pos(1, -2), new Pos(-2, -1), new Pos(2, -1), new Pos(-2, 1), new Pos(2, 1), new Pos(-1, 2), new Pos(1, 2)],
            [new Pos(0, -1)]
        ];
    }
    /**
     * 条件に一致するタイルを返す
     * @param {Tiles} tiles 
     * @param {Function} func 
     * @return {Tiles}
     */
    search(tiles, func) {
        let result = new Tiles();
        for (let y = 1; y < 9; y++) {
            for (let x = 1; x < 9; x++) {
                if (func(tiles[y][x])) result[y][x] = 1;
            }
        }
        return result;
    }
    /**
     * その位置にある駒が移動できるタイルを返す
     */
    calc(from, tiles = new Tiles()) {
        let dup = tiles == new Tiles() ? false : true;
        // 情報が足りない
        // でも引数増やしたくない🤔
    }
    /**
     * 遊び大全のあれ
     * チェックメイトの判定に使用
     */
    dangerMap()
}

class Render {

}

class UI {
    constructor() {
        this.cursor = new Pos(8, 8);
        this.isPick = false;
        this.pickItem = new Pos(0, 0);
        this.grid = new Tiles('grid');
        this.gridFlip = false;
        document.addEventListener('keydown', (e) => ui.input(e.key));
        canvas.addEventListener('click', (e) => {
            let rect = canvas.getBoundingClientRect();
            let x = Math.floor((e.clientX - rect.left) / (rect.width / 10));
            let y = Math.floor((e.clientY - rect.top) / (rect.height / 10));

            ui.click(new Pos(x, y));
        });
    }
    input(key) {
        let p;
        switch (key) {
            case 'ArrowUp': p = new Pos(0, -1); break;
            case 'ArrowDown': p = new Pos(0, 1); break;
            case 'ArrowRight': p = new Pos(1, 0); break;
            case 'ArrowLeft': p = new Pos(-1, 0); break;

            case 'Enter': this.enter(); return;
            case 'R': this.reset(); return;

            default: console.log(key); return;
        }
        this.cursor.add(p);
    }
    click(p) {
        this.cursor = p;
        this.enter();
    }
    enter() {
        if (this.isPick) {
            let grid = this.grid.copy(this.gridFlip);

            master.input(grid.at(this.pickItem), grid.at(this.cursor));
            this.isPick = false;
        } else if (master.board.at(this.cursor) != 0) {
            this.pickItem = this.cursor.copy();
            this.isPick = true;
        }
    }
    reset() {
        // ?
    }
}

// class Step extends Pos{
//     constructor(from, to) {
//         this.from = from;
//         this.to = to;
//     }
// }

// class Pos extends StData{
//     /**
//      * 
//      * @param {Number} x 
//      * @param {Number} y 
//      */
//     constructor(x = 0, y = 0) {
//         this.x = this.y = 0;
//         this.add(x, y);
//         super(x, y);
//     }
//     limit() {
//         this.x = chmix(this,x, 1, 9);
//         this.y = chmix(this.y, 1, 9);
//     }
//     add(x, y) {
//         if(x instanceof Pos) {
//             this.x += p.x;
//             this.y += p.y;
//         } else {
//             this.x += x;
//             this.y += y;
//         }
//         this.limit();
//     }
//     copy() {
//         return new Pos(this.x, this.y);
//     }
// }

// class StData {
//     constructor(x, y) {
//         this.st = this.ptos(x) + String(y);
//     }
//     /**
//      * 
//      * @param {Number} num 
//      * @returns {String}
//      */
//     ptos(num) {
//         return String.fromCharCode('a'.charCodeAt() + num - 1);
//     }
//     /**
//      * 
//      * @param {String} str 
//      * @returns {Number}
//      */
//     stop(str) {
//         return str.charCodeAt() - 'a'.charCodeAt() + 1;
//     }
// }

/**
 * String型で入れたらPos型の配列に変換してくれる
 */
class Step {

}

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    limit() {
        this.x = chmix(this.x, 1, 9);
        this.y = chmix(this.y, 1, 9);
    }
    add() {
        if (x instanceof Pos) {
            this.x += p.x;
            this.y += p.y;
        } else {
            this.x += x;
            this.y += y;
        }
        this.limit();
    }
    copy(flip = false) {
        let c = flip ? -1 : 1;
        return new Pos(this.x, this.y * c);
    }
}

class Tiles {
    /**
     * キーワードに対応したタイルを返す
     * @param {String} Str
     */
    constructor(Str) {
        if (Str == 'base') {
            this[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[1] = [0, -3, -4, -5, -2, -1, -5, -4, -3, 0];
            this[2] = [0, -6, -6, -6, -6, -6, -6, -6, -6, 0];
            this[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[7] = [0, 6, 6, 6, 6, 6, 6, 6, 6, 0];
            this[8] = [0, 3, 4, 5, 2, 1, 5, 4, 3, 0];
            this[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        } else if (Str == 'grid') {
            this[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[1] = [0, 'h1', 'g1', 'f1', 'e1', 'd1', 'c1', 'b1', 'a1', 0];
            this[2] = [0, 'h2', 'g2', 'f2', 'e2', 'd2', 'c2', 'b2', 'a2', 0];
            this[3] = [0, 'h3', 'g3', 'f3', 'e3', 'd3', 'c3', 'b3', 'a3', 0];
            this[4] = [0, 'h4', 'g4', 'f4', 'e4', 'd4', 'c4', 'b4', 'a4', 0];
            this[5] = [0, 'h5', 'g5', 'f5', 'e5', 'd5', 'c5', 'b5', 'a5', 0];
            this[6] = [0, 'h6', 'g6', 'f6', 'e6', 'd6', 'c6', 'b6', 'a6', 0];
            this[7] = [0, 'h7', 'g7', 'f7', 'e7', 'd7', 'c7', 'b7', 'a7', 0];
            this[8] = [0, 'h8', 'g8', 'f8', 'e8', 'd8', 'c8', 'b8', 'a8', 0];
            this[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        } else if (Str == 'color') {
            this[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[1] = [0, 1, 2, 1, 2, 1, 2, 1, 2, 0];
            this[2] = [0, 2, 1, 2, 1, 2, 1, 2, 1, 0];
            this[3] = [0, 1, 2, 1, 2, 1, 2, 1, 2, 0];
            this[4] = [0, 2, 1, 2, 1, 2, 1, 2, 1, 0];
            this[5] = [0, 1, 2, 1, 2, 1, 2, 1, 2, 0];
            this[6] = [0, 2, 1, 2, 1, 2, 1, 2, 1, 0];
            this[7] = [0, 1, 2, 1, 2, 1, 2, 1, 2, 0];
            this[8] = [0, 2, 1, 2, 1, 2, 1, 2, 1, 0];
            this[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        } else {
            this[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[1] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[3] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[4] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[5] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[6] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[7] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[8] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            this[9] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
    }
    /**
     * 第一引数のみならその場所の数値を返す  
     * 第二引数が存在するならその場所に引数を代入する
     * @param {Pos} to 
     * @param {Number} num 
     * @returns {Number}
     */
    at(to, num) {
        if (num == undefined) return this[to.y][to.x];
        this[to.y][to.x] = num;
    }
    copy(flip = false) {
        let result = new Tiles();
        // for (let y = 0; y < 10; y++) result[y] = flip ? [...this[9 - y]] : [...this[y]];
        for (let y = 1; y < 9; y++) {
            for(let x = 1;x < 9; x++) {
                result[y][x] = flip ? this[9 - y][9 - x] : this[y][x];
            }
        }
        return result;
    }
}

const master, chess, render, ui, canvas;
function setup() {

}

const chmix = (a, b, c) => { if (b < c) return (chmax(a, b) || chmin(a, c)); return (chmax(a, c) || chmin(a, b)); }
// const chmix = (a, b, c) => { let max, min; [max, min] = b < c ? [b, c] : [c, b]; return !(chmax(a, max) || chmin(a, min)); }
const chmax = (a, b) => { if (a < b) { return b; } return 0; }
const chmin = (a, b) => { if (a > b) { return b; } return 0; }