<style lang="scss" scoped> 
  @import "./FooterBar.scss";
</style>
<template src="./FooterBar.html">
</template>
<script>
import { AuthorBus } from '@/bus/AuthorBus'
import { SubscribeBus } from '@/bus/SubscribeBus'

export default {
  name: 'footerbar',
  data () {
    return {
      FooterData: {}
    }
  },
  methods: {
    subscribeToAuthor: function () {
      SubscribeBus.$emit('add-follower', {
        id: null,
        followerId: null
      })
    }
  },
  created () {
    AuthorBus.$on('FooterData', (footerData) => {
      this.FooterData = footerData
      this.$forceUpdate()
    })
  }
}
</script>
 