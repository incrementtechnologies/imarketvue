<template>
  <div class="modal fade" id="viewProductOnModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title" id="exampleModalLabel">View products</h5>
          <button type="button" class="close" @click="hideModal()" aria-label="Close">
            <span aria-hidden="true" class="text-white">&times;</span>
          </button>
        </div>
        <div class="modal-body" v-if="dataAdded !== null">
            <center>
              <h4>Order No.{{dataAdded.order_number}}</h4>
              <p>{{dataAdded.location}}</p>
            </center>
          <div class="row">
              <p class="col 4" style="margin-left: 2%">Customer: {{dataAdded.name}}</p>
              <p class="col 4" style="text-align: right; margin-right: 3%">Delivered By: {{dataAdded.assigned_rider !== null ? dataAdded.assigned_rider.name : dataAdded.assigned_rider}}</p>
              <p class="col 4" style="text-align: right; margin-right: 3%">Type of Payment: <b class="text-uppercase">{{dataAdded.type}}</b></p>
          </div>
          <table class="table table-responsive" v-if="data !== null">
            <thead>
              <th>Title</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data" :key="index">
                <td>
                  <i class="fa fa-check text-primary" v-if="item.status === 'completed'"></i>
                  {{item.title}}
                </td>
                <td>
                  {{item.qty}}
                </td>
                <td>
                  {{currency.displayWithCurrency(item.price, item.currency ? item.currency : 'PHP')}} x {{item.qty}} = {{currency.displayWithCurrency(item.price * item.qty, item.currency ? item.currency : 'PHP')}}
                </td>
                <td>
                  <button class="btn btn-primary" @click="complete(item)" v-if="item.status !== 'completed'">Complete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="form-group" v-if="checkout.notes">
            <label>Additional Information</label>
            <br>
            <label class="alert alert-danger">
              {{item.notes}}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="hideModal()">Close</button>
          <button type="button" class="btn btn-primary" v-bind:disabled="btnDisable" @click="confirm()">Complete</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
  .bg-primary{
    background: $primary !important;
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
      btnDisable: true,
      user: AUTH.user,
      config: CONFIG,
      currency: CURRENCY
    }
  },
  props: ['data', 'checkout', 'dataAdded'],
  methods: {
    hideModal(){
      $('#viewProductOnModal').modal('hide')
    },
    showModal(){
      $('#viewProductOnModal').modal('show')
    },
    complete(item){
      let parameter = {
        id: item.id,
        status: 'completed'
      }
      this.APIRequest('checkout_items/update', parameter).then(response => {
      })
      var x = 0
      item.status = 'completed'
      this.data.map(key => {
        if(key.status === 'completed') {
          x++
          if(this.data.length === x){
            this.btnDisable = false
          }
        }
      })
    },
    confirm(){
      let parameter = {
        id: this.checkout.id,
        status: 'completed'
      }
      this.APIRequest('checkouts/update', parameter).then(response => {
        this.btnDisable = true
        this.hideModal()
      })
    }
  }
}
</script>