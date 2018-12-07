<style lang="scss" scoped> 
  @import "./Moderation.scss";
</style>
<template src="./Moderation.html">
</template>
<script>
import Share from '@/components/share/Share.vue'
import Card from '@/components/card/Card.vue'
import GetStarted from '@/components/getstarted/GetStarted.vue'
import Loader from '@/components/loader/Loader.vue'

import Resource from '@/mixins/resource'
import Constants from '@/config/constants'

import { AuthorBus } from '@/bus/AuthorBus'
import { SignInBus } from '@/bus/SignInBus'
import { CurrentUserBus } from '@/bus/CurrentUserBus'

export default {
  name: 'moderation',
  data () {
    return {
      displayTrigger: {
        mostPopular: false,
        latest: false,
        display: false
      },
      moderationCardData: [],
      moderationCardMetadata: {
        title: 'Content To Be Moderated',
        moreHref: '/',
        homeHeader: true,
        displayClass: 'card-body-dg-home',
        currentPaper: null,
        edit: false,
        more: false
      },
      enableModerationCard: false,
      profileIds: [],
      profileData: {},
      currentUser: {}
    }
  },
  components: {
    'share': Share,
    'card': Card,
    'getstarted': GetStarted,
    'loader': Loader
  },
  beforeCreate () {
    if (this.$session.exists()) {
      var currentUserId = this.$session.get(Constants.DATAGLITTER_ID)
      if (currentUserId) {
        // get user info by email
        this.$http.get(Constants.END_POINT + '/application-user/' + currentUserId)
        .then(function (response) {
          CurrentUserBus.$emit('update-current-user', {
            save: true,
            data: response.data
          })
          SignInBus.$emit('set-id', response.data.id)
        })
        .catch(e => {
          Resource.errorHandler(e, 'Fetching user by id failure')
        })
      }
    }
  },
  created: function () {
    // event listner for current user data
    CurrentUserBus.$on('publish-current-user', (currentUser) => {
      this.currentUser = currentUser
    })
    // Getting Un Moderated Cards
    this.$http.get(Constants.END_POINT + '/post/global/un-moderated/0/4')
      .then(response => {
        this.moderationCardData = response.data.content
        var pIds = []
        this.moderationCardData.map(function (value, i) {
          var record = value
          var author = Resource.prepareStringForURL(record.author)
          var title = Resource.prepareStringForURL(record.title)
          record.url = '/paper/' + author + '/' + title + '/' + record.id
          record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 35)
          record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
          pIds.push(record.authorId)
          return record
        })
        this.enableModerationCard = true
        this.profileIds = this.profileIds.concat(pIds)
        AuthorBus.$emit('home-profiles-trigger', 'mostPopular')
      })
      .catch(e => { Resource.errorHandler(e, 'Homepage -> Latest Card Data') })

    AuthorBus.$on('home-profiles-trigger', (modifier) => {
      this.displayTrigger[modifier] = true
      if (this.displayTrigger.mostPopular) {
        this.$http.post(Constants.END_POINT + '/application-user/list', { ids: this.profileIds })
          .then(response => {
            var profiles = response.data
            var profileData = {}
            profiles.map(function (value, i) {
              profileData[value['id']] = value
            })
            this.profileData = profileData
            this.displayTrigger.display = true
          })
          .catch(e => { Resource.errorHandler(e, 'Homepage -> Profile gathering information') })
      }
    })
  }
}
</script>
