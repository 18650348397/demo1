<template>
  <div>
    <Card>
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="80" inline>
        <FormItem label="传感器名称" prop="content">
          <Input v-model="formSearch.content" placeholder="请输入传感器名称关键词" />
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

    <Modal v-model="formModal" title="模拟量传感器" width=700 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="90">
        <Row :gutter="16">
          <Col span="12">
          <FormItem label="设备:" prop="device">
            <Select v-model="formModalValidate.device" style="width:200px">
              <Option value="1" key="1">水浸传感器 (SW-EMS-0100)</Option>
              <Option value="2" key="2">水浸传感器 (SW-EMS-0100W)</Option>
            </Select>
          </FormItem>
          <FormItem label="传感器名称:" prop="name">
            <Input v-model="formModalValidate.name" placeholder="请输入传感器名称" style="width:240px" />
          </FormItem>
          <FormItem label="型号:" prop="model">
            <Input v-model="formModalValidate.model" placeholder="请输入型号" style="width:240px" />
          </FormItem>
          <FormItem label="模拟通道:" prop="bps">
            <Select v-model="formModalValidate.bps" style="width:200px">
              <Option value="1" key="1">1</Option>
              <Option value="2" key="2">2</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="量程:" prop="alleyway1">
            <Select v-model="formModalValidate.device" style="width:200px">
              <Option value="1" key="1">1</Option>
              <Option value="2" key="2">2</Option>
            </Select>
          </FormItem>
          <FormItem label="转发通道:" prop="alleyway2">
            <Select v-model="formModalValidate.device" style="width:200px">
              <Option value="1" key="1">网络1</Option>
              <Option value="2" key="2">网络2</Option>
            </Select>
          </FormItem>
          <FormItem label="转发规约:" prop="statute">
            <Select v-model="formModalValidate.statute" style="width:200px">
              <Option value="1" key="1">规约1</Option>
              <Option value="2" key="2">规约2</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="监测描述:" prop="info">
          <Input v-model="formModalValidate.info" type="textarea" :rows="4" placeholder="请输入监测描述"></Input>
        </FormItem>
      </Form>
    </Modal>

  </div>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "simulation",
  components: {},
  data() {
    return {
      formModal: false,
      formModalLoading: true,
      formModalValidate: {
        device: "",
        name: "",
        model: "",
        bps:"",
        alleyway1: "",
        alleyway2: "",
        statute: "",
        info: ""
      },
      formModalRule: {
        device: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        model: [
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
          key: "model"
        },
        {
          title: "分配ID",
          key: "allotId"
        },
        {
          title: "连接通道",
          key: "alleyway"
        },
        {
          title: "监测说明",
          key: "info"
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
      tableData: [
        {
          device:"1",
          model: "1526640600000",
          name: "三相电量仪(新建监测项1)设备故障。",
          allotId: "1212121asas",
          alleyway: "bbbbb",
          info: "监测说明监测说明监测说明"
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
    handleNewAdd() {
      this.formModal = true;
    },
    handleDelete() {},
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
      this.formModalValidate.device = row.device;
      this.formModalValidate.name = row.name;
      this.formModalValidate.model = row.model;
    },
    formModalOK() {},
    formModalCancel() {
      this.$refs["formModalValidate"].resetFields();
    }
  }
};
</script>
