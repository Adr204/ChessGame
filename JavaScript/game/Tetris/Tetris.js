class Block {
    constructor(x,y,color) {
        this.x = x;
        this.y = y;
        this.color = -1;
        this.color = color;
        this.canvas = document.getElementById('p5Canvas');
        this.ctx = canvas.getContext('2d');
    }
    drawMini() {
        push();
        let s = 16;
        rect(s*this.x,s*this.y,s,s);
        switch(this.color) {
            case -1: this.ctx.fillStyle = 'white'; break;
            case 0: this.ctx.fillStyle = 'black'; break;
            case 1: this.ctx.fillStyle = '#eb88eb'; break;
            case 2: this.ctx.fillStyle = '#d40630'; break;
            case 3: this.ctx.fillStyle = '#45f545'; break;
            case 4: this.ctx.fillStyle = '#db740d'; break;
            case 5: this.ctx.fillStyle = '#0f45d9'; break;
            case 6: this.ctx.fillStyle = '#e6da09'; break;
            case 7: this.ctx.fillStyle = '#13c2ed'; break;
        }
        this.ctx.fillRect(s*this.x,s*this.y,s,s);
        pop();
    }
    draw() /** 1ブロック(25×25)を描画する */ {
        push();
        let s = 25;
        rect(s*this.x,s*this.y,s,s);
        switch(this.color) {
            case -1: this.ctx.fillStyle = 'white'; break;
            case 0: this.ctx.fillStyle = 'black'; break;
            case 1: this.ctx.fillStyle = '#eb88eb'; break;
            case 2: this.ctx.fillStyle = '#d40630'; break;
            case 3: this.ctx.fillStyle = '#45f545'; break;
            case 4: this.ctx.fillStyle = '#db740d'; break;
            case 5: this.ctx.fillStyle = '#0f45d9'; break;
            case 6: this.ctx.fillStyle = '#e6da09'; break;
            case 7: this.ctx.fillStyle = '#13c2ed'; break;
        }
        this.ctx.fillRect(s*this.x,s*this.y,s,s);
        pop();
    }
}

class Mino {
    constructor(x,y,rot,shape) {
        this.x = x; //x座標
        this.y = y; //y座標
        this.rot = rot; //回転数
        this.shape = shape; //ブロックの形
    }
    list() {
        console.log('0:Tミノ');
        console.log('1:Zミノ');
        console.log('2:Sミノ');
        console.log('3:Lミノ');
        console.log('4:Jミノ');
        console.log('5:Oミノ');
        console.log('6:Iミノ');
    }
    calcBlocks() {
        let blocks = [];
        //blocks = [new Block(-1,0), new Block(0,0), new Block(0,-1), new Block(1,0)];
        switch(this.shape) {
            case 0: blocks = [new Block(-1,0,1), new Block(0,0,1), new Block(0,-1,1), new Block(1,0,1)];break; //T
            case 1: blocks = [new Block(-1,-1,2), new Block(0,-1,2), new Block(0,0,2), new Block(1,0,2)];break; //Z
            case 2: blocks = [new Block(0,-1,3), new Block(1,-1,3), new Block(-1,0,3), new Block(0,0,3)];break; //S
            case 3: blocks = [new Block(1,-1,4), new Block(-1,0,4), new Block(0,0,4), new Block(1,0,4)];break; //L
            case 4: blocks = [new Block(-1,-1,5), new Block(-1,0,5), new Block(0,0,5), new Block(1,0,5)];break; //J
            case 5: blocks = [new Block(0,-1,6), new Block(1,-1,6), new Block(0,0,6), new Block(1,0,6)];break; //O
            case 6: blocks = [new Block(-1,0,7), new Block(0,0,7), new Block(1,0,7), new Block(2,0,7)];break; //I
        }
        let rot = (40000000 + this.rot) % 4; //余剰で0~3に丸め込む
        for(var r=0;r<rot;r++) {
            blocks = blocks.map(b => new Block(-b.y,b.x,b.color)); //各要素に対して、回転後の座標を適用させる
            //map => 全要素に対して特定の処理をした配列を出力する
        }
        blocks.forEach(b => (b.x += this.x,b.y += this.y));
        return blocks;
    }
    draw() {
        let blocks = this.calcBlocks();
        //forEach => 全部の要素に対して特定の処理をする
        for(let b of blocks) {
            b.draw();
        }
    }
    drawMini() {
        let blocks = this.calcBlocks();
        for(let b of blocks) {
            b.drawMini();
        }
    }
    copy() {
        return new Mino(this.x,this.y,this.rot,this.shape);
    }
}

