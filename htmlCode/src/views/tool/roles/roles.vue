<template>
  <div>
    <Card>
      <Tabs value="name1">
        <TabPane label="管理员用户" name="name1">
          <Form ref="adminFormValidate" :model="adminFormValidate" :rules="adminRuleValidate" :label-width="100">
            <FormItem label="登录用户名" prop="account">
              <Input v-model="adminFormValidate.account" readonly placeholder="请输入登录用户名" style="width:300px" />
            </FormItem>
            <FormItem label="原密码" prop="oldPassword">
              <Input v-model="adminFormValidate.oldPassword" type="password" placeholder="请输入登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="登录密码" prop="password">
              <Input v-model="adminFormValidate.password" type="password" placeholder="请输入登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="确认登录密码" prop="rePassword">
              <Input v-model="adminFormValidate.rePassword" type="password" placeholder="请输入确认登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="">
              <Button type="primary" :loading="submitLoadingAdmin" @click="handleSubmitAdmin">提交</Button>
              <Button type="ghost" @click="handleResetAdmin" class="margin-left-10">重置</Button>
            </FormItem>
          </Form>
        </TabPane>
        <TabPane label="普通用户" name="name2">
          <Form ref="userFormValidate" :model="userFormValidate" :rules="userRuleValidate" :label-width="100">
            <FormItem label="登录用户名" prop="account">
              <Input v-model="userFormValidate.account" readonly placeholder="请输入登录用户名" style="width:300px" />
            </FormItem>
            <FormItem label="原密码" prop="oldPassword">
              <Input v-model="userFormValidate.oldPassword" type="password" placeholder="请输入登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="登录密码" prop="password">
              <Input v-model="userFormValidate.password" type="password" placeholder="请输入登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="确认登录密码" prop="rePassword">
              <Input v-model="userFormValidate.rePassword" type="password" placeholder="请输入确认登录密码" style="width:300px" />
            </FormItem>
            <FormItem label="用户修改密码" prop="radios">
              <RadioGroup v-model="userFormValidate.radios">
                <Radio label="1">允许修改</Radio>
                <Radio label="2">禁止修改</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="">
              <Button type="primary" :loading="submitLoadingUser" @click="handleSubmitUser">提交</Button>
              <Button type="ghost" @click="handleResetUser" class="margin-left-10">重置</Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Card>
  </div>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "roles",
  components: {},
  data() {
    const adminRePassword = (rule, value, callback) => {
      if (value !== this.adminFormValidate.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    const userRePassword = (rule, value, callback) => {
      if (value !== this.userFormValidate.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      submitLoadingAdmin: false,
      adminFormValidate: {
        account: "admin",
        oldPassword:"",
        password: "",
        rePassword: ""
      },
      adminRuleValidate: {
        account: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: adminRePassword, trigger: "blur" }
        ]
      },

      submitLoadingUser: false,
      userFormValidate: {
        account: "user",
        oldPassword:"",
        password: "",
        rePassword: "",
        radios: "1"
      },
      userRuleValidate: {
        account: [
          {
            required: true,
            message: "必填",
            trigger: "blur"
          }
        ],
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePassword: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: userRePassword, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    handleSubmitAdmin() {
      this.$refs["adminFormValidate"].validate(valid => {
        if (valid) {
          this.submitLoadingAdmin = true;
          this.formSubmit("admin");
        }
      });
    },
    handleResetAdmin() {
      this.$refs["adminFormValidate"].resetFields();
    },
    handleSubmitUser() {
      this.$refs["userFormValidate"].validate(valid => {
        if (valid) {
          this.submitLoadingUser = true;
          this.formSubmit("user");
        }
      });
    },
    handleResetUser() {
      this.$refs["userFormValidate"].resetFields();
    },
    formSubmit(type){
      let _data = {};
      let _url = util.ajaxUrl + "/api/account/"
      if(type == "admin"){
        _data.old_password = this.adminFormValidate.oldPassword
        _data.password = this.adminFormValidate.password
        _data.re_password = this.adminFormValidate.rePassword
        _url += this.adminFormValidate.account
      }else{
        _data.old_password = this.userFormValidate.oldPassword
        _data.password = this.userFormValidate.password
        _data.re_password = this.userFormValidate.rePassword
        _data.allow_update = this.userFormValidate.radios == "1" ? true : false
        _url += this.userFormValidate.account
      }
      util.axiosAjax(
        this,
        {
          url: _url,
          method: 'put',
          data: _data
        },
        data => {
          if(type == "admin"){
            this.submitLoadingAdmin = false;
            this.$refs["adminFormValidate"].resetFields();
          }else{
            this.submitLoadingUser = false;
            this.$refs["userFormValidate"].resetFields();
          }
          this.$Message.info('密码修改成功');
        },
        error => {
          if(type == "admin"){
            this.submitLoadingAdmin = false;
          }else{
            this.submitLoadingUser = false;
          }
        }
      );
    }
  }
};
</script>
