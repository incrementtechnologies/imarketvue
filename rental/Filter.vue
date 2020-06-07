<template>
  <div class="filter">
    <div class="inputs-group">

      <span class="inputs">
        <increment-dropdown
          :label="'Category'"
          :placeholder="'Select category'"
          :data="common.rentalCategories"
          v-model="selectedCategory">
        </increment-dropdown>
      </span>

      <span class="inputs">
        <increment-autocomplete
          :label="'Location'"
          :placeholder="'Type location'"
          :data="countries.cities"
          v-model="selectedLocation"
        ></increment-autocomplete>  
      </span>

      <span class="inputs">
        <div class="input-holder">
          <label>Start Date</label>
          <date-picker
              v-model="startDate"
              :type="'date'"
              :value-type="'YYYY-MM-DD'"
              :use12h="true"
              :placeholder="'Enter date'"
              :format="'MMM D, YYYY'"
              :input-class="'form-control'"
              :disabled-date="beforeToday"
              :input-attr="{style: 'height: 30px !important;border: 0px; padding-left: 0px; color: #999;'}"
            >
          </date-picker>
        </div>
      </span>

      <span class="inputs">
        <div class="input-holder">
          <label>End Date</label>
          <date-picker
              v-model="endDate"
              :type="'date'"
              :value-type="'YYYY-MM-DD'"
              :use12h="true"
              :placeholder="'Enter date'"
              :format="'MMM D, YYYY'"
              :input-class="'form-control'"
              :disabled-date="afterStart"
              :open="startDate && endDate === null ? true : false"
              :default-value="startDate"
              :input-attr="{style: 'height: 30px !important;border: 0px; padding-left: 0px; color: #999;'}"
            >
          </date-picker>
        </div>
      </span>
      <button class="btn btn-primary" @click="search()">
        Search
      </button>

    </div>

    <!-- <div class="input-group" style="margin-top: 10px;">
      <span class="inputs">
        <increment-input
          :label="'Coupon'"
          :placeholder="'Type coupon'"
          v-model="coupon">
        </increment-input>
      </span>
    </div> -->
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.filter{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  position: relative;
}

.inputs-group{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
  position: relative;
}
.inputs{
  margin-right: 1%;
  width: 19%;
  float: left;
  position: relative;
}

.btn{
  height: 60px !important;
  width: 20% !important;
  border-radius: 5px !important;
}

.input-holder{
  border-radius: 5px;
  min-height: 50px;
  overflow-y: hidden;
  border-color: #ccc;
  width: 100%;
  float: left;
  border: solid 1px #eee;
  padding: 5px;
  max-height: 60px;
}

label{
  margin: 0px;
  width: 100%;
  float: left;
  color: #555;
  font-size: 12px;
}

input{
  border: 0px;
  line-height: 30px;
  color: #999;
  width: 100%;
  float: left;
}

input:focus{
  outline: none;
}

.mx-datepicker,
.mx-input-wrapper {
  width: unset;
  position: unset;
  display: unset;
}


@media (max-width: 992px){
  .inputs{
    width: 49%;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import COUNTRIES from 'src/countries.js'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      common: COMMON,
      selectedCategory: 'bikes',
      countries: COUNTRIES,
      selectedLocation: null,
      startDate: null,
      endDate: null,
      coupon: null
    }
  },
  components: {
    'increment-input': require('components/increment/generic/form/input.vue'),
    'increment-autocomplete': require('components/increment/generic/form/AutoComplete.vue'),
    'increment-dropdown': require('components/increment/generic/form/Dropdown.vue'),
    DatePicker
  },
  methods: {
    search(){
      let data = {
        start_date: this.startDate,
        end_date: this.endDate,
        category: this.selectedCategory,
        location: this.selectedLocation
      }
      this.$emit('search', data)
    },
    beforeToday(date){
      return date < new Date()
    },
    afterStart(date){
      let newDate = new Date(this.startDate)
      newDate.setDate(newDate.getDate() - 1)
      return date < newDate
    }
  }
}
</script>
