class Master {
    constructor() {
        this.board = new Tiles('base');
        this.flaglist = {
            castling: {
                white: [false,false,false],
                black: [false,false,false]
            },
            promotion: {
                white: [false,new Pos()],
                black: [false,new Pos()]
            },
            enpassan: {
                white: [false,new Pos()],
                black: [false,new Pos()]
            },
            winner: undefined,
            turn: true,
            phase: 0
            // 入力→一度計算結果表示→再度入力で確定
            // 入力による特殊処理フェーズ
            // チェックメイト判定フェーズ
            // ターン切り替え
        };
        this.configuration = {
            isPhone: navigator.userAgent.match(/iPhone|Android.+Mobile/),
            kingProtect: true,
            useKeyboard: false,
            pause: true
        };
        this.displaySize = this.config.isPhone ? 
                            screen.width : 
                            screen.height;
        this.log = [];
    }
    get display() {
        return this.displaySize;
    }
    get config() {
        return this.config;
    }
    input(mozi) {
        // チェス盤座標の形で入力を受け取ってステップ進める
    }
    /**
     * 
     * @param {Data} data 
     */
    save(data) {
        this.log.push(data);
    }
    load() {
        // 番号指定にするかなんか
        // 機能つけるならビジュアルでわかりやすくすると思う
        // ←→で次へとか戻るとか
    }
    output() {

    }
}

class Game {
    constructor() {
        this.motion = [     
            [null,false,true,true,true,false,false],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1),new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(0,1),new Pos(-1,0),new Pos(1,0),new Pos(0,-1)],
            [new Pos(-1,-1),new Pos(1,-1),new Pos(-1,1),new Pos(1,1)],
            [new Pos(-1,-2),new Pos(1,-2),new Pos(-2,-1),new Pos(2,-1),new Pos(-2,1),new Pos(2,1),new Pos(-1,2),new Pos(1,2)],
            [new Pos(0,-1)]
        ];
    }
    get flag() {
        return this.flaglist;
    }
    /**
     * 与えられた条件に合致したタイルの位置を返す
     * @param {Tiles} tiles
     * @param {Function} func 
     * @returns {Tiles}
     */
    search(tiles,func) {
        let result = new Tiles();
        for(let y = 1;y < 9;y++) {
            for(let x = 1;x < 9;x++) {
                if(func(tiles[y][x])) result[y][x] = 1;
            }
        }
        return result;
    }
    /**
     * 指定した座標に存在する駒の移動可能位置を返す
     * 第三引数にTiles型が与えられた場合それを上書きして返す
     * @param {Tiles} tiles 
     * @param {Pos} p 
     */
    calc(tiles,p,_ = new Tiles()) {

    }
    move() {

    }
}

class Render {
    constructor() {
        this.canvas = document.getElementById('default');
        this.ctx = this.canvas.getContext('2d');
        this.image = {
            white: [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()],
            black: [new Image(),new Image(),new Image(),new Image(),new Image(),new Image(),new Image()]
        };
        this.image.white[0].src = 'assets/img/x.png';
        this.image.black[0].src = 'assets/img/x.png';
        for(let i = 1;i < 7;i++) {
            this.image.white[i].src = `assets/img/white/00${i}.png`;
            this.image.black[i].src = `assets/img/black/00${i}.png`;;
        }
        this.baseSize = master.display/16; 
    }
    set size(num) {
        this.baseSize = master.display/16*(1+num/10);
    }
    get size() {
        return this.baseSize;
    }
    main() {

    }
    /**
     * 指定された座標,タイプ,サイズ,透明度で駒を描画する
     * @param {Pos} p 
     * @param {number} type 
     * @param {number} size 
     * @param {number} [alpha=1.0] 
     */
    drawPiece(p,type,size = this.size,alpha = 1.0) {
        this.ctx.globalAlpha = alpha;
        let img = this.image[color(type)][Math.abs(type)];
        this.drawImage(p,size,img);
        this.ctx.globalAlpha = 1.0;
    }
    /**
     * 指定された座標,タイプで行動予測タイルを描画する
     * @param {Pos} p 
     * @param {number} type 
     */
    drawMoveTile(p,type) {
        if(type == 6) {
            if(master.config.kingProtect) this.drawX(p);
            return;
        } else if(type == undefined) {
            this.fillRect(p,this.size,'#e65a50');
            return;
        }

        let color = type % 2 == 0 ? '37c9be' : '#cfa01f';
        this.fillRect(p,this.size,color);
    }
    /**
     * 指定された座標にばつ印を描画する
     * @param {Pos} p 
     */
    drawX(p) {
        this.drawImage(p,this.size,this.image.white[0]);
    }
    /**
     * 見やすさを重視するための関数
     * @param {Pos} p 
     * @param {number} size 
     * @param {HTMLImageElement} image 
     */
    drawImage(p,size,image) {
        this.ctx.drawImage(image,p.x*size,p.y*size,size,size);
    }
    /**
     * 見やすさを重視するための関数 その2
     * @param {Pos} p 
     * @param {number} size 
     * @param {string} color 
     */
    fillRect(p,size,color = '#ffffff') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(p.x*size,p.y*size,size,size);
    }
}

