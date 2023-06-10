function getRandomChineseWord () {
    let _rsl = "";
    const _randomUniCode = Math.floor(Math.random() * (40870 - 19968) + 19968).toString(16);
    eval("_rsl=" + '"\\u' + _randomUniCode + '"');
    return _rsl;
}

module.exports = getRandomChineseWord;