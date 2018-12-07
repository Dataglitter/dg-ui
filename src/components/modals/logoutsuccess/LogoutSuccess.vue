<style lang="scss" scoped> 
  @import "./LogoutSuccess.scss";
</style>
<template src="./LogoutSuccess.html">
</template>
<script>
export default {
  name: 'logoutsuccessmodal',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    close: function (modalName) {
      this.$modal.hide(modalName)
    },
    navigateTo: function (currentModalName, nextModalName) {
      this.$modal.hide(currentModalName)
      this.$modal.show(nextModalName)
    }
  }
}
</script>