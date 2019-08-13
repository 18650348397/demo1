<style lang="less">
@import "./main.less";
</style>
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">

      <div class="logo-con">
        <img v-show="!shrink" src="../images/logo.png" key="max-logo" />
        <img v-show="shrink" src="../images/logo-min.png" key="min-logo" />
      </div>
      <scrollbar :style="{height:menuHeight + 'px'}" :zIndex=10000>
        <shrinkable-menu :shrink="shrink" @on-change="handleSubmenuChange" :before-push="beforePush" :open-names="openedSubmenuArr" :menu-list="menuList">
        </shrinkable-menu>
      </scrollbar>
      <menu-clock v-show="!shrink"></menu-clock>
    </div>
    <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <lock-screen></lock-screen>
          <div @click="handleRefreshPage" class="refresh-current-page-btn">
            <Tooltip content="刷新当前页" placement="bottom">
              <Icon type="refresh" :size="23"></Icon>
            </Tooltip>
          </div>
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="edit_password" v-if="allowUpdate==1">修改密码</DropdownItem>
                  <DropdownItem name="loginout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar style="background-color: #2d8cf0" icon="person" class="margin-left-10"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
      <div class="single-page" v-if="loadingRefresh">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachePage">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import menuClock from "./main-components/menu-clock/menu-clock.vue";
import scrollbar from "@/views/components/scrollbar/scrollbar-bars";
import Cookies from "js-cookie";
import util from "@/libs/util.js";

export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    menuClock,
    scrollbar
  },
  data() {
    return {
      loadingRefresh: true,
      shrink: false,
      menuHeight: "200",
      userName: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr
    };
  },
  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    },
    allowUpdate() {
      return Cookies.set("allowUpdate")
    }
  },
  methods: {
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.userName = Cookies.get("user");
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.menuHeightResize();
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleClickUserDropdown(name) {
      if (name === "edit_password") {
        util.openNewPage(this, "edit_password");
        this.$router.push({
          name: "edit_password"
        });
      } else if (name === "loginout") {
        this.$store.commit("logout", this);
        this.$store.commit("clearOpenedSubmenu");
        this.$store.commit('clearAllTags');
        this.$router.push({
          name: "login"
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      return true;
    },
    fullscreenChange(isFullScreen) { },
    menuHeightResize() {
      this.menuHeight = document.documentElement.clientHeight - 250;
    },
    handleRefreshPage() {
      util.domReset(this, "loadingRefresh");
    }
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    openedSubmenuArr() {
    }
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.menuHeightResize);
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  },
  dispatch() { }
};
</script>
