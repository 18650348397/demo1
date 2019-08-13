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
    <Modal v-model="formModal" title="监控平台配置" width=700 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="100">
        <Row :gutter="16">
          <Col span="12">
          <div>
            <FormItem label="网关用户名" prop="user_name">
              <Input v-model="formModalValidate.user_name" />
            </FormItem>
            <FormItem label="网关密码" prop="password">
              <Input v-model="formModalValidate.password" />
            </FormItem>
            <FormItem label="主站地址" prop="srv_url">
              <Input v-model="formModalValidate.srv_url" />
            </FormItem>
            <FormItem label="通信机地址" prop="dev_addr">
              <Input v-model="formModalValidate.dev_addr" />
            </FormItem>
          </div>
          </Col>
          <Col span="12">
          <div>
            <FormItem label="协议" prop="protocol_id">
              <Select v-model="formModalValidate.protocol_id">
                <Option v-for="item in statuteData" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="端口" prop="port">
              <InputNumber :min="1" v-model="formModalValidate.port"></InputNumber>
            </FormItem>
            <FormItem label="是否启用" prop="enable">
              <RadioGroup v-model="formModalValidate.enable">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
          </div>
          </Col>
        </Row>

      </Form>
    </Modal>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "allocation",
  components: {},
  data() {
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
          title: "网关用户名",
          key: "userName"
        },
        {
          title: "端口",
          key: "port"
        },
        {
          title: "主站地址",
          key: "srvUrl"
        },
        {
          title: "通信机地址",
          key: "devAddr"
        },
        {
          title: "协议",
          render: (h, { row, column, index }) => {
            return h("span", row.protocol.name);
          }
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
        protocol_id: "",
        srv_url: "",
        dev_addr: "",
        port: 1,
        user_name: "",
        password: "",
        enable: "1",
        id: ""
      },
      formModalRule: {
        user_name: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        protocol_id: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        srv_url: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        dev_addr: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        port: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ]
      },
      disabledDelBtn: true,
      selectTableSelection: null,
      statuteData: null
    };
  },
  mounted() {
    this.getStatuteData();
  },
  methods: {
    getStatuteData() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/protocol"
        },
        data => {
          this.loading = false;
          this.statuteData = data.data.data.list;
          this.tableDataGet(this.currentPage);
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
          url: util.ajaxUrl + "/api/master",
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
          url: util.ajaxUrl + "/api/master/" + _delId,
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
      this.formModalValidate.protocol_id = row.protocol.id;
      this.formModalValidate.srv_url = row.srvUrl;
      this.formModalValidate.dev_addr = row.devAddr;
      this.formModalValidate.port = row.port * 1;
      this.formModalValidate.user_name = row.userName;
      this.formModalValidate.password = row.password;
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
          let _url = util.ajaxUrl + "/api/master";
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
                protocol_id: this.formModalValidate.protocol_id,
                srv_url: this.formModalValidate.srv_url,
                dev_addr: this.formModalValidate.dev_addr,
                port: this.formModalValidate.port,
                user_name: this.formModalValidate.user_name,
                password: this.formModalValidate.password,
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