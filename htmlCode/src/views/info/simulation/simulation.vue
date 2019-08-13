<template>
  <div>
    <Card>
      <Table border :columns="tableColumns" :data="tableData" stripe></Table>
      <div class="clearfix" style="margin-top: 10px;">
        <div class="fr">
          <Page :total="total" :current="currentPage" show-elevator @on-change="handlePageClick"></Page>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>
    </Card>

  </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "simulation_info",
  components: {},
  data() {
    return {
      currentPage: 1,
      total: 1,
      currlocal: 1,
      pageSize: "10",
      loading: false,
      tableColumns: [
        {
          title: "序号",
          type: "index",
          width: 80,
          align: "center"
        },
        {
          title: "监测描述",
          key: "name"
        },
        {
          title: "传感器类型",
          key: "model"
        },
        {
          title: "传感器ID",
          key: "value1"
        },
        {
          title: "连接通道",
          key: "value2"
        },
        {
          title: "状态",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 1 ? "blue" : row.status === 2 ? "yellow" : "red";
            const text =
              row.status === 1
                ? "正常"
                : row.status === 2 ? "故障" : "断开";
            return h(
              "Tag",
              {
                props: {
                  checkable : true,
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "采集数据",
          key: "value4"
        }
      ],
      tableData: [
        {
          model: "1526640600000",
          name: "三相电量仪(新建监测项1)设备故障。",
          value1: "1526640600000",
          value2: "1526640600000",
          status: 3,
          value4: "1526640600000",
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    tableDataGet() {
      /* this.currentPage = data.data.data.pageNum;
          this.currlocal = data.data.data.pageNum;
          this.total = data.data.data.total;
          this.pageSize = data.data.data.pageSize; */
    },
    handlePageClick(clickPageNum) {
      //分页
      if (this.loadingTable) {
        return false;
      }
      this.currlocal = clickPageNum;
      this.tableDataGet(clickPageNum);
    }
  }
};
</script>