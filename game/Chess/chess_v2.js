class Pieces {
    constructor() {
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
        this.canMove = [
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
            [[0,-1]],
            [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],
            [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],
            [[-1,-1],[1,-1],[-1,1],[1,1]],
            [[0,-1],[-1,0],[1,0],[0,1]],
            [[-1,-2],[1,-2],[-2,-1],[2,-1],[-2,1],[2,1],[-1,2],[1,2]]
        ];
        this.moveType = [false,false,true,false,true,true,false];
        /**
         * 0.空白
         * 1.ポーン
         * 2.クイーン
         * 3.キング
         * 4.ビショップ
         * 5.ルーク
         * 6.ナイト
         */
    }
    draw() {
        let s = master.size;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(this.tiles[y][x] == 0) continue;
                let img;
                if(0 < this.tiles[y][x]) img = master.imgW[this.tiles[y][x]];
                else img = master.imgB[-this.tiles[y][x]];
                master.ctx.drawImage(img,s*x,s*y,s,s);
            }
        }
    }
    drawMoveTiles() {
        push();
        let s = master.size;
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(this.canMove[y][x] == 0) continue;
                switch (this.canMove[y][x]) {
                    case 1: master.ctx.fillStyle = '#77c9be'; break;
                    case 2: master.ctx.fillStyle = '#cfa01f'; break;
                }
                master.ctx.fillRect(s*x,s*y,s,s);
            }
        }
        pop();
    }
    move(x,y) {
        if(this.canMove[y][x]) {
            this.tiles[y][x] = cursor.holdPiece.type;
            this.tiles[cursor.holdPiece.y][cursor.holdPiece.x] = 0;
            if(Math.abs(cursor.holdPiece.type) == 1 && x == master.enPassanPos) {
                this.tiles[cursor.holdPiece.y][master.enPassanPos] = 0;
            }
            master.enPassanPos = -1;
            return true;
        }
        return false;
    }
    initMoveTiles() {
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                this.canMove[y][x] = 0;
            }
        }
    }
    calcMoveTiles(x,y) {
        if(this.tiles[y][x] == 0) return;
        let F = 1;
        if(this.tiles[y][x] < 0) F *= -1;
        let tile = this.tiles[y][x] * F;
        this.moveList[tile].forEach(element => {
            let P = {x: x + element[0],y: y + element[1] * F};
            do{
                if(outside(P.x,P.y) && !(follower(P.x,P.y))) {
                    if(enemy(P.x,P.y)) {
                        this.canMove[P.y][P.x] = 2;
                        break;
                    } else {
                        this.canMove[P.y][P.x] = 1;
                    }
                    P.x += element[0];
                    P.y += element[1] * F;
                } else {
                    break;
                }
            }while(this.moveType[tile]);
        });
        if(tile == 1) {
            // ポーンの時の特殊処理 -> [二マス移動,アンパッサン]
            // アンパッサン -> 一つ前の行動で二マス移動を行っていた場合、それと同じx座標のところに移動可能にする
            if(enemy(x,y-F)) this.canMove[y-F][x] = 0;
            else if((master.turn && y == 7 || !(master.turn) && y == 2) && !(enemy(x,y-F*2))) this.canMove[y-F*2][x] = 1;
            if(enemy(x+1,y-F)) this.canMove[y-F][x+1] = 2;
            if(enemy(x-1,y-F)) this.canMove[y-F][x-1] = 2;
            if(Math.abs(x - master.enPassanPos) == 1 && (master.turn && y == 4 || !(master.turn) && y == 5)) this.canMove[y-F][master.enPassanPos] = 2;
        }
    }
}

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
        ]; // 市松模様を再現するだけ
        this.size = Math.min(screen.width,screen.height)/16; // 画面に合わせてサイズ変更
        this.canvas = document.getElementById('target');
        this.ctx = canvas.getContext('2d');
        this.imgW = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.imgB = [0,new Image(),new Image(),new Image(),new Image(),new Image(),new Image()];
        this.turn = true;
        this.enPassanPos = -1;
        this.castFlag = [true,true];
        this.record = [];
        this.checkFlag = false;
        this.checkmateFlag = false;
    }
    setup() {
        for(let i = 1;i < 7;i++) {
            this.imgW[i].src = "img/white/00" + i + ".png";
        }
        for(let i = 1;i < 7;i++) {
            this.imgB[i].src = "img/black/00" + i + ".png";
        }
    }
    drawField() {
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
    check(x,y) {
        for(let i = 1;i < 9;i++) {
            for(let j = 1;j < 9;j++) {
                if(enemy(i,j)) {
                    pieces.initMoveTiles();
                    pieces.calcMoveTiles(i,j);
                    if(pieces.canMove[y][x] == 2) checkFlag = true;
                }
            }
        }
    }
    checkmate(x,y) {
        if(checkFlag) {

        } else {
            return;
        }
    }
}

