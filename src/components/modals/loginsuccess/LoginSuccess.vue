<style lang="scss" scoped> 
  @import "./LoginSuccess.scss";
</style>
<template src="./LoginSuccess.html">
</template>
<script>
import Constants from '@/config/constants'
import Resource from '@/mixins/resource'
import { CurrentUserBus } from '@/bus/CurrentUserBus'
export default {
  name: 'loginsuccessmodal',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    close: function (modalName) {
      this.$modal.hide(modalName)
    },
    writeAPaper: function () {
      this.$modal.hide('login-success')
      this.createAPaper({
        authorId: this.currentUser.id,
        authorName: this.currentUser.name
      })
    },
    createAPaper: function (data) {
      var paper = {
        moderated: false,
        title: '',
        tags: [],
        shortDescription: '',
        coverImage: '',
        content: '',
        author: data.authorName,
        authorId: data.authorId,
        category: '',
        likedBy: 0,
        sharedBy: 0,
        viewedBy: 0,
        published: false,
        active: true
      }
      var route = this.$router
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.post(Constants.END_POINT + '/post', paper, {
        headers: {
          'authorization': token
        }
      }).then(function (response) {
        route.push('/edit/paper/' + response.data.id)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Error in paper creation')
      })
    }
  },
  created () {
    CurrentUserBus.$on('publish-current-user', (currentUser) => {
      this.currentUser = currentUser
      this.profileUrl = '/profile/' + currentUser.id
      this.mySpaceUrl = '/myspace/' + currentUser.id
      this.moderation = '/moderation'
      this.$forceUpdate()
    })
  }
}
</script>