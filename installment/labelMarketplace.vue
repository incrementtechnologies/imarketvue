<template>
  <label style="padding-bottom: 5px;">
    <i>{{data.interest}}% interest rate for {{data.months}} {{data.months > 1 ? 'months' : 'month'}} of installment</i>
  </label>
</template>
<style scoped>
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG
    }
  },
  props: ['data'],
  methods: {
  }
}
</script>
