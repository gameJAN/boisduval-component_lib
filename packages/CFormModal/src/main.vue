<template>
  <div>
    <Form
      :model="searchData"
      ref="formValidate"
      :label-width="labelWidth"
      label-position="right"
      @submit.native.prevent
      :rules="rules"
      :disabled="disabled"
    >
      <Row>
        <template v-for="(item, index) in searchList">
          <Col
            :span="item.control.colspan"
            :key="item.field"
            v-if="
              !item.control.shownField ||
              (searchData.hasOwnProperty(item.control.shownField) &&
              item.control.shownValue.constructor === Array
                ? item.control.shownValue.indexOf(
                    searchData[item.control.shownField]
                  ) !== -1
                : searchData[item.control.shownField] + '' ===
                  item.control.shownValue + '')
            "
          >
            <FormItem
              :label="item.label"
              :label-width="
                item.label.length * 20 > 100
                  ? item.label.length * 20 > 180
                    ? 180
                    : item.label.length * 20
                  : 100
              "
              :prop="item.field"
            >
              <!--日期选择器-->
              <!--            <DatePicker-->
              <!--              :type="item.control.type || 'date'"-->
              <!--              :placeholder="item.label"-->
              <!--              v-model="searchData[item.field]"-->
              <!--              v-if="item.control.controlType === 'date-input'"-->
              <!--              style="width: 100%"-->
              <!--            ></DatePicker>-->
              <DatePicker
                type="datetime"
                :placeholder="item.label"
                @on-change="
                  (value1, value2) => {
                    searchData[item.field] = value1;
                  }
                "
                format="yyyy-MM-dd HH:mm:ss"
                :value="searchData[item.field]"
                v-if="item.control.controlType === 'datetime-input'"
                style="width: 100%"
              ></DatePicker>
              <DatePicker
                :type="'date'"
                :placeholder="item.label"
                @on-change="
                  (value1, value2) => {
                    searchData[item.field] = value1;
                  }
                "
                format="yyyy-MM-dd"
                :value="searchData[item.field]"
                v-if="item.control.controlType === 'date-input'"
                style="width: 100%"
              ></DatePicker>
              <!--月份-->
              <DatePicker
                :type="'month'"
                :placeholder="item.label"
                @on-change="
                  (value1, value2) => {
                    searchData[item.field] = value1;
                  }
                "
                format="yyyy-MM"
                :value="searchData[item.field]"
                v-if="item.control.controlType === 'datemonth-input'"
                style="width: 100%"
              ></DatePicker>
              <!--年份-->
              <DatePicker
                :type="'year'"
                :placeholder="item.label"
                @on-change="
                  (value1, value2) => {
                    searchData[item.field] = value1;
                  }
                "
                format="yyyy"
                :value="searchData[item.field]"
                v-if="item.control.controlType === 'dateyear-input'"
                style="width: 100%"
              ></DatePicker>

              <!--          单选框-->
              <RadioGroup
                v-model="searchData[item.field]"
                v-if="item.control.controlType === 'radio'"
              >
                <Radio
                  v-for="(item1, index) in item.dicts"
                  :label="item1.label"
                  :key="index"
                >
                  <span v-html="item1.content"></span>
                </Radio>
              </RadioGroup>

              <!--          多选框-->
              <CheckboxGroup
                v-model="searchData[item.field]"
                v-if="item.control.controlType === 'checkbox'"
              >
                <Checkbox
                  v-for="(item1, index) in item.dicts"
                  :label="item1.label"
                  :key="index"
                >
                  <span v-html="item1.content"></span>
                </Checkbox>
              </CheckboxGroup>
              <!--          上传-->
              <!--          上传-->
              <CUpload
                :has-preview="false"
                :format="['xls', 'xlsx', 'doc', 'docx', 'pdf']"
                v-if="item.control.controlType === 'upload'"
                v-model="searchData[item.field]"
                type="button"
              ></CUpload>

              <!--            上传图片-->
              <CUpload
                v-if="item.control.controlType === 'picture-upload'"
                v-model="searchData[item.field]"
                :disabled="disabled"
                :multiple="true"
                :maxSize="10240"
                :maxCount="9"
              ></CUpload>
              <Select
                v-if="item.control.controlType === 'select'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
                @on-change="
                  (value) => {
                    handleChange(value, item);
                  }
                "
              >
                <Option
                  v-for="(selectItem, index) in item.dicts"
                  :value="selectItem.value"
                  :key="index"
                  >{{ selectItem.label }}</Option
                >
              </Select>
              <Select
                v-if="item.control.controlType === 'multi-select'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
                multiple
              >
                <Option
                  v-for="(selectItem, index) in item.dicts"
                  :value="selectItem.value"
                  :key="index"
                  >{{ selectItem.label }}</Option
                >
              </Select>
              <TreeSelect
                :disabled="disabled"
                v-if="item.control.controlType === 'select-tree'"
                :clearable="false"
                :valueFormat="item.control.valueFormat || 'id'"
                :default-expand-level="1"
                placeholder="请选择"
                v-model="searchData[item.field]"
                :options="item.dicts"
                :normalizer="item.control.normalizer || normalizer"
                :show-count="true"
                @select="
                  (param) => {
                    handleSelect(param, item.control.description, item.field);
                  }
                "
              >
              </TreeSelect>
              <TreeSelect
                :disabled="disabled"
                v-if="item.control.controlType === 'multi-select-tree'"
                :clearable="false"
                :valueFormat="item.control.valueFormat || 'id'"
                :flat="true"
                :multiple="true"
                :default-expand-level="1"
                placeholder="请选择"
                v-model="searchData[item.field]"
                :options="item.dicts"
                :normalizer="item.control.normalizer || normalizer"
                :show-count="true"
              >
              </TreeSelect>
              <Input
                v-if="item.control.controlType === 'input-text'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
                :type="item.control.type || 'text'"
                :number="item.fieldType === 'number'"
              />

              <!--            富文本-->
              <CEditor
                v-if="item.control.controlType === 'rich-input'"
                v-model="searchData[item.field]"
                :cache="false"
                :disabled="disabled"
              />
              <!--            地理位置框选-->
              <!--            geojson-btn-->
              <div
                v-if="item.control.controlType === 'geojson-btn'"
                style="display: flex"
              >
                <Input
                  v-model="searchData[item.field]"
                  clearable
                  :placeholder="item.label"
                  :type="item.control.type || 'text'"
                />
                <span
                  v-if="!disabled"
                  style="word-break: keep-all; color: #2d8cf0; margin-left: 6px"
                  @click="showGeo(item, 'geojson-btn')"
                  >框选位置</span
                >
              </div>
              <!--            地理位置打点-->
              <!--            gps-btn-->
              <div
                v-if="item.control.controlType === 'gps-btn'"
                style="display: flex"
              >
                <Input
                  v-model="searchData[item.field]"
                  clearable
                  :placeholder="item.label"
                  :type="item.control.type || 'text'"
                />
                <span
                  v-if="!disabled"
                  style="word-break: keep-all; color: #2d8cf0; margin-left: 6px"
                  @click="showGeo(item, 'gps-btn')"
                  >选择位置</span
                >
              </div>
              <!--            extButton-->
            </FormItem>
            <Button
              style="margin-top: 4px; margin-left: 8px"
              v-if="item.extButton"
              :type="item.extButton.type || 'primary'"
              shape="circle"
              size="small"
              :icon="item.extButton.icon"
              @click="handleExt(item, index)"
            ></Button>
          </Col>
        </template>
      </Row>
      <slot name="other" />

      <div style="margin-top: 20px" v-if="editable">
        <!--        <FormItem>-->
        <!--          <Button type="primary" @click="submit('formValidate')">保存</Button>-->
        <!--          <Button @click="handleClear('formValidate')" style="margin-left: 8px"-->
        <!--            >取消</Button-->
        <!--          >-->
        <!--        </FormItem>-->
        <Button
          type="primary"
          @click="submit('formValidate')"
          :loading="searchLoading"
          >保存</Button
        >
        <Button @click="handleClear('formValidate')">取消</Button>
      </div>
    </Form>
    <Modal
      :title="modalTitle"
      :mask-closable="false"
      v-model="modal.show"
      width="1200"
      height="100%"
      @on-ok="handleGeo"
    >
      <CMap
        ref="map"
        v-if="modal.show"
        :type="modal.type"
        :value="searchData[modal.field]"
      />
    </Modal>
  </div>
