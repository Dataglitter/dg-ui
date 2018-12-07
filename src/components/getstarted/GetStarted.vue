<style lang="scss" scoped> 
  @import "./GetStarted.scss";
</style>
<template src="./GetStarted.html">
</template>
<script>
export default {
  name: 'getstarted',
  data () {
    return {
      GetStartedData: {}
    }
  },
  methods: {
    getStarted: function () {
      this.$modal.show('get-started')
    },
    signIn: function () {
      this.$modal.show('login')
    }
  }
}
</script>
 