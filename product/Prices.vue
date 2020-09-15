<template>
  <div id="updateProducts">
    <span v-if="errorMessage !== null" class="text-danger text-center">
        <label><b>Opps! </b>{{errorMessage}}</label>
    </span>
    <div class="form-group" v-if="item.price === null">
      <label for="exampleInputEmail1" style="font-weight: 600;">Price</label>
      <div>
        <select class="form-control form-control-custom" style="width: 24%; float: left;" v-model="currency">
          <option :value="item.currency" v-for="(item, index) in countries.list" :key="index">{{item.currency}}</option>
        </select>
        <select class="form-control form-control-custom" style="width: 26%; float: left;margin-left: 1%;" v-model="flag">
          <option value="fixed">Fixed</option>
        </select>
        <select class="form-control form-control-custom" style="width: 20%; float: left;margin-left: 1%;" v-model="label" v-if="item.type === 'rental'">
          <option value="hour">Per Hour</option>
          <option value="day">Per Day</option>
          <option value="week">Per Week</option>
          <option value="month">Per Month</option>
        </select>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 31%;margin-left: 1%;" placeholder="Type price here" v-model="price" @keyup.enter="createRequest()" v-if="flag === 'fixed'">
        <button class="btn btn-primary form-control-custom pull-right" style="margin-left: 10px;" @click="createRequest()"><i class="fa fa-plus"></i></button>
      </div>
      <!-- <div>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 30.3%; margin-top: 10px;" placeholder="Minimum Qty" v-model="minimum" v-if="flag === 'variable'">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 30.3%; margin-top: 10px;  margin-left: 5px;" placeholder="Maximum Qty" v-model="maximum" v-if="flag === 'variable'">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 30.3%; margin-top: 10px; margin-left: 5px; margin-right: 5px;" placeholder="Type price here" v-model="price" @keyup.enter="createRequest()" v-if="flag === 'variable'">
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px; margin-top: 10px;" @click="createRequest()"><i class="fa fa-plus"></i></button>
      </div> -->
    </div>
    <div class="price-wrapper" v-if="item.price !== null" style="margin-top: 20px; width: 100%; float: left;">
      <label for="exampleInputEmail1" style="font-weight: 600;">Price</label>
      <div class="price-item" v-for="itemI, index in item.price" :key="index">

        <select class="form-control form-control-custom" style="width: 20%; float: left;" v-model="itemI.currency">
          <option :value="itemC.currency" v-for="(itemC, indexC) in countries.list" :key="indexC">{{itemC.currency}}</option>
        </select>

        <select class="form-control form-control-custom" style="width: 20%; float: left; margin-left: 1%;" v-model="itemI.type">
          <option value="fixed">Fixed</option>
          <option value="variable">Variable</option>
        </select>

        <select class="form-control form-control-custom" style="width: 20%; float: left;margin-left: 1%;" v-model="itemI.label" v-if="item.type === 'rental'">
          <option value="hour">Per Hour</option>
          <option value="day">Per Day</option>
          <option value="week">Per Week</option>
          <option value="month">Per Month</option>
        </select>

        <span v-if="itemI.type === 'fixed'"> <input type="text" class="form-control form-control-custom" style="float: left; width: 18%; margin-left: 1%;" placeholder="Type price here" v-model="itemI.price" @keyup.enter="updateRequest(itemI)"></span>
        <span v-else-if="itemI.type ==='variable'">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 18%; margin-left: 1%;" placeholder="Type minimum price here" v-model="itemI.minimum" @keyup.enter="updateRequest(itemI)">
        <input type="text" class="form-control form-control-custom" style="float: left; width: 18%; margin-left: 1%;" placeholder="Type maximum price here" v-model="itemI.maximum" @keyup.enter="updateRequest(itemI)">
        </span>
        <button class="btn btn-danger form-control-custom pull-right" style="margin-left: 10px;" @click="deleteRequest(itemI.id)"><i class="fa fa-trash"></i></button>
        <button class="btn btn-primary form-control-custom pull-right" style="margin-left: 10px;" @click="updateRequest(itemI)"><i class="fa fa-sync"></i></button>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .price-wrapper {
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .price-content{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .price-content .title{
    height: 50px;
    width: 100%;
    float: left;
    font-weight: 600;
    line-height: 50px;
  }
  .price-item{
    width: 100%;
    float: left;
    height: 50px;
    margin-bottom: 15px;
  }
  .form-control-custom {
    height: 50px !important;
  }
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import Countries from 'src/countries.js'
export default {
  mounted(){
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      flag: 'fixed',
      price: null,
      minimum: null,
      maximum: null,
      countries: Countries,
      currency: 'PHP',
      label: null
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    validate(){
      if(this.minimum !== null && this.minimum !== '' && this.maximum !== null && this.maximum !== '' && this.price !== null && this.price !== ''){
        return true
      }
      return false
    },
    deleteRequest(id){
      let parameter = {
        id: id
      }
      this.APIRequest('pricings/delete', parameter).then(response => {
        if(response.data > 0){
          this.$parent.retrieve()
        }
      })
    },
    updateRequest(item){
      if(item.type === 'fixed' && isNaN(item.price)){
        this.errorMessage = 'The required field must be a number.'
        return false
      }else if(item.type === 'variable' && isNaN(item.price) && parseInt(item.price) <= 0){
        return false
      }
      this.APIRequest('pricings/update', item).then(response => {
        if(response.data > 0){
          this.errorMessage = null
          this.$parent.retrieve()
        }
      })
    },
    createRequest(){
      if(parseFloat(this.price) > 0 && this.flag === 'fixed'){
        this.errorMessage = null
        let parameter = {
          account_id: this.user.userID,
          product_id: this.item.id,
          type: this.flag,
          minimum: null,
          maximum: null,
          price: this.price,
          currency: this.currency,
          label: this.label ? this.label : null
        }
        this.APIRequest('pricings/create', parameter).then(response => {
          if(response.data > 0){
            this.$parent.retrieve()
          }
        })
      }else if(this.validate() && this.flag === 'variable'){
        this.errorMessage = null
        let parameter = {
          account_id: this.user.userID,
          product_id: this.item.id,
          type: this.flag,
          minimum: this.minimum,
          maximum: this.maximum,
          price: this.price,
          currency: this.currency
        }
        this.APIRequest('pricings/create', parameter).then(response => {
          if(response.data > 0){
            this.$parent.retrieve()
          }
        })
      }
    }
  }
}
</script>
