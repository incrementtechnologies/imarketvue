<template>
  <div v-if="data !== null">
    <div class="product-item-holder">
      <div class="product-image">
        <img :src="config.BACKEND_URL + selectedImage" class="main-image" v-if="selectedImage !== null">
        <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image" v-if="selectedImage === null && data.featured !== null">
        <i class="fa fa-image" v-if="selectedImage === null && data.featured === null"></i>
       <div class="images-holder" v-if="data.images !== null">
        <div v-for="(item, index) in data.images" :key="index" class="image-item" @click="selectImage(item.url)">
          <img :src="config.BACKEND_URL + item.url" class="other-image">
          <div class="overlay"></div>
        </div>
       </div>
      </div>
      <div class="product-details">
        <div class="product-title">
          <h3>{{data.title}}</h3>
        </div>
         <div class="product-row" v-if="data.merchant !== null">
          <label>
            By {{data.merchant.name}}
          </label>
        </div>
        <div class="product-row text-primary" v-if="data.price !== null">
          <label v-if="data.price.length === 1">
            {{currency.displayWithCurrency(data.price[0].price, data.price[0].currency)}}{{data.price[0].label ? ' per ' + data.price[0].label : ''}}
          </label>
        </div>
        <div class="product-row-tags" v-if="data.tags !== null && data.tag_array !== null">
          <label style="width: 15%;">Tags</label>
          <label class="tag-label" v-for="(item, index) in data.tag_array" :key="index">{{item.title}}</label>
        </div>
        <div class="product-row-rating">
          <ratings :payload="'product'" :payloadValue="data.id"></ratings>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
  .title{
    width: 100%;
    float: left;
    font-size: 16px;
    margin-top: 25px;
  }
  .product-item-holder{
    width: 100%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
  }
  .product-image{
    width: 100%;
    float: left;
    min-height: 410px;
    overflow-y: hidden;
    text-align: center;
  }
  .product-image .main-image{
    height: 350px;
    max-width: 100%;
  }
  .product-image .fa-image{
    font-size: 250px;
    line-height: 350px;
  }
  .product-image .image-item{
    height: 60px;
    float: left;
    width: 80px;
    text-align: center;
  }
  .product-image .other-image{
    height: 60px;
    max-width: 80px;
  }
  .product-image .image-item:hover{
    cursor: pointer;
    background: #ffaa81;
  }
  .images-holder .overlay{
    height: 60px;
    z-index: 2;
    width: 80px;
    margin-top: -60px;
    float: left;
    background: rgba(0, 0, 0, 0);
  }
  .images-holder{
    width: 100%;
    float: left;
    min-height: 60px;
    overflow-y: hidden;
  }
  .product-details{
    min-height: 50px;
    width: 100%;
    float: left;
    overflow-y: hidden;
  }
  .product-title{
    width: 100%;
    float: left;
    min-height: 20px;
    overflow-y: hidden;
  }
  .product-row{
    width: 100%;
    float: left;
    min-height: 20px;
    overflow-y: hidden;
    font-weight: 600;
    line-height: 40px;
  }

  .product-date{
    width: 100%;
    float: left;
    min-height: 20px;
    overflow-y: hidden;
    line-height: 40px;
    padding: 5px;
  }
  .product-row-rating{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    line-height: 40px;
  }
  .product-row label{
    float: left;
    width: 100%;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .product-row-tags label{
    float: left;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .tag-label{
    height: 35px;
    line-height: 35px;
    background: #ffaa81;
    padding-left: 10px;
    padding-right: 10px;
    color: #fff;
    margin-right: 5px;
    border-radius: 5px;
    margin-top: 2px;
  }
  .product-more-details{
    width: 100%;
    float: left;
    margin-bottom: 100px;
    min-height: 50px;
    overflow-y: hidden;
    border-top: solid 1px #ffaa81;
  }
  .product-more-details .details-holder{
    width: 60%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
    margin-top: 25px;
  }
  .product-menu{
    list-style: none;
    padding: 0px;
    margin: 0;
    width: 60%;
    margin-right: 40%;
    float: left;
    color: #fff;
  }
  .product-menu li{
    height: 50px;
    float: left;
    width: 25%;
    line-height: 50px;
    padding-left: 10px;
    font-weight: 600;
    border-right: solid 1px #fff;
    background: #ffaa81;
  }
  .product-menu li:hover{
    cursor: pointer;
    color: #000;
  }
  .menu-active{
    color: #000;
  }
  .show-prices:hover{
    cursor: pointer;
    color: #ffaa81;
  }

  .mx-datepicker,
  .mx-input-wrapper {
    width: unset;
    position: unset;
    display: unset;
  }

  .product-date label{
    width: 100%;
    float: left;
  }

  .inputs{
    margin-right: 1%;
    width: 49%;
    float: left;
    position: relative;
  }

  .input-holder{
    overflow-y: hidden;
    border-color: #ccc;
    width: 100%;
    float: left;
    border: solid 1px #eee;
    padding: 5px;
    height: 60px;
  }


  @media (max-width: 991px){
    .product-details, .product-image{
      width: 100%;
    }
    .product-row label{
      width: 25%;
    }
    .product-menu, .product-more-details .details-holder{
      width: 100%;
    }

  }
  button.btn.btn-primary.two {
    min-width: 133px;
}

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import CURRENCY from 'src/services/currency.js'
import axios from 'axios'
import COMMON from 'src/common.js'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
  mounted(){
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      prevMenuIndex: 0,
      selectedImage: null,
      currency: CURRENCY,
      data: null,
      common: COMMON
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    DatePicker
  },
  props: ['code', 'startDate', 'endDate'],
  methods: {
    beforeToday(date){
      return date < new Date()
    },
    afterStart(date){
      let newDate = new Date(this.startDate)
      newDate.setDate(newDate.getDate() - 1)
      return date < newDate
    },
    afterStartTime(date){
      let newDate = new Date(this.startDate)
      return date <= newDate
    },
    selectImage(url){
      this.selectedImage = url
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: 'published',
          column: 'status',
          clause: '='
        }, {
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType
      }
      this.APIRequest('products/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.data = response.data[0]
        }else{
          this.data = null
        }
      })
    }
  }
}
</script>
