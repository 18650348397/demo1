<style lang="less" scoped>
@import "./login.less";
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" placeholder="请输入用户名">
              <span slot="prepend">
                <Icon :size="16" type="person"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                <Icon :size="14" type="locked"></Icon>
              </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" long :loading="loading" @click="handleSubmit">
                <span v-if="!loading">登录</span>
                <span v-else>登录中...</span>
              </Button>
            </FormItem>
          </Form>
          <p class="login-tip">版权信息</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import md5 from "md5";
import util from "@/libs/util.js";
export default {
  data() {
    return {
      loading: false,
      form: {
        userName: "",
        password: ""
      },
      rules: {
        userName: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          //ajax请求
          util.axiosAjax(
            this,
            {
              //url: "../../static/resources/login.json"
              url: util.ajaxUrl + "/api/login",
              method: "post",
              data: {
                user_name: this.form.userName,
                password: this.form.password
              }
            },
            data => {
              this.loading = false;
              Cookies.set("user", this.form.userName);
              Cookies.set("password", md5(this.form.password));
              if (data.data.data.type == 2) {
                Cookies.set("allowUpdate", data.data.data.allowUpdate);
              }
              if (this.form.userName === "admin") {
                Cookies.set("access", 0);
              } else {
                Cookies.set("access", 1);
              }
              this.$router.push({
                name: "home_index"
              });
            },
            error => {
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style>
</style>
