<template>
  <div>
    <Card>
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

    <Modal v-model="formModal" title="型号" width=350 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="60">
        <FormItem label="名称:" prop="name">
          <Input v-model="formModalValidate.name" placeholder="请输入型号名称" style="width:240px" />
        </FormItem>
        <!-- <FormItem label="传感类型:" prop="type">
          <Input v-model="formModalValidate.type" placeholder="请输入型号类型" style="width:240px" />
        </FormItem> -->
        <FormItem label="传感类型:" prop="type" :label-width="83">
          <Select v-model="formModalValidate.type" style="width:200px">
            <Option value="switchs" key="switchs">开关型传感器</Option>
            <Option value="numerical" key="numerical">数值型传感器</Option>
          </Select>
        </FormItem>
        <FormItem label="传感协议:" prop="senprotocol" :label-width="83">
          <Select v-model="formModalValidate.senprotocol" style="width:200px">
            <Option value="modBus" key="modBus">modBus</Option>
          </Select>
        </FormItem>
        <FormItem label="厂家:" prop="factory">
          <Input v-model="formModalValidate.factory" placeholder="请输入厂家" style="width:240px" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "models",
  components: {},
  data() {
    return {
      formModalType: true,
      formModal: false,
      formModalLoading: true,
      formModalValidate: {
        name: "",
        type: "",
        factory: "",
        senprotocol: "modBus",
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
        type: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        senprotocol: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        factory: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
      },
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
          title: "型号名称",
          key: "name"
        },
        // {
        //   title: "型号",
        //   key: "type"
        // },
        {
          title: "传感类型",
          key: "type",
          render: (h, { row, column, index }) => {
            let _val = "";
            switch (row.type) {
              case "switchs":
                _val = "开关型传感器";
                break;
              case "numerical":
                _val = "数值型传感器";
                break;
            }
            return h("span", _val);
          }
        },
        {
          title: "传感协议",
          key: "senprotocol",
          render: (h, { row, column, index }) => {
            let _val = "";
            switch (row.senprotocol) {
              case "modBus":
                _val = "modBus";
                break;
            }
            return h("span", _val);
          }
        },
        {
          title: "厂家",
          key: "factory"
        },
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
                      this.handleEidtTableItem(row);
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
      selectTableSelection: null
    };
  },
  mounted() {
    this.tableDataGet(this.currentPage);
  },
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
    tableDataGet(pgNum) {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/sensorType/",
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
          url: util.ajaxUrl + "/api/sensorType/" + _delId,
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
      this.formModalValidate.type = row.type;
      this.formModalValidate.senprotocol = row.senprotocol;
      this.formModalValidate.factory = row.factory;
      this.formModalValidate.id = row.id;
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/sensorType/";
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
                type: this.formModalValidate.type,
                senprotocol: this.formModalValidate.senprotocol,
                factory: this.formModalValidate.factory
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
