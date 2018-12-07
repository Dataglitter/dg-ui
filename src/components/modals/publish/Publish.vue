<style lang="scss" scoped> 
  @import "./Publish.scss";
</style>
<template src="./Publish.html">
</template>
<script>
export default {
  name: 'publishmodal',
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