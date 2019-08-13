<template>
  <div>
    <Card>
      <Form ref="formSearch" label-position="left" :model="formSearch" :label-width="80" inline>
        <FormItem label="摄像头名称" prop="content">
          <Input v-model="formSearch.content" placeholder="请输入摄像头名称关键词" />
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

    <Modal v-model="formModal" title="视频资源监测" width=740 :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="100">
        <Row :gutter="16">
          <Col span="12">
          <FormItem label="设备:" prop="value1">
            <Select v-model="formModalValidate.value1" style="width:200px">
              <Option value="1" key="1">水浸传感器 (SW-EMS-0100)</Option>
              <Option value="2" key="2">水浸传感器 (SW-EMS-0100W)</Option>
            </Select>
          </FormItem>
          <FormItem label="摄像头厂家:" prop="value2">
            <Select v-model="formModalValidate.value2" style="width:200px">
              <Option value="1" key="1">摄像头厂家1</Option>
              <Option value="2" key="2">摄像头厂家2</Option>
            </Select>
          </FormItem>
          <FormItem label="摄像头类型:" prop="value3">
            <Select v-model="formModalValidate.value3" style="width:200px">
              <Option value="1" key="1">摄像头类型1</Option>
              <Option value="2" key="2">摄像头类型2</Option>
            </Select>
          </FormItem>
          <FormItem label="摄像头名称:" prop="value4">
            <Input v-model="formModalValidate.value4" placeholder="请输入摄像头名称" style="width:240px" />
          </FormItem>
          <FormItem label="摄像头ID:" prop="value5">
            <Input v-model="formModalValidate.value5" placeholder="请输入摄像头ID" style="width:240px" />
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="摄像头IP:" prop="value6">
            <Input v-model="formModalValidate.value6" placeholder="请输入摄像头IP" style="width:240px" />
          </FormItem>
          <FormItem label="码流:" prop="value7">
            <Input v-model="formModalValidate.value7" placeholder="请输入码流" style="width:240px" />
          </FormItem>
          <FormItem label="通道:" prop="value8">
            <Input v-model="formModalValidate.value8" placeholder="请输入通道" style="width:240px" />
          </FormItem>
          <FormItem label="接入方式:" prop="value9">
            <Select v-model="formModalValidate.value9" style="width:200px">
              <Option value="1" key="1">1</Option>
              <Option value="2" key="2">2</Option>
            </Select>
          </FormItem>
          <FormItem label="摄像头特殊功能:" prop="value10">
            <Select v-model="formModalValidate.value10" style="width:200px">
              <Option value="1" key="1">网络1</Option>
              <Option value="2" key="2">网络2</Option>
            </Select>
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
export default {
  name: "video_source",
  components: {},
  data() {
    return {
      formModal: false,
      formModalLoading: true,
      formModalValidate: {
        value10: "",
        value9: "",
        value8: "",
        value7: "",
        value6: "",
        value5: "",
        value4: "",
        value3: "",
        value2: "",
        value1: ""
      },
      formModalRule: {
        value1: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        value2: [
          {
            required: true,
            message: "必填",
            trigger: "change"
          }
        ],
        value3: [
          {
            required: true,
            message: "必填",
            trigger: "change"
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
          title: "摄像头厂家",
          key: "value1"
        },
        {
          title: "摄像头名称",
          key: "value2"
        },
        {
          title: "摄像头类型",
          key: "value3"
        },
        {
          title: "摄像头ID",
          key: "value4"
        },
        {
          title: "摄像头IP",
          key: "value5"
        },
        {
          title: "接入方式",
          key: "value6"
        },
        {
          title: "状态",
          key: "value7"
        },
        {
          title: "码流类型",
          key: "value8"
        },
        {
          title: "通道",
          key: "value9"
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
          value9: "1",
          value8: "1526640600000",
          value7: "三相电量仪(新建监测项1)设备故障。",
          value6: "1212121asas",
          value5: "bbbbb",
          value4: "监测说明监测说明监测说明",
          value3: "1212121asas",
          value2: "1212121asas",
          value1: "1212121asas"
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
    },
    formModalOK() {},
    formModalCancel() {
      this.$refs["formModalValidate"].resetFields();
    }
  }
};
</script>

