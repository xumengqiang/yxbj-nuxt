/**
 * 获取指定节点的目录结构
 * @param {String|Object} el 解析目录结构的节点对象或ID
 */
const getCatalog = (el) => {
  if (typeof el === 'string') {
    el = document.getElementById(el)
  }

  let titleNodes = el.querySelectorAll('h1,h2,h3');

  let levels = [];
  let noLevels = [];
  for (let el of titleNodes) {
    let obj = {
      anchor: el,
      text: el.innerText,
    }
    noLevels.push(obj);
  }
  return {
    levels,
    noLevels
  };
}


export default getCatalog