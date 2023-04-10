<style>
.select {
  background-color: #fafafa;
  border: none;
  border-bottom: 1px solid #9e9e9e;
}
.multiselect {
  height: 100px;
}
</style>
<template>
  <div id="addEditDishModal" class="modal addEditDishModal">
    <div class="modal-content">
      <h4>{{ dish._id ? 'Edit existing' : 'Add new' }} Dish</h4>
      <div class="progress" v-if="loading">
        <div class="indeterminate"></div>
      </div>
      <!-- Input row -->
      <div class="row">
        <div class="input-field col s6">
          <input v-model="dish.name" id="name" type="text" required class="validate" @input="validate">
          <label for="name" :class="{ 'active': dish.name }">Dish Name</label>
          <span class="helper-text" data-error="The field is required"></span>
        </div>
        <div class="input-field col s6">
          <select v-model="dish.foodType" id="foodType" class="browser-default select" @change="validate">
            <option value="" disabled selected>Choose your option</option>
            <option v-for="(type, index) in foodTypes" :key="index" :value="type">{{ type }}</option>
          </select>
          <label for="foodType" class="active">Meat / Veges</label>
        </div>
      </div>
      <!-- Input row -->
      <div class="row">
        <div class="input-field col s12">
          <input v-model="dish.shortDesc" id="shortDesc" type="text" class="validate" @input="validate">
          <label for="shortDesc" :class="{ 'active': dish.shortDesc }">Short Description</label>
          <span class="helper-text" data-error="The field is required"></span>
        </div>
      </div>
      <!-- Input row -->
      <div class="row">
        <div class="input-field col s4">
          <input v-model="dish.quantity" id="quantity" type="text" class="validate" @input="validate">
          <label for="quantity" :class="{ 'active': dish.quantity }">Quantity</label>
          <span class="helper-text" data-error="The field is required"></span>
        </div>
        <div class="input-field col s4">
          <input v-model="dish.price" id="price" type="number" min="1" required class="validate" @input="validate">
          <label for="price" :class="{ 'active': dish.price }">Price ({{ currency }})</label>
          <span class="helper-text" data-error="The field is required with min value 1"></span>
        </div>
        <div class="input-field col s4">
          <select v-model="dish.category" id="category" class="browser-default select" @change="validate">
            <option value="" disabled selected>Choose your option</option>
            <option v-for="(category, index) in foodCategories" :key="index" :value="category">{{ category }}</option>
          </select>
          <label for="category" class="active">Category</label>
        </div>
      </div>
      <!-- Input row -->
      <div class="row">
        <div class="input-field col s6">
          <select v-model="dish.slotsAvailabe"  id="slotsAvailabe" multiple class="browser-default select multiselect" @change="validate">
            <option v-for="(slot, key) in timeSlots" :key="key" :value="key">{{ slot }}</option>
          </select>
          <label for="slotsAvailabe" class="active">Time Slots Availabe</label>
        </div>
        <div class="input-field col s6">
          <select v-model="dish.daysAvailable" id="daysAvailable" multiple class="browser-default select multiselect" @change="validate">
            <option v-for="(day, key) in days" :key="key" :value="key">{{ day }}</option>
          </select>
          <label for="daysAvailable" class="active">Days Available</label>
        </div>
      </div>
      <!-- Input row -->
      <div class="row">
        <div class="input-field col s4">
          <input v-model="dish.waitTime" id="waitTime" type="number" min="1" required class="validate" @input="validate">
          <label for="waitTime" :class="{ 'active': dish.waitTime }">Wait Time</label>
          <span class="helper-text" data-error="The field is required with min value 1"></span>
        </div>
        <div class="input-field col s4">
          <select v-model="dish.timeUnit" id="timeUnit" class="browser-default select" @change="validate">
            <option value="" disabled selected>Choose your option</option>
            <option v-for="(unit, key) in timeUnits" :key="key" :value="key">{{ unit }}</option>
          </select>
          <label for="timeUnit" class="active">Time Unit</label>
        </div>
        <div class="input-field col s4">
          <select v-model="dish.status" id="status" class="browser-default select" @change="validate">
            <option value="" disabled selected>Choose your option</option>
            <option v-for="(status, index) in statuses" :key="index" :value="status">{{ status }}</option>
          </select>
          <label for="status" class="active">Status</label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <a
        :disabled="loading || formInvalid"
        @click.prevent="addEditDish()"
        class="modal-close waves-effect waves-green btn-flat">
        {{ dish._id ? 'Update' : 'Add' }} Dish
      </a>
      <a
        href=""
        @click.prevent="closeModal()"
        class="modal-close waves-effect waves-green btn-flat">
        Cancel
      </a>
    </div>
  </div>
</template>

<script>
import M from 'materialize-css'
import {
  foodTypes,
  foodCategories,
  menuDishesCurrency,
  time,
  dishStatuses,
  timeSlots,
  days,
} from '../../constants/commonConstants'
import { addEditMenuDish } from '../../services/MenuService'

export default {
  name: "AddEditDishModal",
  beforeMount() {
    this.dish = { ...this.initialDish }
  },
  mounted() {
    // Initializing modal instance
    var elem= document.querySelector('.addEditDishModal')
    this.modalInstance = M.Modal.init(elem)
  },
  props: {
    onAddEditDishSuccess: Function
  },
  data() {
    return {
      loading: false,
      formInvalid: false,
      modalInstance: null,
      isModalSubmitted: false,
      parentProps: {},
      foodTypes: foodTypes,
      foodCategories: foodCategories,
      currency: menuDishesCurrency,
      timeUnits: time,
      statuses: dishStatuses,
      timeSlots: timeSlots,
      days: days,
      dish: {},
      initialDish: {
        name: '',
        shortDesc: '',
        foodType: '',
        quantity: '',
        price: '',
        category: '',
        slotsAvailabe: [],
        daysAvailable: [],
        waitTime: '',
        timeUnit: '',
        status: ''
      }
    }
  },
  methods: {
    openModal() {
      if (!this.dish._id) {
        this.dish = { ...this.initialDish }
      }
      this.validate()
      this.modalInstance.open()
    },
    closeModal() {
      this.modalInstance.close()
    },
    validate() {
      const ignoreKeys = ['_Changed', '_Created', '_id']
      this.formInvalid = Object.entries(this.dish).some(item => { console.log(item)
        return ignoreKeys.indexOf(item[0]) < 0 && item[1].length === 0})
        || this.dish.price < 1 || this.dish.waitTime < 1
      return this.formInvalid
    },
    addEditDish() {
      if (this.validate()) {
        return
      }
      this.loading = true
      try {
        addEditMenuDish(this.dish).then(response => {
          if (response.status !== "OK") {
            throw "Unable to process Menu Dish"
          }
          this.$emit('onAddEditDishSuccess')
          this.loading = false
          M.toast({ html: `Dish ${this.dish._id ? 'Updated' : 'Added'} Successfully!` })
        })
      } catch (e) {
        this.loading = false
        console.error(e)
      }
      this.closeModal()
    }
  },
  beforeDestroy() {
    this.modalInstance.destroy()
    this.dish = { ...this.initialDish }
    this.formInvalid = false
  }
}
</script>