<template>
  <div>

    <Card>
      <ButtonGroup>
        <Button type="info" @click="handleNewAdd" icon="ios-plus-outline">新增</Button>
        <Button type="error" @click="handleDelete" :disabled="disabledDelBtn" icon="ios-trash-outline">删除</Button>
      </ButtonGroup>
      <Table border :columns="tableColumns" :data="tableData" @on-selection-change="selectTableItem" stripe class="margin-top-10"></Table>
      <div class="clearfix margin-top-10">
        <div class="fr">
          <Page :total="total" :current="currentPage" show-elevator @on-change="handlePageClick"></Page>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>

    </Card>
    <Modal v-model="formModal" title="网络" width=750 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="100">
        <Row :gutter="16">
          <Col span="12">
          <FormItem label="IP地址" prop="ipv4">
            <input-ip v-model="formModalValidate.ipv4" style="width:200px" />
          </FormItem>
          <FormItem label="子网掩码" prop="mask">
            <input-ip v-model="formModalValidate.mask" style="width:200px" />
          </FormItem>
          <FormItem label="DNS1" prop="dns1">
            <input-ip v-model="formModalValidate.dns1" style="width:200px" />
          </FormItem>
          <FormItem label="DNS2" prop="dns2">
            <input-ip v-model="formModalValidate.dns2" style="width:200px" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="网关" prop="gateway">
            <input-ip v-model="formModalValidate.gateway" style="width:200px" />
          </FormItem>
          <FormItem label="最大传输单元" prop="mtu">
            <InputNumber :min="1500" :max="100000" v-model="formModalValidate.mtu" style="width:150px"></InputNumber>
          </FormItem>
          <FormItem label="MAC地址" prop="mac">
            <Input v-model="formModalValidate.mac" style="width: 200px" />
          </FormItem>
          <FormItem label="是否启用" prop="enable">
            <RadioGroup v-model="formModalValidate.enable">
              <Radio label="1">是</Radio>
              <Radio label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
import InputIp from "@/views/components/input-ip/input-ip-bars";
export default {
  name: "network_allocation",
  components: { InputIp },
  data() {
    const ipValidate = function (rule, value, callback) {
      var temp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (!temp.test(value)) {
        callback(new Error("必填，输入格式不正确"));
      }
      callback();
    };
    const macValidate = function (rule, value, callback) {
      var temp = /[A-Fa-f0-9]{2}[:-][A-Fa-f0-9]{2}[:-][A-Fa-f0-9]{2}[:-][A-Fa-f0-9]{2}[:-][A-Fa-f0-9]{2}[:-][A-Fa-f0-9]{2}/;
      if (!temp.test(value) && value !== "") {
        callback(new Error("输入的mac地址格式不正确"));
      }
      callback();
    };
    const dnsValidate = function (rule, value, callback) {
      var temp = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
      if (!temp.test(value) && value !== "") {
        callback(new Error("输入格式不正确"));
      }
      callback();
    };
    const gatewayValidate = function (rule, value, callback) {
      var temp = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/;
      if (!temp.test(value)) {
        callback(new Error("必填，输入格式不正确"));
      }
      callback();
    };
    return {
      formModalType: true,
      formModal: false,
      formModalLoading: true,
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
          title: "序号",
          width: 80,
          align: "center",
          type: "index"
        },
        {
          title: "ip地址",
          key: "ipv4"
        },
        {
          title: "子网掩码",
          key: "ipv4Mask"
        },
        {
          title: "网关",
          key: "ipv4Gateway"
        },
        {
          title: "dns1",
          key: "dnsUrl1"
        },
        {
          title: "dns2",
          key: "dnsUrl2"
        },
        {
          title: "最大传输单元",
          key: "mtu"
        },
        {
          title: "mac地址",
          key: "macAddr"
        },
        {
          title: "启用",
          width: 65,
          align: "center",
          render: (h, { row, column, index }) => {
            return h("span", row.enable ? "是" : "否");
          }
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
      formModalValidate: {
        ipv4: "",
        mask: "",
        dns1: "",
        dns2: "",
        gateway: "",
        mtu: 1500,
        mac: "",
        enable: "1",
        id: ""
      },
      formModalRule: {
        ipv4: [
          {
            required: true,
            validator: ipValidate,
            trigger: "blur"
          }
        ],
        mask: [
          {
            required: true,
            validator: ipValidate,
            trigger: "blur"
          }
        ],
        gateway: [
          {
            required: true,
            validator: gatewayValidate,
            trigger: "blur"
          }
        ],
        dns1: [
          {
            validator: dnsValidate,
            trigger: "blur"
          }
        ],
        dns2: [
          {
            validator: dnsValidate,
            trigger: "blur"
          }
        ],
        mac: [
          {
            validator: macValidate,
            trigger: "blur"
          }
        ],
        mtu: [
          {
            required: true,
            message: '必填',
            trigger: "blur"
          }
        ],
      },
      disabledDelBtn: true,
      selectTableSelection: null
    };
  },
  mounted() {
    this.tableDataGet(this.currentPage);
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
          url: util.ajaxUrl + "/api/network",
          params: {
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
          url: util.ajaxUrl + "/api/network/" + _delId,
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
    handleEidtTableItem(row) {
      this.formModal = true;
      this.formModalType = false;
      this.formModalValidate.id = row.id;
      this.formModalValidate.ipv4 = row.ipv4;
      this.formModalValidate.mask = row.ipv4Mask;
      this.formModalValidate.dns1 = row.dnsUrl1 ? row.dnsUrl1 : "";
      this.formModalValidate.dns2 = row.dnsUrl2 ? row.dnsUrl2 : "";
      this.formModalValidate.gateway = row.ipv4Gateway;
      this.formModalValidate.mtu = row.mtu;
      this.formModalValidate.mac = row.macAddr ? row.macAddr : "";
      this.formModalValidate.enable = row.enable ? "1" : "0";
    },
    handlePageClick(clickPageNum) {
      //分页
      if (this.loading) {
        return false;
      }
      this.currlocal = clickPageNum;
      this.tableDataGet(clickPageNum);
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/network";
          if (!this.formModalType) {
            _method = "put";
            _url = _url + "/" + this.formModalValidate.id;
          }
          util.axiosAjax(
            this,
            {
              url: _url,
              method: _method,
              data: {
                enable: this.formModalValidate.enable == "1" ? true : false,
                ipv4: this.formModalValidate.ipv4,
                ipv4_mask: this.formModalValidate.mask,
                ipv4_gateway: this.formModalValidate.gateway,
                dns_url1: this.formModalValidate.dns1,
                dns_url2: this.formModalValidate.dns2,
                mtu: this.formModalValidate.mtu,
                mac_addr: this.formModalValidate.mac
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
