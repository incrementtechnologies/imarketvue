<template>
  <div class="custom-btn" v-if="item !== null">
    <PayPal
      v-bind:amount="'' + item.total"
      currency="PHP"
      :client="paypal"
      :button-style="myStyle"
      :env="paypalStatus"
      @payment-completed="paypalCompleted($event)"
      @payment-cancelled="paypalCancelled($event)"
      @payment-authorized="paypalAuthorized($event)">
    </PayPal>
    <cancelled-paypal></cancelled-paypal>
  </div>
</template>
<style scoped>
.custom-btn{
  height: 50px !important;
  width: 150px;
  float: left;
}
</style>
<script>
import ROUTER from '../../../../router'
import AUTH from '../../../../services/auth'
import CONFIG from '../../../../config.js'
import PayPal from 'vue-paypal-checkout'
import axios from 'axios'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      paypal: CONFIG.paypal,
      paypalStatus: CONFIG.IS_DEV ? 'sandbox' : 'sandbox',
      myStyle: {
        label: 'checkout',
        size: 'responsive',
        shape: 'pill',
        color: 'gold'
      }
    }
  },
  props: ['item', 'coupon', 'discount'],
  components: {
    'cancelled-paypal': require('components/increment/ecommerce/payment/CancelPaypal.vue'),
    PayPal
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    paypalCompleted(data){
      if(data.state === 'approved'){
        let parameter = {
          id: this.item.id,
          payment_type: 'express',
          payment_payload: 'paypal',
          payment_payload_value: data,
          sub_total: this.item.sub_total,
          total: this.item.total,
          tax: this.item.tax,
          discount: (this.coupon !== null) ? this.discount : 0,
          coupon_id: (this.coupon !== null) ? this.coupon.id : null,
          account_id: this.user.userID,
          email: this.user.email,
          order_number: this.item.order_number
        }
        // update paypal on backend
        this.$parent.updateRequest(parameter)
      }
    },
    paypalCancelled(data){
      $('#cancelPaypalModal').modal('show')
    },
    paypalAuthorized(data){
    }
  }
}
</script>
