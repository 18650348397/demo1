<style lang="less" scoped>
@import "./home.less";
</style>
<template>
  <div>
    <Row :gutter="16">
      <Col span="8">
      <Card>
        <p slot="title">网络1连接状态</p>
        <div class="text-layout text-layout-left">
          <ul class="clearfix">
            <li>
              <div class="text-layout-title">IP地址:</div>
              <div class="text-layout-content">{{networksOne.ipv4}}</div>
            </li>
            <li>
              <div class="text-layout-title">子网掩码:</div>
              <div class="text-layout-content">{{networksOne.ipv4Mask}}</div>
            </li>
            <li>
              <div class="text-layout-title">网关:</div>
              <div class="text-layout-content">{{networksOne.ipv4Gateway}}</div>
            </li>
          </ul>
        </div>
      </Card>
      </Col>
      <Col span="8">
      <Card>
        <p slot="title">网络2连接状态</p>
        <div class="text-layout text-layout-left">
          <ul class="clearfix">
            <li>
              <div class="text-layout-title">IP地址:</div>
              <div class="text-layout-content">{{networksTwo.ipv4}}</div>
            </li>
            <li>
              <div class="text-layout-title">子网掩码:</div>
              <div class="text-layout-content">{{networksTwo.ipv4Mask}}</div>
            </li>
            <li>
              <div class="text-layout-title">网关:</div>
              <div class="text-layout-content">{{networksTwo.ipv4Gateway}}</div>
            </li>
          </ul>
        </div>
      </Card>
      </Col>
      <Col span="8">
      <Card>
        <p slot="title">监控平台连接状态</p>
        <div class="text-layout text-layout-left">
          <ul class="clearfix">
            <li>
              <div class="text-layout-title">网关用户名:</div>
              <div class="text-layout-content">{{masterServer.userName}}</div>
            </li>
            <li>
              <div class="text-layout-title">IP地址或域名:</div>
              <div class="text-layout-content">{{masterServer.srvUrl}}</div>
            </li>
            <li>
              <div class="text-layout-title">端口:</div>
              <div class="text-layout-content">{{masterServer.port}}</div>
            </li>
          </ul>
        </div>
      </Card>
      </Col>
    </Row>

    <Card class="margin-top-20">
      <p slot="title">系统基本信息</p>
      <div>
        <Row>
          <Col span="8">
          <div class="c-t-center">
            <i-circle :size="250" :trail-width="4" :stroke-width="5" :percent="disk.per" stroke-linecap="square" stroke-color="#43a3fb">
              <div class="demo-Circle-custom">
                <h1>{{disk.total}} MB</h1>
                <p>硬盘空间</p>
                <span>
                  总占比
                  <i>{{disk.per}}%</i>
                </span>
              </div>
            </i-circle>
          </div>
          </Col>
          <Col span="8">
          <div class="c-t-center">
            <i-circle :size="250" :trail-width="4" :stroke-width="5" :percent="memory.per" stroke-linecap="square" stroke-color="#43a3fb">
              <div class="demo-Circle-custom">
                <h1>{{memory.total}} MB</h1>
                <p>内存</p>
                <span>
                  总占比
                  <i>{{memory.per}}%</i>
                </span>
              </div>
            </i-circle>
          </div>
          </Col>
          <Col span="8">
          <div class="c-t-center">

          </div>
          </Col>
        </Row>

      </div>
    </Card>
    <Spin size="large" fix v-if="loading"></Spin>
  </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "home",
  components: {},
  data() {
    return {
      loading: false,
      networksOne: {
        ipv4: "",
        ipv4Gateway: "",
        ipv4Mask: ""
      },
      networksTwo: {
        ipv4: "",
        ipv4Gateway: "",
        ipv4Mask: ""
      },
      masterServer: {
        port: "",
        srvUrl: "",
        userName: ""
      },
      disk: {
        free: 0,
        per: 0,
        total: 0
      },
      memory: {
        free: 0,
        per: 0,
        total: 0
      }
    };
  },
  mounted() {
    this.getHomeData()
  },
  computed: {},
  watch: {},
  methods: {
    getHomeData() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/index"
        },
        data => {
          this.loading = false;
          let _data = data.data.data;
          if (_data.networks.length > 0) {
            this.networksOne.ipv4 = _data.networks[0].ipv4;
            this.networksOne.ipv4Gateway = _data.networks[0].ipv4Gateway;
            this.networksOne.ipv4Mask = _data.networks[0].ipv4Mask;

            this.networksTwo.ipv4 = _data.networks[1].ipv4;
            this.networksTwo.ipv4Gateway = _data.networks[1].ipv4Gateway;
            this.networksTwo.ipv4Mask = _data.networks[1].ipv4Mask;
          }
          if (_data.masterServer) {
            this.masterServer.userName = _data.masterServer.userName;
            this.masterServer.port = _data.masterServer.port;
            this.masterServer.srvUrl = _data.masterServer.srvUrl;
          }
          this.disk.free = _data.disk.free;
          this.disk.per = _data.disk.per;
          this.disk.total = _data.disk.total;

          this.memory.free = _data.memory.free;
          this.memory.per = _data.memory.per;
          this.memory.total = _data.memory.total;
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
};
</script>
