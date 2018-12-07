<style lang="scss" scoped> 
  @import "./WritePaper.scss";
</style>
<template src="./WritePaper.html">
</template>
<script>
import Constants from '@/config/constants'
import Strings from '@/config/Strings'
import Resource from '@/mixins/resource'
import Common from '@/mixins/common'

import { CurrentUserBus } from '@/bus/CurrentUserBus'
import { SignInBus } from '@/bus/SignInBus'

export default {
  name: 'myspace',
  data () {
    return {
      paperId: this.$route.params.paperId,
      currentUser: {},
      userData: {},
      paper: {},
      enableDisplay: false,
      profilePicBase64: null,
      newTag: '',
      editorUpload: this.editorPicUpload,
      tinyOptions: {
        'height': 750,
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: this.editorUploadHandler
      },
      categories: Strings.CATEGORIES
    }
  },
  methods: {
    savePaper: function () {
      // declaring callbackfunction and calling it once form validation returns true
      let callBackFunction = () => {
        if (this.currentUser.id === this.paper.authorId) {
          var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
          this.paper.published = false
          this.paper.moderated = false
          var data = {
            published: this.paper.published,
            moderated: this.paper.moderated,
            author: this.paper.author,
            authorId: this.paper.authorId,
            category: this.paper.category,
            content: this.paper.content,
            coverImage: this.paper.coverImage,
            createdOn: this.paper.createdOn,
            id: this.paper.id,
            likedBy: this.paper.likedBy,
            sharedBy: this.paper.sharedBy,
            shortDescription: this.paper.shortDescription,
            tags: this.paper.tags,
            title: this.paper.title,
            viewedBy: this.paper.viewedBy
          }
          var instance = this
          this.$http.put(Constants.END_POINT + '/post', data, {
            headers: {
              'authorization': token
            }
          }).then(function (response) {
            instance.paper = response.data
            instance.$forceUpdate()
            Common.toastMessage(instance, Constants.TOAST.SUCCESSFULLY_SAVED, 'success')
          })
          .catch(e => {
            Common.toastMessage(instance, Constants.TOAST.SOMETHING_WENT_WRONG, 'error')
            Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG)
          })
        }
      }
      Common.validateBeforeSubmit(this, callBackFunction)
    },
    getPaper: function (id) {
      this.$http.get(Constants.END_POINT + '/post/' + id)
        .then(response => {
          this.paper = response.data
          this.enableDisplay = true
          this.$forceUpdate()
        })
        .catch(e => { Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG) })
    },
    uploadImage: function (file) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      const fd = new FormData()
      fd.append('file', file, file.name)
      var instance = this
      this.$http.post(Constants.END_POINT + '/post/upload', fd, {
        headers: {
          'authorization': token
        },
        mimeType: 'multipart/form-data'
      }).then(function (response) {
        instance.paper.coverImage = Constants.POST_IMAGES_ENDPOINT + response.data.location
        instance.$forceUpdate()
        Common.toastMessage(instance, Constants.TOAST.IMAGE_SUCESSFULLY_UPLOADED, 'success')
      })
      .catch(e => {
        Common.toastMessage(instance, Constants.TOAST.SOMETHING_WENT_WRONG, 'error')
        Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG)
      })
    },
    editorPicUpload: function (file, cb) {
      var token = this.$session.get(Constants.DATAGLITTER_AUTH_TOKEN)
      const fd = new FormData()
      fd.append('file', file, file.name)
      var instance = this
      this.$http.post(Constants.END_POINT + '/post/upload', fd, {
        headers: {
          'authorization': token
        },
        mimeType: 'multipart/form-data'
      }).then(function (response) {
        // eslint-disable-next-line
        cb(Constants.POST_IMAGES_ENDPOINT + response.data.location, { title: response.data.location })
      })
      .catch(e => {
        Common.toastMessage(instance, Constants.TOAST.SOMETHING_WENT_WRONG, 'error')
        Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG)
      })
    },
    editorUploadHandler: function (cb, value, meta) {
      var uploader = this.$data.editorUpload
      var input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.onchange = function () {
        uploader(this.files[0], cb)
      }
      input.click()
    },
    onFileChange: function (e) {
      var files = e.target.files || e.dataTransfer.files
      let file = files[0]
      let isFileLarger = file.size > 10485760 // 10 MB
      let isFileValid = !file.type.includes('image')
      if (!files.length || isFileLarger || isFileValid) {
        let errMsgLarge = 'File size exceeds 10 MB'
        let errMsgInvalidFile = ' Inavlid file type'
        let errMsg = (isFileLarger && isFileValid) ? errMsgLarge + errMsgInvalidFile : (isFileLarger ? errMsgLarge : (isFileValid ? errMsgInvalidFile : ''))
        Common.toastMessage(this, errMsg, 'error')
        return
      }
      this.uploadImage(file)
    },
    addTag: function () {
      if (this.newTag.trim() === '') {
        Common.toastMessage(this, Constants.TOAST.CANT_ADD_EMPTY_TAG, 'error')
        return
      }
      this.paper.tags.push(this.newTag)
      this.newTag = ''
    },
    removeTag: function (currTag) {
      this.paper.tags.splice(this.paper.tags.indexOf(currTag), 1)
    },
    changed: function (editor, content) {
      console.log(editor, content)
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
          Resource.errorHandler(e, Constants.TOAST.SOMETHING_WENT_WRONG)
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
    this.getPaper(this.paperId)
  }
}
</script>
