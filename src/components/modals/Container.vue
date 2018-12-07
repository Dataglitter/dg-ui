<style lang="scss" scoped> 
  @import "./Container.scss";
</style>
<template src="./Container.html">
</template>
<script>
import Login from '@/components/modals/login/Login.vue'
import GetStarted from '@/components/modals/getstarted/GetStarted.vue'
import EmailForm from '@/components/modals/emailform/EmailForm.vue'
import LoginSuccess from '@/components/modals/loginsuccess/LoginSuccess.vue'
import LogoutSuccess from '@/components/modals/logoutsuccess/LogoutSuccess.vue'
import SubscribeSuccess from '@/components/modals/subscribe/Subscribe.vue'
import BookmarkSuccess from '@/components/modals/bookmark/Bookmark.vue'
import PublishSuccess from '@/components/modals/publish/Publish.vue'
import UnPublishSuccess from '@/components/modals/unpublish/UnPublish.vue'
import DeleteSuccess from '@/components/modals/delete/Delete.vue'

export default {
  name: 'container',
  data () {
    return {
    }
  },
  components: {
    'login': Login,
    'get-started': GetStarted,
    'email-form': EmailForm,
    'login-success': LoginSuccess,
    'logout-success': LogoutSuccess,
    'subscribe-success': SubscribeSuccess,
    'bookmark-success': BookmarkSuccess,
    'publish-success': PublishSuccess,
    'un-publish-success': UnPublishSuccess,
    'delete-success': DeleteSuccess
  }
}
</script>