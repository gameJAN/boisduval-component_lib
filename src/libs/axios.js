import { getNowFormatDate, setToken } from "./util";

import { Notice } from "view-design";
import axios from "axios";
import cfg from "@/config";
import md5 from "js-md5";
import qs from "qs";
import Vue from "vue";

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {},
      withCredentials: true,
      transformRequest(data) {
        return qs.stringify(data);
      },
    };
    return config;
  }

  getMultipartConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {},
      withCredentials: true,
    };
    return config;
  }

  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      (config) => {
        this.queue[url] = true;
        if (config.sign !== false) {
          let timestamp = getNowFormatDate();
          let signKey = cfg.signKey;
          const data = config.data ? config.data.json || config.data : "";
          let requestData = data ? JSON.stringify(data) : "";
          let sign = md5(
            signKey + requestData + timestamp + signKey
          ).toUpperCase();

          if (!config.multipart) {
            Object.assign(config, {
              data: {
                sign: sign,
                timestamp: timestamp,
                data: requestData,
              },
            });
          } else {
            let formData = new FormData();
            formData.append("sign", sign);
            formData.append("timestamp", timestamp);
            formData.append("data", requestData);
            Object.keys(config.data)
              .filter((key) => key !== "json")
              .forEach((key) => {
                formData.append(key, config.data[key]);
              });
            config.data = formData;
          }
        }
        // 防重复接口需要在 header 中添加repeatToken字段
        if (config.repeatToken) {
          config.headers["repeatToken"] = config.repeatToken;
        }
        config.baseURL = Vue.prototype.$baseUrl;
        console.log(config);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      (res) => {
        this.destroy(url);
        var { data } = res;
        // 如果包头中含有 token 信息，添加到 data 中
        if (res.headers.repeattoken) {
          data = data || {};
          data.repeatToken = res.headers.repeattoken;
        }
        if (data.success === true) {
          return data;
        } else if (data.success === false) {
          Notice.error({
            title: "请求出错",
            desc: data.msg || "服务器出现错误，请稍后重试",
          });
          return Promise.reject(data);
        } else {
          return data;
        }
      },
      (error) => {
        const errMsg = error.toString();
        const code = errMsg.substr(errMsg.indexOf("code") + 5);
        if (code === "508") {
          setToken("");
          window.location.reload();
        } else if (code === "507") {
          setToken("");
          router.push({
            name: "login",
          });
        } else if (code === "510") {
          Notice.error({
            title: "请求出错",
            desc: "请勿重复提交！",
          });
          this.destroy(url);
          return Promise.reject(error);
        } else {
          Notice.error({
            title: "请求出错",
            desc: "服务器出现错误，请稍后重试",
          });
          this.destroy(url);
          return Promise.reject(error);
        }
      }
    );
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(
      options.multipart ? this.getMultipartConfig() : this.getInsideConfig(),
      options
    );
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
