import { $axios } from 'plugins/axios'

//新增笔记
export function add(data) {
  return $axios({
    url: "/notes/add",
    method: "post",
    data,
  });
}
//编辑笔记
export function update(data) {
  return $axios({
    url: "/notes/update",
    method: "put",
    data,
  });
}
//禁用笔记
export function disableNotes(data) {
  return $axios({
    url: "/notes/disable",
    method: "put",
    data,
  });
}
//删除笔记
export function deleteNotes(data) {
  return $axios({
    url: "/notes/delete",
    method: "delete",
    data,
  });
}
//获取编辑笔记详情
export function notesEditInfo(query) {
  return $axios({
    url: "/notes/info",
    method: "get",
    params: query,
  });
}
//笔记列表
export function mineNoteslist(query) {
  return $axios({
    url: "/notes/list",
    method: "get",
    params: query,
  });
}

//获取笔记详情
export function notesInfo(query) {
  return $axios({
    url: "/home/notes/info",
    method: "get",
    params: query,
  });
}

//获取分类笔记
export function screenNote(query) {
  return $axios({
    url: "/home/screenNotes/list",
    method: "get",
    params: query,
  });
}
