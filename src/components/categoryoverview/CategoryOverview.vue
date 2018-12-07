<style lang="scss" scoped> 
  @import "./CategoryOverview.scss";
</style>
<template src="./CategoryOverview.html">
</template>
<script>
import Card from '@/components/card/Card.vue'
import Loader from '@/components/loader/Loader.vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'
import { PaperBus } from '@/bus/PaperBus'

export default {
  name: 'categoryoverview',
  data () {
    return {
      category: this.$route.params.category,
      currentUser: {},
      profileData: {},
      papersContent: false,
      profileContent: false,
      pageNo: 0,
      maxPages: 0,
      enableLoadMore: false,
      limit: 6,
      papers: [],
      profileIds: [],
      papersMetadata: {
        title: '',
        moreHref: '/',
        homeHeader: true,
        displayClass: 'card-body-dg-home',
        currentPaper: null,
        edit: false,
        more: false
      },
      loadingContent: false
    }
  },
  components: {
    'card': Card,
    'loader': Loader,
    'pulse-loader': PulseLoader
  },
  methods: {
    getCategoryPapers: function (category, page, limit) {
      this.$http.get(Constants.END_POINT + '/post/global/latest/category/' + category + '/' + page.toString() + '/' + limit.toString())
      .then(function (response) {
        PaperBus.$emit('local-papers-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Failure in fetching category papers')
      })
    },
    getIncCategoryPapers: function (category, page, limit) {
      this.$http.get(Constants.END_POINT + '/post/global/latest/category/' + category + '/' + page.toString() + '/' + limit.toString())
      .then(function (response) {
        PaperBus.$emit('category-increment-papers-update', response.data)
      })
      .catch(e => {
        Resource.errorHandler(e, 'Failure in fetching incremented category papers')
      })
    },
    getAuthors: function (profileIds) {
      this.$http.post(Constants.END_POINT + '/application-user/list', { ids: profileIds })
      .then(response => {
        PaperBus.$emit('local-profile-data-update', response.data)
      })
      .catch(e => { Resource.errorHandler(e, 'Category page -> Profile gathering information') })
    },
    getIncAuthors: function (profileIds) {
      this.$http.post(Constants.END_POINT + '/application-user/list', { ids: profileIds })
      .then(response => {
        PaperBus.$emit('category-increment-profile-data-update', response.data)
      })
      .catch(e => { Resource.errorHandler(e, 'Category page -> Increment Profile gathering information') })
    },
    getNextPage: function () {
      if (this.enableLoadMore) {
        this.loadingContent = true
        this.getIncCategoryPapers(this.category, this.pageNo + 1, this.limit)
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
    CurrentUserBus.$on('local-user-update', (currentUser) => {
      this.currentUser = currentUser.data
      CurrentUserBus.$emit('update-current-user', currentUser)
      this.$forceUpdate()
    })
    PaperBus.$on('local-papers-update', (data) => {
      this.papers = data.content
      var pIds = []
      this.papers.map(function (value, i) {
        var record = value
        var author = Resource.prepareStringForURL(record.author)
        var title = Resource.prepareStringForURL(record.title)
        record.url = '/paper/' + author + '/' + title + '/' + record.id
        record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 30)
        record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
        record.editLink = '/edit/paper' + record.id
        pIds.push(record.authorId)
        return record
      })
      this.profileIds = pIds
      this.pageNo = data.number
      this.maxPages = data.totalPages
      this.enableLoadMore = !data.last
      this.getAuthors(this.profileIds)
    })
    PaperBus.$on('category-increment-papers-update', (data) => {
      var incPapers = data.content
      var pIds = []
      incPapers.map(function (value, i) {
        var record = value
        var author = Resource.prepareStringForURL(record.author)
        var title = Resource.prepareStringForURL(record.title)
        record.url = '/paper/' + author + '/' + title + '/' + record.id
        record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 30)
        record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
        record.editLink = '/edit/paper' + record.id
        pIds.push(record.authorId)
        return record
      })
      this.profileIds.concat(pIds)
      this.papers = this.papers.concat(incPapers)
      this.pageNo = data.number
      this.maxPages = data.totalPages
      this.enableLoadMore = !data.last
      this.getIncAuthors(pIds)
    })
    PaperBus.$on('local-profile-data-update', (data) => {
      var profileTempData = {}
      data.map(function (value, i) {
        profileTempData[value['id']] = value
      })
      this.profileData = profileTempData
      this.papersContent = true
      this.profileContent = true
      this.papersMetadata.title = 'Latest in ' + Resource.getNameOfCategory(this.category)
      this.$forceUpdate()
    })
    PaperBus.$on('category-increment-profile-data-update', (data) => {
      var profileTempData = {}
      data.map(function (value, i) {
        profileTempData[value['id']] = value
      })
      for (var author in profileTempData) {
        this.profileData[author['id']] = author
      }
      this.papersContent = true
      this.profileContent = true
      this.loadingContent = false
      this.$forceUpdate()
    })
    this.getCategoryPapers(this.category, this.pageNo, this.limit)
  }
}
</script>