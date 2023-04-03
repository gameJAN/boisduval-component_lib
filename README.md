### 1. 安装

```javascript
npm i @gamejan/component_lib
```

### 2. 组件的引入

在main.js中写入

```javascript
import ComponentLib from @gamejan/component_lib;
import "@gamejan/component_lib/src/assets/styles/base.less";

Vue.use(CommonLib, {
  baseUrl:
    process.env.NODE_ENV === "development"
      ? process.env.VUE_APP_REQ_PROXY
      : process.env.VUE_APP_SERVER_URL,
});
```

### 3. 组件的使用

#### CTable

表格组件，用法和原先的Tables一样。

eg:

```html
<CTable
      :searchable="true"
      :searchData="searchData"
      tableTitle="数据列表"
      :columns="columns"
      :value="tableData"
      :total="tableDataTotal"
      :page="curPage"
      :rows="pageSize"
      :search-list="searchList"
      :auths="auths"
      @on-selection-change="onSelectionChange"
      @on-search-clear="handleClear"
      @getList="getList"
      @handleEdit="handleEdit"
      @addItem="addItem"
      @handleDetail="handleDetail"
      @handleDel="handleDel"
      @delItems="delItems"
      @handleImport="handleImport"
    >
    </CTable>
```



#### FormModal

表单组件，一般用于增删改查等操作的弹窗。

eg:

```html
<Modal
      title="添加数据"
      :mask-closable="false"
      v-model="handleModalItem"
      width="800"
      height="100%"
      footer-hide
    >
      <CFormModal
        :data="modal.searchData"
        :search-list="modal.formList"
        @handleCancel="handleModalItem = false"
        @handleSubmit="handleSubmit"
        @handleTree="
          (data, param) => {
            handleTree(data, param, 'add');
          }
        "
      />
</Modal>
```



### 4. 组件的更新

- 1. 修改package.json中的版本号，然后：
        ```javascript
        npm run build:file
        ```

- 2. 打包

     ```javascript
     npm run lib
     ```

- 3. 登录npm账号

     ```javascript
     npm login
     ```

- 4. 发布到npm

     > 不能使用taobao源，会报错；要切换npm源

     ```javascript
     npm publish
     ```

- 5. 需要更新的项目重新安装组件，可能会有一些延迟。

     ```javascript
     npm i @gamejan/component_lib
     ```

     

