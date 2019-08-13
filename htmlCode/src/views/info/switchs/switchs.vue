<template>
  <div>
    <Card>
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="40" inline>
        <FormItem label="名称:" prop="name">
          <Input v-model="formSearch.name" placeholder="请输入名称关键词" />
        </FormItem>
        <FormItem label="型号:" prop="type">
          <Input v-model="formSearch.type" placeholder="请输入型号关键词" />
        </FormItem>
        <div style="display: inline">
          <ButtonGroup class="margin-right-10">
            <Button type="ghost" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button type="ghost" icon="ios-loop" @click="handleReset">重置</Button>
          </ButtonGroup>
        </div>
      </Form>
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
  name: "switchs_info",
  components: {},
  data() {
    return {
      formSearch: {
        name: "",
        type: ""
      },
      currentPage: 1,
      total: 1,
      currlocal: 1,
      pageSize: "10",
      loading: false,
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "传感器名称",
          key: "name"
        },
        {
          title: "型号",
          render: (h, { row, column, index }) => {
            return h("span",row.type.name)
          }
        },
        {
          title: "干接点",
          render: (h, { row, column, index }) => {
            return h("span",row.connect.name)
          }
        },
        {
          title: "转发规约",
          render: (h, { row, column, index }) => {
            return h("span",row.protocol.name)
          }
        },
        {
          title: "报警模式",
          render: (h, { row, column, index }) => {
            return h("span",row.alarmModel.name)
          }
        },
        {
          title: "启用",
          width: 80,
          align: "center",
          render: (h, { row, column, index }) => {
            let _enable = row.enable ? "是" : "否"
            return h("span",_enable)
          }
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          render: (h, { row, column, index }) => {
            const color =
              row.status === "normal" ? "blue" : row.status === "closed" ? "green" : "red";
            const text = 
              row.status === "normal" ? "正常" : row.status === "closed" ? "关闭" : "错误";
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
          title: "监测说明",
          key: "desc"
        }
      ],
      tableData: []
    };
  },
  mounted() {
    this.tableDataGet(this.currentPage);
  },
  computed: {},
  watch: {},
  methods: {
    handleSearch() {
      this.tableDataGet(1);
    },
    handleReset() {
      this.$refs["formSearch"].resetFields();
      this.tableDataGet(1);
    },
    tableDataGet(pgNum) {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/switch",
          params: {
            name: this.formSearch.name,
            type: this.formSearch.type,
            page: pgNum,
            pageSize: this.pageSize
          }
        },
        data => {
          this.loading = false;
          this.tableData = data.data.data.list;
          this.currentPage = data.data.data.pageNum;
          this.currlocal = data.data.data.pageNum;
          this.total = data.data.data.total;
          this.pageSize = data.data.data.pageSize;
        },
        error => {
          this.loading = false;
        }
      );
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