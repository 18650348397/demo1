<style lang="less" scoped>
@import "./style.less";
</style>

<template>
  <ul class="input-ip" :class="[wrapClasses,{'isfocus': isFocus}]">
    <li v-for="(item,index) in segments">
      <input type="text" @input="onInput($event,index)" @keyup="onInputKeyUp($event,index)" :value="item" ref="inputIp" @focus="onInputFocus($event,index)" @blur="onInputBlur($event,index)" />
    </li>
  </ul>
</template>

<script>
/* 
https://www.jianshu.com/p/40c874f111fc
https://github.com/lakb248/vue-ip-input
*/
export default {
  name: "InputIp",

  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "default"
    }
  },

  data() {
    return {
      isFocus: false,
      segments: ["", "", "", ""]
    };
  },
  watch: {
    value(val) {
      this.syncIp(val);
    },
    segments() {
      this.updateValue();
    }
  },
  computed:{
    wrapClasses(){
      let _class = "input-ip-";
      _class = this.size == "default" ? _class + "default" : this.size == "small" ? _class + "small" : _class + "large"
      return _class
    }
  },
  methods: {
    updateValue() {
      let _val = "";
      if(this.segments[0] != ""){
        _val = this.segments.join(".");
      }
      this.$emit("input", _val);
    },
    onInputKeyUp(e, index) {
      let value = e.target.value;
      //删除键把当前数据删除完毕后会跳转到前一个input，左一不做任何处理
      if (e.keyCode == 8) {
        if (index != 0 && value<=0) {
          this.$refs.inputIp[index - 1].focus();
        }
      }
      //右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
      if (
        e.keyCode == 39 ||
        e.keyCode == 13 ||
        e.keyCode == 32 ||
        e.keyCode == 190 ||
        e.keyCode == 110
      ) {
        if (index != 3) {
          this.$refs.inputIp[index + 1].focus();
        }
      }
    },
    onInput(e, index) {
      let value = e.target.value;
      e.target.value = this.segments[index];
      let segment = Number(value);
      if (isNaN(segment)) {
        return;
      } else if (value === "") {
        this.segments.splice(index, 1, 0);
      } else if (segment > 255 || segment < 0) {
        this.segments.splice(index, 1, 255);
      }else {
        this.segments.splice(index, 1, segment);
      }
      // 自动跳到下一个输入框
      if (
        (value.length === 3 && index < 3) ||
        value[value.length - 1] === "."
      ) {
        this.$refs.inputIp[index + 1].focus();
      }
    },
    onInputFocus(e, index) {
      this.isFocus = true;
    },
    onInputBlur(e, index) {
      this.isFocus = false;
    },
    syncIp(value) {
      if(value==""){
        this.segments=["", "", "", ""]
      }
      if (value && value.indexOf(".") !== -1) {
        value.split(".").map((segment, index) => {
          if (isNaN(segment) || segment < 0 || segment > 255) {
            segment = 255;
          }
          this.segments.splice(index, 1, segment);
          return segment;
        });
      }
    }
  },
  mounted() {
    this.syncIp(this.value);
  }
};
</script>

