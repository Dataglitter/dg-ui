<style lang="scss" scoped> 
  @import "./TopNav.scss";
</style>
<template src="./TopNav.html">
</template>
<script>
import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { SignInBus } from '@/bus/SignInBus'
import { CurrentUserBus } from '@/bus/CurrentUserBus'

export default {
  name: 'topnav',
  data () {
    return {
      logInStatus: null,
      currentUser: {},
      profileUrl: null,
      mySpaceUrl: null,
      moderation: null,
      settingUrl: null,
      enableWritePaper: false
    }
  },
  methods: {
    getStarted: function () {
      this.$modal.show('get-started')
    },
    signIn: function () {
      this.$modal.show('login')
    },
    signOut: function () {
      SignInBus.$emit('remove-session', { type: 'Sign Out' })
    },
    writeAPaper: function () {
      this.createAPaper({
        authorId: this.currentUser.id,
        authorName: this.currentUser.name
      })
    },
    showMderation: function (role) {
      if (this.currentUser.roles) {
        return this.currentUser.roles.indexOf(role) > -1
      } else {
        return false
      }
    },
    validateToken: function (token) {
      this.$http.get(Constants.END_POINT + '/token/validate', {
        headers: {
          'authorization': token
        }
      }).then(function (response) {
        if (!response) {
          SignInBus.$emit('remove-session', { type: 'Sign Out' })
        } else {
          SignInBus.$emit('login-success', { type: Constants.VALIDATE })
        }
      })
      .catch(e => {
        Resource.errorHandler(e, 'Login Failure')
        this.errorMessage = 'login Failure'
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
        published: false
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
      if (this.$route.name !== 'writepaper') {
        this.enableWritePaper = true
      }
      this.currentUser = currentUser
      this.profileUrl = '/profile/' + currentUser.id
      this.mySpaceUrl = '/myspace/' + currentUser.id
      this.moderation = '/moderation'
      this.settingUrl = '/settings'
      this.$forceUpdate()
    })
    SignInBus.$on('login-success', (loginType) => {
      this.logInStatus = true
      this.$forceUpdate()
    })
    SignInBus.$on('remove-session', (signOut) => {
      this.$router.push('/')
      this.logInStatus = false
      this.$session.destroy()
      this.$modal.show('logout-success')
      this.$forceUpdate()
    })
    SignInBus.$on('validate-session', (validation) => {
      this.validateToken(this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN))
    })
    if (this.$session.exists()) {
      this.validateToken(this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN))
    } else {
      this.logInStatus = false
      this.$forceUpdate()
    }
  }
}
</script>