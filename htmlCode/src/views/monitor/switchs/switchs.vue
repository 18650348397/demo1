<template>
  <div>
    <Card>

      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="80" inline>
        <FormItem label="传感器名称" prop="name">
          <Input v-model="formSearch.name" placeholder="请输入传感器名称关键词" />
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

    <Modal v-model="formModal" title="开关型传感器" width=700 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="90">
        <Row :gutter="16">
          <Col span="12">
          <FormItem label="型号:" prop="type">
            <Select v-model="formModalValidate.type" style="width:240px">
              <Option v-for="item in config.types" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="传感器名称:" prop="name">
            <Input v-model="formModalValidate.name" placeholder="请输入传感器名称" style="width:240px" />
          </FormItem>
          <FormItem label="是否启用:" prop="enable">
            <RadioGroup v-model="formModalValidate.enable">
              <Radio label="1">是</Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="干接点通道:" prop="connect">
            <Select v-model="formModalValidate.connect" style="width:200px">
              <Option v-for="item in config.connects" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="转发规约:" prop="protocol">
            <Select v-model="formModalValidate.protocol" style="width:200px">
              <Option v-for="item in config.protocols" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="报警模式:" prop="alarm_model">
            <Select v-model="formModalValidate.alarm_model" style="width:200px">
              <Option v-for="item in config.alarmModels" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="监测描述:" prop="desc">
          <Input v-model="formModalValidate.desc" type="textarea" :rows="4" placeholder="请输入监测描述"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "switchs",
  components: {},
  data() {
    return {
      config: {
        alarmModels: null,
        connects: null,
        protocols: null,
        types: null
      },
      formModal: false,
      formModalLoading: true,
      formModalType: true,
      formModalValidate: {
        id: "",
        name: "",
        type: "",
        connect: "",
        protocol: "",
        alarm_model: "",
        enable: "2",
        desc: ""
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
        alarm_model: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        protocol: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        connect: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ]
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
          title: "传感器名称",
          key: "name"
        },
        {
          title: "型号",
          render: (h, { row, column, index }) => {
            return h("span", row.type.name);
          }
        },
        {
          title: "干接点",
          render: (h, { row, column, index }) => {
            return h("span", row.connect.name);
          }
        },
        {
          title: "转发规约",
          render: (h, { row, column, index }) => {
            return h("span", row.protocol.name);
          }
        },
        {
          title: "报警模式",
          render: (h, { row, column, index }) => {
            return h("span", row.alarmModel.name);
          }
        },
        {
          title: "启用",
          width: 80,
          align: "center",
          render: (h, { row, column, index }) => {
            let _enable = row.enable ? "是" : "否";
            return h("span", _enable);
          }
        },
        {
          title: "状态",
          width: 100,
          align: "center",
          render: (h, { row, column, index }) => {
            const color =
              row.status === "normal"
                ? "blue"
                : row.status === "closed" ? "green" : "red";
            const text =
              row.status === "normal"
                ? "正常"
                : row.status === "closed" ? "关闭" : "错误";
            return h(
              "Tag",
              {
                props: {
                  checkable: true,
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
    this.getConfigData();
  },
  computed: {},
  watch: {},
  methods: {
    getConfigData() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/switch/config"
        },
        data => {
          this.loading = false;
          this.tableDataGet(this.currentPage);
          let _data = data.data.data;
          this.config.alarmModels = _data.alarmModels;
          this.config.connects = _data.connects;
          this.config.protocols = _data.protocols;
          this.config.types = _data.types;
        },
        error => {
          this.loading = false;
        }
      );
    },
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
          url: util.ajaxUrl + "/api/switch",
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
          url: util.ajaxUrl + "/api/switch/" + _delId,
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
      if (this.loadingTable) {
        return false;
      }
      this.currlocal = clickPageNum;
      this.tableDataGet(clickPageNum);
    },
    handleEidtTableItem(row) {
      this.formModal = true;
      this.formModalType = false;

      this.formModalValidate.id = row.id;
      this.formModalValidate.name = row.name;
      this.formModalValidate.type = row.type.id;
      this.formModalValidate.connect = row.connect.id;
      this.formModalValidate.protocol = row.protocol.id;
      this.formModalValidate.alarm_model = row.alarmModel.id;
      this.formModalValidate.enable = row.enable ? "1" : "2";
      this.formModalValidate.desc = row.desc;
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/switch";
          let _data = {
            name: this.formModalValidate.name,
            type: this.formModalValidate.type,
            connect: this.formModalValidate.connect,
            protocol: this.formModalValidate.protocol,
            alarm_model: this.formModalValidate.alarm_model,
            enable: this.formModalValidate.enable == "1" ? true : false,
            desc: this.formModalValidate.desc
          };
          if (!this.formModalType) {
            _method = "put";
            _url += "/" + this.formModalValidate.id;
          }
          util.axiosAjax(
            this,
            {
              url: _url,
              method: _method,
              data: _data
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