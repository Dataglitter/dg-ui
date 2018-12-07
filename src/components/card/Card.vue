<style lang="scss" scoped>
  @import "./Card.scss";
</style>
<template src="./Card.html">
</template>
<script>
import Resource from '@/mixins/resource'
import Constants from '@/config/constants'

export default {
  props: ['CardData', 'CardMetadata', 'ProfileData'],
  name: 'Card',
  data () {
    return {
    }
  },
  methods: {
    routeToEdit: function (id) {
      this.$router.push('/edit/paper/' + id)
    },
    publishPaper: function (id) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/post/' + id + '/publish', {}, {
        headers: {
          'authorization': token
        }
      })
      .then(response => {
        var resp = response.data
        this.CardData.map(function (value, i) {
          if (value.id === id) {
            value.published = resp
          }
          return value
        })
        this.$forceUpdate()
        this.$modal.show('publish-success')
      })
      .catch(e => { Resource.errorHandler(e, 'Publish Paper') })
    },
    unPublishPaper: function (id) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.put(Constants.END_POINT + '/post/' + id + '/un-publish', {}, {
        headers: {
          'authorization': token
        }
      })
      .then(response => {
        var resp = response.data
        this.CardData.map(function (value, i) {
          if (value.id === id) {
            value.published = resp
          }
          return value
        })
        this.$forceUpdate()
        this.$modal.show('un-publish-success')
      })
      .catch(e => { Resource.errorHandler(e, 'UnPublish Paper') })
    },
    deletePaper: function (id) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      this.$http.delete(Constants.END_POINT + '/post/' + id, {
        headers: {
          'authorization': token
        }
      })
      .then(response => {
        var itemNo
        this.CardData.map(function (value, i) {
          if (value.id === id) {
            itemNo = i
          }
        })
        this.CardData.splice(itemNo, 1)
        this.$forceUpdate()
        this.$modal.show('delete-success')
      })
      .catch(e => { Resource.errorHandler(e, 'UnPublish Paper') })
    }
  }
}
</script>