import HttpRequest from "@/libs/axios";
import config from "@/config/index";

const baseUrl =
  process.env.NODE_ENV === "development" ? "/api/" : config.baseUrl;

const axios = new HttpRequest(baseUrl);
export default axios;
