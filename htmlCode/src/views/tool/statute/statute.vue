<template>
  <div>
    <Card>
      <Table border :columns="tableColumns" :data="tableData" stripe></Table>
      <Spin size="large" fix v-if="loading"></Spin>
    </Card>


  </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "statute",
  components: {},
  data() {
    return {
      loading: false,
      tableColumns: [
        {
          title: "规约名称",
          key: "name"
        },
        {
          title: "规约ID",
          key: "id"
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.tableDataGet()
  },
  computed: {},
  watch: {},
  methods: {
    tableDataGet() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/protocol"
        },
        data => {
          this.loading = false;
          this.tableData = data.data.data.list;
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
};
</script>