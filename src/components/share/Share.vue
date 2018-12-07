<style lang="scss" scoped> 
  @import "./Share.scss";
</style>
<template src="./Share.html">
</template>
<script>
import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { BookmarkBus } from '@/bus/BookmarkBus'

export default {
  name: 'share',
  props: ['ShareData'],
  data () {
    return {
      pagePath: null
    }
  },
  methods: {
    incrementMedal: function (id) {
      this.$http.put(Constants.END_POINT + '/post/' + id + '/liked')
        .then(response => {
          this.ShareData.medalData.show = true
          this.ShareData.medalData.count = response.data
          this.$forceUpdate()
        })
        .catch(e => { Resource.errorHandler(e, 'Share page -> Increment Medal') })
    },
    addBookmark: function () {
      BookmarkBus.$emit('add-bookmark', {
        id: null,
        postId: null
      })
    }
  },
  created () {
    this.pagePath = Constants.SITE_URL + this.$route.fullPath
    this.$forceUpdate()
  }
}
</script>
 