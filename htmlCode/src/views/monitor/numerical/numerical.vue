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

    <Modal v-model="formModal" title="数值型传感器" width=700 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="90">
        <Row :gutter="16">
          <Col span="12">
          <FormItem label="传感器名称:" prop="name">
            <Input v-model="formModalValidate.name" placeholder="请输入传感器名称" style="width:240px" />
          </FormItem>
          <FormItem label="传感器型号:" prop="type">
            <Input v-model="formModalValidate.type" placeholder="请输入型号" style="width:240px" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="端口:" prop="portId">
            <Select v-model="formModalValidate.portId" style="width:200px">
              <Option v-for="item in portLists" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>

          <FormItem label="转发规约:" prop="protocolId">
            <Select v-model="formModalValidate.protocolId" style="width:200px">
              <Option v-for="item in protocolLists" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="信息体地址:" prop="startAddr">
          <Input v-model="formModalValidate.startAddr" placeholder="请输入信息体地址" style="width:300px" />
          <span style="color:#999; margin-left:15px">地址范围：0x4001~0x5000</span>
        </FormItem>
        <FormItem label="传感器地址:" prop="devAddress">
          <Input v-model="formModalValidate.devAddress" placeholder="请输入传感器地址" style="width:300px" />
        </FormItem>
        <FormItem label="读取寄存器:" prop="points">
          <Input @on-keyup="handleReplaceStr" @on-blur="handleReplaceStr" v-model="formModalValidate.points" type="textarea" :autosize="true" placeholder="请输入读取寄存器" style="width:550px" />
        </FormItem>
        <FormItem label="监测描述:" prop="monitorDesc">
          <Input v-model="formModalValidate.monitorDesc" type="textarea" :rows="4" placeholder="请输入监测描述" />
        </FormItem>
        <FormItem label="设备启用:" prop="enable">
          <i-switch v-model="formModalValidate.enable" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";

const replaceStr = (str, b) => {
  if (b) {
    return str.replace(/\s*/g, "");
  }
  return str.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
}

export default {
  name: "numerical",
  components: {},
  data() {
    const regs = (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        callback(new Error('只允许字母和数字'));
      }
      callback()
    }
    return {
      protocolLists: [],
      portLists: [],
      formModal: false,
      formModalType: true,
      formModalLoading: true,
      formModalValidate: {
        id: "",
        name: "",
        type: "",
        monitorDesc: "",
        protocolId: "",
        portId: "",
        devAddress: "",
        points: "",
        startAddr: "",
        enable: true
      },
      formModalRule: {
        name: [
          { required: true, max: 128, message: "必填,且最长为128个字符", trigger: "blur" }
        ],
        protocolId: [
          { required: true, message: "必选", trigger: "blur" }
        ],
        portId: [
          { required: true, message: "必选", trigger: "blur" }
        ],
        type: [
          { required: true, max: 128, message: "必填,且最长为128个字符", trigger: "blur" },
          { validator: regs, trigger: "blur" }
        ],
        devAddress: [
          { required: true, max: 11, message: "必填,且最长为11个字符", trigger: "blur" },
          { validator: regs, trigger: "blur" }
        ],
        startAddr: [
          { required: true, max: 32, message: "必填,且最长为32个字符", trigger: "blur" },
          { validator: regs, trigger: "blur" }
        ],
        monitorDesc: [
          { max: 256, message: "最长为256个字符", trigger: "blur" },
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
          title: "传感器型号",
          key: "type"
        },
        {
          title: "端口ID",
          key: "portName"
        },
        {
          title: "监测说明",
          key: "monitorDesc"
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
    Promise.all([this.getProtocolData(), this.getPortData()]).then(this.tableDataGet(1));
  },
  computed: {},
  watch: {},
  methods: {
    getProtocolData() {
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/protocol",
        },
        data => {
          this.protocolLists = data.data.data.list
        },
        error => {

        }
      );
    },
    getPortData() {
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/port",
        },
        data => {
          this.portLists = data.data.data.list
        },
        error => {

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
          url: util.ajaxUrl + "/api/number",
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
          url: util.ajaxUrl + "/api/number/" + _delId,
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
      this.formModalValidate.type = row.type;
      this.formModalValidate.monitorDesc = row.monitorDesc;
      this.formModalValidate.protocolId = row.protocolId;
      this.formModalValidate.portId = row.portId;
      this.formModalValidate.devAddress = row.devAddress;
      this.formModalValidate.points = replaceStr(row.points);
      this.formModalValidate.startAddr = row.startAddr;
      this.formModalValidate.enable = row.enable == 1 ? true : false;
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/number";
          let _data = {
            name: this.formModalValidate.name,
            type: this.formModalValidate.type,
            monitorDesc: this.formModalValidate.monitorDesc,
            protocolId: this.formModalValidate.protocolId,
            portId: this.formModalValidate.portId,
            devAddress: this.formModalValidate.devAddress,
            points: replaceStr(this.formModalValidate.points, true),
            startAddr: this.formModalValidate.startAddr,
            enable: this.formModalValidate.enable ? 1 : 0
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
    },
    handleReplaceStr() {
      this.formModalValidate.points = replaceStr(this.formModalValidate.points)
    }
  }
};
</script>