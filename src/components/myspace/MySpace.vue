<style lang="scss" scoped> 
  @import "./MySpace.scss";
</style>
<template src="./MySpace.html">
</template>
<script>
import Card from '@/components/card/Card.vue'
import Loader from '@/components/loader/Loader.vue'

import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'
import { PaperBus } from '@/bus/PaperBus'

export default {
  name: 'myspace',
  data () {
    return {
      userId: this.$route.params.userId,
      currentUser: {},
      userData: {},
      papersContent: false,
      userContent: false,
      pageNo: 0,
      limit: 10,
      papers: [],
      papersMetadata: {
        title: 'Your Papers',
        moreHref: '/',
        homeHeader: true,
        displayClass: 'card-body-dg-recommondation',
        currentPaper: null,
        edit: true,
        more: false
      }
    }
  },
  components: {
    'card': Card,
    'loader': Loader
  },
  methods: {
    getAuthorPapers: function (id, page, limit) {
      this.$http.get(Constants.END_POINT + '/post/latest/author/' + id + '/' + page.toString() + '/' + limit.toString())
      .then(function (response) {
        PaperBus.$emit('local-papers-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'User profile update failure')
      })
    }
  },
  beforeCreate () {
    if (this.$session.exists()) {
      var currentUserId = this.$session.get(Constants.DATAGLITTER_ID)
      if (currentUserId) {
        this.$http.get(Constants.END_POINT + '/application-user/' + currentUserId)
        .then(function (response) {
          CurrentUserBus.$emit('local-user-update', {
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
    CurrentUserBus.$on('local-user-update', (currentUser) => {
      this.currentUser = currentUser.data
      this.userContent = true
      this.userData[currentUser.data.id] = currentUser.data
      CurrentUserBus.$emit('update-current-user', currentUser)
      this.$forceUpdate()
    })
    PaperBus.$on('local-papers-update', (data) => {
      this.papers = data.content
      this.papers.map(function (value, i) {
        var record = value
        var author = Resource.prepareStringForURL(record.author)
        var title = Resource.prepareStringForURL(record.title)
        record.url = '/paper/' + author + '/' + title + '/' + record.id
        record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 100)
        record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
        record.editLink = '/edit/paper' + record.id
        return record
      })
      this.pageNo = data.number
      this.papersContent = true
      this.$forceUpdate()
    })
    this.getAuthorPapers(this.userId, this.pageNo, this.limit)
  }
}
</script>
