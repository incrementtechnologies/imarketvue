<template>
  <div class="holder">
    <div>
      <button class="btn btn-primary pull-left" v-if="viewInactive === false" @click="retrieve({'created_at': 'desc'}, {column: 'status', value: 'inactive'}), viewInactive = !viewInactive">Show Inactive</button>
      <button class="btn btn-primary pull-left" v-if="viewInactive === true" @click="retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''}), viewInactive = !viewInactive">Show All</button>
      <button class="btn btn-warning pull-right" style="margin-bottom: 10px;" @click="exportData()"><i class="fas fa-file-export" style="padding-right: 5px;"></i>Export</button>
    </div>
    <filter-product v-bind:category="category" 
      :activeCategoryIndex="0"
      :activeSortingIndex="0"
      @changeSortEvent="retrieve($event.sort, $event.filter)"
      @changeStyle="manageGrid($event)"
      :grid="['list', 'th-large']">
    </filter-product>
    <table class="table table-bordered" v-if="data !== null">
      <thead>
        <tr>
          <td>Trace ID</td>
          <td>Batch Number</td>
          <td>Manufacture Date</td>
          <td>Status</td>
          <td>Created At</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td>{{item.code}}</td>
          <td>{{item.batch_number}}</td>
          <td>{{item.manufacturing_date}}</td>
          <td style="text-transform: UPPERCASE">{{item.status}}</td>
          <td>{{item.created_at_human}}</td>
  <!--         <td>
            <label class="text-primary action-link" @click="redirect('/product/edit/' + item.code)">EDIT</label> / 
            <label class="text-danger action-link">DELETE</label>
          </td> -->
        </tr>
      </tbody>
    </table>
    <empty v-if="data === null" :title="'Looks like you have not added a product!'" :action="'Click the New Product Button to get started.'"></empty>
  </div>
</template>
<style>
  .holder{  
    width: 98%;
    float: left;
    margin-right: 2%;
    margin-top: 25px;
    margin-bottom: 50px;
  }
  .results{
    width: 100%;
    float: left;
    margin-top: 25px;
  }
  .item:hover{
    cursor: pointer;
  }

  .products-holder{
    width: 24%;
    float: left;
    height: 300px;
    margin-right: 1%;
    border: solid 1px #ddd;
    margin-bottom: 10px;
    color: #555;
    margin-top: 25px;
  }
  .products-holder:hover{
    cursor: pointer;
    border: solid 1px #ffaa81;
    background: #ffaa81;
    color: #fff;
  }

  .products-image{
    width: 100%;
    float: left;
    position: relative;
    height: 250px;
    text-align: center;
  }

  .products-image img{
    height: 250px;
    float: left;
    width: 100%;
  }
  .products-image .fa-image{
    font-size: 150px;
    line-height: 250px;

  }
  .products-details{
    height: 50px;
    width: 100%;
    float: left;
    border-top: solid 1px #ddd;
  }
  .products-title{
    width: 50%;
    float: left;
    height: 50px;
  }
  .products-title label{
    width: 100%;
    float: left;
    font-size: 12px;
    margin: 0px !important;
    padding-left: 10px;
  }
  .products-price{
    width: 50%;
    float: left;
    height: 50px;
    line-height: 50px;
    font-weight: 600;
    text-align: right;
    padding-right: 5px;
  }

  .products-wishlist{
    height: 50px;
    text-align: center;
    line-height: 50px;
    width: 100%;
    position: absolute;
    top: 50%;
    z-index: 10;
    display: none;
  }

  .products-wishlist:hover, .products-wishlist i:hover, .products-wishlist label:hover{
    cursor: pointer;
  }

  .products-wishlist label{
    line-height: 50px;
    float: left;
    width: 50%;
    text-align: center;
  }
  
  .products-wishlist i{
    font-size: 32px;
    line-height: 50px;
  }

  .products-holder:hover .products-wishlist{
    display: block;
  }

