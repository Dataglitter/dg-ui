<style lang="scss" scoped> 
  @import "./Delete.scss";
</style>
<template src="./Delete.html">
</template>
<script>
export default {
  name: 'deletemodal',
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