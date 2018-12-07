<style lang="scss">
  @import "./App.scss";
</style>
<template src="./App.html">
</template>
<script>
import Icons from '@/assets/icons/Icons.vue'
import TopNav from '@/components/topnav/TopNav.vue'
import FooterBar from '@/components/footer/FooterBar.vue'
import Container from '@/components/modals/Container.vue'

import Constants from '@/config/constants'
import Resource from '@/mixins/resource'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { BookmarkBus } from '@/bus/BookmarkBus'
import { SubscribeBus } from '@/bus/SubscribeBus'
import { PaperBus } from '@/bus/PaperBus'
import { AuthorBus } from '@/bus/AuthorBus'

export default {
  name: 'app',
  data () {
    return {
      currentUser: {},
      currentPaper: {},
      currentAuthor: {}
    }
  },
  components: {
    'icons': Icons,
    'top-nav': TopNav,
    'footer-bar': FooterBar,
    'modal-container': Container
  },
  methods: {
    addBookmark: function (bookmarkData) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/application-user/add-bookmark', bookmarkData, {
        headers: {
          'authorization': token
        }
      })
      .then(response => {
        this.currentUser.bookmarks.push(response.data.postId)
        CurrentUserBus.$emit('update-current-user', this.currentUser)
        this.$modal.show('bookmark-success')
      })
      .catch(e => { Resource.errorHandler(e, 'Add Bookmark') })
    },
    addFollower: function (followerData) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/application-user/add-follower', followerData, {
        headers: {
          'authorization': token
        }
      })
      .then(response => {
        this.currentAuthor.followers.push(response.data.followerId)
        AuthorBus.$emit('update-current-author', this.currentAuthor)
        this.$modal.show('subscribe-success')
      })
      .catch(e => { Resource.errorHandler(e, 'Add Bookmark') })
    }
  },
  created () {
    CurrentUserBus.$on('update-current-user', (currentUser) => {
      if (currentUser.save) {
        this.currentUser = currentUser.data
      }
      CurrentUserBus.$emit('publish-current-user', this.currentUser)
      this.$forceUpdate()
    })
    PaperBus.$on('update-current-paper', (currentPaper) => {
      this.currentPaper = currentPaper
      this.$forceUpdate()
    })
    AuthorBus.$on('update-current-author', (currentAuthor) => {
      this.currentAuthor = currentAuthor
      this.$forceUpdate()
    })
    BookmarkBus.$on('add-bookmark', (bookmarkData) => {
      if (this.$session.exists()) {
        if (this.currentUser.bookmarks.indexOf(this.currentPaper.id) < 0) {
          if (this.currentUser.id !== this.currentAuthor.id && this.currentAuthor.id !== null) {
            if (this.currentUser.id && this.currentPaper.id) {
              bookmarkData.id = this.currentUser.id
              bookmarkData.postId = this.currentPaper.id
              this.addBookmark(bookmarkData)
              this.currentUser.bookmarks.push(this.currentPaper.id)
            }
          }
        } else {
          this.$modal.show('bookmark-success')
        }
      } else {
        this.$modal.show('get-started')
      }
    })
    SubscribeBus.$on('add-follower', (followerData) => {
      if (this.$session.exists()) {
        if (this.currentAuthor.followers.indexOf(this.currentUser.id) < 0) {
          if (this.currentUser.id !== this.currentAuthor.id && this.currentPaper.id !== null) {
            if (this.currentUser.id && this.currentAuthor.id) {
              followerData.id = this.currentAuthor.id
              followerData.followerId = this.currentUser.id
              this.addFollower(followerData)
              this.currentAuthor.followers.push(this.currentUser.id)
            }
          }
        } else {
          this.$modal.show('subscribe-success')
        }
      } else {
        this.$modal.show('get-started')
      }
    })
  }
}
</script>
