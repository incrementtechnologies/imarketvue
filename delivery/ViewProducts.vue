<template>
  <div>
    <div class="modal fade" id="viewProductOnModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="exampleModalLabel">View products</h5>
            <button type="button" class="close" @click="hideModal('main')" aria-label="Close">
              <span aria-hidden="true" class="text-white">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <table class="table table-responsive" v-if="data !== null">
              <thead>
                <th>
                  Title
                </th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </thead>
              <tbody>
                <tr v-for="(item, index) in data">
                  <td>
                    <i class="fa fa-check text-primary" v-if="item.status === 'completed'"></i>
                    {{item.title}}
                  </td>
                  <td>{{item.qty}}</td>
                  <td>
                    {{currency.displayWithCurrency(item.price, item.currency ? item.currency : 'PHP')}} x {{item.qty}} = {{currency.displayWithCurrency(item.price * item.qty, item.currency ? item.currency : 'PHP')}}
                  </td>
                  <td>
                    <button class="btn btn-primary" @click="item.status = 'completed'" v-if="item.status !== 'completed'">Complete</button>
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
            <button type="button" class="btn btn-primary" @click="confirm()">Submit</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="confirmComplete" tabindex="-1" role="dialog" aria-labelledby="confirmHeader" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <button type="button" class="close" aria-label="Close" @click="hideModal('alert')">
              <span class="text-white" aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <p>
              <b>Confirming this order will confirm all items on this list.</b> 
            </p>
            <p>
              Click 'Confirm' to proceed.
            </p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="hideModal('alert')">Cancel</button>
            <button type="button" class="btn btn-success" @click="proceed()">Confirm</button>
          </div>
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
      user: AUTH.user,
      config: CONFIG,
      complete: true,
      confirmAll: false,
      currency: CURRENCY
    }
  },
  props: ['data', 'checkout'],
  methods: {
    hideModal(type){
      if(type === 'alert') {
        $('#confirmComplete').modal('hide')
      } else {
        $('#viewProductOnModal').modal('hide')
      }
    },
    proceed() {
      this.hideModal('alert')
      this.complete = false
      for(let i = 0; i < this.data.length; i++) {
        if(i === this.data.length - 1) {
          this.complete = true
          this.confirmAll = true
        }
        this.completeItem(this.data[i])
      }
    },
    completeItem(item, runOnce = false) {
      let parameter = {
        id: item.id,
        status: 'completed'
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('checkout_items/update', parameter).then(response => {
        if(this.complete) {
          $('#loading').css({display: 'none'})
        }
        if(this.confirmAll) {
          this.completeOrder()
        }
      })
    },
    showModal(){
      $('#viewProductOnModal').modal('show')
    },
    confirm() {
      $('#viewProductOnModal .error').remove()
      let complete = true
      this.data.forEach(element => {
        if(element.status !== 'completed') {
          complete = false
        }
      })

      if(complete) {
        this.completeOrder()
      } else {
        $('#confirmComplete').modal('show')
      }
    },
    completeOrder(){
      this.confirmAll = false
      let parameter = {
        id: this.checkout.id,
        status: 'completed'
      }
      this.APIRequest('checkouts/update', parameter).then(response => {
        this.hideModal()
        this.$parent.retrieve()
      })
    }
  }
}
</script>
