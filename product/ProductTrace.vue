<template>
  <div class="inventories-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group" v-if="item.type === 'regular' && item.status === 'published'">
      <label for="exampleInputEmail1" style="font-weight: 600;">Stocks</label>
      <div>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="addTraces()"> Add</button>
        <!-- <button class="btn btn-warning form-control-custom" style="margin-left: 10px;" @click="create()"> Import</button> -->
      </div>
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1" style="font-weight: 600;">Available:</label>
      <label v-if="parseInt(item.qty) > 0" class="alert alert-success">{{item.qty}}</label>
      <label v-if="parseInt(item.qty) <= 0" class="alert alert-warning">Out of Stock</label>
    </div>
    <div class="inventories-content" v-if="item.product_traces !== null">
      <table class="table table-bordered">
        <thead>
          <tr>
            <td>Trace ID</td>
            <td>Batch ID</td>
            <td>Manufacturing Date</td>
            <td>Date</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemI, indexI in item.product_traces">
            <td>
              {{itemI.code}}
            </td>
            <td>
              {{itemI.batch_number}}
            </td>
            <td>{{itemI.manufacturing_date}}</td>
            <td>
              {{item.created_at_human}}
            </td>
          </tr>
          <tr>
            <td colspan="3" class="text-center">
              <button class="btn btn-primary" @click="redirect('/traces/' + item.code)">View More</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal :params="productId"></create-product-traces-modal>
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
import ProductTrace from './CreateProductTrace.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      newItem: {
        product_id: this.item.id,
        qty: null
      },
      createProductTraceModal: ProductTrace,
      productId: this.item.id
    }
  },

  components: {
    'empty': require('components/increment/generic/empty/EmptyDynamicIcon.vue'),
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    addTraces(){
      this.productId = this.item.id
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    showModal(action, item = null){
      switch(action){
        case 'create':
          this.createProductTraceModal = {...ProductTrace}
          let inputs = this.createProductTraceModal.inputs
          inputs.map(input => {
            if(input.variable !== 'status'){
              input.value = null
            }else{
              input.value = 'Normal'
            }
            input.disabled = false
          })
          this.createProductTraceModal.params = [{
            variable: 'account_id',
            value: AUTH.user.userID
          }, {
            variable: 'account_type',
            value: AUTH.user.type
          }, {
            variable: 'product_id',
            value: this.item.id
          }, {
            variable: 'inventory_type',
            value: COMMON.ecommerce.inventoryType
          }]
          break
        case 'update':
          let modalData = {...this.createProductTraceModal}
          let parameter = {
            title: 'Update Sub Account',
            route: 'sub_accounts/update',
            button: {
              left: 'Cancel',
              right: 'Update'
            },
            sort: {
              column: 'created_at',
              value: 'desc'
            },
            params: [{
              variable: 'id',
              value: item.id
            }, {
              variable: 'account_id',
              value: item.member
            }]
          }
          modalData = {...modalData, ...parameter} // updated data without input values
          let selectedData = item
          modalData.inputs.map(data => {
            if(data.variable === 'status'){
              data.value = item.status
            }
            if(data.variable === 'username'){
              data.value = item.account.username
              data.disabled = true
            }
            if(data.variable === 'email'){
              data.value = item.account.email
              data.disabled = true
            }
            if(data.variable === 'password'){
              data.value = '*****'
              data.disabled = true
            }
          })
          this.createProductTraceModal = {...modalData}
          break
      }
      $('#createProductTraceModal').modal('show')
    },
    deleteItem(item){
      let parameter = {
        id: item.id
      }
      this.APIRequest('product_traces/delete', parameter).then(response => {
        this.$parent.retrieve()
      })
    },
    retrieve(sort){
      this.$parent.retrieve(sort)
    },
    update(item){
      if(item.qty !== null && item.qty !== '' && isNaN(item.qty) === false){
        this.APIRequest('product_traces/update', item).then(response => {
          if(response.data === true){
            this.$parent.retrieve()
          }
        })
      }else{
        this.errorMessage = 'Input must be a number greater than 0.'
      }
    }
  }
}
</script>
