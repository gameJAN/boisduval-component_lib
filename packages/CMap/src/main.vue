<template>
  <div id="mapDiv" class="mapDiv">
    <div id="keyWord">
      <Dropdown trigger="custom" :visible="visible">
        <Input
          clearable
          placeholder="请输入关键字"
          type="text"
          icon="ios-search"
          v-model="searchData"
          @on-keyup="onKeyUp"
          @on-focus="visible = true"
          @on-blur="
            visible = false;
            enableScrollWheelZoom();
          "
        />
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item, index) in searchList"
            :key="index"
            @click.native="handleSelect(item)"
            >{{ item.name }}</DropdownItem
          >
          <!--          <DropdownItem @click.native="nextPage" v-if="totalPage > page"-->
          <!--            >更多</DropdownItem-->
          <!--          >-->
        </DropdownMenu>
      </Dropdown>
      <div class="btn-group" v-if="type === 'geojson-btn'">
        <Button size="small" @click="drawPolygon">圈地</Button>
        <Button
          size="small"
          @click="
            map.clearOverLays();
            polygon = [];
            polygonPoints = [];
          "
          >清除</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import mapMixin from "./mapMixin"; // 公共方法
export default {
  name: "CMap",
  mixins: [mapMixin],
  props: {
    type: {
      type: String,
      default: "geojson-btn",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      map: "", // 对象
      zoom: 12, // 地图的初始化级别，及放大比例,
      center: [116.30034, 40.07689],
      searchData: "",
      searchList: [],
      totalPage: 0,
      page: 1,
      visible: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.disableScrollWheelZoom();
      }
    },
  },
  mounted() {
    let that = this;
    // 挂载完成后渲染地图
    this.$nextTick(function () {
      that.onLoad();
    });
  },
  methods: {
    onLoad() {
      let that = this;
      // var T = Window.T;
      var imageURL =
        "http://t0.tianditu.gov.cn/img_w/wmts?" +
        "SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
        "&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=8e9d8ca42859c4df737fffee3729395b";
      //创建自定义图层对象
      let lay = new T.TileLayer(imageURL, { minZoom: 1, maxZoom: 18 });
      let config = { layers: [lay] };
      that.map = new T.Map("mapDiv", config);

      that.map.centerAndZoom(
        new T.LngLat(this.center[0], this.center[1]),
        that.zoom
      ); // 设置显示地图的中心点和级别
      // 添加地图类型控件
      // that.addCtrl();

      // 搜索
      this.createSearch();

      this.showData();

      // 普通标注
      // let site = [
      //   { lng: 116.30034, lat: 39.98054 },
      //   { lng: 116.41238, lat: 40.07689 },
      //   { lng: 116.34143, lat: 40.03403 },
      // ];
      // that.markerPoint(site);
    },

    // 搜索
    onKeyUp() {
      // this.visible = true;
      this.search();
    },

    /**
     * 搜索后选择
     * @param obj
     */
    handleSelect(obj) {
      this.searchData = obj.name;
      this.center = obj.lonlat.split(" ");
      this.setCenter(this.center[0], this.center[1]);
      // if (this.type === "gps-btn") {
      //   this.markerPoint({ lng: this.center[0], lat: this.center[1] });
      // }
    },
  },
};
</script>

<style scoped lang="less"></style>
