<style lang="scss" scoped> 
  @import "./Setting.scss";
</style>
<template src="./Setting.html">
</template>
<script>
import Constants from '@/config/constants'
import Resource from '@/mixins/resource'
import Common from '@/mixins/common'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'
export default {
  name: 'setting',
  data () {
    return {
    }
  },
  components: {
  },
  methods: {
    deactivate: function () {
      let confirmCallBack = () => {
        let token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
        this.$http.put(Constants.END_POINT + '/application-user/deactivate/' + this.currentUser.id, {}, {
          headers: {
            'authorization': token
          }
        }).then(function (response) {
          SignInBus.$emit('remove-session', { type: 'Sign Out' })
        })
      .catch(e => {
        Resource.errorHandler(e, 'Account Deactivation failure')
      })
      }
      Common.confirmDialog(this, 'Are you sure your account will be Deactivated?', confirmCallBack)
    },
    deleteAccount: function () {
      let confirmCallBack = () => {
        var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
        this.$http.delete(Constants.END_POINT + '/application-user/' + this.currentUser.id, {
          headers: {
            'authorization': token
          }
        }).then(function (response) {
          SignInBus.$emit('remove-session', { type: 'Sign Out' })
        })
        .catch(e => {
          Resource.errorHandler(e, 'Account deletion failure')
        })
      }
      Common.confirmDialog(this, 'Are you sure your account will be Deleted?', confirmCallBack)
    }
  },
  beforeCreate () {
    if (this.$session.exists()) {
      var currentUserId = this.$session.get(Constants.DATAGLITTER_ID)
      if (currentUserId) {
        // get user info by email
        this.$http.get(Constants.END_POINT + '/application-user/' + currentUserId)
        .then(function (response) {
          CurrentUserBus.$emit('local-user-update', response.data)
          SignInBus.$emit('set-id', response.data.id)
        })
        .catch(e => {
          Resource.errorHandler(e, 'Fetching user by id failure')
        })
      } else {
        this.$router.push('/')
      }
    } else {
      this.$router.push('/')
    }
  },
  created: function () {
    CurrentUserBus.$on('local-user-update', (currentUser) => {
      this.currentUser = currentUser
      CurrentUserBus.$emit('update-current-user', {
        save: true,
        data: currentUser
      })
      this.$forceUpdate()
    })
  }
}
</script>
