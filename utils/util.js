/**
 * 格式化时间    
 * @param {*} date  date时间对象
 * @param {*} fmt fmt时间格式 如yyyy/MM/dd hh:mm:ss
 */
const FmtTime = (date, fmt) => {
    var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp(`(${k})`).test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
            );
    return fmt;
};
/**
 *  generateUUID 生成UUID
 *  @returns {string} 返回字符串
 */
const generateUUID = () => {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
}
/**
 * 时间多少分钟
 * @param {*} time 
 * @param {*} local 
 */
const formatTime = (time) => {
    const diff = (new Date().getTime() - new Date(time.replace(/-/g, "/")).getTime()) / 1000;

    if (diff < 30) {
        return "刚刚";
    } else if (diff < 3600) {
        return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 30) {
        return Math.floor(diff / 3600 / 24) + "天前";
    } else if (diff < 3600 * 24 * 365) {
        return Math.floor(diff / 3600 / 24 / 30) + "月前";
    } else {
        return Math.floor(diff / 3600 / 24 / 365) + "年前";
    }
}

/**
 * 计算年龄
 * @param {*} time 
 */
const Age = (time) => {
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    let year = Math.floor(diff / (3600 * 24 * 365));

    let mounth = Math.floor((diff - year * (3600 * 24 * 365)) / (3600 * 24 * 30));

    let day = Math.floor((diff - mounth * (3600 * 24 * 30)) / (3600 * 24));

    if (year) {
        return `${year}年${mounth}月${day}天`;
    } else if (mounth) {
        return `${mounth}月${day}天`;
    } else {
        return `${day}天`;
    }
}
export default { FmtTime, generateUUID, formatTime, Age }