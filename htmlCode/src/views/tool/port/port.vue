<template>
  <Card>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="串口:">
        <Select v-model="formValidate.name" placeholder="请选择串口" style="width:200px" @on-change="handleChange">
          <Option value="600">600</Option>
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
      <FormItem label="通信协议:" prop="protocol">
        <Select v-model="formValidate.protocol" placeholder="请选择通信协议" style="width:200px">
          <Option value="modbus">modbus</Option>
          <Option value="1393">1393</Option>
        </Select>
      </FormItem>
      <FormItem label="端口启用:" prop="enable">
        <i-switch v-model="formValidate.enable" size="large">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
      </FormItem>
    </Form>
    <Spin size="large" fix v-if="loading"></Spin>
  </Card>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "port",
  components: {},
  data() {
    return {
      loading: false,
      formValidate: {
        name: 'COM1',
        baudRate: '',
        dataBits: '',
        parity: '',
        stopBit: '',
        protocol: '',
        enable: true
      },
      ruleValidate: {
        baudRate: [
          { required: true, message: '此项不能为空，请选择', trigger: 'change' }
        ],
        dataBits: [
          { required: true, message: '此项不能为空，请选择', trigger: 'change' }
        ],
        parity: [
          { required: true, message: '此项不能为空，请选择', trigger: 'change' }
        ],
        stopBit: [
          { required: true, message: '此项不能为空，请选择', trigger: 'change' }
        ],
        protocol: [
          { required: true, message: '此项不能为空，请选择', trigger: 'change' }
        ],
      }
    }
  },
  mounted() {
    this.getPortData()
  },
  computed: {},
  watch: {
  },
  methods: {
    handleChange() {
      this.getPortData()
    },
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.postPortData()
        }
      })
    },
    getPortData() {
      this.loading = true
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/port/" + this.formValidate.name,
        },
        data => {
          this.loading = false;
          let _data = data.data.data
          this.formValidate.baudRate = _data.baudRate
          this.formValidate.dataBits = _data.dataBits
          this.formValidate.parity = _data.parity
          this.formValidate.stopBit = _data.stopBit
          this.formValidate.protocol = _data.protocol
          this.formValidate.enable = _data.enable == 1 ? true : false
        },
        error => {
          this.loading = false;
          this.$refs.formValidate.resetFields();
        }
      );
    },
    postPortData() {
      this.loading = true
      util.axiosAjax(
        this,
        {
          url: util.ajaxUrl + "/api/port/",
          method: 'post',
          data: {
            name: this.formValidate.name,
            baudRate: this.formValidate.baudRate,
            dataBits: this.formValidate.dataBits,
            parity: this.formValidate.parity,
            stopBit: this.formValidate.stopBit,
            protocol: this.formValidate.protocol,
            enable: this.formValidate.enable ? 1 : 0
          }
        },
        data => {
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    }
  }
};
</script>
