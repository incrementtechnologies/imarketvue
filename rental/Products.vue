<template>
  <div v-if="data !== null">
      <div class="product-holder" v-for="(item, index) in data" :key="index"> 
        <div class="product-image">
          <img :src="config.BACKEND_URL + item.featured[0].url" v-if="item.featured !== null">
          <i class="fas fa-image" v-else></i>
        </div> 

        <div class="product-details">
          <div class="product-title">
            <span class="item title">
              {{item.title}}
            </span>
            <span class="item">
              <ratings :payload="'product'" :payloadValue="item.id"></ratings>
            </span>
            <span class="item" v-if="item.location !== null">
              <i class="fas fa-map-marker-alt"></i>
              {{item.location.locality + ', ' + item.location.country}}
            </span>
          </div>
        </div>

        <div class="product-rate">
          <span class="label">
            Rate
          </span>
          <span class="price text-uppercase title">
            {{currency.displayWithCurrency(item.price[0].price, item.price[0].currency)}} {{item.price[0].label ? 'per ' + item.price[0].label : ''}}
          </span>
          <span class="item">
            <button class="btn btn-primary text-uppercase" style="margin: 10px !important;" @click="redirect('/rental/booking/' + item.code + '/' + filter.start_date + '/' + filter.end_date)">
              VIEW DETAILS
            </button>
          </span>
        </div>
      </div>
  </div>
  
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
  .product-holder{
    float: left;
    margin-right: 1%;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border: solid 1px #f2f2f2;
    border-bottom: solid 10px #f2f2f2;
    margin-bottom: 10px;
    color: #555;
    margin-top: 0px;
    margin-bottom: 25px;
  }
  
  .product-holder:hover{
    cursor: pointer;
    border-bottom: solid 10px $primary;
  }

  .product-image{
    width: 20%;
    float: left;
    position: relative;
    text-align: center;
    min-height: 50px;
    overflow-y: hidden;
  }

  .product-image img{
    height: auto;
    width: 100%;
  }
  .product-image .fa-image{
    font-size: 150px;
    line-height: 250px;
  }

  .product-details{
    min-height: 50px;
    width: 50%;
    float: left;
    overflow-y: hidden;
  }

  .product-details .item{
    width: 100%;
    line-height: 45px;
    float: left;
  }

  .title{
    font-size: 16px;
  }

  .product-rate{
    min-height: 50px;
    width: 30%;
    float: left;
    overflow-y: hidden;
    border-left: solid 1px #f2f2f2;
    border-bottom: solid 1px #f2f2f2;
  }

  .product-rate .label{
    line-height: 45px;
    text-align: center;
    width: 100%;
    float: left;
    background: $primary;
    color: $white;
  }

  .product-rate .price{
    line-height: 100px;
    text-align: center;
    width: 100%;
    float: left;
    color: $primary;
  }

  @media (max-width: 991px){
  }
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import CURRENCY from 'src/services/currency.js'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      total: 0,
      avg: 0,
      stars: 0,
      status: true,
      currency: CURRENCY,
      common: COMMON
    }
  },
  props: ['data', 'filter'],
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'generic-filter': require('components/increment/imarketvue/marketplace/Filter.vue'),
    'installemnt-label': require('components/increment/imarketvue/installment/labelMarketplace.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    addToWishlist(id){
      let parameter = {
        payload: 'product',
        payload_value: id,
        account_id: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('wishlists/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.$parent.retrieve()
      })
    }
  }
}
</script>
