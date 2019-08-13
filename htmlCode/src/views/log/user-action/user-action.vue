<template>
  <div>
    <Card>
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="60" inline>
        <FormItem label="日志内容" prop="name">
          <Input v-model="formSearch.name" placeholder="请输入日志内容关键词" />
        </FormItem>
        <div style="display: inline">
          <ButtonGroup class="margin-right-10">
            <Button type="ghost" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button type="ghost" icon="ios-loop" @click="handleReset">重置</Button>
          </ButtonGroup>
        </div>
      </Form>

      <Table border :columns="tableColumns" :data="tableData" @on-selection-change="selectTableItem" stripe></Table>
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
  name: "user_action",
  components: {},
  data() {
    return {
      disabledDelBtn: true,
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
          title: "日志时间",
          width: 200,
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              util.formatDate(new Date(params.row.time), "yyyy-MM-dd hh:mm")
            );
          }
        },
        {
          title: "类型",
          width: 150,
          align: "center",
          render: (h, params) => {
            const row = params.row;
            const color = row.result === "success" ? "blue" : "red";
            const text1 = row.type === "login" ? "登录" : "操作";
            const text2 = row.result === "success" ? text1 + "成功" : text1 + "失败";
            return h(
              "Tag",
              {
                props: {
                  checkable : true,
                  color: color
                }
              },
              text2
            );
          }
        },
        {
          title: "日志内容",
          align: "center",
          key: "content"
        }
      ],
      tableData: [],
      formSearch: {
        name: ""
      },
      selectTableSelection: null
    };
  },
  mounted() {
    this.tableDataGet(1)
  },
  methods: {
    selectTableItem(selection) {
      if (selection.length) {
        this.disabledDelBtn = false;
        this.selectTableSelection = selection;
      } else {
        this.disabledDelBtn = true;
        this.selectTableSelection = null;
      }
    },
    tableDataGet(pgNum) {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/log/operate",
          params: {
            kw: this.formSearch.name,
            page: pgNum,
            pageSize: this.pageSize
          }
        },
        data => {
          this.loading = false;
          if (data.data.data.list.length == 0 && data.data.data.pageNum > 1) {
            this.tableDataGet(data.data.data.pageNum - 1);
          } else {
            this.tableData = data.data.data.list;
            this.currentPage = data.data.data.pageNum;
            this.currlocal = data.data.data.pageNum;
            this.total = data.data.data.total;
            this.pageSize = data.data.data.pageSize;
          }
        },
        error => {
          this.loading = false;
        }
      );
    },
    handleSearch() {
      this.tableDataGet(1)
    },
    handleReset() {
      this.$refs["formSearch"].resetFields();
      this.tableDataGet(1);
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
