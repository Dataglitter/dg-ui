<style lang="scss" scoped> 
  @import "./Recommondation.scss";
</style>
<template src="./Recommondation.html">
</template>
<script>
export default {
  props: ['RecommondationDetails', 'CurrentPaper'],
  name: 'Recommondation',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>