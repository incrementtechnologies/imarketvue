<template>
  <div>
    <div class="modal fade" id="createProductTracesModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-md" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary">
            <h5 class="modal-title" id="exampleModalLabel">Add Item</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" class="text-white">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <span v-if="errorMessage !== null" class="text-danger text-center">
                <label><b>Opps! </b>{{errorMessage}}</label>
            </span>
            <br v-if="errorMessage !== null">
            <br>
            <div class="form-group">
              <label for="exampleInputEmail1">Batch Number <b class="text-danger">*</b></label>
              <input type="text" class="form-control" placeholder="Type batch number here..." v-model="newData.batch_number">
            </div>

            <!-- <div class="form-group form-group-three margin-right">
              <label for="exampleInputEmail1">Date <b class="text-danger">*</b></label>
              <select class="form-control" v-model="manufacturing.date">
                <option v-for="i in 31" :key="i" :value="i">{{i}}</option>
              </select>
            </div>
            <div class="form-group form-group-three margin-right">
              <label for="exampleInputEmail1">Month <b class="text-danger">*</b></label>
              <select class="form-control" v-model="manufacturing.month">
                <option v-for="(item, index) in months" :key="index" :value="item.code">{{item.title}}</option>
              </select>
            </div>
            <div class="form-group form-group-three margin-left">
              <label for="exampleInputEmail1">Year <b class="text-danger">*</b></label>
              <input type="number" class="form-control" placeholder="YYYY" v-model="manufacturing.year">
            </div> -->
            <div>
              <label for="exampleInputEmail1">Manufacture Date <b class="text-danger">*</b></label>
              <date-picker
                v-model="newData.manufacturing_date"
                :type="'date'"
                :value-type="'YYYY-MM-DD'"
                :use12h="true"
                :placeholder="'Search date'"
                :format="'MMM D, YYYY'"
                :input-class="'form-control'"
                :input-attr="{style: 'min-height: 50px !important; width: 100% !important;'}"
              ></date-picker>
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">Quantity <b class="text-danger">*</b></label>
              <input type="number" class="form-control" placeholder="Type qty here..." v-model="newData.qty">
            </div>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#createProductTracesModal">Cancel</button>
              <button type="button" class="btn btn-primary" @click="submit()">Create</button>
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
.form-control{
  height: 50px !important;
}
.form-group-three{
  width: 30% !important;
  float: left;
}
.margin-left{
  margin-left: 4%;
}
.margin-right{
  margin-right: 3%;
}
.mx-datepicker,
.mx-input-wrapper {
  width: unset;
  position: unset;
  display: unset;
}
@media (max-width: 991px){
  .form-group-three{
    width: 100% !important;
    float: left;
  }
  .margin-left{
    margin-left: 0%;
  }
  .margin-right{
    margin-left: 0%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
  mounted(){
    var date = new Date()
    this.manufacturing.year = date.getFullYear()
    this.manufacturing.month = (parseInt(date.getMonth()) + 1)
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      manufacturing: {
        date: null,
        month: null,
        year: null
      },
      months: [{
        title: 'January',
        code: 1
      }, {
        title: 'Febuary',
        code: 2
      }, {
        title: 'March',
        code: 3
      }, {
        title: 'April',
        code: 4
      }, {
        title: 'May',
        code: 5
      }, {
        title: 'June',
        code: 6
      }, {
        title: 'July',
        code: 7
      }, {
        title: 'August',
        code: 8
      }, {
        title: 'September',
        code: 9
      }, {
        title: 'October',
        code: 10
      }, {
        title: 'November',
        code: 11
      }, {
        title: 'December',
        code: 12
      }],
      newData: {
        batch_number: null,
        manufacturing_date: null,
        qty: 1,
        product_id: null,
        account_id: null,
        inventory_type: COMMON.ecommerce.inventoryType
      }
    }
  },
  components: {
    DatePicker
  },
  props: ['params'],
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    submit(){
      if(this.validate()){
        this.errorMessage = null
        this.newData.product_id = this.params
        this.newData.account_id = this.user.userID
        this.APIRequest('product_traces/create', this.newData).then(response => {
          if(response.data !== null){
            this.newData = {
              batch_number: null,
              manufacturing_date: null,
              qty: 1,
              product_id: null,
              account_id: null,
              inventory_type: COMMON.ecommerce.inventoryType
            }
            $('#createProductTracesModal').modal('hide')
            this.$parent.retrieve({column: 'created_at', value: 'desc'})
          }
        })
      }
    },
    validate(){
      if(this.newData.batch_number === '' || this.newData.batch_number === null){
        this.errorMessage = 'Batch number is required'
        return false
      }else if(this.newData.qty <= 0 || this.newData.qty === null || this.newData.qty === ''){
        this.errorMessage = 'Quantity should not be less than or equal to 0'
        return false
      }else if(this.newData.manufacturing_date === null || this.newData.manufacturing_date === ''){
        this.errorMessage = 'Manufacturing date is required.'
        return false
      }
      return true
    }
  }
}
</script>
