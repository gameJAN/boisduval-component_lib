import CEditor from "./src/main";

/* istanbul ignore next */
CEditor.install = function (Vue) {
  Vue.component(CEditor.name, CEditor);
};

export default CEditor;
