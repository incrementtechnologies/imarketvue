<template>
  <div class="location-holder">
    <div class="error text-danger" v-if="errorMessage !== null">{{errorMessage}}</div>
    <div class="form-group" v-if="countries !== null">
      <label for="exampleInputEmail1" style="font-weight: 600;">Exclusive Location</label>
      <div>
        <!-- <select style="width: 80%; float: left;" class="form-control form-control-custom" v-model="selectedLocationIndex">
          <option v-for="(cItem, cIndex) in countries.cities" :key="cIndex" :value="cIndex">{{cItem.title}}</option>
        </select> -->
        <select style="width: 80%; float: left;" class="form-control form-control-custom" v-model="selectedLocationIndex">
          <option v-for="(cItem, cIndex) in countries" :key="cIndex" :value="cIndex">{{cItem.city}}</option>
        </select>
        <button class="btn btn-primary form-control-custom" style="margin-left: 10px;" @click="create()"><i class="fa fa-plus"></i></button>
      </div>
    </div>
    <div class="location-content" v-if="data !== null">
      <span class="location-item" v-for="(dItem, dIndex) in data" :key="dIndex">
        <label class="">{{dItem.locality + ', ' + dItem.country}}</label>
        <button class="btn btn-danger form-control-custom" style="margin-left: 10px;" @click="deleteItem(dItem.id)"><i class="fa fa-trash"></i></button>
      </span>
    </div>
  </div>
</template>
<style scoped>
.location-holder{
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
.location-content{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.location-content .title{
  height: 50px;
  width: 100%;
  float: left;
  font-weight: 600;
  line-height: 50px;
}
.form-control-custom{
  height: 50px !important;
}

.location-item{
  width: 100%;
  float: left;
  height: 50px;
  margin-bottom: 10px;
}

.location-item label{
  line-height: 50px;
  width: 80%;
  float: left;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import COUNTRIES from 'src/countries.js'
import axios from 'axios'
export default {
  mounted(){
    this.retrieve()
    this.retrieveLocation()
  },
  props: ['item'],
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      common: COMMON,
      selectedLocationIndex: null,
      // countries: COUNTRIES
      countries: null
    }
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    create(){
      if(this.selectedLocationIndex === null){
        return
      }
      // let parameter = {
      //   product_id: this.item.id,
      //   locality: COUNTRIES.cities[this.selectedLocationIndex].title,
      //   region: COUNTRIES.cities[this.selectedLocationIndex].region,
      //   country: COUNTRIES.cities[this.selectedLocationIndex].country
      // }
      let parameter = {
        product_id: this.item.id,
        locality: this.countries[this.selectedLocationIndex].city,
        region: this.countries[this.selectedLocationIndex].region,
        country: this.countries[this.selectedLocationIndex].country
      }
      this.APIRequest('product_exclusive_locations/create', parameter).then(response => {
        if(response.data > 0){
          this.errorMessage = null
          this.retrieve()
        }
      })
    },
    retrieve(){
      if(this.item === null){
        return
      }
      let parameter = {
        condition: [{
          value: this.item.id,
          clause: '=',
          column: 'product_id'
        }],
        sort: {
          created_at: 'desc'
        }
      }
      this.APIRequest('product_exclusive_locations/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.data = response.data
        }else{
          this.data = null
        }
      })
    },
    retrieveLocation(){
      if(this.item === null){
        return
      }
      let parameter = {
        code: this.user.location_scope
      }
      this.APIRequest('location_scopes/retrieve', parameter).then(response => {
        if(response.data.length > 0){
          this.countries = response.data
        }else{
          this.countries = null
        }
      })
    },
    deleteItem(id){
      let parameter = {
        id: id
      }
      this.APIRequest('product_exclusive_locations/delete', parameter).then(response => {
        this.retrieve()
      })
    }
  }
}
</script>