</template>

<script>
import TreeSelect from "@riophae/vue-treeselect";
import CUpload from "~/CUpload";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CMap from "~/CMap";
import { getGeoStandard } from "_s/libs/util";
import CEditor from "~/CEditor";
export default {
  name: "CFormModal",
  components: { CEditor, CMap, TreeSelect, CUpload },
  props: {
    searchList: {
      type: Array,
      default() {
        return [];
      },
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    editable: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  computed: {
    rules() {
      let obj = {};
      this.searchList.map((item) => {
        obj[item.field] = (item.rules || []).map((item1) => {
          item1.trigger = "change";
          return item1;
        });

        if (item.required) {
          obj[item.field] = [
            {
              required: true,
              message: "请输入" + item.label,
              trigger: "change",
              type: item.fieldType || "string",
            },
          ];
        }
      });
      return obj;
    },
    modalTitle() {
      if (this.modal.type === "geojson-btn") {
        return "地理位置框选";
      } else {
        return "地理位置打点";
      }
    },
  },
  watch: {
    data(val) {
      // for (const valKey in val) {
      //   this.searchData[valKey] = val[valKey] + "";
      // }
      this.searchData = { ...val };
    },
  },
  data() {
    return {
      searchData: {},
      searchLoading: false,
      modal: {
        show: false,
        // title: "地理位置框选",
        field: "",
        type: "",
      },
    };
  },
  methods: {
    normalizer(node) {
      return {
        id: node.id,
        label: node.text,
        children: node.children,
      };
    },
    // handleClear() {
    //   this.searchData = {};
    //   this.$emit("handleCancel");
    // },
    // submit() {
    //   this.$emit("handleSubmit", this.searchData);
    //   // this.handleClear();
    // },
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$emit("handleSubmit", this.searchData);
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleClear() {
      this.$refs.formValidate.resetFields();
      this.searchData = {};
      this.$emit("handleCancel");
    },
    handleExt(item, index) {
      if (item.extButton.description === "handleRemoveBtn") {
        let label = this.searchList[index - 1].field;
        let value = this.searchList[index].field;
        delete this.searchData[label];
        delete this.searchData[value];
      }
      this.$emit(item.extButton.description, item, index);
    },
    handleChange(value, param) {
      if (param.control.description === "handleStatus") {
        this.$emit(param.control.description, value, param);
      }
    },
    handleSelect(param, func, field) {
      this.$emit(func, this.searchData, param);
      setTimeout(() => {
        this.$refs.formValidate.validateField(field, (e) => {
          console.log(this.searchData[field]);
        });
      }, 200);
    },

    showGeo(obj, type) {
      this.modal.show = true;
      this.modal.field = obj.field;
      this.modal.type = type;
    },

    handleGeo() {
      if (this.modal.type === "geojson-btn") {
        if (this.$refs.map.polygon) {
          let res = [];
          this.$refs.map.polygonPoints.map((item) => {
            console.log(item);
            res.push(getGeoStandard(item));
          });
          this.searchData[this.modal.field] = JSON.stringify(res);
        }
      } else {
        if (this.$refs.map.markPoint) {
          let obj = this.$refs.map.markPoint;
          this.searchData[this.modal.field] = obj.lng + "," + obj.lat;
        }
      }
    },
  },
};
</script>

<style scoped>
/deep/.ivu-col {
  display: flex;
}
/deep/.ivu-form-item {
  flex: 1;
}
/deep/.ivu-input-suffix {
  width: auto !important;
  display: flex;
  align-items: center;
  margin-right: 6px;
  cursor: pointer;
}
</style>
