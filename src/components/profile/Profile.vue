<style lang="scss" scoped> 
  @import "./Profile.scss";
</style>
<template src="./Profile.html">
</template>
<script>
import Constants from '@/config/constants'
import Resource from '@/mixins/resource'
import Common from '@/mixins/common'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'

export default {
  name: 'profile',
  data () {
    return {
      userId: this.$route.params.userId,
      displayForm: false,
      currentUser: {},
      profilePicBase64: null
    }
  },
  methods: {
    saveProfile: function () {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/application-user', this.currentUser, {
        headers: {
          'authorization': token
        }
      }).then(function (response) {
        CurrentUserBus.$emit('local-user-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'User profile update failure')
      })
    },
    uploadImage: function (file) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      const fd = new FormData()
      fd.append('file', file, file.name)
      var instance = this
      this.$http.post(Constants.END_POINT + '/profile/upload', fd, {
        headers: {
          'authorization': token
        },
        mimeType: 'multipart/form-data'
      }).then(function (response) {
        instance.currentUser.profilePicture = Constants.PROFILE_PICS_ENDPOINT + response.data.location
        instance.$forceUpdate()
        Common.toastMessage(instance, Constants.TOAST.IMAGE_SUCESSFULLY_UPLOADED, 'success')
      })
      .catch(e => {
        Common.toastMessage(instance, Constants.TOAST.SOMETHING_WENT_WRONG, 'error')
        Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG)
      })
    },
    onFileChange: function (e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      // this.createImage(files[0])
      this.uploadImage(files[0])
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
