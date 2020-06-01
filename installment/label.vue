<template>
  <div>
    <span class="installment-holder text-uppercase">
      {{data.interest}}% interest rate for {{data.months}} {{data.months > 1 ? 'months' : 'month'}} of installment
    </span>
    <span class="installment-holder">
      Requirements:
      <label v-for="(item, index) in requirements" :index="index">{{item.title}}{{
        index === requirements.length - 1 ? '' : ', '
      }}</label>
    </span>
  </div>
</template>
<style scoped>
.installment-holder{
  width: 100%;
  float: left;
  line-height: 30px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    let requirements = this.data.requirements.split(',')
    for (var i = 0; i < requirements.length; i++) {
      let payload = requirements[i]
      for (var j = 0; j < COMMON.requirementOptions.length; j++) {
        let item = COMMON.requirementOptions[j]
        if(item.payload === payload){
          this.requirements.push(item)
        }
      }
    }
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      requirements: []
    }
  },
  props: ['data'],
  methods: {
  }
}
</script>
