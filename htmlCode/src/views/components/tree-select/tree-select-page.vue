<template>
	<Card>
		<treeselect v-model="value" :multiple="true" :options="options" />

		<div class="margin-top-20">api: <a target="_blank" href="https://vue-treeselect.js.org">api官网</a></div>
		<div class="margin-top-20">
      <h3>新增Node: </h3>
      <ul class="padding-left-20">
        <li>"isSelect:false" 当前节点不会被选中</li>
        <li>"isHide:true" 当前节点隐藏</li>
      </ul>
      
    </div>

	</Card>
</template>

<script>
import Treeselect from "./tree-select-bars";
export default {
  name: "tree-select",
  components: {
    Treeselect
  },
  data() {
    return {
      // define default value
      value: null,
      // define options
      options: [
        {
          id: "a",
          label: "a",
          children: [
            {
              id: "aa",
              label: "aa"
            },
            {
              id: "ab",
              label: "ab"
            }
          ]
        },
        {
          id: "b",
          label: "b",
          isSelect: true
        },
        {
          id: "c",
          label: "c"
        }
      ]
    };
  }
};
</script>

<style lang="less">

</style>
