<template>
  <div>
    <table class="table table-bordered table-responsive">
      <thead>
        <tr>
          <td>Product Name</td>
          <td>Tags</td>
          <td>Inventory</td>
           <td>Settings</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>
            <i class="fas fa-clone text-primary" v-if="item.type !== 'regular'" title="This is a bundled product"></i>
            <label class="underline-on-hover" @click="redirect('/marketplace/product/' + item.code + '/preview')">{{item.title}}</label>
          </td>
          <td>{{item.tags}}</td>
          <td >
             <button class="btn btn-primary">{{parseInt(item.qty)}}</button>
          </td>
          <td >         
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">
              <i class="fas fa-pencil-alt" style="padding-right:0"></i>
            </button>                                       
          </td>                  
        </tr>
      </tbody>
    </table>
    <!-- <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal :params="productId"></create-product-traces-modal> -->  
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
    // deleteProduct(item){
    //   let params = {
    //     id: item.id
    //   }
    //   console.log(item.id)
    //   $('#loading').css({display: 'block'})
    //   this.APIRequest('products/delete', params).then(response => {
    //     $('#loading').css({display: 'none'})
    //     this.retrieve({'title': 'asc'})
    //   })
    // }
  }
}
</script>
