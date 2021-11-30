// var list = [];
// for(let i=1;i<7;i++) {
//     let script = document.createElement('script');
//     script.src = "chess_v" + i + ".js";
//     list.push(script);
// }
// console.log(list);
// function remove() {
//     while(0 < document.body.getElementsByTagName('script').length) {
//         var script01 = document.body.getElementsByTagName('script');
//         document.body.removeChild(script01[0]);
//     }
// }

var key = "Adr204.Chess.ver";
var now = 6;

function setver(ver = now) {
    Number(ver);
    if(!(0 < ver && ver < now)) ver = now;
    console.log("The Selected version is " + ver);

    let script = document.createElement('script');
    script.src = "js/chess_v" + ver + ".js";
    document.head.appendChild(script);
}

function exver(ver) {
    localStorage.setItem(key,ver);
    window.location.reload();
}

function test() {
    setup();
}

window.onload = () => {
    let version = localStorage.getItem(key);
    setver(version);
    // import {setup} from './chess_v6';
    localStorage.removeItem(key);
    let wait = setInterval(() => {
        if(window.setup != undefined) {
            setup();
            clearInterval(wait);
        }
    }, 100);
}

// 多分ﾖｼ!