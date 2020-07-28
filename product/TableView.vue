<template>
  <div>
    <table class="table table-bordered table-responsive">
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
            <label class="underline-on-hover" @click="redirect('/marketplace/product/' + item.code + '/preview')">{{item.title}}</label>
          </td>
          <td>{{item.tags}}</td>
          <td>
             <button class="btn btn-primary" @click="redirect('/traces/' + item.code)" title="Total active trace">{{parseInt(item.qty)}}</button>
          </td>
          <td >
            <button class="btn btn-danger" @click="deleteProduct(item)" data-toggle="modal" data-target="#delete"><i class="fas fa-trash-alt"></i>Delete</button>
            <button class="btn btn-primary" @click="redirect('/product/edit/' + item.code)">EDIT</button>
            <button class="btn btn-warning" @click="showModal('create', item)" v-if="item.type === 'regular' && item.status === 'published'">Add Inventory</button>
          </td>
        </tr>
      </tbody>
    </table>

    

    <create-modal :property="createProductTraceModal"></create-modal>
    <create-product-traces-modal :params="productId"></create-product-traces-modal>

    <!-- DELETE PRODUCT MODAL -->
    <div class="modal fade right" id="delete" tabindex="-1" role="dialog" aria-labelledby="deleteHeader"
     aria-hidden="true">
      <div class="modal-dialog modal-side modal-notify modal-primary" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteheader">Delete Product</h5>
            <button type="button" class="close" aria-label="Close" data-dismiss="modal" @click="selectedBranch = null">
              <span aria-hidden="true" class="white-text">&times;</span>
            </button>
          </div>
          <div class="modal-body p-4">
            Are you sure you want to delete this product?
          </div>
          <div class="modal-footer">
            <button class="btn btn-dark" data-dismiss="modal" @click="selectedBranch = null">Cancel</button>
            <button class="btn btn-secondary" data-dismiss="modal" @click="deleteProduct(item)">Delete</button>
          </div>
        </div>
      </div>
    </div>
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
    },
    deleteProduct(item){
      let params = {
        id: item.id
      }
      console.log(item.id)
      $('#loading').css({display: 'block'})
      this.APIRequest('products/delete', params).then(response => {
        $('#loading').css({display: 'none'})
        this.retrieve({'title': 'asc'})
      })
    }
  }
}
</script>
