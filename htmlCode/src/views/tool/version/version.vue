<template>
  <Card>
    <table class="tb tb-s" style="width:100%">
      <tbody>
        <tr>
          <th>设备软件版本号</th>
          <td>{{softwareVerNo}}</td>
        </tr>
        <tr>
          <th>设备硬件版本号</th>
          <td>{{hardwareVerNo}}</td>
        </tr>
        <tr>
          <th>产品序列号</th>
          <td>{{serialNo}}</td>
        </tr>
      </tbody>
    </table>
    <Spin size="large" fix v-if="loading"></Spin>
  </Card>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "version",
  components: {},
  data() {
    return {
      loading: false,
      hardwareVerNo: "",
      serialNo: "",
      softwareVerNo: ""
    };
  },
  mounted() {
    this.getVersionData();
  },
  watch: {},
  methods: {
    getVersionData() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/ver"
        },
        data => {
          this.softwareVerNo = data.data.data.softwareVerNo;
          this.serialNo = data.data.data.serialNo;
          this.hardwareVerNo = data.data.data.hardwareVerNo;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
};
</script>
