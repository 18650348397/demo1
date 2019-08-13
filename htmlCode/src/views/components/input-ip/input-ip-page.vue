<style lang="less" scoped>
</style>

<template>
  <div>
    <Card>
      <p slot="title">
        基础用法
      </p>
      <div>
        <Row :gutter="16">
          <Col span="12">
          <input-ip v-model="ip" size="large" />
          </Col>
          <Col span="12">
          <div>

            <Alert>
              代码：
              <code> &lt;input-ip v-model="ip" /&gt; </code>
            </Alert>
          </div>
          </Col>
        </Row>

      </div>
    </Card>

    <Card class="margin-top-10">
      <p slot="title">
        API
      </p>
      <div>
        <div>
          <h3>props</h3>
          <Table border :columns="propsColumns" :data="propsData"></Table>
        </div>
        <div class="margin-top-20">
          <h3>methods</h3>
          <Table border :columns="methodsColumns" :data="methodsData"></Table>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import InputIp from "./input-ip-bars";

export default {
  name: "input-ip-page",
  components: {
    InputIp
  },
  data() {
    return {
      ip: "127.0.0.1",
      propsColumns: [
        {
          title: "属性",
          key: "name"
        },
        {
          title: "说明",
          key: "description"
        },
        {
          title: "类型",
          width: 150,
          key: "type"
        },
        {
          title: "默认值",
          width: 120,
          key: "default"
        }
      ],
      propsData: [
        {
          name: "size",
          description: "输入框尺寸，可选值为large、small、default或者不设置",
          type: "String",
          default: "-"
        }
      ],
      methodsColumns: [
        {
          title: "方法名",
          width: 200,
          key: "name"
        },
        {
          title: "说明",
          key: "description"
        },
        {
          title: "参数",
          width: 150,
          key: "parameter"
        }
      ],
      methodsData:[]
    };
  },

  methods: {
    testInput() {
      this.$refs["inputip"].onInputBlur();
    }
  }
};
</script>
