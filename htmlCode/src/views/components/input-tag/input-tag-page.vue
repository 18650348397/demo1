<style lang="less" scoped>
</style>

<template>
	<div class="">

    <Card>
      <p slot="title">
          基础用法
      </p>
      <Row :gutter="16">
          <Col span="12">
            <Form :model="inputTagData" :label-width="100">
              <FormItem label="placeholder:" style="width:300px">
                  <Input v-model="inputTagData.placeholder" />
              </FormItem>
              <FormItem label="readOnly:">
                  <Checkbox v-model="inputTagData.readOnly"></Checkbox>
              </FormItem>
              <FormItem label="addTagOnBlur:">
                  <Checkbox v-model="inputTagData.addTagOnBlur"></Checkbox>
              </FormItem>
              <FormItem label="limit:">
                <InputNumber :max="100" :min="1" v-model="inputTagData.limit"></InputNumber>
              </FormItem>
              <FormItem label="validate:">
                  <Select v-model="inputTagData.validate" style="width:200px">
                      <Option value="">No validate</Option>
                      <Option value="text">Text</Option>
                      <Option value="email">Email</Option>
                      <Option value="url">Url</Option>
                      <Option value="digits">Digits</Option>
                      <Option value="isodate">ISO Date</Option>
                  </Select>
              </FormItem>
              <FormItem label="tags:">
                  <code>{{ inputTagData.tags }}</code>
              </FormItem>
            </Form>
          
          </Col>
          <Col span="12">
            <input-tag
              :limit='inputTagData.limit'
              :tags.sync='inputTagData.tags'
              :placeholder='inputTagData.placeholder'
              :read-only='inputTagData.readOnly'
              :validate='inputTagData.validate'
              :add-tag-on-blur='inputTagData.addTagOnBlur'
            ></input-tag>

            <div class="margin-top-10">
              代码：
              <Alert><code> {{ getPreviewHTML() }} </code></Alert>
            </div>
          </Col>
      </Row>
    </Card>
    <Card class="margin-top-10">
      <p slot="title">
          API
      </p>
      <div>
        <h3>props</h3>
        <Table border :columns="propsColumns" :data="propsData"></Table>
      </div>
    </Card>
	</div>
</template>

<script>
import InputTag from "./input-tag-bars";

export default {
  name: "input-tag-page",
  components: {
    InputTag
  },
  data() {
    return {
      inputTagData:{
        readOnly: false,
        addTagOnBlur: false,
        placeholder: "Add Tag",
        tags: ["张三", "李四", "王五", "老六"],
        limit: 10,
        htmlCode: "",
        validate: ""
      },
      propsColumns: [
          {
              title: '属性',
              key: 'name'
          },
          {
              title: '类型',
              key: 'type'
          },
          {
              title: '默认值',
              key: 'default'
          },
          {
              title: '说明',
              key: 'description'
          }
      ],
      propsData: [
        {
            name: 'tags',
            description: '要在输入中呈现的标记',
            type: 'Array',
            default: '[]'
        },
        {
            name: 'placeholder',
            description: '默认占位符',
            type: 'String',
            default: '""'
        },
        {
            name: 'read-only',
            description: '将输入设置为只读',
            type: 'Boolean',
            default: 'false'
        },
        {
            name: 'addTagOnBlur',
            description: '失去焦点后自动创建标签',
            type: 'Boolean',
            default: 'false'
        },
        {
            name: 'limit',
            description: '设置标签数量的限制',
            type: 'String or Number',
            default: '-1 (none)'
        },
        {
            name: 'validate',
            description: '验证用户输入内容。email电子邮件、URL、text文本、digits数字、isodate日期',
            type: 'String or Object',
            default: '""'
        },
        {
            name: 'addTagOnKeys',
            description: '要添加新标签的键',
            type: 'Array',
            default: '[ 13 (return), 188 (comma), 9 (tab) ]'
        },
      ]
    };
  },

  methods: {
    getPreviewHTML() {
      let html = "<input-tag";
      html += this.inputTagData.placeholder ? ` placeholder="${this.inputTagData.placeholder}"` : "";
      html += this.inputTagData.tags ? ' :tags.sync="tags"' : "";
      html += this.inputTagData.readOnly ? ' :read-only="true"' : "";
      html += this.inputTagData.addTagOnBlur ? ' :add-tag-on-blur="true"' : "";
      html += this.inputTagData.limit ? ' :limit="limit"' : "";
      html += this.inputTagData.validate ? ` validate="${this.inputTagData.validate}"` : "";
      return `${html}></input-tag>`;
    }
  }
};
</script>
