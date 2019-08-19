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
            <FormItem label="网关用户名" prop="name">
              <Input v-model="formModalValidate.name" />
            </FormItem>
            <FormItem label="网关密码" prop="pwd">
              <Input v-model="formModalValidate.pwd" />
            </FormItem>
            <FormItem label="FSUID" prop="fsuid">
              <Input v-model="formModalValidate.fsuid"  placeholder="最大长度为3位数值" :maxlength="3"/>
            </FormItem>
            <FormItem label="IP地址" prop="address">
              <Input v-model="formModalValidate.address" />
            </FormItem>
          </div>
          </Col>
          <Col span="12">
          <div>
            <FormItem label="通信协议" prop="protocolName">
              <Select v-model="formModalValidate.protocolName">
                <Option v-for="item in statuteData" :value="item.name" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="端口" prop="port">
              <!-- <InputNumber :min="1" v-model="formModalValidate.port"></InputNumber> -->
              <Input v-model="formModalValidate.port" />
            </FormItem>
            <!-- <FormItem label="是否启用" prop="enable">
              <RadioGroup v-model="formModalValidate.enable">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem> -->
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
          key: "name"
        },
        {
          title: "端口",
          key: "port"
        },
        {
          title: "FSUID",
          key: "fsuid"
        },
        {
          title: "IP地址",
          key: "address"
        },
        {
          title: "通信协议",
          key: "protocolName",
          render: (h, { row, column, index }) => {
            return h("span", row.protocolName);
          }
        },
        // {
        //   title: "启用",
        //   width: 65,
        //   align: "center",
        //   render: (h, { row, column, index }) => {
        //     return h("span", row.enable ? "是" : "否");
        //   }
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
        protocolName: "",
        fsuid: "",
        address: "",
        port: "",
        name: "",
        pwd: "",
        // enable: "1",
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
        // protocol_id: [
        //   {
        //     required: true,
        //     message: "必填",
        //     trigger: "blur"
        //   }
        // ],
        fsuid: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        protocolName: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        // port: [
        //   {
        //     required: true,
        //     message: "必填",
        //     trigger: "blur"
        //   }
        // ],
      },
      disabledDelBtn: true,
      selectTableSelection: null,
      statuteData: null
    };
  },
  mounted() {
    this.getStatuteData();
    // this.tableDataGet(this.currentPage);
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
      this.formModalValidate.protocolName = row.protocolName;
      this.formModalValidate.fsuid = row.fsuid;
      this.formModalValidate.address = row.address;
      this.formModalValidate.port = row.port * 1;
      this.formModalValidate.name = row.name;
      this.formModalValidate.pwd = row.pwd;
      // this.formModalValidate.enable = row.enable ? "1" : "0";
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
                // enable: this.formModalValidate.enable == "1" ? true : false,
                protocolName: this.formModalValidate.protocolName,
                fsuid: this.formModalValidate.fsuid,
                address: this.formModalValidate.address,
                port: this.formModalValidate.port,
                name: this.formModalValidate.name,
                pwd: this.formModalValidate.pwd,
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