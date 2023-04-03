import HttpRequest from "./axios";
import Vue from "vue";

const baseUrl = Vue.prototype.baseUrl;
const axios = new HttpRequest(baseUrl);
export default axios;
