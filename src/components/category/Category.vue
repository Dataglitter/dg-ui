<style lang="scss" scoped>
  @import "./Category.scss";
</style>
<template src="./Category.html">
</template>
<script>
import Strings from '@/config/Strings'

export default {
  name: 'Category',
  data () {
    return {
      categories: Strings.CATEGORIES
    }
  }
}
</script>