class Cursor {
    constructor() {
        this.x = 5;
        this.y = 8;
        this.isHold = false; // 持ち駒を選択しているか否か
        this.holdPiece = {x:-1,y:-1,type:0};
        this.canMove = [
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
        ]; // 駒を動かせる範囲の描画(trueの時のみ駒を動かせる)
    }
    draw() {
        push();
        let s = master.size;
        if(this.isHold) {
            master.ctx.fillStyle = '#e65a50';
            master.ctx.fillRect(s*this.holdPiece.x,s*this.holdPiece.y,s,s);
        }
        master.ctx.strokeStyle = '#3d88da';
        master.ctx.lineWidth = '4.0';
        master.ctx.strokeRect(s*this.x,s*this.y,s,s);
        pop();
    }
    move(x,y) {
        if(outside(this.x+x,this.y+y)) {
            this.x += x;
            this.y += y;
        }
        drawing();
    }
    pick() {
        if(pieces.tiles[this.y][this.x] == 0) return;
        if(follower(this.x,this.y)) {
            this.holdPiece.x = this.x;
            this.holdPiece.y = this.y;
            this.holdPiece.type = pieces.tiles[this.y][this.x];
            this.isHold = true;
            pieces.initMoveTiles();
            pieces.calcMoveTiles(this.x,this.y);
            drawing();
        }
    }
}

class Input {
    constructor() {
        this.keybord = false;
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
                // console.log("[" + cursor.x + "," + cursor.y + "] => " + pieces.tiles[cursor.y][cursor.x]);
                if(cursor.isHold) {
                    if(cursor.x == cursor.holdPiece.x && cursor.y == cursor.holdPiece.y) {
                        cursor.isHold = false;
                        drawing();
                    } else {
                        if(pieces.move(cursor.x,cursor.y)) {
                            cursor.isHold = false;
                            master.record.push(new Rec(cursor.holdPiece,cursor));
                            if(Math.abs(cursor.holdPiece.type) == 1 && 1 < Math.abs(cursor.holdPiece.y - cursor.y)) {
                                master.enPassanPos = cursor.x;
                            }
                            master.turn = !master.turn;
                        };
                        drawing();
                    }
                } else {
                    cursor.pick();
                }
            }/*  else if(this.keybord && ('a' <= e.key && e.key <= 'h' || '1' <= e.key && e.key <= '8')) {
                // 棋譜の座標入力用
            } */
        })
    }
    keyInput() {
        this.keybord = !this.keybord;
    }
}

class Rec {
    constructor(P,C,action) {
        this.type = P.type;
        this.x = P.x;
        this.y = P.y;
        this.Nx = C.x;
        this.Ny = C.y;
        this.action = action;
    }
}

let master;
let pieces;
let cursor;
let input;
let loadW = [true,false,false,false,false,false,false];
let loadB = [true,false,false,false,false,false,false];
const outside = (x,y) => (0 < x && x < 9 && 0 < y && y < 9);
const follower = (x,y) => (pieces.tiles[y][x] != 0 && 0 < pieces.tiles[y][x] == master.turn);
const enemy = (x,y) => (pieces.tiles[y][x] != 0 && pieces.tiles[y][x] < 0 == master.turn);

function setup() {
    master = new Master();
    master.setup();
    createCanvas(master.size * 10,master.size * 10);
    // 駒の初期配置をここに挟む
    pieces = new Pieces();
    cursor = new Cursor();
    for(let i = 2n;i < 14;i++) {
        let img;
        if(i % 2n != 0n) {
            img = master.imgW[i/2n];
            img.onload = function() {
                master.ctx.drawImage(img,0,0,0,0);
                loadW[master.imgW.indexOf(img)] = true;
            }
        } else {
            img = master.imgB[i/2n];
            img.onload = function() {
                master.ctx.drawImage(img,0,0,0,0);
                loadB[master.imgB.indexOf(img)] = true;
            }
        }
    }
    let _setInterval_ = setInterval(find,100);
    function find() {
        if(loadW.every(value => value) && loadB.every(value => value)) {
            drawing();
            input = new Input();
            clearInterval(_setInterval_);
        }
    }
}

function drawing() {
    master.drawField();
    if(cursor.isHold)pieces.drawMoveTiles();
    cursor.draw();
    pieces.draw();
}

/**
 * TODO
 * 
 * ログ(棋譜)機能
 * SE若しくは駒移動のアニメーション
 * 対人or対CPUの実装
 * チェックメイトの特殊処理
 * 
 * キャスリング、プロモーションの実装
 * -> チェック,チェックメイトの判定実装
 * 敵の攻撃を全部計算して、王の座標に重なるようならチェック
 * チェックフラグが立っていて、全組み合わせを試して尚覆らないならチェックメイト?
 * ステイルメイトになってるかどうかの判定も必要
 * あと自害禁止機能も
 * 
 * 一手動かして再計算するのもどうかと思うので、チェックできる駒が見つかった時点で防げる範囲を保存しておく
 * その後出てきた駒をその範囲で防げなくなった時点であうと
 * 
 * 汚くなってきたので作り直しましょう
 */