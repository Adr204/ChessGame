class Pieces {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.tiles = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,-5,-6,-4,-2,-3,-4,-6,-5,0],
            [0,-1,-1,-1,-1,-1,-1,-1,-1,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [0,5,6,4,2,3,4,6,5,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        this.imgW = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.imgB = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.canMove = [
            [],
            [[0,-1]],
            [[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7],[-7,-7],[7,-7],[-6,-6],[6,-6],[-5,-5],[5,-5],[-4,-4],[4,-4],[-3,-3],[3,-3],[-2,-2],[2,-2],[-1,-1],[1,-1],[-7,7],[7,7],[-6,6],[6,6],[-5,5],[5,5],[-4,4],[4,4],[-3,3],[3,3],[-2,2],[2,2],[-1,1],[1,1]],
            [[1,1],[0,1],[-1,1],[1,0],[-1,0],[1,-1],[0,-1],[-1,-1]],
            [[-7,-7],[7,-7],[-6,-6],[6,-6],[-5,-5],[5,-5],[-4,-4],[4,-4],[-3,-3],[3,-3],[-2,-2],[2,-2],[-1,-1],[1,-1],[-7,7],[7,7],[-6,6],[6,6],[-5,5],[5,5],[-4,4],[4,4],[-3,3],[3,3],[-2,2],[2,2],[-1,1],[1,1]],
            [[0,7],[0,6],[0,5],[0,4],[0,3],[0,2],[0,1],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[-1,0],[-2,0],[-3,0],[-4,0],[-5,0],[-6,0],[-7,0],[0,-1],[0,-2],[0,-3],[0,-4],[0,-5],[0,-6],[0,-7]],
            [[1,2],[-1,2],[2,1],[-2,1],[2,-1],[-2,-1],[1,-2],[-1,-2]]
        ];
        /**
         * 1.ポーン
         * 2.クイーン
         * 3.キング
         * 4.ビショップ
         * 5.ルーク
         * 6.ナイト
         */
    }
    setup() {
        for(let i = 1;i < 7;i++) {
            this.imgW[i].src = "img/white/00" + i + ".png";
        }
        for(let i = 1;i < 7;i++) {
            this.imgB[i].src = "img/black/00" + i + ".png";
        }
    }
    draw() {
        push();
        let s = field.size;
        for(let y = 0;y < 9;y++) {
            for(let x = 0;x < 9;x++) {
                let piece = this.tiles[y][x];
                if(piece === 0) {
                    continue;
                }
                let img;
                if(0 < piece) {
                    img = this.imgW[piece];
                } else {
                    img = this.imgB[-piece];
                }
                field.ctx.drawImage(img,x*s,y*s,s,s);
            }
        }
        pop();
    }
    drawMove(x,y) {
        push();
        let s = field.size;
        let type = this.tiles[y][x];
        let move = this.canMove[Math.abs(type)];
        console.log("Pos: [" + x + "," + y + "]");
        for(let i = 0;i < move.length;i++) {
            let after;
            if(0 < type) {
                after = [move[i][0] + x,move[i][1] + y];
            } else {
                after = [move[i][0] + x,move[i][1] * -1 + y];
            }
            console.log(after[0] + "," + after[1]);
            if(0 < after[0] && after[0] < 9 && 0 < after[1] && after[1] < 9 && this.tiles[after[1]][after[0]] == 0) {
                if(0 < type) {
                    field.ctx.fillStyle = '#77c9be';
                } else {
                    field.ctx.fillStyle = '#c97777';
                }
                field.ctx.fillRect(s*after[0],s*after[1],s,s);
            }
        }
        pop();
    }
    list() {
        for(let v = 0;v < this.text.length();v++) {
            console.log((v+1) + ": " + this.text[v]);
        }
    }
}

class Field {
    constructor() {
        this.tiles = [
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
        this.size = Math.min(screen.width,screen.height)/16;
        this.canvas = document.getElementById('target');
        this.ctx = canvas.getContext('2d');
    }
    draw() {
        push();
        let s = this.size;
        for(let y = 0;y < 10;y++) {
            for(let x = 0;x < 10;x++) {
                switch(this.tiles[y][x]) {
                    case 0: this.ctx.fillStyle = '#915f3d'; break; // 縁取り
                    case 1: this.ctx.fillStyle = '#e0b882'; break;
                    case 2: this.ctx.fillStyle = '#b5804a'; break;
                }
                this.ctx.fillRect(s*x,s*y,s,s);
            }
        }
        pop();
    }
}

class Cursor {
    constructor() {
        this.x = 1;
        this.y = 7;
        this.isHave = false;
    }
    move(_x,_y,char) {
        if(_x == 0 && _y == 0) {
            console.log(char);
            if('a' <= char && char <= 'h') {
                this.x = char.charCodeAt(0) - 'a'.charCodeAt() + 1;
            } else {
                this.y = char;
            }
        } else if(0 < this.x + _x && this.x + _x < 9 && 0 < this.y + _y && this.y + _y < 9) {
            this.x += _x;
            this.y += _y;
        }
        debug.draw();
    }
    draw() {
        let s = field.size;
        push();
        field.ctx.strokeStyle = "#3d88d9";
        field.ctx.lineWidth = "4.0";
        field.ctx.strokeRect(s*this.x,s*this.y,s,s);
        pop();
    }
    getInfo() {
        let tile = pieces.tiles[this.y][this.x];
        if(tile == 0) return 0;
        switch(Math.abs(tile)) {
            case 1: console.log("ポーン"); break;
            case 2: console.log("クイーン"); break;
            case 3: console.log("キング"); break;
            case 4: console.log("ビショップ"); break;
            case 5: console.log("ルーク"); break;
            case 6: console.log("ナイト"); break;
        }
        pieces.drawMove(this.x,this.y);
    }
}


let field;
let pieces;
let cursor;
let debug;
function setup() {
    field = new Field();
    createCanvas(field.size * 10,field.size * 10);
    pieces = new Pieces();
    pieces.setup();
    cursor = new Cursor();
    debug = new Debug();
    window.setTimeout(deray,200);
}
function deray() {
    debug.draw();
    addEventListener("keydown",function(e) {
        if(e.key == "ArrowUp") {
            cursor.move(0,-1);
        } else if(e.key == "ArrowDown") {
            cursor.move(0,1);
        } else if(e.key == "ArrowRight") {
            cursor.move(1,0);
        } else if(e.key == "ArrowLeft") {
            cursor.move(-1,0);
        } else if(inputFromKeybord && ('a' <= e.key && e.key <= 'h' || '1' <= e.key && e.key <= '8')) {
            cursor.move(0,0,e.key);
        } else if(e.key == "Enter") {
            cursor.getInfo();
        }
    },true);
}

let inputFromKeybord = false;
class Debug {
    constructor() {
        field.draw();
        cursor.draw();
        pieces.draw();
    }
    draw() {
        field.draw();
        cursor.draw();
        pieces.draw();
    }
    keyInput() {
        inputFromKeybord = !inputFromKeybord;
        return inputFromKeybord;
    }
}

/**
 * TODO
 * 
 * [*] Enter押したら駒の情報(敵味方,キャスリング済み,取った駒の数etc..)
 * [*] デフォルメ画像か、ドットの駒表示
 * ログ保存
 * SEつける
 * 対人or対CPU
 * 操作
 * 間に駒があると移動できない仕様の再現
 * [+] 操作ガイド表示
 * [*] a~hと1~8のキーを押したらその場所にカーソル移動
 */