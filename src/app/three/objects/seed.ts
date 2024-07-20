// 擬似乱数生成器の関数
function createSeededRandom(seed) {
    return function() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
}   

export { createSeededRandom };