<style lang="less" scoped>
@import "./restart.less";
</style>
<template>
  <Card>
    <div class="clearfix restart-wrap">
      <div class="fl">
        <Icon size="200" type="loop"></Icon>
      </div>
      <div class="fl padding-left-20">
        <p>该操作将重新启动设备, 您确定要执行该操作吗?</p>
        <Button type="primary" size="large" style="width:200px" @click="restart">重新启动</Button>
      </div>
    </div>
    <Spin size="large" fix v-if="loading"></Spin>
  </Card>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "restart",
  components: {},
  data() {
    return {
      loading: false
    };
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {
    restart() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/sys/restart",
          method: "post"
        },
        data => {
          this.loading = false;
          this.$Message.success('重新启动设备成功');
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
};
</script>
