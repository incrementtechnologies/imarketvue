<template>
  <div class="variations-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Variations</label>
      <div>
        <input class="form-control form-control-custom" style="width: 45%; float: left;" v-model="newAttribute.payload" placeholder="Type variation here...">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 40%; margin-left: 10px;" placeholder="Type variation value here..." v-model="newAttribute.payload_value" @keyup.enter="create()">
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="create()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="variations-content" v-if="item.variation !== null">
      <div class="attribute-item" v-for="itemVariation, indexVariation in item.variation">
        <input class="form-control form-control-custom" style="width: 40%; float: left; margin-right: 10px;" v-model="itemVariation.payload" placeholder="Type variation here...">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 35%;" placeholder="Type variation value here..." v-model="itemVariation.payload_value" @keyup.enter="update(itemVariation)">
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
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
export default {
  mounted(){
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      newAttribute: {
        product_id: this.item.id,
        payload: null,
        payload_value: null
      }
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(){
      if(this.newAttribute.payload_value !== null && this.newAttribute.payload_value !== ''){
        this.APIRequest('product_attributes/create', this.newAttribute).then(response => {
          if(response.data > 0){
            this.newAttribute.payload_value = null
            this.errorMessage = null
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Fill up the required fields.'
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
