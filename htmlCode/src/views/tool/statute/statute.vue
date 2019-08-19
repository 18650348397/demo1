<template>
  <div>
    <Card>
      <!-- <Table border :columns="tableColumns" :data="tableData" stripe></Table>
      <Spin size="large" fix v-if="loading"></Spin>-->
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="40" inline>
        <FormItem label="名称:" prop="name">
          <Input v-model="formSearch.name" placeholder="请输入名称关键词" />
        </FormItem>
        <div style="display: inline">
          <ButtonGroup class="margin-right-10">
            <Button type="ghost" icon="ios-search" @click="handleSearch">搜索</Button>
            <Button type="ghost" icon="ios-loop" @click="handleReset">重置</Button>
          </ButtonGroup>
          <ButtonGroup class="padding-left-10">
            <Button type="info" @click="handleNewAdd" icon="ios-plus-outline">新增</Button>
            <Button
              type="error"
              @click="handleDelete"
              :disabled="disabledDelBtn"
              icon="ios-trash-outline"
            >删除</Button>
          </ButtonGroup>
        </div>
      </Form>

      <Table
        border
        :columns="tableColumns"
        :data="tableData"
        @on-selection-change="selectTableItem"
        @on-select="selectTableItem"
        stripe
      ></Table>
      <div class="clearfix" style="margin-top: 10px;">
        <div class="fr">
          <Page :total="total" :current="currentPage" show-elevator @on-change="handlePageClick"></Page>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>
    </Card>

    <Modal
      v-model="formModal"
      title="规约"
      width="350"
      :loading="formModalLoading"
      @on-ok="formModalOK"
      @on-cancel="formModalCancel"
    >
      <Form
        ref="formModalValidate"
        :model="formModalValidate"
        :rules="formModalRule"
        :label-width="60"
      >
        <FormItem label="规约名称:" prop="name">
          <Input v-model="formModalValidate.name" placeholder="请输入规约名称" style="width:240px" />
        </FormItem>
        <FormItem label="规约协议编号:" prop="protocolid" :label-width="83">
          <Select v-model="formModalValidate.protocolid" style="width:200px">
            <Option value="3" key="3">3</Option>
            <Option value="4" key="4">4</Option>
            <Option value="5" key="5">5</Option>
            <Option value="6" key="6">6</Option>
            <Option value="7" key="7">7</Option>
            <Option value="8" key="8">8</Option>
            <Option value="9" key="9">9</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="规约ID:" prop="id">
          <Input v-model="formModalValidate.type" placeholder="请输入规约ID" style="width:240px" />
        </FormItem>-->
      </Form>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "statute",
  components: {},
  data() {
    return {
      loading: false,
      formModal: false,
      formModalLoading: true,
      disabledDelBtn: true,
      currentPage: 1,
      total: 1,
      pageSize: "10",
      currlocal: 1,
      formModalValidate: {
        name: "",
        protocolid: "",
        id: ""
      },
      formModalRule: {
        name: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        protocolid: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        // id: [
        //   {
        //     required: true,
        //     message: "必填",
        //     trigger: "blur"
        //   }
        // ]
      },
      tableColumns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "规约名称",
          key: "name"
        },
        {
          title: "规约协议编号",
          key: "protocolid",
        },
        // {
        //   title: "规约ID",
        //   key: "id"
        // },
        {
          title: "操作",
          width: 100,
          align: "center",
          render: (h, { row, column, index }) => {
            return (
              <div>
                <ButtonGroup size="small">
                  <Button
                    type="ghost"
                    icon="edit"
                    onClick={() => {
                      if (row.name == "b" || row.name == "104") {
                        this.$Message.info("该条规约不可操作");
                      } else {
                        this.handleEidtTableItem(row);
                      }
                    }}
                  />
                </ButtonGroup>
              </div>
            );
          }
        }
      ],
      tableData: [],
      formSearch: {
        name: ""
      },
    };
  },
  mounted() {
    this.tableDataGet(this.currentPage);
  },
  computed: {},
  watch: {},
  methods: {
    // selectTableItem(selection) {
    //   if (selection.length) {
    //     this.disabledDelBtn = false;
    //     this.selectTableSelection = selection;
    //   } else {
    //     this.disabledDelBtn = true;
    //     this.selectTableSelection = null;
    //   }
    // },
    selectTableItem(selection) {
      if (selection.length) {
        if (selection[0].name == "b" || selection[0].name == "104") {
          this.$Message.info("该条规约不可删除");
          this.disabledDelBtn = true;
        } else {
          this.disabledDelBtn = false;
          this.selectTableSelection = selection;
        }
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
          url: util.ajaxUrl + "/api/protocol/",
          params: {
            name: this.formSearch.name,
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
      this.tableDataGet(1);
    },
    handleReset() {
      this.$refs["formSearch"].resetFields();
      this.tableDataGet(1);
    },
    handleNewAdd() {
      this.formModal = true;
      this.formModalType = true;
    },
    handleDelete() {
      let _delId = "";
      if (this.selectTableSelection.length > 1) {
        this.selectTableSelection.forEach((item, index) => {
          _delId += item.id + ",";
        });
        _delId = _delId.substring(0, _delId.length - 1);
      } else {
        _delId = this.selectTableSelection[0].id;
      }
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/protocol/" + _delId,
          method: "delete"
        },
        data => {
          this.tableDataGet(this.currentPage);
          this.disabledDelBtn = true;
        },
        error => {
          this.loading = false;
        }
      );
    },
    handlePageClick(clickPageNum) {
      //分页
      if (this.loading) {
        return false;
      }
      this.currlocal = clickPageNum;
      this.tableDataGet(clickPageNum);
    },
    handleEidtTableItem(row) {
      this.formModal = true;
      this.formModalType = false;
      this.formModalValidate.name = row.name;
      this.formModalValidate.protocolid = row.protocolid.toString();
      this.formModalValidate.id = row.id;
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/protocol/";
          if (!this.formModalType) {
            _method = "put";
            _url += "/" + this.formModalValidate.id;
          }
          util.axiosAjax(
            this,
            {
              url: _url,
              method: _method,
              data: {
                name: this.formModalValidate.name,
                protocolid: this.formModalValidate.protocolid
              }
            },
            data => {
              this.formModal = false;
              if (this.formModalType) {
                this.tableDataGet(1);
              } else {
                this.tableDataGet(this.currentPage);
              }

              this.$refs["formModalValidate"].resetFields();
            },
            error => {
              util.domReset(this, "formModalLoading");
            }
          );
        } else {
          util.domReset(this, "formModalLoading");
        }
      });
    },
    formModalCancel() {
      this.$refs["formModalValidate"].resetFields();
    }
  }
};
</script>