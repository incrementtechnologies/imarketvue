<template>
  <div class="marketplace-holder">
    <div class="product-holder">
      <div class="filter">
        <generic-filter 
          @search="retrieve">
        </generic-filter>
      </div>
      <div class="results">
        <products v-if="data !== null" :data="data" :filter="filter"></products> 
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
    this.retrieve(null)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      common: COMMON,
      filter: null
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
    retrieve(filter){
      if(filter === null || (filter !== null && (filter.category === null || filter.location === null || filter.start_date === null || filter.end_date === null))){
        return
      }
      this.filter = filter
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/search', filter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
