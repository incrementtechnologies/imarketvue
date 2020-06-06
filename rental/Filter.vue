<template>
  <div class="filter">
    <div class="input-group">
      <increment-input
        :label="'Category'"
        :placeholder="'Select category'"
        style="width: 20%;"
        v-model="selectedCategory">
        </increment-input>

        <increment-autocomplete
        :label="'Location'"
        :placeholder="'Select location'"
        :data="countries.cities"
        style="width: 20%;"
        v-model="selectedLocation"
        ></increment-autocomplete>
    </div>
  </div>
</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.filter{
  width: 100%;
  float: left;
  height: 50px;
}
.form-control{
  height: 40px !important;
}
.btn{
  border-radius: 0px !important;
  height: 40px !important;
}
.select-btn{
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
  border-bottom-right-radius: 0px !important;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
import COUNTRIES from 'src/countries.js'
export default {
  mounted(){
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      common: COMMON,
      selectedCategory: null,
      countries: COUNTRIES,
      selectedLocation: null
    }
  },
  components: {
    'increment-input': require('components/increment/generic/form/input.vue'),
    'increment-autocomplete': require('components/increment/generic/form/AutoComplete.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    }
  }
}
</script>
