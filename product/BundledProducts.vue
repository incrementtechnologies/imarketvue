<template>
  <div class="inventories-holder">
    <div class="inventories-content" v-if="user.type === 'MANUFACTURER'">
      <div class="form-group">
        <label for="exampleInputEmail1" style="font-weight: 600;">Search</label>
        <div>
          <input type="text" v-model="search" class="form-control form-control-custom" style="width: 40%; float: left;" placeholder="Search" @keyup.enter="searchProduct()"/>
          <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="searchProduct()">Search</button>
        </div>
      </div>
    </div>
    <div class="inventories-content">
      <div class="form-group" v-if="errorMessage !== null">
        <label class="text-danger"><b>Opps!</b> {{errorMessage}}</label>
      </div>
      <div class="form-group">
        <div v-for="(pSearch, index) in productSearch" :key="index" style="width: 100%; float: left;">
          <label class="alert alert-success" style="float: left; paddingTop: 15px; paddingLeft: 15px; width: 40%">{{pSearch.title}}</label>
          <input type="number" class="form-control form-control-custom" style="float: left; width: 9%; margin-left: 1%;" placeholder="Qty"  v-model="pSearch.qtyI" @keyup.enter="create(pSearch)">
          <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="create(pSearch)"><i class="fa fa-plus"></i></button>
        </div>
      </div>
    </div>
    
    <div class="form-group" v-if="item.bundled_settings !== null">
      <label for="exampleInputEmail1" style="font-weight: 600;">Allowed products</label>
      <div v-for="(setting, index) in item.bundled_settings" :key="index" style="width: 100%; float: left;">
        <label class="alert alert-success" style="float: left; paddingTop: 15px; paddingLeft: 15px; width: 40%">{{setting.product.title}}</label>
        <input type="text" class="form-control form-control-custom" style="float: left; width: 9%; margin-left: 1%;" placeholder="Qty" v-model="setting.qty" @keyup.enter="update(setting)">
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="update(setting)"><i class="fa fa-sync"></i></button>
        <button class="btn btn-danger form-control-custom" style="margin-left: 10px;" @click="deleteItem(setting)"><i class="fa fa-trash"></i></button>
      </div>
    </div>
    <div class="inventories-content">
      <div class="form-group">
        <label for="exampleInputEmail1" style="font-weight: 600;">Bundled Products</label>
        <div>
          <select class="form form-control form-control-custom" style="float: left; width: 50%; margin-bottom: 10px;" v-model="selectedId">
            <option v-for="(trace, index) in item.product_traces" :key="index" :value="trace.id">{{trace.code}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="inventories-content" v-if="item.bundled_products !== null">
      <table class="table table-bordered">
        <thead>
          <tr>
            <td>Title</td>
            <td>Trace ID</td>
            <td>Batch ID</td>
            <td>Manufacturing Date</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemI, indexI in item.bundled_products" v-if="selectedId === null || (selectedId !== null && parseInt(itemI.bundled_trace) === selectedId)">
            <td>
              {{itemI.product_trace_details[0].product.title}}
            </td>
            <td>
              {{itemI.product_trace_details[0].code}}
            </td>
            <td>
              {{itemI.product_trace_details[0].batch_number}}
            </td>
            <td>{{itemI.product_trace_details[0].manufacturing_date}}</td>
            <td>{{itemI.product_trace_details[0].created_at_human}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
.inventories-holder{
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
.inventories-content{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.inventories-content .title{
  height: 50px;
  width: 100%;
  float: left;
  font-weight: 600;
  line-height: 50px;
}
.inventories-item{
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
import COMMON from 'src/common.js'
export default {
  mounted(){
    this.searchProduct()
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      selectedIndex: null,
      selectedId: null,
      productSearch: [],
      productSelected: null,
      search: null,
      common: COMMON,
      errorMessage: null
    }
  },

  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(product){
      this.errorMessage = null
      if(product.qtyI > 0){
        let parameter = {
          bundled: this.item.id,
          product_id: product.id,
          qty: product.qtyI
        }
        this.errorMessage = null
        if(product.qtyI > 0){
          this.APIRequest('bundled_settings/create', parameter).then(response => {
            if(response.data !== null){
              this.$parent.retrieve()
            }else{
              this.errorMessage = response.error
            }
          })
        }
      }else{
        this.errorMessage = 'Quantity should be greater than 0.'
      }
    },
    searchProduct(){
      if(this.user.type === 'MANUFACTURER'){
        let parameter = {
          condition: [{
            value: '%' + this.search + '%',
            clause: 'like',
            column: 'title'
          }, {
            value: this.user.subAccount.merchant.id,
            column: 'merchant_id',
            clause: '='
          }, {
            value: 'regular',
            column: 'type',
            clause: '='
          }],
          account_id: this.user.userID,
          inventory_type: this.common.ecommerce.inventoryType
        }
        if(this.search !== null && this.search.length > 0){
          this.APIRequest('products/retrieve', parameter).then(response => {
            this.productSearch = response.data
            this.productSearch.map(item => {
              item['qtyI'] = 1
              return item
            })
          })
        }
      }else{
        let parameter = {
          condition: {
            value: '%',
            column: 'title'
          },
          merchant_id: this.user.subAccount.merchant.id,
          sort: {
            'title': 'asc'
          },
          account_id: this.user.userID,
          inventory_type: this.common.ecommerce.inventoryType
        }
        $('#loading').css({'display': 'block'})
        this.APIRequest('transfers/retrieve_consignments', parameter).then(response => {
          $('#loading').css({'display': 'none'})
          this.productSearch = response.data
          this.productSearch.map(item => {
            item['qtyI'] = 1
            return item
          })
        })
      }
    },
    update(item){
      this.errorMessage = null
      if(item.qty > 0){
        let parameter = {
          id: item.id,
          qty: item.qty
        }
        this.APIRequest('bundled_settings/update', parameter).then(response => {
          this.$parent.retrieve()
        })
      }else{
        this.errorMessage = 'Quantity should be greater than 0.'
      }
    },
    deleteItem(item){
      let parameter = {
        id: item.id,
        bundled: item.bundled
      }
      this.APIRequest('bundled_settings/delete', parameter).then(response => {
        this.$parent.retrieve()
      })
    }
  }
}
</script>
