'use strict';
const fs = require('fs'); // file systemの略で、ファイルを扱うためのモジュール
const readline = require('readline'); // ファイルを一行ずつ読みだすモジュール
const rs = fs.createReadStream('./popu-pref.csv'); // ストリームを作り出す関数
const rl = readline.createInterface({ input: rs, output: {} }); // 作ったストリームをreadlineの情報源として使う
const prefecturePopuMap = new Map();

rl.on('line', (lineString) => {
    const data = lineString.split(',');
    const year = parseInt(data[0], 10);
    const prefecture = data[1];
    const popu = parseInt(data[3], 10);
    if (year === 2010 || year === 2015) {
        let value = prefecturePopuMap.get(prefecture);
        if (!value) {
            value = {popu10: 0, popu15: 0, change: null }
    // prefecturePopuMap.setでやってはいけない。value変数が使えなくなってしまう
    // ゲッターを使ってバリューを変更するのは、chromeの処理系では行えない。nodeに特有。
        }
        if (year === 2010) {
            value.popu10 = popu;
        }
        else if (year === 2015) {
            value.popu15 = popu;
        }
        prefecturePopuMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    for (let [key, value] of prefecturePopuMap) {
        value.change = value.popu15 / value.popu10;
    }
    var rankingArray = Array.from(prefecturePopuMap).sort( (pair1, pair2) => {
        return pair2[1].change - pair1[1].change // [1]を忘れないように。配列の1の要素にオブジェクトが入っているので。人口の変化率順に並び替える。
    });
    // console.log(rankingArray);
    var rankingString = rankingArray.map( ([key, value]) => {
        return [
            key + " " +
            value.popu10 +
            "人 から " +
            value.popu15 + 
            "人 変化率：" +
            value.change
        ]
    });
    console.log(rankingString);
});
