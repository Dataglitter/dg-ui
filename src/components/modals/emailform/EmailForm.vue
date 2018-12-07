<style lang="scss" scoped> 
  @import "./EmailForm.scss";
</style>
<template src="./EmailForm.html">
</template>
<script>
import Strings from '@/config/Strings'
import Resource from '@/mixins/resource'
import Constants from '@/config/constants'

import { SignInBus } from '@/bus/SignInBus'
import { CurrentUserBus } from '@/bus/CurrentUserBus'

export default {
  name: 'emailformmodal',
  data () {
    return {
      newRegistration: false,
      option: null,
      emailAuth: {
        email: null,
        password: null,
        confirmPassword: null
      },
      errorMessage: null,
      successMessage: null,
      currentUser: {}
    }
  },
  methods: {
    logMeIn: function ($event) {
      this.successMessage = null
      if (!this.newRegistration) {
        this.emailAuth.confirmPassword = this.emailAuth.password
      }
      if (this.emailAuth.email != null && this.emailAuth.password != null) {
        if (this.emailAuth.password === this.emailAuth.confirmPassword) {
          this.errorMessage = null
          var cred = { password: this.emailAuth.password, email: this.emailAuth.email }
          if (!this.$session.exists()) {
            if (!this.newRegistration) {
              this.login(cred)
              this.getUserByEmail(cred)
            } else {
              this.checkIfUserExists(cred)
            }
          } else {
            SignInBus.$emit('validate-session', { type: Constants.VALIDATE })
          }
        } else {
          this.errorMessage = Strings.PASSWORD_MISS_MATCH
        }
      } else {
        if (this.emailAuth.email == null) {
          this.errorMessage = Strings.EMAIL_MISSING
        } else {
          this.errorMessage = Strings.PASSWORD_MISSING
        }
      }
    },
    login: function (cred) {
      // login user with email and password
      this.$http.post(Constants.LOGIN_END_POINT + '/login', {
        password: cred.password,
        email: cred.email
      }).then(function (response) {
        if (response.status === 200 && 'authorization' in response.headers) {
          SignInBus.$emit('set-token', response.headers)
        } else {
          SignInBus.$emit('sign-in-failure', Strings.MESSAGE_XXX)
        }
      },
      function (error) {
        if (error.response.status === 401) {
          SignInBus.$emit('sign-in-failure', Strings.MESSAGE_401)
        } else {
          SignInBus.$emit('sign-in-failure', Strings.MESSAGE_XXX)
        }
      })
      .catch(e => {
        Resource.errorHandler(e, 'Login Failure')
        SignInBus.$emit('sign-in-failure', String.LOGIN_FAILURE)
      })
    },
    getUserByEmail: function (cred) {
      this.$http.post(Constants.END_POINT + '/application-user/by-email', { email: cred.email })
      .then(function (response) {
        CurrentUserBus.$emit('update-current-user', {
          save: true,
          data: response.data
        })
        SignInBus.$emit('set-id', response.data.id)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Fetching user by email failure')
      })
    },
    signUp: function (cred) {
      this.$http.post(Constants.END_POINT + '/sign-up',
        {
          password: cred.password,
          email: cred.email,
          name: '',
          designation: '',
          followers: [],
          roles: [ 'ROLE_AUTHOR' ],
          bookmarks: [],
          about: '',
          facebookURL: '',
          twitterURL: '',
          instagramURL: '',
          linkedinURL: '',
          githubURL: '',
          profilePicture: '',
          accountStatus: 'IN_USE',
          active: true
        }
      )
      .then(function (response) {
        SignInBus.$emit('user-created-set-login', { from: 'email-form' })
      }, function (error) {
        if (error.response.status === 401) {
          SignInBus.$emit('sign-in-failure', Strings.MESSAGE_401)
        } else {
          SignInBus.$emit('sign-in-failure', Strings.MESSAGE_XXX)
        }
      })
      .catch(e => {
        Resource.errorHandler(e, 'Login Failure')
        this.errorMessage = String.LOGIN_FAILURE
      })
    },
    checkIfUserExists: function (cred) {
      this.$http.post(Constants.END_POINT + '/application-user/check-email', { email: cred.email })
      .then(function (response) {
        if (response.data !== 1) {
          SignInBus.$emit('create-new-user', cred)
        } else {
          SignInBus.$emit('sign-in-failure', Strings.USER_EXISTS)
        }
      })
      .catch(e => {
        SignInBus.$emit('sign-in-failure', Strings.MESSAGE_XXX)
      })
    },
    close: function (modalName) {
      this.$modal.hide(modalName)
    },
    navigateTo: function (currentModalName, nextModalName) {
      this.$modal.hide(currentModalName)
      this.$modal.show(nextModalName)
    },
    initialize: function (e) {
      this.emailAuth = {
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  created () {
    SignInBus.$on('sign-in-call', (signInData) => {
      this.newRegistration = signInData.newRegistration
      this.option = this.newRegistration ? 'Sign up' : 'Sign in'
      this.$forceUpdate()
    })

    SignInBus.$on('sign-in-failure', (message) => {
      this.errorMessage = message
      this.$forceUpdate()
    })

    SignInBus.$on('set-token', (headers) => {
      this.$session.start()
      this.$session.set(Constants.DATAGLITTER_AUTH_TOKEN, headers.authorization)
      this.$modal.hide('email-form')
      SignInBus.$emit('login-success', {
        type: Strings.LOGIN_TYPE.EMAIL
      })
      this.$modal.show('login-success')
      if (!this.currentUser.active) {
        var userDetails = this.currentUser
        userDetails.active = true
        this.$http.put(Constants.END_POINT + '/application-user/activate/' + this.currentUser.id, {}, {
          headers: {
            'authorization': headers.authorization
          }
        }).then(function (response) {
          CurrentUserBus.$emit('update-current-user', userDetails)
        })
        .catch(e => {
          Resource.errorHandler(e, 'Account activation failure')
        })
      }
    })

    CurrentUserBus.$on('update-current-user', (currentUser) => {
      this.currentUser = currentUser.data
    })

    SignInBus.$on('set-id', (id) => {
      this.$session.set(Constants.DATAGLITTER_ID, id)
    })

    SignInBus.$on('user-created-set-login', (info) => {
      this.$modal.hide(info.from)
      this.newRegistration = false
      this.option = this.newRegistration ? 'Sign up' : 'Sign in'
      this.successMessage = Strings.USER_CREATION_SUCCESS
      this.$forceUpdate()
      this.$modal.show(info.from)
    })

    SignInBus.$on('create-new-user', (cred) => {
      this.signUp(cred)
    })
  }
}
</script>