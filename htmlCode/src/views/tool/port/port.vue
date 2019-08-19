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
      title="串口"
      width="350"
      :loading="formModalLoading"
      @on-ok="formModalOK('formValidate')"
      @on-cancel="formModalCancel"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="串口:" prop="name">
          <Select
            v-model="formValidate.name"
            placeholder="请选择串口"
            style="width:200px"
          >
            <Option value="COM1">COM1</Option>
            <Option value="COM2">COM2</Option>
            <Option value="COM3">COM3</Option>
            <Option value="COM4">COM4</Option>
            <Option value="RS485-1">RS485-1</Option>
            <Option value="RS485-2">RS485-2</Option>
          </Select>
        </FormItem>
        <FormItem label="波特率:" prop="baudRate">
          <Select v-model="formValidate.baudRate" placeholder="请选择波特率" style="width:200px">
            <Option value="600">600</Option>
            <Option value="1200">1200</Option>
            <Option value="2400">2400</Option>
            <Option value="4800">4800</Option>
            <Option value="9600">9600</Option>
            <Option value="19200">19200</Option>
            <Option value="38400">38400</Option>
            <Option value="57600">57600</Option>
            <Option value="115200">115200</Option>
          </Select>
        </FormItem>
        <FormItem label="数据位:" prop="dataBits">
          <Select v-model="formValidate.dataBits" placeholder="请选择数据位" style="width:200px">
            <Option value="5">5</Option>
            <Option value="6">6</Option>
            <Option value="7">7</Option>
            <Option value="8">8</Option>
          </Select>
        </FormItem>
        <FormItem label="校验位:" prop="parity">
          <Select v-model="formValidate.parity" placeholder="请选择校验位" style="width:200px">
            <Option value="NONE">NONE</Option>
            <Option value="ODD">ODD</Option>
            <Option value="EVEN">EVEN</Option>
            <Option value="MARK">MARK</Option>
            <Option value="SPACE">SPACE</Option>
          </Select>
        </FormItem>
        <FormItem label="停止位:" prop="stopBit">
          <Select v-model="formValidate.stopBit" placeholder="请选择停止位" style="width:200px">
            <Option value="1">1</Option>
            <Option value="1.5">1.5</Option>
            <Option value="2">2</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="通信协议:" prop="protocol">
          <Select v-model="formValidate.protocol" placeholder="请选择通信协议" style="width:200px">
            <Option value="modbus">modbus</Option>
            <Option value="1393">1393</Option>
          </Select>
        </FormItem> -->
        <FormItem label="端口启用:" prop="enable">
          <i-switch v-model="formValidate.enable" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <!-- <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>-->
      </Form>
    </Modal>
  </div>  
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "port",
  components: {},
  data() {
    return {
      formSearch: {
        name: ""
      },
      formModal: false,
      formModalLoading: true,
      formModalRule: {
        name: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        baudRate: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        dataBits: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        parity: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        stopBit: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        // protocol: [
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
          title: "串口名称",
          key: "name"
        },
        {
          title: "波特率",
          key: "baudRate"
        },
        {
          title: "数据位",
          key: "dataBits"
        },
        {
          title: "校验位",
          key: "parity"
        },
        {
          title: "停止位",
          key: "stopBit"
        },
        // {
        //   title: "通信协议",
        //   key: "protocol"
        // },
        {
          title: "端口启用",
          key: "enable"
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
      disabledDelBtn: true,
      tableData: [],
      total: 1,
      currentPage: 1,
      loading: false,
      formValidate: {
        name: "",
        baudRate: "",
        dataBits: "",
        parity: "",
        stopBit: "",
        // protocol: "",
        enable: true,
        id:""
      },
      ruleValidate: {
        baudRate: [
          { required: true, message: "此项不能为空，请选择", trigger: "change" }
        ],
        dataBits: [
          { required: true, message: "此项不能为空，请选择", trigger: "change" }
        ],
        parity: [
          { required: true, message: "此项不能为空，请选择", trigger: "change" }
        ],
        stopBit: [
          { required: true, message: "此项不能为空，请选择", trigger: "change" }
        ],
        // protocol: [
        //   { required: true, message: "此项不能为空，请选择", trigger: "change" }
        // ]
      }
    };
  },
  mounted() {
    this.tableDataGet(this.currentPage);
   
  },
  computed: {},
  watch: {},
  methods: {
    tableDataGet(pgNum) {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/port/",
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
    // formModalOK(name) {
    //   this.$refs[name].validate(valid => {
    //     if (valid) {
    //       this.postPortData();
    //     }
    //   });
    // },
    formModalOK() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/port/";
          if (!this.formModalType) {
            _method = "put";
            _url += "/" + this.formValidate.id;
          }
          util.axiosAjax(
            this,
            {
              url: _url,
              method: _method,
              data: {
                name: this.formValidate.name,
                baudRate: this.formValidate.baudRate,
                dataBits: this.formValidate.dataBits,
                parity: this.formValidate.parity,
                stopBit: this.formValidate.stopBit,
                id: this.formValidate.id,
                // protocol: this.formValidate.protocol,
                enable: this.formValidate.enable ? 1 : 0
              }
            },
            data => {
              this.formModal = false;
              if (this.formModalType) {
                this.tableDataGet(1);
              } else {
                this.tableDataGet(this.currentPage);
              }

              this.$refs["formValidate"].resetFields();
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
      this.formValidate.name = row.name;
      this.formValidate.baudRate = row.baudRate.toString();
      this.formValidate.dataBits = row.dataBits.toString();
      this.formValidate.parity = row.parity;
      this.formValidate.stopBit = row.stopBit.toString();
      // this.formValidate.protocol = row.protocol;
      this.formValidate.enable = row.enable;
      this.formValidate.id = row.id;

    },
    handleReset() {
      this.$refs["formSearch"].resetFields();
      this.tableDataGet(1);
    },
    handleSearch() {
      this.tableDataGet(1);
    },
    handleNewAdd() {
      this.formModal = true;
      this.formModalType = true;
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
          url: util.ajaxUrl + "/api/port/" + _delId,
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
    formModalCancel() {
      this.$refs["formValidate"].resetFields();
    },
    // handleChange() {
    //   this.getPortData();
    // },
    // handleSubmit(name) {
    //   this.$refs[name].validate((valid) => {
    //     if (valid) {
    //       this.postPortData()
    //     }
    //   })
    // },
    // getPortData() {
    //   this.loading = true;
    //   util.axiosAjax(
    //     this,
    //     {
    //       url: util.ajaxUrl + "/api/port/" + this.formValidate.name
    //     },
    //     data => {
    //       this.loading = false;
    //       let _data = data.data.data;
    //       this.formValidate.baudRate = _data.baudRate;
    //       this.formValidate.dataBits = _data.dataBits;
    //       this.formValidate.parity = _data.parity;
    //       this.formValidate.stopBit = _data.stopBit;
    //       this.formValidate.protocol = _data.protocol;
    //       this.formValidate.enable = _data.enable == 1 ? true : false;
    //     },
    //     error => {
    //       this.loading = false;
    //       this.$refs.formValidate.resetFields();
    //     }
    //   );
    // },
    // postPortData() {
    //   this.loading = true;
    //   util.axiosAjax(
    //     this,
    //     {
    //       url: util.ajaxUrl + "/api/port/",
    //       method: "post",
    //       data: {
    //         name: this.formValidate.name,
    //         baudRate: this.formValidate.baudRate,
    //         dataBits: this.formValidate.dataBits,
    //         parity: this.formValidate.parity,
    //         stopBit: this.formValidate.stopBit,
    //         protocol: this.formValidate.protocol,
    //         enable: this.formValidate.enable ? 1 : 0
    //       }
    //     },
    //     data => {
    //       this.loading = false;
    //     },
    //     error => {
    //       this.loading = false;
    //     }
    //   );
    // }
  }
};
</script>
