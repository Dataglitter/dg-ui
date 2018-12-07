import Vue from 'vue'
import VueRouter from 'vue-router'
import Paper from '@/components/paper/Paper.vue'
import Home from '@/components/home/Home.vue'
import Profile from '@/components/profile/Profile.vue'
import Setting from '@/components/setting/Setting.vue'
import MySpace from '@/components/myspace/MySpace.vue'
import Moderation from '@/components/moderation/Moderation.vue'
import WritePaper from '@/components/writepaper/WritePaper.vue'
import TermsOfService from '@/components/termsofservice/TermsOfService.vue'
import PrivacyPolicy from '@/components/privacypolicy/PrivacyPolicy.vue'
import AuthorOverview from '@/components/authoroverview/AuthorOverview.vue'
import CategoryOverview from '@/components/categoryoverview/CategoryOverview.vue'
import Credits from '@/components/credits/Credits.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/paper/:authorName/:title/:paperId',
      name: 'paper',
      component: Paper
    },
    {
      path: '/profile/:userId',
      name: 'profile',
      component: Profile
    },
    {
      path: '/settings',
      name: 'settings',
      component: Setting
    },
    {
      path: '/termsOfService',
      name: 'termsOfService',
      component: TermsOfService
    },
    {
      path: '/privacyPolicy',
      name: 'privacyPolicy',
      component: PrivacyPolicy
    },
    {
      path: '/credits',
      name: 'credits',
      component: Credits
    },
    {
      path: '/moderation',
      name: 'moderation',
      component: Moderation
    },
    {
      path: '/myspace/:userId',
      name: 'myspace',
      component: MySpace
    },
    {
      path: '/edit/paper/:paperId',
      name: 'writepaper',
      component: WritePaper
    },
    {
      path: '/:authorName/:authorId',
      name: 'authoroverview',
      component: AuthorOverview
    },
    {
      path: '/:category',
      name: 'categoryoverview',
      component: CategoryOverview
    }
  ],
  mode: 'history'
})
