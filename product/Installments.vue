<template>
  <div id="updateProducts">
    <span v-if="errorMessage !== null" class="text-danger text-center">
        <label><b>Opps! </b>{{errorMessage}}</label>
    </span>
    <div class="form-group" v-if="data === null">
      <label for="exampleInputEmail1" style="font-weight: 600;">Installment terms</label>
      <div>
        <select class="form-control form-control-custom" style="width: 20%; float: left;" v-model="months">
          <option :value="item" v-for="(item, index) in 36" :key="index">{{item}} {{item > 1 ? 'Months' : 'Month'}}</option>
        </select>
        <select class="form-control form-control-custom" style="width: 20%; float: left; margin-left: 1%;" v-model="interest">
          <option :value="item" v-for="(item, index) in 20" :key="index">{{item}} {{item > 1 ? 'Percent' : 'Percents'}}</option>
        </select>
        <select class="form-control form-control-custom" style="width: 50%; float: left; margin-left: 1%;" v-model="selectedIndex">
          <option :value="index" v-for="(item, index) in requirementOptions" :key="index">{{item.title}}</option>
        </select>
        <button class="btn btn-primary form-control-custom pull-right" style="margin-left: 10px;" @click="addRequirements()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="form-group" v-if="data !== null">
      <label for="exampleInputEmail1" style="font-weight: 600; width: 100%; float: left;">Installment terms</label>
      <select class="form-control form-control-custom" style="width: 20%; float: left;" v-model="data.months">
        <option :value="item" v-for="(item, index) in 36" :key="index">{{item}} {{item > 1 ? 'Months' : 'Month'}}</option>
      </select>
      <select class="form-control form-control-custom" style="width: 20%; float: left; margin-left: 1%;" v-model="data.interest">
        <option :value="item" v-for="(item, index) in 20" :key="index">{{item}} {{item > 1 ? 'Percent' : 'Percents'}}</option>
      </select>
      <select class="form-control form-control-custom" style="width: 50%; float: left; margin-left: 1%;" v-model="selectedIndex">
        <option :value="index" v-for="(item, index) in requirementOptions" :key="index">{{item.title}}</option>
      </select>
      <button class="btn btn-primary form-control-custom pull-right" style="margin-left: 10px;" @click="addRequirements()"><i class="fa fa-plus"></i></button>
    </div>
    <div class="form-group" v-if="requirements.length > 0">
      <label for="exampleInputEmail1" style="font-weight: 600;">Selected requirements</label>
      <div>
        <button class="btn btn-primary" v-for="(item, index) in requirements" :key="index" style="margin-left: 5px;">{{item.title}} <i class="fas fa-times text-danger" @click="removeItem(index)"></i></button>
      </div>
    </div>
    <div class="form-group" v-if="requirements.length > 0 && data === null">
      <button class="btn btn-primary" @click="submit()">Submit installment terms</button>
    </div>
    <div class="form-group" v-if="data !== null" >
      <button class="btn btn-primary" style="margin-top: 5px;" @click="update()">Update</button>
    </div>
  </div>
</template>
<style scoped>
  .price-wrapper {
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .price-content{
    width: 100%;
    float: left;
    min-height: 50px;
    overflow-y: hidden;
  }
  .price-content .title{
    height: 50px;
    width: 100%;
    float: left;
    font-weight: 600;
    line-height: 50px;
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
import Countries from 'src/countries.js'
export default {
  mounted(){
    this.retrieve()
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      months: 1,
      interest: 1,
      requirementOptions: [{
        title: 'At least 1 Valid ID',
        payload: 'id_1'
      }, {
        title: 'At least 2 Valid ID\'s',
        payload: 'id_2'
      }, {
        title: 'Credit Card',
        payload: 'credit_card'
      }],
      selectedIndex: 0,
      requirements: [],
      data: null
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    addRequirements(){
      let flag = false
      let selected = this.requirementOptions[this.selectedIndex]
      for (var i = 0; i < this.requirements.length; i++) {
        let item = this.requirements[i]
        if(item.payload === selected.payload){
          flag = true
          break
        }
      }
      if(flag === false){
        this.requirements.push(selected)
      }
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.item.id,
          column: 'product_id',
          clause: '='
        }]
      }
      this.APIRequest('installments/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.data = response.data[0]
          let requirements = this.data.requirements.split(',')
          for (var i = 0; i < requirements.length; i++) {
            let payload = requirements[i]
            for (var j = 0; j < this.requirementOptions.length; j++) {
              let item = this.requirementOptions[j]
              if(item.payload === payload){
                this.requirements.push(item)
              }
            }
          }
        }else{
          this.data = null
        }
      })
    },
    removeItem(index){
      this.requirements.splice(index, 1)
    },
    update(){
      let requirements = ''
      for (var i = 0; i < this.requirements.length; i++) {
        let item = this.requirements[i]
        requirements += item.payload + ','
      }
      let parameter = {
        id: this.data.id,
        months: this.data.months,
        interest: this.data.interest,
        requirements: requirements
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('installments/update', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.requirements = []
        this.retrieve()
      })
    },
    submit(){
      let requirements = ''
      for (var i = 0; i < this.requirements.length; i++) {
        let item = this.requirements[i]
        requirements += item.payload + ','
      }
      let parameter = {
        product_id: this.item.id,
        months: this.months,
        interest: this.interest,
        requirements: requirements
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('installments/create', parameter).then(response => {
        $('#loading').css({display: 'none'})
        this.requirements = []
        this.retrieve()
      })
    }
  }
}
</script>
