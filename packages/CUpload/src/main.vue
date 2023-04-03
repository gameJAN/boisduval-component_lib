<template>
  <div class="c-upload">
    <div
      class="upload-list"
      v-for="(item, index) in fileList"
      :key="index"
      v-show="hasPreview"
    >
      <template v-if="item.status === 'finished'">
        <img :src="$img.appendImgUrl(item.url)" />
        <div class="upload-cover">
          <Icon
            type="ios-eye-outline"
            title="查看"
            @click.native="handleView(item)"
          ></Icon>
        </div>
        <Icon
          v-show="type !== 'preview' && !disabled"
          type="ios-close-circle"
          title="删除"
          @click.native="handleRemove(item)"
          class="remove"
        ></Icon>
      </template>
      <template v-else>
        <Progress
          v-if="item.showProgress"
          :percent="item.percentage"
          hide-info
        ></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :default-file-list="defaultList"
      :multiple="multiple"
      :show-upload-list="true"
      :format="format"
      :max-size="maxSize"
      :before-upload="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :action="action"
      :data="uploadData"
      v-if="type === 'button'"
      :disabled="disabled"
    >
      <Button>上传</Button>
    </Upload>
    <Upload
      class="uploader"
      ref="upload"
      :default-file-list="defaultList"
      :multiple="multiple"
      :show-upload-list="false"
      :format="format"
      :max-size="maxSize"
      :before-upload="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      type="drag"
      :action="action"
      :data="uploadData"
      v-show="fileList.length < limit && !disabled"
      v-else-if="type === ''"
    >
      <div class="upload-btn-add">
        <Icon type="ios-add" />
      </div>
    </Upload>
    <Modal :styles="{ top: '20px' }" footer-hide v-model="preview.visible">
      <img :src="$img.appendImgUrl(preview.url)" style="width: 100%" />
      <span class="down" @click="down(preview)">
        <Icon type="md-download" />
      </span>
    </Modal>
  </div>
</template>

<script>
import SparkMD5 from "spark-md5";
import { uploadDownFile, getFileList } from "_s/api/user";// 个人上传接口
export default {
  name: "CUpload",
  props: {
    beforeUploadCallback: {
      type: Function,
      default: undefined,
    },
    value: {
      type: String,
      default() {
        return "2940f5ed5fe4056bb8f323bd4df170b1";
      },
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    format: {
      type: Array,
      default() {
        return ["jpg", "jpeg", "png", "xls"];
      },
    },
    maxSize: {
      type: Number,
      default: 2048,
    },
    maxCount: {
      type: Number,
      default: 5,
    },
    type: {
      // 显示类型,preview为只查看图片，button为上传按钮
      type: String,
      default: "",
    },
    hasPreview: {
      // 是否有预览
      type: Boolean,
      default: true,
    },
    valName: {
      // 返回值字段名
      type: String,
      default: "uniqueid",
    },
    /** 上传文件接口地址 */
    api: {
      type: String,
      default: "/uploaddown/upload.action",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(val) {
      this.getFileList();
    },
  },
  computed: {
    /** 开发环境下，接口地址前添加接口代理前缀字符串；正式环境下直接使用api */
    action() {
      return `${this.$baseUrl}${this.api}`;
    },
    // 文件数量
    limit() {
      if (this.multiple) {
        return this.maxCount;
      } else {
        return 1;
      }
    },
  },
  data() {
    return {
      fileList: [],
      preview: {
        visible: false,
        url: "",
        uniqueid: "",
        name: "",
      },
      uploadData: {
        // 上传附加参数
        uniqueid: "",
      },
      defaultList: [],
    };
  },
  mounted() {
    this.getFileList();
  },
  methods: {
    getFileList() {
      if (this.valName === "uniqueid" && this.value) {
        getFileList({ fid: this.value }).then((data) => {
          this.defaultList = data.obj.map((item) => {
            return {
              name: item.oldname,
              url: "/" + item.filepath,
              uniqueid: item.uniqueid,
              status: "finished",
            };
          });
          this.$nextTick(() => {
            this.fileList = this.defaultList;
            // this.fileList = this.$refs.CUpload.fileList
          });
        });
      } else {
        this.fileList = [];
      }
    },
    // 查看大图
    handleView(file) {
      this.preview.visible = true;
      this.preview.url = file.url;
      this.preview.uniqueid = file.uniqueid;
      this.preview.name = file.name;
    },
    // 删除图片
    handleRemove(file) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确定要删除吗？</p>",
        onOk: () => {
          this.fileList.splice(this.fileList.indexOf(file), 1);
          let val = this.fileList.map((item) => {
            return item.uniqueid;
          });
          this.$emit("input", val.join(";"));
        },
      });
    },
    handleUpload(file) {
      return new Promise((resolve) => {
        this.computeMD5(file).then((val) => {
          // 控制最多上传文件数量
          const check = this.fileList.length < this.limit;
          if (!check && this.limit > 1) {
            this.$Notice.warning({
              title: "最多可以上传" + this.limit + "张图片。",
            });
          } else {
            if (this.limit === 1) {
              // 如果只能传单张，则覆盖
              this.fileList.splice(this.fileList.indexOf(file), 1);
            }
            this.uploadData.uniqueid = val;
            if (this.beforeUploadCallback) {
              this.beforeUploadCallback(file, this.uploadData);
              // reject(new Error())
            } else {
              resolve(true);
            }
          }
        });
      });
    },
    // 图片上传成功
    handleSuccess(res, file, fileList) {
      if (res.success) {
        let obj = res.obj;
        file.url = obj.filepath;
        file.name = obj.oldname;
        file.uniqueid = obj.uniqueid;
        this.fileList = fileList;
        let val = fileList.map((item) => {
          return item[this.valName];
        });
        this.$Message.info("上传成功");
        this.$emit("input", val.join(";"));
      } else {
        this.$Notice.error({
          title: "上传出错",
          desc: res.msg || "服务器出现错误，请稍后重试",
        });
      }
    },
    // 上传失败
    handleError() {
      this.$Notice.error({
        title: "上传出错",
        desc: "服务器出现错误，请稍后重试",
      });
    },
    // 图片格式失败
    handleFormatError(file) {
      this.$Notice.warning({
        title: "上传图片格式不正确",
        desc:
          "图片  " +
          file.name +
          " 太大，不能超过" +
          (this.maxSize / 1024).toFixed(0) +
          "M",
      });
    },
    // 图片最大尺寸
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "图片超出限制大小",
        desc: "图片  " + file.name + " 太大，不能超过2M",
      });
    },
    down(obj) {
      uploadDownFile({
        uniqueid: obj.uniqueid,
      }).then((res) => {
        let src =
          "data:image/jpg;base64," +
          btoa(
            new Uint8Array(res).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
        this.srcImg = src; // 图片回显
        let link = document.createElement("a");
        link.href = src;
        link.download = obj.name;
        link.click();
      });
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
};
</script>

<style lang="less" scoped></style>
