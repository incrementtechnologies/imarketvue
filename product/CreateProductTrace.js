import CONFIG from 'src/config.js'
import AUTH from 'src/services/auth'
import COMMON from 'src/common.js'
export default {
  id: 'createProductTraceModal',
  size: 'modal-md',
  title: 'Add Item',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Batch Number',
    variable: 'batch_number',
    placeholder: 'Enter batch number',
    disabled: false,
    value: null,
    required: true,
    id: 'batch_number',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 2,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Manufacture Date',
    variable: 'manufacturing_date',
    placeholder: 'Enter manufacture date',
    disabled: false,
    value: null,
    required: true,
    id: 'manufacturing_date',
    type: 'date',
    validation: {
      size: 2,
      type: 'date'
    }
  }, {
    row: 'full',
    label: 'Quantity',
    variable: 'qty',
    placeholder: 'Enter Quantity',
    disabled: false,
    value: 1,
    required: true,
    id: 'qty',
    type: 'input',
    inputType: 'number',
    validation: {
      type: 'number'
    }
  }],
  route: 'product_traces/create',
  button: {
    left: 'Cancel',
    right: 'Create'
  },
  sort: {
    column: 'created_at',
    value: 'desc'
  },
  params: [{
    variable: 'product_id',
    value: null
  }, {
    variable: 'account_id',
    value: null
  }, {
    variable: 'inventory_type',
    value: COMMON.ecommerce.inventoryType
  }]
}
