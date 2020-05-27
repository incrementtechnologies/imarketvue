<template>
  <div class="total-sidebar">
    <span class="title">Order Summary</span>
    <span class="item">
      <label>Subtotal</label>
      <label class="pull-right" style="padding-right: 10px;">{{currency.display(item.sub_total)}}</label>
    </span>
    <span class="item">
      <label>Tax</label>
      <label class="pull-right" style="padding-right: 10px;">{{currency.display(item.tax)}}</label>
    </span>
    <span class="item" style="border-bottom: 0px;">
      <label class="text-primary">
        <b>Promo Code</b>: <b v-if="coupon !== null">{{coupon.code.toUpperCase()}}</b>
        <b v-if="coupon !== null && coupon.type === 'percentage'"> (-{{coupon.value}}%)</b>
        <b v-if="coupon !== null && coupon.type === 'fixed_amount'"> (-{{coupon.value}})</b>
      </label>
      <i @click="clearCoupon()" class="fa fa-trash text-danger pull-right" style="line-height: 50px; font-size: 20px;padding-right: 10px;" v-if="coupon !== null"></i>
      <i @click="applyCoupon()" class="fa fa-plus text-primary pull-right" style="line-height: 50px; font-size: 20px;padding-right: 10px;" v-else></i>
    </span>
    <span class="item" style="border-bottom: 0px;">
      <label><b>Total</b></label>
      <label class="pull-right" style="padding-right: 10px;"><b>{{currency.display(item.total)}}</b></label>
    </span>
    <button class="btn btn-warning custom-btn" @click="next()">{{buttonTitle}}</button>
    <button class="btn btn-danger custom-btn" @click="previous()" v-if="back === true">Back</button>
    
    <apply-coupon></apply-coupon>
  </div>
</template>
<style scoped>
.total-sidebar{
  width: 100%;
  float: left;
}
.total-sidebar .title, .total-sidebar .item{
  height: 50px;
  width: 100%;
  float: left;
  line-height: 50px;
  border-bottom: solid 1px #eee;
  padding-left: 10px;
}
.total-sidebar .title{
  font-size: 24px;
  border-bottom: 0px;
  background: #22b173;
  color: #fff;
}
.custom-btn{
  margin-top: 10px !important; 
  width: 100% !important;
  height: 50px !important;
}
.fa-edit{
  font-size: 24px;
  line-height: 50px;
  float: left;
}
.delete:hover{
  cursor: pointer;
}
.fa-edit:hover{
  cursor: pointer;
  color: #22b173;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
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
      coupon: null,
      discount: null,
      success: null,
      currency: CURRENCY
    }
  },
  props: ['item', 'method', 'buttonTitle', 'back', 'optionLabel'],
  components: {
    'apply-coupon': require('components/increment/imarketvue/coupon/Apply.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    applyCoupon(){
      $('#applyCouponModal').modal('show')
    },
    clearCoupon(){
      this.coupon = null
      this.$parent.retrieve()
    },
    manageCoupon(){
      if(this.coupon !== null){
        if(this.coupon.type === 'percentage'){
          this.discount = (parseFloat(this.coupon.value) / 100) * this.item.total
        }else if(this.coupon.type === 'fixed_amount'){
          this.discount = parseFloat(this.coupon.value)
        }
        this.item.total -= this.discount
      }
    },
    next(){
      this.$parent.setNextActiveStep()
    },
    previous(){
      this.$parent.setPreviousActiveStep()
    }
  }
}
</script>