class UI {
    constructor() {
        this.cursor = new Pos(8,8);
        this.isPick = false;
        this.pickItem = new Pos(0,0);
        document.addEventListener('keydown', (e) => ui.input(e.key));
        render.canvas.addEventListener('click', (e) => {
            let rect = render.canvas.getBoundingClientRect();
            let x = Math.floor((e.clientX - rect.left) / (rect.width / 10));
            let y = Math.floor((e.clientY - rect.top) / (rect.height / 10));
            
            ui.click(new Pos(x,y));
        },);
    }
    // 所持してるか否かでMasterの関数呼び出しを行う
}

class Pos {
    /**
     * @param {Number|Pos} x 
     * @param {Number} y 
     */
    constructor(x=0,y=0) {
        if(x instanceof Pos) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }
    limit(p) {
        if(0 <= Math.min(p.x,p.y) && Math.max(p.x,p.y)< 9) return true;
        return false;
    }
    add(p) {
        if(this.limit(new Pos(this.x+p.x,this.y+p.y))) {
            this.x += p.x;
            this.y += p.y
        }
    }
}

class Data {
    /**
     * @param {Pos} from 
     * @param {Pos} to 
     */
    constructor(from, to) {
        this.pos = this.ptos(from) + this.ptos(to);
    }
    /**
     * String型をPos型の座標に変換して返す
     * @param {String} str 
     * @returns {Pos}
     */
    static stop(str) {
        return new Pos(this.reconvert(str[0]),Number(str[1]));
    }
    /**
     * Pos型をString型の座標に変換して返す
     * @param {Pos} from 
     * @param {Pos} to 
     */
    ptos(p) {
        return this.convert(p.x) + p.y;
    }
    /**
     * @param {Number} num 
     * @returns {String}
     */
    convert(num) {
        switch (num) {
            case 1: return 'a';
            case 2: return 'b';
            case 3: return 'c';
            case 4: return 'd';
            case 5: return 'e';
            case 6: return 'f';
            case 7: return 'g';
            case 8: return 'h';
            default: return;
        }
    }
    /**
     * @param {String} str 
     * @returns {Number}
     */
    reconvert(str) {
        switch(str) {
            case 'a': return 1;
            case 'b': return 2;
            case 'c': return 3;
            case 'd': return 4;
            case 'e': return 5;
            case 'f': return 6;
            case 'g': return 7;
            case 'h': return 8;
            default: return;
        }
    }
}

class Tiles {
    /**
     * @param {String|Tiles} c 
     */
    constructor(c) {
        if(c instanceof Tiles) {
            let t = c.copy();
            for(let y = 0;y < 10;y++) this[y] = [...t[y]];            
        } else {
            switch(c) {
                case 'base' : 
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
                    break;
                default : 
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
    }
    /**
     * 0or180度回転したタイルを返す
     * @param {Boolean} flip
     * @returns {Tiles}
     */
    copy(flip=false) {
        let result = new Tiles();
        for(let y = 0;y < 10;y++) result[y] = flip ? [...this[9-y]] : [...this[y]];
        return result;
    }
}

const color = (num) => 0 < num ? 'white' : 'black';

/**
 * 今のところクラス分けする意味が役割分担を明確にする以外の意味がない
 * コードが冗長になりがちだからプログラムの区切りに気を付ける
 * 盛り込む機能を決めてから作る
 * JS Docの書き方で進めてみる
 * 名称を統一する
 * チェックメイトに関して
 * - その都度計算するから大変な処理になるのであって、王の位置を保存
 *   それぞれの王へのチェック・チェックメイトを左側とかに文字で表示させておけば
 *   そんなに困らなくなる
 * - 条件に合った駒の位置を返す関数を作れば良いのでは？
 * Masterとかいうクソ邪魔なクラス作ったの誰だ
 * 4月までには完成させる
 * 
 * 1.UIで入力を受け取る
 * 2.Masterへ変換したデータを受け渡す
 * 3.Gameに情報を渡して処理を受け取る
 * 4.それに合わせてboardを変化させる
 * 5.記録・特殊処理を行う
 * 6.ターン終了・1に戻る
 */