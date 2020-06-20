<template>
  <div class="marketplace-holder">
    <div class="product-holder">
      <div class="filter">
      </div>
      <div class="results">
        <table class="table table-bordered table-responsive" v-if="data !== null">
          <thead>
            <th>Customer</th>
            <th>Product name</th>
            <th>Price</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index">
              <td>{{
              (item.account.information && item.account.information.first_name !== null) ? item.account.information.first_name + ' ' + item.account.information.last_name : item.account.username}}</td>
              <td>{{item.product.title}}</td>
              <td class="text-uppercase text-primary">
                {{currency.displayWithCurrency(item.product.price[0].price, item.product.price[0].currency) + ' per ' + item.product.price[0].label}}
              </td>
              <td>{{item.start_human}}</td>
              <td>{{item.end_human}}</td>
              <td>
                <span class="badge text-uppercase" :class="{'badge-warning': item.status === 'pending', 'badge-danger': item.status === 'declined', 'badge-primary': item.status === 'confirmed'}">{{item.status}} </span>
              </td>
              <td>
                <button class="btn btn-primary" v-if="item.status !== 'declined' && item.thread === null" @click="confirm(item)">Confirm</button>
                <button class="btn btn-danger" @click="update(item.id)" v-if="item.status !== 'declined' && item.thread === null">Decline</button>
                <i class="fas fa-envelope text-primary" v-if="item.thread !== null" @click="redirect('/thread/' + item.thread.title)"></i>
              </td>
            </tr>
          </tbody>
        </table>
        <dynamic-empty v-if="data === null" :title="'No request yet!'" :action="'Please be back soon.'" :icon="'far fa-smile'" :iconColor="'text-primary'"></dynamic-empty>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.marketplace-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-bottom: 50px;
}
.product-holder{
  width: 100%;
  float: left;
  min-height: 10px;
  overflow-y: hidden;
  margin-top: 25px;
}

.filter{
  width: 100%;
  float: left;
  overflow-y: hidden;
}
.product-holder .results{
  width: 100%;
  font-size: left;
  min-height: 10px;
  overflow-y: hidden;
  float: left;
}

@media (max-width: 992px){
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import CURRENCY from 'src/services/currency.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve(null)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      common: COMMON,
      currency: CURRENCY,
      filter: null
    }
  },
  components: {
    'products': require('components/increment/imarketvue/rental/Products.vue'),
    'dynamic-empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'generic-filter': require('components/increment/imarketvue/rental/Filter.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(){
      let parameter = {
        condition: [{
          column: 'merchant_id',
          value: this.user.subAccount.merchant.id,
          clause: '='
        }],
        sort: {
          created_at: 'desc'
        }
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    confirm(item){
      let parameter = {
        member: item.account_id,
        title: item.code,
        payload: 'rental',
        creator: this.user.userID
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('custom_messenger_groups/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data > 0){
          this.redirect('/thread/' + item.code)
        }
      })
    },
    update(id){
      let parameter = {
        id: id,
        status: 'declined'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('rentals/update', parameter).then(response => {
        this.retrieve()
      })
    }
  }
}
</script>
