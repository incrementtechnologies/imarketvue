<template>
  <div class="marketplace-holder">
    <div class="product-holder">
      <div class="filter">
        <generic-filter 
          @search="retrieve">
        </generic-filter>
      </div>
      <div class="results">
        <products v-if="data !== null" :data="data" :listStyle="listStyle"></products> 
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
.product-holder .list{
    display: flex;
    flex-direction: column;
}
#attach-file {
  color: $primary;
  font-size: 7em;
  margin-right: 150p;
}
.modal-body {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.modal-body img {
  width: 40%;
  max-width: 150px;
}
.modal-body img:hover {
  cursor: pointer;
}
.divider {
  border-left: 1px solid rgba(0,0,0,0.2);
  height: 120px;
}
@media (max-width: 992px){
  .modal-body {
    flex-direction: column;
  }
  .divider {
    border-top: 1px solid rgba(0,0,0,0.2);
    width: 120px;
    height:1px;
    margin-bottom: 10px;
  } 
}
.modal-content {
    max-width: 700px;
    margin: 0 auto;
}
.btn-primary {
    background: #22b173;
    border-color: #22b173;
}
select.btn.btn-white {
    border-color: lightgrey;
}
button.btn.btn-primary.dropdown-toggle {
    min-height: 40px;
}

option {
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: .255em;
    vertical-align: .255em;
    content: "";
    border-top: .3em solid;
    border-right: .3em solid transparent;
    border-left: .3em solid transparent;
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
    'products': require('components/increment/imarketvue/marketplace/Products.vue'),
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
      console.log(filter)
      // let parameter = {
      //   condition: [{
      //     value: 'published',
      //     column: 'status',
      //     clause: '='
      //   }, {
      //     value: 'rental',
      //     column: 'type',
      //     clause: '='
      //   }, {
      //     value: filter ? filter.value + '%' : '%',
      //     column: 'tags',
      //     clause: 'like'
      //   }],
      //   start_date: filter ? filter.start_date : null,
      //   end_date: filter ? filter.end_date : null,
      //   account_id: this.user.userID,
      //   inventory_type: COMMON.ecommerce.inventoryType
      // }
      // $('#loading').css({display: 'block'})
      // this.APIRequest('products/retrieve_basic', parameter).then(response => {
      //   $('#loading').css({display: 'none'})
      //   if(response.data.length > 0){
      //     this.data = response.data
      //   }
      // })
    }
  }
}
</script>
