//=============================================================================
// バージョン管理用の関数ファイルです
// [V.ex(任意のバージョン);]と入力することで
// ページを再読み込みしバージョンを切り替えることができます
// 
// 自己満足のためのファイルです
//=============================================================================

class Version {
    ex = function(ver) {
        localStorage.setItem(key,ver);
        window.location.reload();
    };
    setver = function(ver) {
        ver = Number(ver);
        if(typeof ver != 'number' || ver < 1) ver = stable;
        if(!(0 < ver && ver <= stable)) console.log("サポート対象外のバージョンを指定しています。");
        console.log("The selected version is" + ver);

        let script = document.createElement('script');
        script.src = 'js/v' + ver + '.js';
        document.head.appendChild(script);
    };
}

const key = "Adr204.Chess.ver";
const stable = 5;
const V = new Version();


window.onload = function() {
    let version = localStorage.getItem(key);
    localStorage.removeItem(key);
    
    V.setver(version);
    let wait = setInterval(function() {
        if(window.setup != undefined) {
            setup();
            clearInterval(wait);
        }
    }, 100);
}