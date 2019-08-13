<template>
  <div>
    <Row :gutter="10">
      <Col span="6">
      <Card :padding="4">
        <scrollbar class="scroll-container">
          <p v-for="i in 100" :key="`item-${i}`">item - {{ i }}</p>
        </scrollbar>
      </Card>
      </Col>
      <Col span="6">
      <Card :padding="4">
        <scrollbar class="scroll-container">
          <p class="list-item" v-for="i in 6" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
        </scrollbar>
      </Card>
      </Col>
      <Col span="6">
      <Card :padding="4">
        <scrollbar class="scroll-container">
          <p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
        </scrollbar>
      </Card>
      </Col>
      <Col span="6">
      <Card :padding="4">
        <scrollbar class="scroll-container">
          <p class="list-item" v-for="i in 100" :key="`item-${i}`">item - {{ i }} - item-long-show-x-scrollbar- long-text-make-scroller-x-show-and-useable - item-long-show-x-scrollbar</p>
        </scrollbar>
      </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import util from "@/libs/util.js";
import scrollbar from "./scrollbar-bars";
export default {
  components: {
    scrollbar
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {},
  watch: {},
  methods: {

  }
};
</script>
<style lang="less">
.scroll-container {
  height: 260px;
}
.list-item {
  word-break: keep-all;
  white-space: nowrap;
}
</style>
