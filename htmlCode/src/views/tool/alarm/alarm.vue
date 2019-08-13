<template>
  <Card>

    <ButtonGroup>
      <Button type="info" @click="handleNewAdd" icon="ios-plus-outline">新增</Button>
      <Button type="error" @click="handleDelete" :disabled="disabledDelBtn" icon="ios-trash-outline">删除</Button>
    </ButtonGroup>
    <Table border :columns="tableColumns" :data="tableData" @on-selection-change="selectTableItem" stripe class="margin-top-10"></Table>
    <Spin size="large" fix v-if="loading"></Spin>

    <Modal v-model="formModal" title="告警配置" :loading="formModalLoading" @on-ok="formModalOK" @on-cancel="formModalCancel">
      <Form ref="formModalValidate" :model="formModalValidate" :rules="formModalRule" :label-width="100">
        <FormItem label="名称" prop="name">
          <Input v-model="formModalValidate.name" placeholder="请输入报警名称" style="width:260px" />
        </FormItem>
        <FormItem label="告警时间段" prop="period">
          <Select v-model="formModalValidate.period" style="width:150px">
            <Option value="work_out" key="work_out">非工作时间</Option>
            <Option value="work_time" key="work_time">工作时间</Option>
            <Option value="all_day" key="all_day">全天</Option>
          </Select>
        </FormItem>
        <FormItem label="邮件地址" prop="mailTo" v-show="formModalValidate.byMail == '1'">
          <Input v-model="formModalValidate.mailTo" placeholder="请输入邮件地址" style="width:260px" />
        </FormItem>
        <FormItem label="声音类型" prop="soundType">
          <Select v-model="formModalValidate.soundType" style="width:200px">
            <Option value="null" key="null">无</Option>
            <Option value="buzzer" key="buzzer">蜂鸣器</Option>
          </Select>
        </FormItem>
        <FormItem label="持续时间(秒)" prop="holdTime">
          <InputNumber :max="1000" :min="1" v-model="formModalValidate.holdTime" style="width:160px"></InputNumber>
        </FormItem>
        <FormItem label="重复时间(秒)" prop="repeatTime">
          <InputNumber :max="1000" :min="1" v-model="formModalValidate.repeatTime" style="width:160px"></InputNumber>
        </FormItem>
        <FormItem label="是否发送邮件" prop="byMail">
          <RadioGroup v-model="formModalValidate.byMail">
            <Radio label="1">是</Radio>
            <Radio label="2">否</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>

<script>
import util from "@/libs/util.js";
import { Button, ButtonGroup } from "iview";
export default {
  name: "alarm",
  components: {},
  data() {
    const mailValidate = (rule, value, callback) => {
      var temp = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!temp.test(value) && this.formModalValidate.byMail == "1") {
        callback(new Error("必填，输入格式不正确"));
      }
      callback();
    };
    return {
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
          title: "名称",
          key: "name"
        },
        {
          title: "告警时间段",
          render: (h, { row, column, index }) => {
            let _val = "";
            switch (row.period) {
              case "work_out":
                _val = "非工作时间";
                break;
              case "work_time":
                _val = "工作时间";
                break;
              case "all_day":
                _val = "全天";
                break;
            }
            return h("span", _val);
          }
        },
        {
          title: "声音类型",
          render: (h, { row, column, index }) => {
            let _val = "";
            switch (row.soundType) {
              case null:
                _val = "无";
                break;
              case "buzzer":
                _val = "蜂鸣器";
                break;
            }
            return h("span", _val);
          }
        },
        {
          title: "持续时间(秒)",
          key: "holdTime"
        },
        {
          title: "重复时间(秒)",
          key: "repeatTime"
        },
        {
          title: "是否发送邮件",
          render: (h, { row, column, index }) => {
            let _val = row.byMail == "1" ? "是" : "否"
            return h("span", _val);
          }
        },
        {
          title: "邮件地址",
          key: "mailTo"
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
      formModal: false,
      formModalLoading: true,
      formModalType: true,
      formModalValidate: {
        name: "",
        holdTime: 1,
        repeatTime: 1,
        soundType: "",
        period: "",
        byMail: "1",
        mailTo: "",
        id: ""
      },
      formModalRule: {
        name: [
          {
            required: true,
            max: 32,
            message: "必填;最多32个字符",
            trigger: "blur"
          }
        ],
        soundType: [
          {
            required: true,
            message: "必填;",
            trigger: "blur"
          }
        ],
        period: [
          {
            required: true,
            message: "必填;",
            trigger: "blur"
          }
        ],
        mailTo: [
          {
            required: true,
            validator: mailValidate,
            trigger: "blur"
          }
        ]
      },
      disabledDelBtn: true,
      selectTableSelection: null
    };
  },
  mounted() {
    this.getAlarmData();
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
    getAlarmData() {
      this.loading = true;
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/alarmModel"
        },
        data => {
          this.loading = false;
          this.tableData = data.data.data;
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
          url: util.ajaxUrl + "/api/alarmModel/" + _delId,
          method: "delete"
        },
        data => {
          this.getAlarmData();
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
      this.formModalValidate.name = row.name;
      this.formModalValidate.holdTime = row.holdTime;
      this.formModalValidate.repeatTime = row.repeatTime;
      this.formModalValidate.soundType = row.soundType == null ? "null" : row.soundType;
      this.formModalValidate.period = row.period;
      this.formModalValidate.byMail = row.byMail ? "1" : "2";
      this.formModalValidate.mailTo = row.mailTo;
    },
    formModalOK() {
      this.$refs["formModalValidate"].validate(valid => {
        if (valid) {
          let _method = "post";
          let _url = util.ajaxUrl + "/api/alarmModel";
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
                name: this.formModalValidate.name,
                hold_time: this.formModalValidate.holdTime,
                repeat_time: this.formModalValidate.repeatTime,
                sound_type: this.formModalValidate.soundType == "null" ? null : this.formModalValidate.soundType,
                period: this.formModalValidate.period,
                by_mail: this.formModalValidate.byMail == "1" ? true : false,
                mail_to: this.formModalValidate.mailTo
              }
            },
            data => {
              this.formModal = false;
              this.getAlarmData();
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
    } /* 


    handleSubmit() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          util.axiosAjax(
            this,
            {
              url: util.ajaxUrl + "/api/alarmModel",
              method: "post",
              data: {
                name: this.formValidate.name,
                hold_time: this.formValidate.holdTime,
                repeat_time: this.formValidate.repeatTime,
                sound_type: this.formValidate.soundType,
                period: this.formValidate.period,
                by_mail: this.formValidate.byMail == "1" ? true : false,
                mail_to: this.formValidate.mailTo
              }
            },
            data => {
              this.$Message.success("告警配置成功");
              this.submitLoading = false;
            },
            error => {
              this.submitLoading = false;
            }
          );
        } else {
        }
      });
    },
    handleReset() {
      if (!this.submitLoading) {
        this.$refs["formValidate"].resetFields();
      }
    } */
  }
};
</script>
