import Vue from 'vue'
import VeeValidate from 'vee-validate'  // http://vee-validate.logaretm.com/
import VueIziToast from 'vue-izitoast'  // https://github.com/arthurvasconcelos/vue-izitoast
import '../../node_modules/izitoast/dist/css/iziToast.min.css'

Vue.use(VeeValidate)
Vue.use(VueIziToast)

export default {
    // Validates form and toasts message if found error.
    // @param context: The parent context to access toast class[mandatory].
    // @param callBackFunction: Execute call back function if entries are valid.
  validateBeforeSubmit: function (context, callBackFunction) {
    context.callBackFunction = callBackFunction
    context.$validator.validateAll().then((result) => {
      if (result) {
        context.callBackFunction()
        // context.$toast.success('Successfully inserted record!', 'OK', {position: 'bottomCenter'})
      } else {
        let arrFileds = context.$validator.fields.items.map((v, i) => { return v.name })
        let errString = arrFileds.join(' , ') + (arrFileds.length > 1 ? ' are mandatory' : ' is mandatory')
        context.$toast.error(errString, 'error', {position: 'bottomCenter'})
      }
    })
  },

  // shows toast message animation
  // @param context The parent context to access toast class[mandatory].
  // @param msg The message content to be toasted.
  // @param msgType Title of message toast.
  // @param position position of message toast animation.
  // @return The area of the circle.
  toastMessage: function (context, msg, msgType = 'show', position = 'bottomCenter') {
    context.$toast[msgType.toLowerCase()](msg, msgType.toUpperCase(), {position})
  },

  confirmDialog: function (context, msg, callBackConfirm) {
    let question = {
      timeout: 20000,
      close: false,
      overlay: true,
      toastOnce: true,
      id: 'question',
      zindex: 999,
      position: 'center',
      buttons: [
        ['<button><b>YES</b></button>', function (instance, toast) {
          callBackConfirm()
          instance.hide({
            transitionOut: 'fadeOut'
          }, toast, 'button')
        }, true],
        ['<button>NO</button>', function (instance, toast) {
          instance.hide({
            transitionOut: 'fadeOut'
          }, toast, 'button')
        }]
      ],
      onClosing: function (instance, toast, closedBy) {
        console.info('Closing | closedBy: ' + closedBy)
      },
      onClosed: function (instance, toast, closedBy) {
        console.info('Closed | closedBy: ' + closedBy)
      }
    }
    context.$toast.question(msg, '', question)
  }
}
