<template>
  <div v-if="data !== null">
    <div class="title" v-if="status === 'preview'">
      <b @click="redirectBack()">
        <label class="text-primary action-link">Back</label>
      </b>
    </div>
    <div class="title" v-if="status !== 'preview'">
      <b @click="redirectBack()">
        <label class="text-primary action-link">Marketplace</label>
      </b>
      <label class="text-primary">/ {{data.title}}</label>
    </div>
    <div class="product-item-holder">
      <div class="product-image">
        <img :src="config.BACKEND_URL + selectedImage" class="main-image" v-if="selectedImage !== null && getFileType(selectedImage) === 'img'">
        <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image" v-if="selectedImage === null && data.featured !== null && getFileType(data.featured[0].url) === 'img'">
        <b-embed
        type="iframe"
        v-else-if="data.featured !== null && getFileType(selectedImage) === 'vid'"
        aspect="16by9"
        :src="config.BACKEND_URL + selectedImage"
        allowfullscreen
        ></b-embed>
        <i class="fa fa-image" v-if="selectedImage === null && data.featured === null"></i>
       <div class="images-holder" v-if="data.images !== null">
        <div v-for="(item, index) in data.images" :key="index" class="image-item" @click="selectImage(item.url)">
          <img :src="config.BACKEND_URL + item.url" class="other-image" v-if="getFileType(config.BACKEND_URL + item.url) === 'img'">
          <b-embed
          type="video"
          v-else-if="getFileType(config.BACKEND_URL + item.url) === 'vid'"
          aspect="16by9"
          :src="config.BACKEND_URL + item.url"
          allowfullscreen
          ></b-embed>
          <div class="overlay"></div>
        </div>
       </div>
      </div>
      <div class="product-details">
        <div class="product-title">
          <h3>{{data.title}}</h3>
        </div>
        <div class="product-row" v-if="data.checkout_flag === true">
          <span class="alert alert-success">
            This product was added to your cart. Proceed to checkout now!
          </span>
        </div>
        <div class="product-row" v-if="errorMessage !== null">
          <span class="alert alert-danger">
            {{errorMessage}}
          </span>
        </div>
        <div class="product-row text-primary" v-if="data.price !== null">
          <label v-if="data.price.length === 1">{{currency.displayWithCurrency(data.price[0].price, data.price[0].currency)}}</label>
          <label v-if="data.price.length > 1">{{data.price[0].currency}} {{data.price[0].price + ' - ' + data.price[data.price.length - 1].price}}</label>
          <i class="fa fa-chevron-down show-prices" style="padding-left: 20px;" @click="showPrice(true)" v-if="data.price.length > 1 && priceFlag === false"></i>
          <i class="fa fa-chevron-up show-prices" style="padding-left: 20px;" @click="showPrice(false)" v-if="data.price.length > 1 && priceFlag === true"></i>
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
        <div class="product-row" v-if="data.color !== null">
          <label>Color</label>
          <span v-for="(item, index) in data.color" :key="index" v-bind:style="{background: item.payload_value}" class="attribute" v-bind:class="{'active-color': activeColor === item.payload_value}" @click="activeColor = item.payload_value"></span>
        </div>
        <div class="product-row" v-if="data.size !== null">
          <label>Size</label>
          <span class="attribute attribute-flexible" v-for="(item, index) in data.size" :key="index" v-bind:class="{'bg-primary': activeSize === item.payload_value}" @click="activeSize = item.payload_value">{{item.payload_value}}</span>
        </div>
        <div class="product-row" v-if="parseInt(data.qty) > 0">
          <label>Quantity</label>
          <select class="qty-input" v-model="qty">
            <option v-for="(i, index) in parseInt(data.qty)" :key="index">{{i}}</option>
          </select>
        </div>
        <div class="product-row" v-if="parseInt(data.qty) <= 0">
          <span style="width: 100%'" class="alert alert-danger">Out of stock.</span>
        </div>
