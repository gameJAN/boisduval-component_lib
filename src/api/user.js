import axios from "_s/libs/api.request";
export const upload = (data) => {
  return axios.request({
    url: "uploaddown/upload.action",
    method: "post",
    data,
    sign: false,
    multipart: true,
  });
};
export const uploadDownLoadByHttp = (data) => {
  return axios.request({
    url: "uploaddown/downLoadByHttp.action",
    method: "post",
    data,
    sign: false,
  });
};
export const uploadDownFile = (data) => {
  return axios.request({
    url: "uploaddown/downFile.action",
    method: "post",
    data,
    responseType: "arraybuffer",
    sign: false,
  });
};
export const uploadDelete = (data) => {
  return axios.request({
    url: "uploaddown/delete.action",
    method: "post",
    data,
    sign: false,
  });
};
export const getFileList = (data) => {
  return axios.request({
    url: "uploaddown/getFileList.action",
    method: "post",
    data,
    sign: false,
  });
};
