<template>
  <div>
    <Card v-if="searchable" :padding="0" class="search">
      <Form
        :model="searchData"
        ref="search"
        :label-width="labelWidth"
        label-position="right"
        style="padding: 24px 15px"
        :rules="searchRules"
        @submit.native.prevent
      >
        <Row>
          <Col :span="12" v-if="$route.name.indexOf('datalist') !== -1">
            <FormItem label="地区" :label-width="100">
              <TreeSelect
                :clearable="true"
                :multiple="false"
                :default-expand-level="1"
                placeholder="请选择"
                v-model="searchData.grid"
                :options="areaList"
                :normalizer="areaNormalizer || normalizer"
                :show-count="true"
              ></TreeSelect>
            </FormItem>
          </Col>
          <Col
            :span="item.control.colspan"
            v-for="(item, index) in searchList"
            :key="index"
          >
            <FormItem
              :label="item.label"
              :label-width="
                item.label.length * 20 > 100 ? item.label.length * 20 : 100
              "
            >
              <!--日期选择器-->
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
              <!--          单选框-->
              <RadioGroup
                v-model="searchData[item.field]"
                v-if="item.control.controlType === 'radio-group'"
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
                v-if="item.control.controlType === 'check-group'"
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
              <Upload
                v-if="item.control.controlType === 'file-upload'"
                :multiple="item.control.multiple"
                :action="item.control.url"
              >
                <Button icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
              <Select
                v-if="item.control.controlType === 'select'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
                @on-change="
                  (param) => {
                    handleSelected(param, item.control.description);
                  }
                "
              >
                <Option
                  v-for="selectItem in item.dicts"
                  :value="selectItem.value"
                  :key="selectItem.value"
                  >{{ selectItem.label }}</Option
                >
              </Select>
              <Select
                v-if="item.control.controlType === 'multi-select'"
                :value="(searchData[item.field] || '').split(',')"
                clearable
                :placeholder="item.label"
                multiple
                @on-change="
                  (value) => {
                    searchData[item.field] = value.join(',');
                  }
                "
              >
                <Option
                  v-for="selectItem in item.dicts"
                  :value="selectItem.value"
                  :key="selectItem.value"
                  >{{ selectItem.label }}</Option
                >
              </Select>
              <TreeSelect
                v-if="item.control.controlType === 'select-tree'"
                :clearable="false"
                :multiple="true"
                :flat="true"
                :default-expand-level="1"
                placeholder="请选择"
                v-model="searchData[item.field]"
                :options="item.dicts"
                :normalizer="item.control.normalizer || normalizer"
                :show-count="true"
              ></TreeSelect>
              <Input
                v-if="item.control.controlType === 'input-text'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
              />
              <Input
                v-if="item.control.controlType === 'input-textarea'"
                v-model="searchData[item.field]"
                clearable
                :placeholder="item.label"
                :number="item.fieldType === 'number'"
                type="textarea"
                :rows="item.control.rowspan"
              />
            </FormItem>
          </Col>
        </Row>
        <Button type="primary" @click="handleSearch" :loading="searchLoading"
          >查询</Button
        >
        <Button @click="handleClear" :loading="clearLoading">清空</Button>
      </Form>
    </Card>
    <slot name="other"></slot>
    <Row v-if="!isTreeTable">
      <Col span="4" v-if="leftbarable">
        <slot name="leftbar"></slot>
      </Col>
      <Col :span="leftbarable ? '20' : '24'">
        <Card v-if="tableTitle">
          <p slot="title">{{ tableTitle }}</p>
          <div slot="extra" class="btns-group">
            <Button
              ghost
              v-for="item in auths"
              :key="item.listid"
              :type="item.type === 'danger' ? 'error' : item.type"
              @click="handleClick(item, selection)"
              >{{ item.listname }}</Button
            >
          </div>
          <Table
            ref="tablesMain"
            :columns="insideColumns"
            :data="insideTableData"
            :stripe="stripe"
            :border="border"
            :show-header="showHeader"
            :width="width"
            :height="height"
            :loading="loading"
            :disabled-hover="disabledHover"
            :highlight-row="highlightRow"
            :row-class-name="rowClassName"
            :size="size"
            :no-data-text="noDataText"
            :no-filtered-data-text="noFilteredDataText"
            @on-selection-change="onSelectionChange"
            @on-current-change="onCurrentChange"
            @on-select="onSelect"
            @on-select-cancel="onSelectCancel"
            @on-select-all="onSelectAll"
            @on-sort-change="onSortChange"
            @on-filter-change="onFilterChange"
            @on-row-click="onRowClick"
            @on-row-dblclick="onRowDblclick"
            @on-expand="onExpand"
          >
            <slot name="header" slot="header"></slot>
            <slot name="footer" slot="footer"></slot>
            <slot name="loading" slot="loading"></slot>
            <template slot="actions" slot-scope="scope">
              <div v-if="$config.tableBtnsStyle === 'ButtonGroup'">
                <ButtonGroup size="small" shape="circle">
                  <template v-for="(item, index) in actionList">
                    <Button
                      :key="item.listid"
                      v-if="index <= 2"
                      @click.stop="handleClick(item, scope)"
                    >
                      <CIcon :color="item.iconcolor" :type="item.icon" />
                      {{ item.listname }}
                    </Button>
                  </template>
                </ButtonGroup>
                <Dropdown
                  style="margin-left: 5px"
                  :transfer="true"
                  v-if="actionList.length > 3"
                >
                  <Button icon="ios-more" size="small" shape="circle"></Button>
                  <DropdownMenu slot="list">
                    <template v-for="(item, index) in actionList">
                      <DropdownItem
                        :key="item.listid"
                        v-if="index > 2"
                        @click.native.stop="handleClick(item, scope)"
                      >
                        <CIcon :color="item.iconcolor" :type="item.icon" />
                        {{ item.listname }}
                      </DropdownItem>
                    </template>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </template>
            <template slot="picture" slot-scope="scope">
              <CUpload
                v-model="scope.row[scope.column.key]"
                :disabled="true"
                :multiple="true"
                :maxSize="4096"
                :maxCount="9"
              ></CUpload>
            </template>
            <template slot="rich" slot-scope="scope">
              <div v-html="scope.row[scope.column.key]" />
            </template>
          </Table>
          <Page
            v-if="pageable"
            show-total
            show-elevator
            :total="total"
            :current="pageIndex"
            :page-size="pageSize"
            @on-change="changePage"
            style="margin-top: 10px; text-align: right"
          />
        </Card>
      </Col>
    </Row>

    <Card v-if="isTreeTable">
      <p slot="title">{{ tableTitle }}</p>
      <div slot="extra" class="btns-group">
        <Button
          ghost
          v-for="item in auths"
          :key="item.listid"
          :type="item.type === 'danger' ? 'error' : item.type"
          @click="handleClick(item, $refs.table.getCheckedProp(dataId))"
          >{{ item.listname }}</Button
        >
      </div>
      <tree-table
        ref="table"
        :expand-key="expandKey"
        :expand-type="expandType"
        :stripe="stripe"
        :isFold="isFold"
        :columns="insideColumns"
        :data="insideTableData"
        :selection-type="true"
        @cell-click="onCellClick"
        :size="size"
      >
        <template slot="actions" slot-scope="scope">
          <div v-if="$config.tableBtnsStyle === 'ButtonGroup'">
            <ButtonGroup size="small" shape="circle">
              <template v-for="(item, index) in actionList">
                <Button
                  v-if="index <= 2"
                  :key="item.listid"
                  @click.stop="handleClick(item, scope)"
                >
                  <CIcon :color="item.iconcolor" :type="item.icon" />
                  {{ item.listname }}
                </Button>
              </template>
            </ButtonGroup>
            <Dropdown
              style="margin-left: 5px"
              :transfer="true"
              v-if="actionList.length > 3"
            >
              <Button icon="ios-more" size="small" shape="circle"></Button>
              <DropdownMenu slot="list">
                <template v-for="(item, index) in actionList">
                  <DropdownItem
                    :key="item.listid"
                    v-if="index > 2"
                    @click.native.stop="handleClick(item, scope)"
                  >
                    <CIcon :color="item.iconcolor" :type="item.icon" />
                    {{ item.listname }}
                  </DropdownItem>
                </template>
              </DropdownMenu>
            </Dropdown>
          </div>
        </template>
      </tree-table>
    </Card>
  </div>
