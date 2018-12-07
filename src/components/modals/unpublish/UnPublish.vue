<style lang="scss" scoped> 
  @import "./UnPublish.scss";
</style>
<template src="./UnPublish.html">
</template>
<script>
export default {
  name: 'unpublishmodal',
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