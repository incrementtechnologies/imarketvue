<template>
  <div>
    <table class="table table-bordered table-responsive" v-if="type === 'consignments'">
      <thead>
        <tr>
          <td v-if="user.type !== 'MANUFACTURER'">Manufacturer</td>
          <td>Title</td>
          <td v-if="user.type === 'MANUFACTURER'">Tags</td>
          <td>Inventory</td>
          <td v-if="user.type === 'MANUFACTURER'">Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-if="user.type !== 'MANUFACTURER'">
            {{item.merchant.name}}
          </td>
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            <label class="underline-on-hover" @click="redirect('/marketplace/product/' + item.code + '/preview')">{{item.title}}</label>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">{{item.tags}}</td>
          <td v-if="user.type === 'MANUFACTURER'">
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">>{{parseInt(item.qty)}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td v-if="user.type !== 'MANUFACTURER'">
             <button class="btn btn-primary" title="Total active trace">{{user.type === 'USER' ? parseFloat(item.qty).toFixed(2) : parseInt(item.qty)}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td v-if="user.type === 'MANUFACTURER'">
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">EDIT</button>
            <button class="btn btn-warning" @click="showModal('create', item)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-bordered table-responsive" v-if="type === 'products'">
      <thead>
        <tr>
          <td>Title</td>
          <td>Tags</td>
          <td>Inventory</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            {{item.title}}
          </td>
          <td>{{item.tags}}</td>
          <td>
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">{{user.type === 'USER' ? parseFloat(item.qty).toFixed(2) : parseInt(item.qty)}}</button>
             <button class="btn btn-warning" title="Total active trace in bundled">{{item.qty_in_bundled}}</button>
          </td>
          <td>
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">EDIT</button>
            <button class="btn btn-warning" @click="showModal('create', item)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button>
          </td>
        </tr>
      </tbody>
    </table>

    <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal :params="productId"></create-product-traces-modal>
  </div>
</template>
<style>
.underline-on-hover:hover{
  cursor: pointer;
  text-decoration: underline;
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
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      createProductTraceModal: ProductTrace,
      productId: null
    }
  },
  components: {
    'create-modal': require('components/increment/generic/modal/Modal.vue'),
    'create-product-traces-modal': require('./CreateProductTraces.vue')
  },
  props: ['data', 'type'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    addProductTraces(id){
      this.productId = id
      setTimeout(() => {
        $('#createProductTracesModal').modal('show')
      }, 100)
    },
    showModal(action, item){
      switch(action){
        case 'create':
          this.createProductTraceModal = {...ProductTrace}
          let inputs = this.createProductTraceModal.inputs
          inputs.map(input => {
            if(input.variable !== 'qty'){
              input.value = null
            }else{
              input.value = 1
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
            value: item.id
          }, {
            variable: 'inventory_type',
            value: COMMON.ecommerce.inventoryType
          }]
          break
      }
      $('#createProductTraceModal').modal('show')
    },
    retrieve(sort){
      this.$parent.retrieve(null, null)
    }
  }
}
</script>
