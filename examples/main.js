import "view-design/dist/styles/iview.css";
import "./index.less";
import "@/assets/icons/iconfont.css";
import "@/assets/icons/glyphicon.css";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import "@/libs/ie";
import App from "./App";
import TreeTable from "tree-table-vue";
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import { directive as clickOutside } from "v-click-outside-x";
import config from "@/config";
import ViewUI from "view-design";
// import CommonLib from "@gamejan/component_lib";
// import "@gamejan/component_lib/src/assets/styles/base.less";
import importDirective from "@/directive";
import installPlugin from "@/plugin";
import router from "./router";
import store from "./store";
import validate from "@/libs/validate";
import img from "@/libs/img-utils";
import file from "@/libs/file-utils";
import date from "@/libs/date-utils";
import Debounce from "@/libs/Debounce";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";

// 实际打包时应该不引入mock
/* eslint-disable */
// if ( process.env.NODE_ENV !== 'production' ) require( '@/mock' )

Vue.use(ViewUI);
Vue.use(TreeTable);
Vue.use(preview);
// Vue.use(CommonLib, {
//   baseUrl:
//     process.env.NODE_ENV === "development"
//       ? process.env.VUE_APP_REQ_PROXY
//       : process.env.VUE_APP_SERVER_URL,
// });
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue);
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;
Vue.prototype.$validate = validate; // 全局注册必填方法
Vue.prototype.$img = img;
Vue.prototype.$file = file;
Vue.prototype.$date = date;
Vue.prototype.$Debounce = Debounce;

/**
 * 注册指令
 */
importDirective(Vue);
Vue.directive("clickOutside", clickOutside);

/**
 * vue之iview table展示图片，实现点击放大
 */
Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source",
  },
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
