<style lang="scss" scoped> 
  @import "./Bookmark.scss";
</style>
<template src="./Bookmark.html">
</template>
<script>
export default {
  name: 'bookmarkmodal',
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