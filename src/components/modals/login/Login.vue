<style lang="scss" scoped> 
  @import "./Login.scss";
</style>
<template src="./Login.html">
</template>
<script>
import { SignInBus } from '@/bus/SignInBus'

export default {
  name: 'loginmodal',
  data () {
    return {
      msg: ''
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
          newRegistration: false
        })
      }
      this.$modal.show(nextModalName)
    }
  }
}
</script>