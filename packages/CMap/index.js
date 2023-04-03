import CMap from "./src/main";

/* istanbul ignore next */
CMap.install = function (Vue) {
  Vue.component(CMap.name, CMap);
};

export default CMap;
