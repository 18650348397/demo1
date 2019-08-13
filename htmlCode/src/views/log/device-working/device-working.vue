<template>
  <div>
    <Card>
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="60" inline>
        <FormItem label="日志内容" prop="content">
          <Input v-model="formSearch.content" placeholder="请输入日志内容关键词" />
        </FormItem>
        <div style="display: inline">
          <ButtonGroup class="margin-right-10">
            <Button type="ghost" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button type="ghost" icon="ios-loop" @click="handleReset">重置</Button>
          </ButtonGroup>
          <ButtonGroup class="padding-left-10">
            <Button type="info" @click="handleExport" icon="ios-download-outline">导出</Button>
            <Button type="error" @click="handleDelete" :disabled="disabledDelBtn" icon="ios-trash-outline">删除</Button>
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
  name: "device_working",
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
            const color =
              row.status === 1 ? "blue" : row.status === 2 ? "green" : row.status === 3 ? "yellow" : "red";
            const text =
              row.status === 1
                ? "启动记录"
                : row.status === 2 ? "报警信息" : row.status === 3 ? "故障信息" : "关机记录";
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
          title: "日志内容",
          align: "center",
          key: "content"
        }
      ],
      tableData: [
        {
          time: 1526640600000,
          status: 1,
          content: "本机时间校准(本机时间偏差在5分钟内)。"
        },
        {
          time: 1526640600000,
          status: 2,
          content: "本机时间校准(本机时间偏差在5分钟内)。"
        },
        {
          time: 1526640600000,
          status: 3,
          content: "本机时间校准(本机时间偏差在5分钟内)。"
        },
        {
          time: 1526640600000,
          status: 4,
          content: "本机时间校准(本机时间偏差在5分钟内)。"
        }
      ],
      formSearch: {
        content: ""
      },
      selectTableSelection: null
    };
  },
  mounted() {},
  computed: {},
  watch: {},
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
    tableDataGet() {},
    handleSearch() {},
    handleReset() {},
    handleExport() {},
    handleDelete() {},
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
