<template>
  <div class="variations-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Variations</label>
      <div>
        <select style="width: 20%; float: left;" class="form-control form-control-custom" v-model="newAttribute.payload" @change="onSelect()">
          <option v-for="(item, index) in common.ecommerce.variations" :key="index" :value="item">{{item}}</option>
        </select>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 27%; margin-left: 10px;" placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="create()" v-if="newAttribute.payload !== null && newAttribute.payload.toLowerCase() !== 'color'">

        <input type="text" class="form-control form-control-custom" style="float: left; width: 13%; margin-left: 10px;" placeholder="#ff0000" v-model="newAttribute.payload_value" @keyup.enter="create()" v-if="newAttribute.payload !== null && newAttribute.payload.toLowerCase() === 'color'">
        <label class="form-control-custom color-viewer" style="float: left; width: 13%;" :style="{background: newAttribute.payload_value}" v-if="newAttribute.payload !== null && newAttribute.payload.toLowerCase() === 'color'"></label>

        <select style="width: 11%; float: left; margin-right: 5px; margin-left: 5px;" class="form-control form-control-custom" v-model="newAttribute.currency" @keyup.enter="create()" v-if="newAttribute.payload !== null">
          <option>{{country.list[0].currency}}</option>
        </select>
        <input type="number" class="form-control form-control-custom" style="float: left; width: 12%; margin-left: 3px; margin-right: 3px;" placeholder="Price" v-model="newAttribute.price" @keyup.enter="create()" v-if="newAttribute.payload !== null">
        <select style="width: 18%; float: left; margin-right: 5px;" class="form-control form-control-custom text-uppercase" v-model="newAttribute.status" @keyup.enter="create()" v-if="newAttribute.payload !== null">
          <option v-for="(item, index) in common.ecommerce.status" :key="index" :value="item">{{item}}</option>
        </select>


        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="create()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="variations-content" v-if="item.variation !== null">
      <div class="attribute-item" v-for="itemVariation, indexVariation in item.variation">
        <input class="form-control form-control-custom" style="width: 20%; float: left; margin-right: 10px;" v-model="itemVariation.payload" placeholder="Type variation here...">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 20%;" placeholder="Type variation value here..." v-if="itemVariation.payload.toLowerCase() !== 'color'" v-model="itemVariation.payload_value" @keyup.enter="update(itemVariation)">

        <input type="text" class="form-control form-control-custom" style="float: left; width: 11%; margin-left: 10px;" placeholder="#ff0000" v-model="itemVariation.payload_value" v-if="itemVariation.payload.toLowerCase() === 'color'">
        <label class="form-control-custom color-viewer" style="float: left; width: 7%;" :style="{background: itemVariation.payload_value}" v-if="itemVariation.payload.toLowerCase() === 'color'"></label>

        <select style="width: 12%; float: left; margin-right: 5px; margin-left: 5px;" class="form-control form-control-custom" v-model="itemVariation.currency">
          <option>{{country.list[0].currency}}</option>
        </select>
        <input class="form-control form-control-custom" style="width: 10%; float: left; margin-right: 5px; margin-left: 5px;" type="number" v-model="itemVariation.price" placeholder="Price">
        <select style="width: 18%; float: left; margin-right: 5px;" class="form-control form-control-custom text-uppercase" v-model="itemVariation.status">
          <option v-for="(item, index) in common.ecommerce.status" :key="index" :value="item">{{item}}</option>
        </select>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="update(itemVariation)">
          <i class="fa fa-sync"></i>
        </button>
        <button class="btn btn-danger form-control-custom" style="margin-left: 10px;" @click="deleteItem(itemVariation)">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.variations-holder{
  width: 100%;
  float: left;
  min-height: 100px;
  overflow-y: hidden;
}
.error{
  width: 100%;
  float: left;
  line-height: 50px;
}
.variations-content{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.variations-content .title{
  height: 50px;
  width: 100%;
  float: left;
  font-weight: 600;
  line-height: 50px;
}
.attribute-item{
  width: 100%;
  float: left;
  height: 50px;
  margin-bottom: 15px;
}
.form-control-custom{
  height: 50px !important;
}

.color-viewer{
  border-radius: 5px;
  margin-left: 5px;
}

@media (max-width:992px) {
  select.form-control.form-control-custom {
    width: 38% !important;
    float: left; 
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import axios from 'axios'
import COUNTRIES from 'src/countries.js'
export default {
  mounted(){
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      country: COUNTRIES,
      errorMessage: null,
      newAttribute: {
        product_id: this.item.id,
        payload: null,
        payload_value: null,
        currency: null,
        price: null,
        status: null
      },
      common: COMMON
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(){
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== '' && this.newAttribute.currency !== null && this.newAttribute.currency !== '' &&
      this.newAttribute.price !== null && this.newAttribute.price !== '' && this.newAttribute.status !== null && this.newAttribute.status !== ''){
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
            this.newAttribute.payload_value = null
            this.newAttribute.price = null
            this.newAttribute.currency = null
            this.newAttribute.status = null
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    },
    onSelect(){
      if(this.newAttribute.payload !== null && this.newAttribute.payload.toLowerCase() === 'color'){
        this.newAttribute.payload_value = '#ff0000'
      }else{
        this.newAttribute.payload_value = null
      }
    },
    deleteItem(item){
      let parameter = {
        id: item.id
      }
      this.APIRequest('product_attributes/delete', parameter).then(response => {
        this.$parent.retrieve()
      })
    },
    update(item){
      if(item.payload_value !== null && item.payload_value !== ''){
        this.APIRequest('product_attributes/update', item).then(response => {
          if(response.data === true){
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
      }
    }
  }
}
</script>
