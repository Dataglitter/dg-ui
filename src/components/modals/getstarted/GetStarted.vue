<style lang="scss" scoped> 
  @import "./GetStarted.scss";
</style>
<template src="./GetStarted.html">
</template>
<script>
import { SignInBus } from '@/bus/SignInBus'
export default {
  name: 'getstartedmodal',
  data () {
    return {
      profileUrl: null,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    close: function (modalName) {
      this.$modal.hide(modalName)
    },
    navigateTo: function (currentModalName, nextModalName) {
      this.$modal.hide(currentModalName)
      if (nextModalName === 'email-form') {
        SignInBus.$emit('sign-in-call', {
          newRegistration: true
        })
      }
      this.$modal.show(nextModalName)
    }
  }
}
</script>