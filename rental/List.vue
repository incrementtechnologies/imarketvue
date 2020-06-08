<template>
  <div class="marketplace-holder">
    <div class="product-holder">
      <div class="filter">
        <generic-filter 
          @search="retrieve">
        </generic-filter>
      </div>
      <div class="results">
        <products v-if="data !== null" :data="data"></products> 
        <dynamic-empty v-if="data === null" :title="'No products yet!'" :action="'Please be back soon.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></dynamic-empty>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.marketplace-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 50px;
}
.product-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-top: 25px;
}

.filter{
  width: 100%;
  float: left;
  overflow-y: hidden;
}
.product-holder .results{
  width: 100%;
  font-size: left;
  min-height: 10px;
  overflow-y: hidden;
  float: left;
}

@media (max-width: 992px){
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      common: COMMON
    }
  },
  components: {
    'products': require('components/increment/imarketvue/rental/Products.vue'),
    'dynamic-empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'generic-filter': require('components/increment/imarketvue/rental/Filter.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
      if(parameter === 'editor/v2'){
        AUTH.mode = 1
      }
    },
    retrieve(filter = null){
      let parameter = {
        category: filter ? filter.category : '',
        location: filter ? filter.location : '',
        start_date: filter ? filter.start_date : null,
        end_date: filter ? filter.end_date : null
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/search', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }
      })
    }
  }
}
</script>
