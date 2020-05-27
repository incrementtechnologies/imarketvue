<template>
  <div class="payment-method-holder">
    <span class="items">
      <div class="payment-method-menu">
        <span class="menu-item" style="border: 0px;">
           <paypal :item="item" :coupon="coupon" :discount="discount"></paypal>
        </span>
        <span class="menu-item" v-for="item, index in paymentMethod" @click="selectedPaymentMethod(item.payload)" v-bind:class="{'bg-primary': selectedMethod === item.payload}" v-if="item.payload !== 'paypal'">
          <span class="title">
            {{item.title}}
          </span>
          <span class="icons" v-if="item.icons !== null">
            <i v-bind:class="iItem" v-for="iItem, iIndex in item.icons"></i>
          </span>
        </span>
      </div>
      <credit-card v-if="selectedMethod === 'credit-card'"></credit-card>
     
    </span>
    <span class="sidebar pull-right">
      <total :item="item" :method="method" :buttonTitle="'Complete purchase'" :back="true"></total>
    </span>
  </div>
</template>
<style scoped>
.payment-method-holder{
  width: 100%;
  float: left;
}
.payment-method-menu, .step-action{
  width: 100%;
  float: left;
  margin-bottom: 25px;
}
.menu-item{
  width: 150px;
  height: 50px;
  float: left;
  line-height: 50px;
  border: solid 1px #ddd;
  margin-right: 10px;
  margin-bottom: 25px;
}
.menu-item:hover{
  cursor: pointer;
  border: solid 1px #22b173;
}
.menu-item .title{
  width: 100%;
  float: left;
  padding-left: 5px;
}
.menu-item .icons{
  width: 100%;
  float: left;
}
.payment-method-holder{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.payment-method-holder .items{
  width: 68%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  margin-right: 2%;
}
.payment-method-holder .sidebar{
  width: 30%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
@media (max-width: 991px){
  .menu-item{
    width: 100%;
  }
  .payment-method-holder .items{
    width: 100%;
    margin-right: 0%;
  }
  .payment-method-holder .sidebar{
    width: 100%;
  }
}
</style>
<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import axios from 'axios'
export default {
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      paymentMethod: CONFIG.paymentMethods,
      selectedMethod: 'paypal'
    }
  },
  props: ['item', 'coupon', 'discount', 'method'],
  components: {
    'credit-card': require('components/increment/ecommerce/payment/CreditCard.vue'),
    'paypal': require('components/increment/ecommerce/payment/Paypal.vue'),
    'total': require('components/increment/ecommerce/checkout/Total.vue')
  },
  methods: {
    updateRequest(parameter){
      this.$parent.updateRequest(parameter)
    },
    updateStripeExpress(parameter){
      if(this.item !== null){
        let parameter = {
          id: this.item.id,
          payment_type: 'express',
          payment_payload: 'credit_card',
          payment_payload_value: null,
          sub_total: this.item.sub_total,
          total: this.item.total,
          tax: this.item.tax,
          discount: (this.coupon !== null) ? this.discount : 0,
          coupon_id: (this.coupon !== null) ? this.coupon.id : null,
          account_id: this.user.userID,
          email: this.user.email,
          order_number: this.item.order_number
        }
        this.$parent.updateRequest(parameter)
      }
    },
    selectedPaymentMethod(params){
      this.selectedMethod = params
      if(params === 'cash-on-delivery'){
        // pass cod
      }
    },
    setNextActiveStep(){
      this.$parent.setNextActiveStep()
    },
    setPreviousActiveStep(){
      this.$parent.setPreviousActiveStep()
    }
  }
}
</script>

