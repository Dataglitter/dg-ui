<style lang="scss" scoped> 
  @import "./Subscribe.scss";
</style>
<template src="./Subscribe.html">
</template>
<script>
export default {
  name: 'subscribemodal',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    close: function (modalName) {
      this.$modal.hide(modalName)
    }
  }
}
</script>