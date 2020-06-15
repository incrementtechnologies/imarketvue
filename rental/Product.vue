<template>
  <div v-if="data !== null">
    <div class="title" v-if="status === 'preview'">
      <b @click="redirect('/product/edit/' + data.code)">
        <label class="text-primary action-link">Back</label>
      </b>
    </div>
    <div class="title" v-if="status !== 'preview'">
      <b @click="redirect('/rentals')">
        <label class="text-primary action-link">Rentals</label>
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
        <div class="product-title" v-if="data.location !== null" style="line-height: 40px;">
          <i class="fas fa-map-marker-alt"></i>
          <label v-for="(item, index) in data.location" :key="index">
            {{(index > 0 && index <= data.location.length -1 ? ', ' : '') + item.locality}}
          </label>
        </div>
        <div class="product-date">
          <label style="line-height: 30px;" v-if="data.schedule === null">Available on</label>
          <label class="text-danger" style="line-height: 30px;" v-if="data.schedule !== null">Date not available</label>
          <span class="inputs">
            <div class="input-holder">
              <date-picker
                  v-model="startDate"
                  :type="'datetime'"
                  :value-type="'YYYY-MM-DD HH:mm:ss'"
                  :use12h="true"
                  :placeholder="'Enter date'"
                  :format="'MMM D, YYYY hh:mm A'"
                  :input-class="'form-control'"
                  :disabled-date="beforeToday"
                  @clear="startDate = null, endDate = null"
                  @change="endDate = null"
                  :input-attr="{style: 'height: 45px !important;border: 0px; padding-left: 5px; color:' + (data.schedule === null ? '#000;' : '#ff0000;')}"
                >
              </date-picker>
            </div>
          </span>

          <span class="inputs">
            <div class="input-holder">
              <date-picker
                  v-model="endDate"
                  :type="'datetime'"
                  :value-type="'YYYY-MM-DD HH:mm:ss'"
                  :use12h="true"
                  :placeholder="'Enter date'"
                  :format="'MMM D, YYYY hh:mm A'"
                  :input-class="'form-control'"
                  :disabled-date="afterStart"
                  :default-value="startDate"
                  :disabled-time="afterStartTime"
                  @change="retrieve()"
                  :input-attr="{style: 'height: 45px !important;border: 0px; padding-left: 5px; color:' + (data.schedule === null ? '#000;' : '#ff0000;')}"
                >
              </date-picker>
            </div>
          </span>
          
        </div>

        <div class="product-row" v-if="data.schedule === null">
          <button class="btn btn-primary" @click="bookNow(data)">BOOK NOW</button>
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
      <div class="details-holder" v-if="prevMenuIndex === 2">
        <product-comments :payloadValue="data.id" :payload="'product'" :load="true"></product-comments>
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
      data: null,
      code: this.$route.params.code,
      status: this.$route.params.status,
      productMenu: [
        {title: 'Details', flag: true},
        {title: 'Reviews', flag: false}
      ],
      prevMenuIndex: 0,
      selectedImage: null,
      currency: CURRENCY,
      startDate: this.$route.params.startDate,
      endDate: this.$route.params.endDate
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'product-comments': require('components/increment/generic/comment/Comments.vue'),
    DatePicker
  },
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
    redirect(parameter){
      ROUTER.push(parameter)
      if(parameter === 'editor/v2'){
        AUTH.mode = 1
      }else{
        AUTH.redirect(parameter)
      }
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
    bookNow(data){
      if(data.schedule !== null){
        this.errorMessage = 'Selected date is not available.'
        return
      }
      if(this.startDate === null || this.endDate === null){
        this.errorMessage = 'Start and end date are required.'
        return
      }
      let parameter = {
        account_id: this.user.userID,
        merchant_id: data.merchant_id,
        product_id: data.id,
        start: this.startDate,
        end: this.endDate,
        status: 'pending'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          this.redirect('/dashboard')
        }
      })
      this.errorMessage = null
    },
    retrieve(){
      if(this.startDate === null || this.endDate === null){
        return
      }
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
        start_date: this.startDate,
        end_date: this.endDate
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/retrieve_details', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
        }
      })
    }
  }
}
</script>
