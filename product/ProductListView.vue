<template>
  <div class="product-list-holder" v-if="data !== null">
    <div class="product-image">
      <img :src="config.BACKEND_URL + data.featured[0].url" class="main-image" v-if="data.featured !== null">
      <i class="fa fa-image" v-if="data.featured === null"></i>
    </div>
    <div class="product-details">
      <label><b>{{data.title}}</b></label>
      <!-- Please include shipping fees -->
      <label class="text-primary text-uppercase">{{currency.displayWithCurrency(data.total, data.currency) + (data.price !== null && data.price[0].label !== null ? ' PER ' + data.price[0].label : '' )}}</label>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.product-list-holder{
  width: 100%;
  float: left;
}
.product-image{
  float: left;
  overflow-y: hidden;
  text-align: center;
}
.product-image .main-image{
  height: 75px;
  width: auto;
}
.product-image .fa-image{
  font-size: 70px;
}

.product-details{
  float: left;
  margin-left: 10px;
  max-width: 80%;
}

.product-details label{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  margin: 0px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import CURRENCY from 'src/services/currency.js'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      currency: CURRENCY
    }
  },
  props: ['data']
}
</script>
