/**
 * map 公用方法
 * @param addCtrl:添加地图类型控件
 * @param markerPoint: 添加普通标注
 */
export default {
  data() {
    return {
      localsearch: null,
      pageCapacity: 100,
      polygon: [],
      polygonPoints: [],
      marker: [],
      markPoint: null,
    };
  },
  methods: {
    /**
     * 添加地图类型控件
     */
    addCtrl() {
      var ctrl = new T.Control.MapType([
        {
          title: "地图", // 地图控件上所要显示的图层名称
          icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png", // 地图控件上所要显示的图层图标（默认图标大小80x80）
          layer: TMAP_NORMAL_MAP, // 地图类型对象，即MapType。
        },
        {
          title: "卫星",
          icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
          layer: TMAP_HYBRID_MAP,
        },
        {
          title: "卫星混合",
          http: "api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
          layer: "TMAP_HYBRID_MAP",
        },
        {
          title: "地形",
          icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",
          layer: window.TMAP_TERRAIN_MAP,
        },
        {
          title: "地形混合",
          icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",
          layer: window.TMAP_TERRAIN_HYBRID_MAP,
        },
      ]);
      this.map.addControl(ctrl);
    },
    /**
     * 添加普通标注
     * @param site  (site.lng, site.lat)  地理坐标
     */
    markerPoint(site) {
      this.clearAll();
      // site.forEach((item) => {
      //创建标注对象
      this.marker.push(new T.Marker(new T.LngLat(site.lng, site.lat)));
      //向地图上添加标注
      this.map.addOverLay(this.marker[0]);
      this.marker[0].enableDragging();
      this.center = [site.lng, site.lat];
      this.map.centerAndZoom(new T.LngLat(site.lng, site.lat), 16);
      // });
    },

    /**
     * 搜索
     */
    createSearch() {
      const config = {
        pageCapacity: this.pageCapacity, //每页显示的数量
        onSearchComplete: this.localSearchResult, //接收数据的回调函数
      };
      //创建搜索对象
      this.localsearch = new T.LocalSearch(this.map, config);
    },

    search() {
      this.page = 1;
      // this.searchList = [];
      this.localsearch.search(this.searchData, 7);
    },

    // nextPage() {
    //   this.page++;
    //   this.localsearch.nextPage();
    // },

    /**
     * 接收数据的回调函数
     * @param result
     */
    localSearchResult(result) {
      //清空地图及搜索列表
      // this.clearAll();

      // 获取总分页数
      this.totalPage = Math.floor(result.getCount() / 10);
      //解析建议词信息
      this.suggests(result.getPois());
    },

    //解析建议词信息
    suggests(obj) {
      if (obj) {
        //建议词提示，如果搜索类型为公交规划建议词或公交站搜索时，返回结果为公交信息的建议词。
        // this.searchList = [...this.searchList, ...obj];
        this.searchList = obj;
      }
    },

    //清空地图及搜索列表
    clearAll() {
      this.map.clearOverLays();
      this.searchData = "";
      this.visible = false;
    },

    /**
     * 禁用滚轮
     */
    disableScrollWheelZoom() {
      this.map.disableScrollWheelZoom();
    },
    /**
     * 启用滚轮
     */
    enableScrollWheelZoom() {
      this.map.enableScrollWheelZoom();
    },

    /**
     * 设置中心
     * @param lng
     * @param lat
     */
    setCenter(lng, lat) {
      this.map.panTo(new T.LngLat(lng, lat));
    },

    getPoints() {
      this.center = [this.map.getCenter().lng, this.map.getCenter().lat];
      //  获取缩放级别
      let zoom = this.map.getZoom();
      let num = 8 / (zoom * zoom * zoom);
      let points = [];
      points.push(new T.LngLat(this.center[0] - num, this.center[1] + num));
      points.push(new T.LngLat(this.center[0] - num, this.center[1] - num));
      points.push(new T.LngLat(this.center[0] + num, this.center[1] - num));
      points.push(new T.LngLat(this.center[0] + num, this.center[1] + num));
      return points;
    },
    /**
     * 画多边形
     * @param points
     */
    // addPolygon(points) {
    //   //创建面对象
    //   this.polygon.push(
    //     new T.Polygon(points, {
    //       color: "blue",
    //       weight: 3,
    //       opacity: 0.5,
    //       fillColor: "#FFFFFF",
    //       fillOpacity: 0.5,
    //     })
    //   );
    //   //向地图上添加面
    //   this.map.addOverLay(this.polygon[this.polygon.length - 1]);
    //   this.polygon[this.polygon.length - 1].enableEdit();
    // },

    //绘制多边形
    drawPolygon() {
      this.polygon.push(
        new T.PolygonTool(this.map, {
          color: "blue",
          weight: 3,
          opacity: 0.5,
          fillColor: "#FFFFFF",
          fillOpacity: 0.5,
        })
      );
      // var PolygonTool = new T.PolygonTool(this.map);
      // this.map.clearOverLays();
      this.polygon[this.polygon.length - 1].open();
      //绑定draw事件 用户双击完成一次折线绘制时触发事件。
      this.polygon[this.polygon.length - 1].addEventListener(
        "draw",
        this.getPoints4
      );
    },

    getPoints4(e) {
      //用户当前绘制的多边形的点坐标数组
      console.log(e.currentLnglats);
      if (this.polygonPoints.length < this.polygon.length) {
        this.polygonPoints.push([]);
      }
      this.polygonPoints[this.polygonPoints.length - 1] = e.currentLnglats;
      console.log("用户最后绘制的多边形的地理面积:" + e.currentArea);
    },

    //绘制标注(点)
    drawMarker() {
      this.marker.push(new T.MarkTool(this.map, { follow: true }));
      this.marker[this.marker.length - 1].open();
      //绑定mouseup事件 在用户每完成一次标注时触发事件。
      this.marker[this.marker.length - 1].addEventListener(
        "mouseup",
        this.getPoints1
      );
    },

    getPoints1(e) {
      var points = e.currentLnglat;
      //  清除原先的点
      if (this.marker.length > 1) {
        if (this.marker[0].clear) {
          this.marker[0].clear();
        }
        this.map.removeOverLay(this.marker[0]);
        this.marker.splice(0, 1);
      }
      this.markPoint = points;
      this.drawMarker();

      //标注点的坐标
      console.log(points);
    },

    showData() {
      //  回显
      if (this.type === "geojson-btn") {
        if (!this.value) return;
        let coordinates = JSON.parse(this.value);
        this.center = [
          coordinates[0].coordinates[0][0][0],
          coordinates[0].coordinates[0][0][1],
        ];
        this.map.centerAndZoom(
          new T.LngLat(this.center[0], this.center[1]),
          12
        );
        coordinates.map((item) => {
          var points = [];
          this.polygonPoints.push(
            item.coordinates[0].map((item) => {
              return { lng: item[0], lat: item[1] };
            })
          );
          item.coordinates[0].map((lntlat) => {
            console.log(lntlat);
            points.push(new T.LngLat(lntlat[0], lntlat[1]));
          });
          //创建面对象
          this.polygon.push(
            new T.Polygon(points, {
              color: "blue",
              weight: 3,
              opacity: 0.5,
              fillColor: "#FFFFFF",
              fillOpacity: 0.5,
            })
          );
          //向地图上添加面
          this.map.addOverLay(this.polygon[this.polygon.length - 1]);
        });
      } else {
        if (!this.value) {
          this.drawMarker();
        } else {
          let arr = this.value.split(",");
          this.markerPoint({ lng: arr[0], lat: arr[1] });
          this.markPoint = { lng: arr[0], lat: arr[1] };
          this.drawMarker();
        }
      }
    },
  },
};