</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import CONFIG from 'src/config.js'
import axios from 'axios'
import COMMON from 'src/common.js'
import { ExportToCsv } from 'export-to-csv'
export default {
  mounted(){
    this.retrieve({'created_at': 'desc'}, {column: 'created_at', value: ''})
  },
  data(){
    return {
      user: AUTH.user,
      config: CONFIG,
      errorMessage: null,
      data: null,
      selectedItem: null,
      selectedIndex: null,
      listStyle: 'list',
      category: [{
        title: 'Product Traces',
        sorting: [{
          title: 'Code ascending',
          payload: 'code',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Code descending',
          payload: 'code',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Created ascending',
          payload: 'created_at',
          payload_value: 'asc',
          type: 'date'
        }, {
          title: 'Created descending',
          payload: 'created_at',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Batch number ascending',
          payload: 'batch_number',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Batch number descending',
          payload: 'batch_number',
          payload_value: 'desc',
          type: 'text'
        }, {
          title: 'Manufacturing date ascending',
          payload: 'manufacturing_date',
          payload_value: 'asc',
          type: 'date'
        }, {
          title: 'Manufacturing date descending',
          payload: 'manufacturing_date',
          payload_value: 'desc',
          type: 'date'
        }, {
          title: 'Status ascending',
          payload: 'status',
          payload_value: 'asc',
          type: 'text'
        }, {
          title: 'Status descending',
          payload: 'status',
          payload_value: 'desc',
          type: 'text'
        }]
      }],
      common: COMMON,
      date: null,
      viewInactive: false
    }
  },
  components: {
    'empty': require('components/increment/generic/empty/Empty.vue'),
    'filter-product': require('components/increment/imarketvue/filter/Product.vue')
  },
  methods: {
    redirect(parameter){
      ROUTER.push(parameter)
    },
    retrieve(sort, filter){
      let parameter = {
        condition: [{
          value: filter.value + '%',
          column: filter.column,
          clause: 'like'
        }],
        code: this.$route.params.code,
        sort: sort
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('product_traces/retrieve', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data
          this.date = response.request_timestamp
          if(this.selectedItem !== null){
            this.selectedItem = this.data[this.selectedIndex]
          }
        }else{
          this.data = null
          this.selectedIndex = null
          this.selectedItem = null
        }
      })
    },
    editModal(item, index){
      for (var i = 0; i < this.$children.length; i++) {
        if(this.$children[i].$el.id === 'updateProducts'){
          this.selectedItem = item
          this.selectedIndex = index
          this.$children[i].modal()
        }
      }
    },
    manageGrid(event){
      switch(event){
        case 'list': this.listStyle = 'list'
          break
      }
    },
    exportData(){
      $('#loading').css({'display': 'block'})
      let options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: 'Trackr',
        useTextFile: false,
        useBom: true,
        // useKeysAsHeaders: true,
        filename: COMMON.APP_NAME + ' - ' + this.date,
        headers: ['trace_code', 'batch_number', 'manufacturing_date', 'status', 'created_at', 'nfc']
      }
      var exportData = []
      if(this.data !== null){
        for (var i = 0; i < this.data.length; i++) {
          let item = this.data[i]
          var code = item.product.title + '<>' + item.product.merchant.name + '<>' + item.batch_number + '<>' + item.manufacturing_date + '<>' + item.code + '<>' + item.product.merchant.website
            // this is an export hehe
          if(item.status === 'inactive'){
            var object = {
              trace_code: item.code,
              batch_number: item.batch_number,
              manufacturing_date: item.manufacturing_date,
              status: item.status,
              created_at: item.created_at_human,
              nfc: code
            }
            exportData.push(object)
          }
        }
      }
      if(exportData.length > 0){
        var csvExporter = new ExportToCsv(options)
        csvExporter.generateCsv(exportData)
      }
      $('#loading').css({'display': 'none'})
    }
  }
}
</script>