class Field {
    constructor() {
        this.tiles = [
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
        ];
        this.colors= [
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,0,0,0,0,0,0,0,0,0,0,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        ];
    }
    tileAt(x,y) {
        if(x<0 || x>=12 || y<0 || y >= 21) return 1; //画面外
        return this.tiles[y][x];
    }
    putBlock(x,y,color) {
        this.tiles[y][x] = 1;
        this.colors[y][x] = color;
    }
    findLineFilled() {
        for(let y=0; y<20; y++) {
            let isFilled = this.tiles[y].every(t => t === 1); //配列が条件を満たしているか判定
            if(isFilled) return y;
        }
        return -1;
    }
    cutLine(y) {
        this.tiles.splice(y,1); //index(y)の要素を一つ削除
        this.colors.splice(y,1);
        this.tiles.unshift([1,0,0,0,0,0,0,0,0,0,0,1]); //先頭に要素を追加する ≒ テトリスのライン消し
        this.colors.unshift([-1,0,0,0,0,0,0,0,0,0,0,-1]);
    }
    draw() {
        for(let y = 0;y < 21;y++) {
            for(let x = 0;x < 12;x++) {
                if(this.tiles[y][x] === 0) continue;
                new Block(x,y,this.colors[y][x]).draw();
            }
        }
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById("p5Canvas");
        this.ctx = canvas.getContext("2d");
        this.mino = Game.makeMino();
        this.nextMino = new Mino(20,5,0,nextList[1]);
        this.minoVx = 0;
        this.minoDrop = false;
        this.minoVr = 0;
        this.field = new Field();
        this.fc = 0;
        this.score = 0;
        this.lvl = 1;
        this.gameoverFlag = false;
    }
    static makeMino() /** ランダムでミノを出現させる */ {
        if(nextList.length <= 4) {
            nextList = nextList.concat(Game.nextMino());
        }
        return new Mino(5,2,0,nextList[0]);
    }
    static nextMino() {
        let next = [0,1,2,3,4,5,6];
        let RND = [];
        for(let i=6;i > 0;i--) {
            let rnd = floor(random(0,i));
            RND.push(next[rnd]);
            next.splice(rnd,1);
        }
        RND.push(next[0]);
        return RND;
    }
    static isMinoMovable(mino,field) /** 今動かしているブロック全部とFieldを照らし合わせて、同座標にブロックがあるか判定 ≒ すり抜け防止 */ {
        let blocks = mino.calcBlocks();
        return blocks.every(b => field.tileAt(b.x,b.y) === 0);
    }
    drawScore() {
        push();
        this.ctx.font = "48px Arial";
        this.ctx.fillStyle = "#70dd40";
        this.ctx.fillText("Score: "+this.score, 8, 600);
        pop();
    }
    drawNext() {
        push();
        this.ctx.font = "16px Arial";
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText("NextMino",320,50);
        this.nextMino.drawMini();
        pop();
    }
    proc() {
        // 落下
        if(this.minoDrop || (this.fc % 30) === 29) {
            let futureMino = this.mino.copy();
            futureMino.y += 1;
            if(Game.isMinoMovable(futureMino,this.field)) {
                this.mino.y += 1;
            } else {
                // 接地
                nextList.splice(0,1);
                for(let b of this.mino.calcBlocks()) {
                    if(this.field.tiles[b.y][b.x] === 1) {
                        this.gameoverFlag = true;
                        stop();
                        break;
                    }
                    this.field.putBlock(b.x,b.y,b.color);
                    this.mino = Game.makeMino();
                    this.nextMino = new Mino(21,5,0,nextList[1]);
                }
                console.log(nextList);
            }
            // 消去
            let line;
            let point = 0;
            while((line = this.field.findLineFilled()) !== -1) {
                console.log(line);
                this.field.cutLine(line);
                point++;
            }
            this.score += (point * point * this.lvl * 100);
            this.minoDrop = false;
        }
        // 左右移動
        if(this.minoVx !== 0) {
            let futureMino = this.mino.copy();
            futureMino.x += this.minoVx;
            if(Game.isMinoMovable(futureMino,this.field)) {
                this.mino.x += this.minoVx;
            }
            this.minoVx = 0;
        }
        // 回転
        if(this.minoVr !== 0) {
            let futureMino = this.mino.copy();
            futureMino.rot += this.minoVr;
            if(Game.isMinoMovable(futureMino,this.field)) {
                this.mino.rot += this.minoVr;
            }
            this.minoVr = 0;
        }

        // 描画
        background(64);
        this.mino.draw();
        this.field.draw();
        
        this.fc++;
    }
}
let game;

document.addEventListener("keydown", keyPressed, false);
document.addEventListener("keyup",function() {press = false;},false);
var press;

function keyPressed(e) {
    if(press) {
        return;
    }
    // console.log(e.key);
    if(e.key == 'Right' || e.key == "ArrowRight") {
        game.minoVx++;
        press = true;
    }
    if(e.key == 'Left' || e.key == "ArrowLeft") {
        game.minoVx--;
        press = true;
    }
    if((e.key == 'Up' || e.key == "ArrowUp")) {
        if(e.shiftKey) {
            game.minoVr--;
            press = true;
        } else {
            game.minoVr++;
            press = true;
        }
    }
    if(e.key == 'Down' || e.key == "ArrowDown") {
        if(e.shiftKey) {
            for(let i=0;i < 21;i++) {
                let futureMino = game.mino.copy();
                futureMino.y += 1;
                if(Game.isMinoMovable(futureMino,game.field)) {
                    game.mino.y += 1;
                } else {
                    break;
                }
            }
        } else {
            game.minoDrop = true;
            press = true;
        }
    }
}

let processing = true;
function stop() {
    processing = !processing;
    console.log(processing);
    if(game.gameoverFlag) {
        alert('GAME OVER!');
        let result = confirm('Would you like to try the game again?');
        if(result) {
            location.reload();
        } else {
            alert('Thank you for playing!');
        }
        return;
    }
}

let nextList = [];
function setup() {
    createCanvas(400,600);
    nextList = Game.nextMino();
    console.log(nextList);
    game = new Game();
}

function draw() {
    if(processing) {
        game.proc();
        game.drawScore();
        game.drawNext();
    }
}