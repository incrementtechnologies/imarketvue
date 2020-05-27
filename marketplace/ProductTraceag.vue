<template>
  <div v-if="data !== null">
    <div class="title" v-if="status === 'preview'">
      <b @click="redirect('/product/edit/' + data.code)">
        <label class="text-primary action-link">Back</label>
      </b>
    </div>
    <div class="title" v-if="status !== 'preview'">
      <b @click="redirect('/marketplace')">
        <label class="text-primary action-link">Marketplace</label>
      </b>
      <label class="text-primary">/ {{data.title}}</label>
    </div>
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
        <div class="product-row" v-if="errorMessage !== null">
          <span class="alert alert-danger">
            {{errorMessage}}
          </span>
        </div>
        <div class="product-row" v-if="data.price !== null && data.price.length > 1 && priceFlag === true">
          <table class="table table-bordered">
            <thead>
              <tr>
                <td>Minimum</td>
                <td>Maximum</td>
                <td>Price</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data.price" :key="index">
                <td>{{item.minimum}}</td>
                <td>{{item.maximum}}</td>
                <td>PHP {{item.price}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="product-row" v-if="data.variation !== null">
          <span>{{data.variation[0].payload_value}} {{data.variation[0].payload}}</span>
        </div>
        <div class="product-row" v-if="data.sku !== null && data.sku !== ''">
          <label>Sku</label>
          <label class="text-danger"><i>{{data.sku}}</i></label>
        </div>
        <div class="product-row-tags" v-if="data.tags !== null && data.tag_array !== null">
          <label>Tags</label>
          <label class="tag-label" v-for="(item, index) in data.tag_array" :key="index">{{item.title}}</label>
        </div>
        <div class="product-row" v-if="data.merchant !== null">
          <span>{{data.merchant.name}}</span>
        </div>
        <div class="product-row" v-if="data.merchant !== null">
          <span>{{data.merchant.website}}</span>
        </div>
      </div>
    </div>
    <div class="product-more-details">
      <div class="pagination-holder">
        <ul class="product-menu"> <!--  do dis --> 
          <li v-for="(item, index) in productMenu" :key="index" v-bind:class="{'menu-active': item.flag === true}" class="" @click="selectMenu(index)">{{item.title}}</li>
        </ul>
      </div>
      <div class="details-holder" v-if="prevMenuIndex === 0">
        <label>
          <label v-html="data.description"></label>
        </label>
      </div>
      <div class="details-holder" v-if="prevMenuIndex === 1">
        <label>Shippings</label>
      </div>
      <div class="details-holder" v-if="prevMenuIndex === 2">
        <product-comments :payloadValue="data.id" :payload="'product'" :load="true"></product-comments>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .title{
    width: 100%;
    float: left;
    font-size: 16px;
  }
  .product-item-holder{
    width: 100%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
  }
  .product-image{
    width: 40%;
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
    width: 58%;
    margin-left: 2%;
    float: left;
    overflow-y: hidden;
  }
  .product-title{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .product-row{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-weight: 600;
    font-size: 16px;
    line-height: 40px;
  }
  .product-row-tags{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-weight: 600;
    line-height: 40px;
  }
  .product-row-rating{
    width: 100%;
    float: left;
    min-height: 40px;
    overflow-y: hidden;
    font-size: 16px;
    line-height: 40px;
  }
  .product-row label{
    float: left;
    width: 15%;
    margin-top: 0px;
    margin-bottom: 0px;
  }
  .qty-input{
    width: 50px;
    height: 40px;
    float: left;
    border-radius: 5px;
    border: solid 1px #ffaa81;
    text-align: center !important;
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
  .attribute{
    width: 50px;
    height: 36px;
    float: left;
    margin-top: 2px;
    margin-bottom: 2px;
    border-radius: 5px;
    margin-right: 5px;
    line-height: 36px;
  }

  .active-color{
    border: solid 2px #ffaa81;
  }

  .attribute-flexible{
    width: auto;
    padding-right: 10px;
    padding-left: 10px;
    border: solid 1px #ffaa81;
  }
  .attribute:hover{
    cursor: pointer;
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
      code: this.$route.params.code,
      status: this.$route.params.status,
      productMenu: [
        {title: 'Details', flag: true}
        // {title: 'Supplier', flag: false},
        // {title: 'Shippings', flag: false},
        // {title: 'Reviews', flag: false}
      ],
      prevMenuIndex: 0,
      selectedImage: null,
      qty: 1,
      priceFlag: false,
      activeSize: null,
      activeColor: null,
      currency: CURRENCY,
      productCode: null
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'product-comments': require('components/increment/generic/comment/Comments.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    selectMenu(index){
      if(this.prevMenuIndex !== index){
        this.productMenu[this.prevMenuIndex].flag = false
        this.productMenu[index].flag = true
        this.prevMenuIndex = index
      }
    },
    selectImage(url){
      this.selectedImage = url
    },
    retrieve(){
      let parameter = null
      if(this.status === 'preview'){
        parameter = {
          condition: [{
            value: this.code,
            column: 'code',
            clause: '='
          }],
          account_id: this.user.userID,
          inventory_type: COMMON.ecommerce.inventoryType
        }
      }else{
        parameter = {
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
          inventory_type: COMMON.ecommerce.inventoryType
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
        }
      })
    }
  }
}
</script>
