<style lang="scss" scoped> 
  @import "./Paper.scss";
</style>
<template src="./Paper.html">
</template>
<script>
import Share from '@/components/share/Share.vue'
import Author from '@/components/author/Author.vue'
import Recommondation from '@/components/recommondation/Recommondation.vue'
import Card from '@/components/card/Card.vue'
import GetStarted from '@/components/getstarted/GetStarted.vue'
import Category from '@/components/category/Category.vue'

import Resource from '@/mixins/resource'
import Constants from '@/config/constants'

import { AuthorBus } from '@/bus/AuthorBus'
import { SignInBus } from '@/bus/SignInBus'
import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { PaperBus } from '@/bus/PaperBus'

export default {
  name: 'post',
  data () {
    return {
      paperId: this.$route.params.paperId,
      authorName: this.$route.params.authorName,
      title: this.$route.params.title,
      paper: {},
      AuthorDetails: {},
      enableAuthorDetails: false,
      RecommondationDetails: {},
      enableRecommondationDetails: false,
      enableShare: false,
      shareData: {
        medalData: {}
      },
      footerData: {},
      popularCardData: [],
      popularCardMetadata: {
        title: 'Most Popular',
        moreHref: '/',
        homeHeader: false,
        displayClass: 'card-body-dg-recommondation',
        currentPaper: this.$route.params.paperId,
        edit: false,
        more: false
      },
      enablePopularCard: false,
      profileData: {},
      displayMostPopularRecommondation: false,
      currentUser: {},
      activateModeration: false
    }
  },
  components: {
    'share': Share,
    'author': Author,
    'recommondation': Recommondation,
    'card': Card,
    'getstarted': GetStarted,
    'category': Category
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
  created () {
    // event listner for current user data
    CurrentUserBus.$on('update-current-user', (payload) => {
      this.currentUser = payload.data
      var userData = payload.data
      if (userData.id) {
        if (userData.roles.indexOf('ROLE_ADMIN') > -1) {
          this.activateModeration = true
        }
      }
    })
    // Getting data and Building the page
    this.$http.get(Constants.END_POINT + '/post/' + this.paperId)
      .then(response => {
        this.paper = response.data
        // publishing current paper
        PaperBus.$emit('update-current-paper', response.data)
        // SEO Content
        Resource.setPageTitle(this.paper.title)
        Resource.setPageTags(this.paper.tags)
        Resource.setPageDescription(this.paper.shortDescription)
        Resource.setPageAuthor(this.paper.author)
        this.paper.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - this.paper.createdOn)))
        // preparing sharing data
        this.shareData.medalData = {
          id: this.paper.id,
          count: this.paper.likedBy,
          show: this.paper.likedBy > -1
        }
        this.enableShare = true
        // Getting Author Information
        this.$http.get(Constants.END_POINT + '/application-user/' + this.paper.authorId)
          .then(response => {
            // publishing current paper
            AuthorBus.$emit('update-current-author', response.data)
            this.AuthorDetails = response.data
            this.AuthorDetails.currentPaperTitle = this.paper.title
            this.enableAuthorDetails = true
            // prepare footer data
            this.footerData = {
              authorId: this.paper.authorId,
              authorName: this.paper.author,
              picture: this.AuthorDetails.profilePicture,
              linkToProfile: '/' + Resource.prepareStringForURL(this.paper.author) + '/' + this.paper.authorId,
              enable: true
            }
            // listner in footerBar component
            AuthorBus.$emit('FooterData', this.footerData)
          })
          .catch(e => { Resource.errorHandler(e, 'Author Information') })
        // Getting Recommondations
        this.$http.get(Constants.END_POINT + '/post/global/getLatestPostsByCategory/' + this.paper.category + '/5')
          .then(response => {
            this.RecommondationDetails = response.data
            this.RecommondationDetails.map(function (value, i) {
              var record = value
              var author = Resource.prepareStringForURL(record.author)
              var title = Resource.prepareStringForURL(record.title)
              record.url = '/paper/' + author + '/' + title + '/' + record.id
              record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 40)
              record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
              return record
            })
            this.enableRecommondationDetails = true
          })
          .catch(e => { Resource.errorHandler(e, 'Recommondation Information') })
        // Increment page view
        if (this.paper.moderated && this.paper.published) {
          this.$http.put(Constants.END_POINT + '/post/' + this.paperId + '/viewed')
          .then(response => {})
          .catch(e => { Resource.errorHandler(e, 'View Increment Information') })
        }
      })
      .catch(e => { Resource.errorHandler(e, 'Paper Information') })

    // Getting Recommondations
    this.$http.get(Constants.END_POINT + '/post/global/popular/0/4')
      .then(response => {
        this.popularCardData = response.data.content
        var pIds = []
        this.popularCardData.map(function (value, i) {
          var record = value
          var author = Resource.prepareStringForURL(record.author)
          var title = Resource.prepareStringForURL(record.title)
          record.url = '/paper/' + author + '/' + title + '/' + record.id
          record.shortDescription = Resource.getNWordsFromString(record.shortDescription, 50)
          record.timeAgo = Resource.timer(Resource.dhm(Math.abs(new Date() - record.createdOn)))
          pIds.push(record.authorId)
          return record
        })
        this.enablePopularCard = true
        this.$http.post(Constants.END_POINT + '/application-user/list', { ids: pIds })
          .then(response => {
            var profiles = response.data
            var profileData = {}
            profiles.map(function (value, i) {
              profileData[value['id']] = value
            })
            this.profileData = profileData
            this.popularCardMetadata.currentPaper = this.paperId
            this.displayMostPopularRecommondation = true
          })
          .catch(e => { Resource.errorHandler(e, 'Homepage -> Profile gathering information') })
      })
      .catch(e => { Resource.errorHandler(e, 'Homepage -> Latest Card Data') })
  },
  methods: {
    actionModerate: function (a, b) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/post/moderate', { id: a, moderated: b },
        {
          headers: {
            'authorization': token
          }
        })
      .then(response => {
        this.paper.moderated = b
      })
      .catch(e => { Resource.errorHandler(e, 'Homepage -> Profile gathering information') })
    }
  },
  mixins: [Resource]
}
</script>