</template>

<script>
import { flexColumnWidth, treeData } from "_s/libs/util";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CIcon from "~/CIcon";
import CUpload from "~/CUpload";
export default {
  name: "CTable",
  components: {
    TreeSelect,
    CIcon,
    CUpload,
  },
  props: {
    searchData: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否动态宽度
    isFlexWidth: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 是否可选择的表格
    isSelect: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 资源id，取权限用
    sourceId: {
      type: Number,
      default: 0,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    tablebtns: {
      type: Array,
      default() {
        return [];
      },
    },
    isTreeTable: {
      type: Boolean,
      default: false,
    },
    /**
     * @description 是否显示搜索模块
     */
    searchable: {
      type: Boolean,
      default: false,
    },
    searchRules: {
      type: Object,
      default() {
        return {};
      },
    },
    pageable: {
      type: Boolean,
      default: true,
    },
    leftbarable: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      default: 0,
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    /**
     * @description 搜索模块标题
     */
    searchTitle: {
      type: String,
      default: "查询条件",
    },
    // searchData: {
    //   type: Object,
    //   default() {
    //     return {};
    //   },
    // },
    tableTitle: {
      type: String,
    },
    searchList: {
      type: Array,
      default() {
        return [];
      },
    },
    auths: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * @description 表格列内容
     */
    // actionList: {
    //   type: Array,
    //   default() {
    //     return [];
    //   },
    // },
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    dataId: {
      type: String,
      default() {
        return "id";
      },
    },
    expandKey: {
      type: String,
      default() {
        return "";
      },
    },
    expandType: {
      type: Boolean,
      default: false,
    },
    isFold: {
      type: Boolean,
      default: true,
    },
    stripe: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "small",
    },
    width: {
      type: [Number, String],
    },
    height: {
      type: [Number, String],
    },
    border: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    highlightRow: {
      type: Boolean,
      default: false,
    },
    rowClassName: {
      type: Function,
      default() {
        return "";
      },
    },
    noDataText: {
      type: String,
    },
    noFilteredDataText: {
      type: String,
    },
    disabledHover: {
      type: Boolean,
    },
    actionList: {
      type: Array,
      default: () => {
        return [
          // {
          //   listid: 1100,
          //   listname: "新增",
          //   description: "handleAdd",
          //   icon: "glyphicon-plus",
          // },
          {
            listid: 1101,
            listname: "查看",
            description: "handleDetail",
            icon: "",
          },
          {
            listid: 1102,
            listname: "修改",
            description: "handleEdit",
            icon: "glyphicon-edit",
          },
          {
            listid: 1103,
            listname: "删除",
            description: "handleDel",
            icon: "glyphicon-remove",
          },
        ];
      },
    },
    /**
     * @description 分页条数
     */
    rows: {
      type: Number,
    },
    /**
     * @description 页码索引
     */
    page: {
      type: Number,
      default: 1,
    },
    tablebtnsable: {
      // 不显示表格表头操作按钮
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: true,
      searchLoading: false,
      clearLoading: false,
      insideColumns: [],
      insideTableData: [],
      modalFormRule: {},
      tableData: [],
      selection: [], // 表格选择项
      condition: [],
      pageIndex: this.page,
      searchExpand: false,
      gridTreeData: [],
      areaList: [],
      areaNormalizer: null,
    };
  },
  computed: {
    pageSize() {
      // 不指定分页条数，则用默认的
      return this.rows || this.$config.DEFAULT_PAGE_SIZE;
    },
  },

  methods: {
    async getTree() {
      // const { obj: obj1 } = await getAuthArea({});
      this.areaList = treeData(JSON.parse(localStorage.getItem("areaList")));
      this.areaNormalizer = (node) => {
        return {
          id: node.id,
          label: node.gridname,
          children: node.children,
        };
      };
    },
    searchExpandHandle() {
      this.searchExpand = !this.searchExpand;
    },
    handleColumns(columns) {
      this.handleTableData();
      this.insideColumns = columns.map((item) => {
        let res = item;
        // item.width = flexColumnWidth(item.key, this.tableData);
        if (res.key === "action") {
          this.condition = res.condition;
          if (this.isTreeTable) {
            res.type = "template";
            res.template = "action";
          } else {
            res.slot = "action";
          }
        }
        if (res.key === "actions") {
          res.align = "center";
          if (this.isTreeTable) {
            res.type = "template";
            res.template = "actions";
          } else {
            res.slot = "actions";
          }
        }
        if (res.key === "index") {
          res.width = 60;
          res.align = "center";
        }
        if (res.slot === "picture") {
          res.width = 280;
        }
        if (res.formatterKey) {
          res.render = (h, params) => {
            return h("span", params.row[res.formatterKey]);
          };
        }

        return res;
      });
      if (this.isFlexWidth) {
        for (let i = 0; i < this.insideColumns.length; i++) {
          if (i === 0) {
            if (this.isSelect) {
              continue;
            }
          }
          let key =
            this.insideColumns[i].formatterKey || this.insideColumns[i].key;
          if (this.insideColumns[i].key === "actions") {
            this.insideColumns[i].width = flexColumnWidth(
              key,
              this.insideColumns[i].title,
              this.insideTableData,
              this.actionList
            );
          } else {
            this.insideColumns[i].minWidth = flexColumnWidth(
              key,
              this.insideColumns[i].title,
              this.insideTableData,
              this.actionList
            );
          }
        }
      }
    },
    handleClick(item, params) {
      if (item.listname.includes("删除")) {
        this.onDelete(item, params);
      } else {
        this.$emit(item.description, params, item.targetsourceid);
      }
    },
    onDelete(item, params) {
      let isArray = params instanceof Array;
      if ((isArray && params.length === 0) || !params) {
        this.$Modal.info({
          title: "提示",
          content: "请选择内容！",
          width: 350,
        });
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: "确认要删除吗？",
          width: 350,
          onOk: () => {
            this.$emit(item.description, params, item.targetsourceid);
          },
        });
      }
    },
    // 查询
    handleSearch() {
      // let filters = this.searchData
      // let keys = Object.keys(filters)
      // this.insideTableData = this.value.filter(item => {
      //   return keys.every(key => {
      //     if (filters[key] !== '' && typeof filters[key] === 'string') {
      //       return item[key].indexOf(filters[key]) > -1
      //     } else if (filters[key] !== '' && typeof filters[key] === 'number') {
      //       return item[key] === filters[key]
      //     } else {
      //       return true
      //     }
      //   })
      // })
      this.$refs.search.validate((valid) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        this.searchLoading = true;
        this.$emit("getList", 1, this.searchData);
        this.selection = [];
      });
    },
    // 清除
    handleClear() {
      this.searchData = {};
      this.$refs.search.resetFields();
      this.$emit("on-search-clear");
      // this.loading = true;
      // this.clearLoading = true;
      this.$emit("getList", 1, this.searchData);
      this.selection = [];
    },
    handleTableData() {
      this.insideTableData = this.value;
    },
    changePage(page) {
      this.loading = true;
      this.$emit("getList", page, this.searchData);
      this.selection = [];
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("on-current-change", currentRow, oldCurrentRow);
    },
    onSelect(selection, row) {
      this.$emit("on-select", selection, row);
    },
    onSelectCancel(selection, row) {
      this.$emit("on-select-cancel", selection, row);
    },
    onSelectAll(selection) {
      this.$emit("on-select-all", selection);
    },
    onSelectionChange(selection) {
      this.selection = selection;
      this.$emit("on-selection-change", selection);
    },
    onSortChange(column, key, order) {
      this.$emit("on-sort-change", column, key, order);
    },
    onFilterChange(row) {
      this.$emit("on-filter-change", row);
    },
    onRowClick(row, index) {
      this.$emit("on-row-click", row, index);
    },
    onRowDblclick(row, index) {
      this.$emit("on-row-dblclick", row, index);
    },
    onExpand(row, status) {
      this.$emit("on-expand", row, status);
    },
    onCellClick(row, rowIndex, column, columnIndex, $event) {
      this.$emit("on-cell-click", row, rowIndex, column, columnIndex, $event);
    },
    // // 获取网格树
    // getGridTree() {
    //   getUserGrid().then((data) => {
    //     this.gridTreeData = treeData(data.obj);
    //   });
    // },
    // // 获取组织结构树
    // getDeptTree() {
    //   getDeptTreegrid().then((data) => {
    //     this.deptTreeData = treeData(data.obj);
    //   });
    // },
    normalizer(node) {
      return {
        id: node.id,
        label: node.text,
        children: node.children,
      };
    },
    handleSelected(param, description) {
      this.$emit(description, param);
    },
  },
  watch: {
    columns(columns) {
      this.handleColumns(columns);
    },
    value: {
      handler() {
        // this.handleTableData();
        this.handleColumns(this.insideColumns);
        this.$nextTick(() => {
          this.loading = false;
          this.searchLoading = false;
          this.clearLoading = false;
        });
      },
      deep: true,
    },
    // 监听页码的变化，从而更新 Page 组件的 current 属性
    page(newPage) {
      this.pageIndex = newPage;
    },
  },
  created() {
    this.getTree();
    // this.getDeptTree();
    // this.getGridTree();
  },
  mounted() {
    this.handleColumns(this.columns);
    // this.handleTableData();
  },
};
</script>
<style lang="less">
.search {
  margin-bottom: 10px;
  position: relative;
  .btns-group {
    position: absolute;
    right: 15px;
    top: 29px;
    width: 24%;
    text-align: right;
  }
  .btn-expand {
    font-size: 12px;
    margin-right: 15px;
    cursor: pointer;
    color: #358962;
    user-select: none;
  }
  .search-expand {
    display: none;
    &.expand {
      display: block;
    }
  }
  .ivu-form-item {
    .ivu-form-item-content {
      display: flex;
    }
  }
}
.btns-group {
  margin-top: -5px;
}
.tableswrap .btns-group {
  padding-bottom: 10px;
  margin-top: 0;
  text-align: right;
}
</style>
