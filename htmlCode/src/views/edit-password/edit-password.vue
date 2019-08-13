<style lang="less">
@import "./edit-password.less";
</style>

<template>
  <Card>
    <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
      <FormItem label="登录用户名" prop="account">
        <Input v-model="editPasswordForm.account" readonly placeholder="请输入登录用户名" style="width:300px" />
      </FormItem>
      <FormItem label="原密码" prop="oldPass">
        <Input v-model="editPasswordForm.oldPass" type="password" placeholder="请输入现在使用的密码" style="width:300px"></Input>
      </FormItem>
      <FormItem label="新密码" prop="newPass">
        <Input v-model="editPasswordForm.newPass" type="password" placeholder="请输入新密码，至少6位字符" style="width:300px"></Input>
      </FormItem>
      <FormItem label="确认新密码" prop="rePass">
        <Input v-model="editPasswordForm.rePass" type="password" placeholder="请再次输入新密码" style="width:300px"></Input>
      </FormItem>
      <FormItem label="">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
import util from "@/libs/util.js";
export default {
  name: "edit_password",
  data() {
    const valideRePassword = (rule, value, callback) => {
      if (value !== this.editPasswordForm.newPass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      savePassLoading: false,
      editPasswordForm: {
        account: "user",
        oldPass: "",
        newPass: "",
        rePass: ""
      },
      passwordValidate: {
        oldPass: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        newPass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "请至少输入6个字符", trigger: "blur" },
          { max: 32, message: "最多输入32个字符", trigger: "blur" }
        ],
        rePass: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: valideRePassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    saveEditPass() {
      this.$refs["editPasswordForm"].validate(valid => {
        if (valid) {
          this.savePassLoading = true;
          util.axiosAjax(
            this,
            {
              url: util.ajaxUrl + "/api/account/" + this.editPasswordForm.account,
              method: 'put',
              data: {
                old_password: this.editPasswordForm.oldPass,
                password: this.editPasswordForm.newPass,
                re_password: this.editPasswordForm.rePass
              }
            },
            data => {
              this.$Message.info('密码修改成功');
              setTimeout(() => {
                this.savePassLoading = false;
                this.$store.commit("logout", this);
                this.$store.commit('clearAllTags');
                this.$router.push({
                  name: "login"
                });
              }, 1000)
            },
            error => {
              this.$Message.error('密码修改失败');
            }
          );
        }
      });
    },
    cancelEditPass() {
      this.$store.commit("removeTag", "edit_password");
      localStorage.pageOpenedList = JSON.stringify(
        this.$store.state.app.pageOpenedList
      );
      let lastPageName = "";
      if (this.$store.state.app.pageOpenedList.length > 1) {
        lastPageName = this.$store.state.app.pageOpenedList[1].name;
      } else {
        lastPageName = this.$store.state.app.pageOpenedList[0].name;
      }
      this.$router.push({
        name: lastPageName
      });
    }
  },
  mounted() { }
};
</script>
