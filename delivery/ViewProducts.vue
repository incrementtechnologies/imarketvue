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
        <div class="modal-body">
          <table class="table table-responsive" v-if="data !== null">
            <thead>
              <th>
                Title
              </th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Actions</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data">
                <td>
                  <i class="fa fa-check text-primary" v-if="item.status === 'completed'"></i>
                  {{item.title}}
                </td>
                <td>{{item.qty}}</td>
                <td>{{item.notes}}</td>
                <td>
                  <button class="btn btn-primary" @click="item.status = 'completed'" v-if="item.status !== 'completed'">Complete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-danger" @click="hideModal()">Close</button>
          <button type="button" class="btn btn-primary" @click="confirm()">Submit</button>
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
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG
    }
  },
  props: ['data', 'checkout'],
  methods: {
    hideModal(){
      $('#viewProductOnModal').modal('hide')
    },
    confirm(){
      let parameter = {
        id: this.checkout.id,
        status: 'completed'
      }
      this.APIRequest('checkouts/update', parameter).then(response => {

      })
    }
  }
}
</script>
