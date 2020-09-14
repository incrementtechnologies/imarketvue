<template>
  <div v-if="data !== null">
    <div class="title" style="margin-top: 25px;">
      <b @click="redirect('/products')">
        <label class="text-primary action-link">Products</label>
      </b>
      <label class="text-primary">/ {{data.title}}</label>
    </div>
    <div class="product-item-holder">
      <div class="product-item-details">
        <div v-if="errorMessage !== null">
          <label class="text-danger">Opps! {{errorMessage}}</label>
        </div>
        <div v-if="successMessage !== null">
          <label class="text-success">{{successMessage}}</label>
        </div>
        <div class="product-item-title">
          <label>Title <label class="text-danger">*</label></label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.title" placeholder="Type product title here...">
        </div>
        <div class="product-item-title">
          <label>Description <label class="text-danger">*</label></label>
          <br>
          <textarea class="form-control" rows="20" v-model="data.description" placeholder="Type product description here..."></textarea>
        </div>
        <div class="product-item-title">
          <label>Tags</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.tags" placeholder="Separate tags with ,">
        </div>
        <div class="product-item-title">
          <label>SKU</label>
          <br>
          <input type="text" class="form-control form-control-custom" v-model="data.sku" placeholder="Type product sku here...">
        </div>
        <div v-if="common.ecommerce.productUnits !== null">
          <div v-if="data.variation !== null">
            <div class="product-item-title" style="width: 79%; margin-right: 1%;">
              <label>Volume</label>
              <br>
              <input type="number" class="form-control form-control-custom" v-model="data.variation[0].payload_value" placeholder="Type volume here...">
            </div>
            <div class="product-item-title" style="width: 20%;">
              <label>Units</label>
              <br>
              <select class="form-control form-control-custom" v-model="data.variation[0].payload">
                <option v-for="(item, index) in common.ecommerce.productUnits" :value="item">{{item}}</option>
              </select>
            </div>
          </div>
          <div v-else>
            <div class="product-item-title" style="width: 79%; margin-right: 1%;">
              <label>Volume</label>
              <br>
              <input type="number" class="form-control form-control-custom" v-model="newAttribute.payload_value" placeholder="Type volume here...">
            </div>
            <div class="product-item-title" style="width: 20%;">
              <label>Units</label>
              <br>
              <select class="form-control form-control-custom" v-model="newAttribute.payload">
                <option v-for="(item, index) in common.ecommerce.productUnits" :value="item" :key="index">{{item}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="product-item-title" style="width: 32% !important; margin-right: 1%;">
          <label>Foods</label>
          <br>
          <select class="form-control form-control-custom" v-model="data.type">
            <option value="regular">Regular</option>
            <option value="rental">Rental</option>
          </select>
        </div>
        <!-- <div class="product-item-title" style="width: 32% !important; margin-right: 1%;">
          <label>Type of product</label>
          <br>
          <select class="form-control form-control-custom" v-model="data.category">
            <option v-for="(item, index) in categories" :value="item.value">{{item.name}}</option>
          </select>
        </div> -->
        <div class="product-item-title" style="width: 32% !important;margin-left: 1%;">
          <label>Status</label>
          <br>
          <select class="form-control form-control-custom" v-model="data.status">
            <option value="pending">Pending</option>
            <option value="published">Publish</option>
            <option value="Featured">Feature</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
        <div class="product-item-title">
          <button class="btn btn-danger" @click="showConfirmationModal(data.id)" v-if="data.inventories === null && data.product_traces === null && data.status === 'pending'" style="margin-top: 5px;">Delete</button>
          <button class="btn btn-primary pull-right" @click="updateProduct()" style="margin-right: 2px; margin-top: 5px;">Update</button>
          <button class="btn btn-warning pull-right" @click="redirect('/marketplace/product/' + data.code + '/' + 'preview')" style="margin-right: 10px; margin-top: 5px;">Preview</button>
        </div>
      </div>
      <div class="product-image" style="position: relative;">
        <div class="product-row" style="text-align: left !important;">
          <label style="width: 100%">
            <label style="width: 70%">Featured Image</label>
            <button class="btn btn-primary pull-right" @click="showImages('featured')">Select</button>
          </label>
        </div>
        <img :src="config.BACKEND_URL + selectedImage" class="main-image" v-if="selectedImage !== null">
        <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image" v-if="selectedImage === null && data.featured !== null">
        <b-embed
        type="video"
        v-else-if="getFileType(config.BACKEND_URL + selectedImage) === 'vid'"
        aspect="16by9"
        :src="config.BACKEND_URL + selectedImage"
        allowfullscreen controls
        ></b-embed>
        <i class="fa fa-image" v-if="selectedImage === null && data.featured === null"></i>
        <label class="remove-image text-danger" id="featured-image-remove" @click="removeImage(data.featured[0].id)" v-if="selectedImage === null && data.featured !== null">
          <i class="fa fa-times"></i>
        </label>
       <div class="images-holder">
        <div class="product-row" style="text-align: left !important;">
          <label style="width: 100%">
            <label style="width: 70%">Other Images</label>
            <button class="btn btn-primary pull-right" @click="showImages('images')">Select</button>
          </label>
        </div>
        <div v-for="item, index in data.images" class="image-item" @click="selectImage(item.url)" style="position: relative;">
          <img :src="config.BACKEND_URL + item.url" class="other-image" v-if="getFileType(config.BACKEND_URL + item.url) === 'img'">
          <b-embed
          type="video"
          v-else-if="getFileType(config.BACKEND_URL + item.url) === 'vid'"
          aspect="16by9"
          :src="config.BACKEND_URL + item.url"
          allowfullscreen
          ></b-embed>
          <div class="overlay"></div>
          <label class="remove-image text-danger" id="other-images-remove" @click="removeImage(item.id)" v-if="item.status !== 'featured'">
            <i class="fa fa-times"></i>
          </label>
        </div>
       </div>
      </div>
    </div>
    <div class="product-more-details">
      <div class="pagination-holder">
        <ul class="product-menu">
          <li v-for="item, index in productMenu" v-bind:class="{'menu-active': item.flag === true}" class="" @click="selectMenu(index)">{{item.title}}</li>
        </ul>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Variation'">
        <variations :item="data"></variations>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Price'">
        <prices :item="data"></prices>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Installment'">
        <installments :item="data"></installments>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Inventory'">
        <inventories :item="data" v-if="common.ecommerce.inventoryType === 'inventory'"></inventories>
        <product-trace v-if="common.ecommerce.inventoryType === 'product_trace'" :item="data"></product-trace>
      </div>
      <div class="details-holder" v-if="selectedMenu.title === 'Comment'">
        <product-comments :payloadValue="data.id" :payload="'product'" :load="true"></product-comments>
      </div>

      <div class="details-holder" v-if="selectedMenu.title === 'Location'">
        <location :item="data"></location>
      </div>

      <div class="details-holder-bundled" v-if="selectedMenu.title === 'Bundled Products'">
        <bundled-products :item="data"></bundled-products>
      </div>
    </div>
    <browse-images-modal :fileUpload="'images/*,video/*'"></browse-images-modal>
    <confirmation ref="confirmationModal" :title="'Confirmation Message'" :message="'Are you sure you want delete this product?'" @onConfirm="deleteProduct($event.id)"></confirmation>
  </div>
</template>
<style scoped>
  .title{
    width: 95%;
    float: left;
    margin-left: 2%;
    font-size: 16px;
  }
  .product-item-holder{
    width: 98%;
    float: left;
    margin-left: 2%;
    min-height: 10px;
    overflow-y: hidden;
  }
  .product-image{
    width: 36%;
    float: left;
    margin-left: 2%;
    margin-right: 2%;
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
    max-width: 100%;
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
  .product-item-details{
    min-height: 50px;
    width: 60%;
    float: left;
    overflow-y: hidden;
    border: 0px;
  }
  .product-item-title{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
    margin-top: 15px;
  }
  .product-item-title label{
    font-weight: 600;
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
    height: 40px;
    float: left;
    border-radius: 5px;
    border: solid 1px #ffaa81;
    margin-right: 5px;
  }
  .attribute:hover{
    cursor: pointer;
  }
  .product-more-details{
    width: 96%;
    float: left;
    margin-bottom: 100px;
    min-height: 50px;
    overflow-y: hidden;
    margin-left: 2%;
    margin-right: 2%;
    border-top: solid 1px #ffaa81;
    margin-top: 25px;
  }
  .product-more-details .details-holder{
    width: 60%;
    float: left;
    min-height: 10px;
    overflow-y: hidden;
    margin-top: 25px;
  }

  .product-more-details .details-holder-bundled{
    width: 100%;
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
    width: 20%;
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
  .form-control-custom{
    height: 50px !important;
  }

  .remove-image{
    position: absolute;
  }

  #featured-image-remove{
    top: 50px;
    right: 5px;
    z-index: 10;
    font-size: 24px;
  }

  #other-images-remove{
    top: -20px;
    right: 0px;
    z-index: 10;
    font-size: 18px;
  }

  .remove-image:hover{
    cursor: pointer;
  }

  @media (max-width: 992px){
    .product-item-details, .product-image, .product-more-details .details-holder, .product-menu{
      width: 100%;
    }
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
      successMessage: null,
      data: null,
      code: this.$route.params.code,
      // categories: [
      //   {name: 'Native', value: 'cat1'},
      //   {name: 'Fast food', value: 'cat2'},
      //   {name: 'Casual dining', value: 'cat3'},
      //   {name: 'Family Style', value: 'cat4'},
      //   {name: 'Fine Dining', value: 'cat5'}
      // ],
      prevMenuIndex: 0,
      selectedMenu: COMMON.ecommerce.editProductMenu[0],
      selectedImage: null,
      qty: 1,
      priceFlag: false,
      newImage: {
        product_id: null,
        url: null,
        status: null
      },
      imageStatus: null,
      common: COMMON,
      newAttribute: {
        product_id: null,
        payload: null,
        payload_value: null
      }
    }
  },
  computed: {
    productMenu: function (){
      if(this.data !== null){
        if(this.data.type === 'rental'){
          return COMMON.ecommerce.editProductMenuRental
        }else{
          return COMMON.ecommerce.editProductMenu
        }
      }
    }
  },
  components: {
    'ratings': require('components/increment/generic/rating/Ratings.vue'),
    'product-comments': require('components/increment/generic/comment/Comments.vue'),
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue'),
    'variations': require('components/increment/imarketvue/product/Variations.vue'),
    'inventories': require('components/increment/imarketvue/product/Inventories.vue'),
    'product-trace': require('components/increment/imarketvue/product/ProductTrace.vue'),
    'bundled-products': require('components/increment/imarketvue/product/BundledProducts.vue'),
    'prices': require('components/increment/imarketvue/product/Prices.vue'),
    'installments': require('components/increment/imarketvue/product/Installments.vue'),
    'location': require('components/increment/imarketvue/product/Location.vue'),
    'confirmation': require('components/increment/generic/modal/Confirmation.vue')
  },
  methods: {
    getFileType(url){
      console.log(url.substring(url.lastIndexOf('.')))
      return url.substring(url.lastIndexOf('.')) === '.webm' ? 'vid' : 'img'
    },
    redirect(parameter){
      ROUTER.push(parameter)
    },
    selectMenu(index){
      if(this.prevMenuIndex !== index){
        this.productMenu[this.prevMenuIndex].flag = false
        this.productMenu[index].flag = true
        this.prevMenuIndex = index
        this.selectedMenu = this.productMenu[index]
      }
    },
    showConfirmationModal(id){
      this.$refs.confirmationModal.show(id)
    },
    selectImage(url){
      this.selectedImage = url
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.code,
          column: 'code',
          clause: '='
        }],
        account_id: this.user.userID,
        inventory_type: this.common.ecommerce.inventoryType
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
          console.log(this.data)
        }
      })
    },
    deleteProduct(id){
      let parameter = {
        id: id
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('products/delete', parameter).then(response => {
        $('#loading').css({display: 'none'})
        ROUTER.push('/products')
      })
    },
    validate(){
      this.errorMessage = null
      let ret = true
      if(this.data.title === null || this.data.title === ''){
        this.errorMessage = 'Title is required.'
        ret = false
      }
      if(this.data.description === '' || this.data.description === null){
        this.errorMessage = 'Description is required.'
        ret = false
      }
      if(typeof this.common.ecommerce.productTitleLimit !== undefined && typeof this.common.ecommerce.productTitleLimit !== 'undefined' && this.data.title.length > this.common.ecommerce.productTitleLimit){
        this.errorMessage = 'Product title length should not exceed to ' + this.common.ecommerce.productTitleLimit + ' characters.'
        ret = false
      }
      // if(!this.data.category){
      //   this.errorMessage = 'Category is required.'
      //   ret = false
      // }
      return ret
    },
    updateProduct(){
      if(this.validate() === false){
        return
      }
      this.APIRequest('products/update', this.data).then(response => {
        if(this.common.ecommerce.productUnits !== null){
          if(this.data.variation !== null){
            this.updateAttribute(this.data.variation[0])
          }else{
            this.createAttribute()
          }
        }else{
          this.retrieve()
        }
        this.successMessage = 'Updated Successfully'
        ROUTER.push(AUTH.redirectRoute(this.user.type))
      })
    },
    createAttribute(){
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== '' && parseInt(this.newAttribute.payload_value) > 0){
        this.newAttribute.product_id = this.data.id
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
            this.newAttribute.payload_value = null
            this.errorMessage = null
            this.retrieve()
          }
        })
      }else{
        this.retrieve()
      }
    },
    updateAttribute(item){
      if(item.payload_value !== null && item.payload_value !== '' && parseInt(item.payload_value) > 0){
        this.APIRequest('product_attributes/update', item).then(response => {
          if(response.data === true){
            this.retrieve()
          }
        })
      }else{
        this.retrieve()
      }
    },
    showImages(status){
      this.imageStatus = status
      $('#browseImagesModal').modal('show')
    },
    createPhoto(url){
      if(this.imageStatus === 'featured'){
        this.newImage.status = 'featured'
        if(this.data.featured === null){
          this.newImage.product_id = this.data.id
          this.newImage.url = url
          this.createRequest(this.newImage)
        }else{
          this.data.featured[0].url = url
          this.updateRequest(this.data.featured[0])
        }
      }else if(this.imageStatus === 'images'){
        this.newImage.status = 'others'
        this.newImage.product_id = this.data.id
        this.newImage.url = url
        this.createRequest(this.newImage)
      }
    },
    createRequest(parameter){
      this.APIRequest('product_images/create', parameter).then(response => {
        this.retrieve()
      })
    },
    updateRequest(parameter){
      this.APIRequest('product_images/update', parameter).then(response => {
        this.retrieve()
      })
    },
    manageImageUrl(url){
      this.createPhoto(url)
    },
    removeImage(id){
      let parameter = {
        id: id
      }
      this.APIRequest('product_images/delete', parameter).then(response => {
        this.retrieve()
        this.selectedImage = null
      })
    }
  }
}
</script>