<!--         <div class="product-row">
          <button class="btn btn-primary" @click="addToPost(data)">Buy Now</button>
          <button class="btn btn-primary" @click="addToInstallment(data)">PROCEED WITH INSTALLMENT</button>
          <button class="btn btn-primary" @click="redirect('/checkout')">PROCEED TO CHECKOUT</button>
          <button class="btn btn-danger" @click="addToWishlist(data.id)" v-if="data.wishlist_flag === false && data.checkout_flag === false"><i class="far fa-heart" style="padding-right: 10px;"></i>ADD TO WISHLIST</button>
        </div> -->
        <div class="product-row" v-if="data.sku !== null && data.sku !== ''">
          <label style="width: 15%;">Sku</label>
          <label class="text-danger"><i>{{data.sku}}</i></label>
        </div>
        <div class="product-row-tags" v-if="data.tags !== null && data.tag_array !== null">
          <label style="width: 15%;">Tags</label>
          <label class="tag-label" v-for="(item, index) in data.tag_array" :key="index">{{item.title}}</label>
        </div>
        <div class="product-row-rating">
          <ratings :payload="'product'" :payloadValue="data.id"></ratings>
        </div>

        <div class="product-row-rating" v-if="data.installment !== null">
          <installemnt-label :data="data.installment"></installemnt-label>
        </div>
      </div>
    </div>
    <div class="product-more-details">
      <div class="pagination-holder">
        <ul class="product-menu"> <!--  do dis --> 
          <li v-for="(item, index) in productMenu" :key="index" v-bind:class="{'menu-active': item.flag === true}" class="" @click="selectMenu(index)">{{item.title}}</li>
        </ul>
      </div>
      <div class="details-holder" v-if="prevMenuIndex === 0" style="text-align: justify">
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
    margin-top: 25px;
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
      status: this.$route.params.preview,
      productMenu: [
        {title: 'Details', flag: true},
        // {title: 'Supplier', flag: false},
        {title: 'Shippings', flag: false},
        {title: 'Reviews', flag: false}
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
    'product-comments': require('components/increment/generic/comment/Comments.vue'),
    'installemnt-label': require('components/increment/imarketvue/installment/label.vue')
  },
  methods: {
    getFileType(url){
      console.log(url.substring(url.lastIndexOf('.')))
      return url.substring(url.lastIndexOf('.')) === '.webm' ? 'vid' : 'img'
    },
    redirect(parameter){
      ROUTER.push(parameter)
      if(parameter === 'editor/v2'){
        AUTH.mode = 1
      }else{
        AUTH.redirect(parameter)
      }
    },
    redirectBack(){
      ROUTER.go(-1)
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
        this.retrieve()
      })
    },
    addToInstallment(data){
      if(this.validate() === false){
        return false
      }
      if(parseInt(this.data.qty) <= 0){
        this.errorMessage = 'This is item is out of stock. Please be back soon!'
        return false
      }
      let parameter = {
        account_id: this.user.userID,
        merchant_id: data.merchant_id,
        product_id: data.id,
        size: this.activeSize,
        color: this.activeColor,
        qty: this.qty,
        status: 'pending'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('installment_requests/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          this.redirect('/dashboard')
        }
      })
      this.errorMessage = null
    },
    addToCart(id){
      if(this.validate() === false){
        return false
      }
      if(parseInt(this.data.qty) <= 0){
        this.errorMessage = 'This is item is out of stock. Please be back soon!'
        return false
      }
      let parameter = {
        account_id: this.user.userID,
        payload: 'product',
        payload_value: id,
        price: this.getPrice(),
        size: this.activeSize,
        color: this.activeColor,
        qty: this.qty,
        type: 'marketplace'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('checkout_items/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          AUTH.checkAuthentication(null)
          this.retrieve()
        }
      })
      this.errorMessage = null
    },
    validate(){
      let color = this.data.color
      let size = this.data.size
      if(color !== null){
        if(color.length > 1 && this.activeColor === null){
          this.errorMessage = 'Please select any of the color variation.'
          return false
        }else if(color.length === 1 && this.activeColor === null){
          this.activeColor = color[0].payload_value
        }
      }
      if(size !== null){
        if(size.length > 1 && this.activeSize === null){
          this.errorMessage = 'Please select any of the size variation.'
          return false
        }else if(size.length === 1 && this.activeSize === null){
          this.activeSize = size[0].payload_value
        }
      }
      this.errorMessage = null
    },
    showPrice(flag){
      this.priceFlag = flag
    },
    getPrice(){
      let price = this.data.price
      if(price === null){
        return 0
      }
      if(price.length > 1){
        // variable
        for (var i = 0; i < price.length; i++) {
          if(this.qty >= price[i].minimum && this.qty <= price[i].maximum){
            return price[i].price
          }
        }
        if(this.qty > price[price.length - 1].maximum){
          return price[price.length - 1].maximum
        }
      }else if(price.length === 1){
        if(price[0].type === 'fixed'){
          return price[0].price
        }
      }
      return 0
    },
    addToPost(data){
      data['total'] = data.price[0].price
      data['currency'] = data.price[0].currency
      AUTH.attachmentValue = data
      ROUTER.push('/createRequestBorrow')
    }
  }
}
</script>
