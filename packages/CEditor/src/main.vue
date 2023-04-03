<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
import Editor from "wangeditor";
// import "wangeditor/release/wangEditor.min.css";
import { oneOf } from "@/libs/tools";
import { upload } from "_s/api/user";//个人上传接口
import SparkMD5 from "spark-md5";
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: "",
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: "html",
      validator: (val) => {
        return oneOf(val, ["html", "text"]);
      },
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200,
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: true,
    },
    /**
     * @description 只读
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 250,
    },
  },
  computed: {
    editorId() {
      return `editor${this._uid}`;
    },
  },
  watch: {
    value(val) {
      this.setHtml(val || "");
    },
    disabled(val) {
      if (this.editor && val) this.editor.disable();
    },
  },
  methods: {
    setHtml(val) {
      console.log(val);
      this.editor.txt.html(val);
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      // let time = new Date().getTime()
      let md5 = "";
      fileReader.readAsArrayBuffer(file);
      let promise = new Promise((resolve) => {
        fileReader.onload = (e) => {
          if (file.size !== e.target.result.byteLength) {
            this.error("浏览器报告成功，但在结束之前无法读取文件。");
            return;
          }
          md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
          // console.log(
          //   `MD5计算完毕：${file.id} ${
          //     file.name
          //   } MD5：${md5} 用时：${new Date().getTime() - time} ms`
          // )
          resolve(md5);
        };
        fileReader.onerror = function () {
          this.error(
            "已触发FileReader，OnError：可能是由于内存使用率高而导致浏览器中止。"
          );
        };
      });
      return promise;
    },
  },
  mounted() {
    this.editor = new Editor(`#${this.editorId}`);
    this.editor.config.onchange = (html) => {
      let text = this.editor.txt.text();
      if (this.cache) localStorage.editorCache = html;
      this.$emit("input", this.valueType === "html" ? html : text);
      this.$emit("on-change", html, text);
    };
    //上传图片
    // this.editor.config.uploadImgShowBase64 = true;
    this.editor.config.customUploadImg = (resultFiles, insertImgFn) => {
      const baseUrl = this.$serviceUrl;
      // resultFiles 是 input 中选中的文件列表
      let urls = [];
      Promise.all(
        resultFiles.map((item) => {
          let formData = new FormData();
          formData.append("file", item);
          return this.computeMD5(item).then((val) => {
            formData.append("uniqueid", val);
            return upload(formData);
          });
        })
      ).then((res) => {
        res.map((item) => {
          if (item.success) {
            urls.push(baseUrl + "/" + item.obj.filepath);
          }
        });
        console.log(urls);
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法

        // 上传图片，返回结果，将图片插入到编辑器中
        urls.map((item) => {
          insertImgFn(item);
        });
      });
    };
    this.editor.config.onchangeTimeout = this.changeInterval;
    this.editor.config.zIndex = 100;

    // 设置编辑区域高度
    this.editor.config.height = this.height;

    // create这个方法一定要在所有配置项之后调用
    this.editor.create();
    if (this.editor && this.disabled) this.editor.disable();
    // 如果本地有存储加载本地存储内容
    let html = this.value || "";
    if (this.cache) html = this.value || localStorage.editorCache;
    if (html) this.editor.txt.html(html);
  },
};
</script>

<style lang="less">
// .editor-wrapper *{
//   z-index: 100 !important;
// }
.w-e-text-container {
  //height: 250px !important;
}
.w-e-toolbar {
  flex-wrap: wrap;
}
</style>
