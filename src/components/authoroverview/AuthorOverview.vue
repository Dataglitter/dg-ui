<style lang="scss" scoped> 
  @import "./AuthorOverview.scss";
</style>
<template src="./AuthorOverview.html">
</template>
<script>
import Card from '@/components/card/Card.vue'
import Loader from '@/components/loader/Loader.vue'
import Author from '@/components/author/Author.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'
import { PaperBus } from '@/bus/PaperBus'
import { AuthorBus } from '@/bus/AuthorBus'

export default {
  name: 'authoroverview',
  data () {
    return {
      authorId: this.$route.params.authorId,
      currentUser: {},
      userData: {},
      enableAuthorDetails: false,
      authorDetails: {},
      papersContent: false,
      userContent: false,
      pageNo: 0,
      limit: 4,
      papers: [],
      papersMetadata: {
        title: 'Authors Papers',
        moreHref: '/',
        homeHeader: true,
        displayClass: 'card-body-dg-recommondation',
        currentPaper: null,
        edit: false,
        more: false
      },
      enableLoadMore: false,
      loadingContent: false
    }
  },
  components: {
    'card': Card,
    'loader': Loader,
    'author': Author,
    'pulse-loader': PulseLoader
  },
  methods: {
    getAuthorPapers: function (id, page, limit) {
      this.$http.get(Constants.END_POINT + '/post/global/latest/author/' + id + '/' + page.toString() + '/' + limit.toString())
      .then(function (response) {
        PaperBus.$emit('local-papers-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Authors papers fetch failure')
      })
    },
    getIncAuthorPapers: function (id, page, limit) {
      this.$http.get(Constants.END_POINT + '/post/global/latest/author/' + id + '/' + page.toString() + '/' + limit.toString())
      .then(function (response) {
        PaperBus.$emit('author-incremental-papers-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Authors inc papers fetch failure')
      })
    },
    getAuthorDetails: function (id) {
      this.$http.get(Constants.END_POINT + '/application-user/' + id)
      .then(response => {
        PaperBus.$emit('local-author-update', response.data)
        AuthorBus.$emit('update-current-author', response.data)
      })
      .catch(e => { Resource.errorHandler(e, 'Author Information') })
    },
    getNextPage: function () {
      if (this.enableLoadMore) {
        this.loadingContent = true
        this.getIncAuthorPapers(this.authorId, this.pageNo + 1, this.limit)
      }
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
    window.addEventListener('scroll', this.handleScroll)
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
        record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 30)
        record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
        return record
      })
      this.pageNo = data.number
      this.enableLoadMore = !data.last
      this.papersContent = true
      this.$forceUpdate()
    })
    PaperBus.$on('author-incremental-papers-update', (data) => {
      var incPapers = data.content
      incPapers.map(function (value, i) {
        var record = value
        var author = Resource.prepareStringForURL(record.author)
        var title = Resource.prepareStringForURL(record.title)
        record.url = '/paper/' + author + '/' + title + '/' + record.id
        record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 30)
        record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
        return record
      })
      this.papers = this.papers.concat(incPapers)
      this.pageNo = data.number
      this.enableLoadMore = !data.last
      this.papersContent = true
      this.loadingContent = false
      this.$forceUpdate()
    })
    PaperBus.$on('local-author-update', (data) => {
      this.authorDetails = data
      this.authorDetails.currentPaperTitle = ''
      this.userData[data.id] = data
      this.enableAuthorDetails = true
    })
    this.getAuthorDetails(this.authorId)
    this.getAuthorPapers(this.authorId, this.pageNo, this.limit)
  }
}
</script>
