<style>
  @import './MenuDishes.css';
</style>
<template>
  <div id="menu-dishes" class="row">
    <div class="col s12 loader-wrapper center-align" v-if="loading">
      <Loader size="big"/>
    </div>
    <div class="col s12" v-if="!loading">
      <div class="center-align heading strong">Menu Dishes</div>
      <!-- Add Menu Button -->
      <a
        class="waves-effect waves-light btn add-dish-btn"
        @click="handleAddEdit()">
        Add Dish
      </a>

      <table class="striped responsive-table">
        <thead>
          <tr>
              <th>S.no.</th>
              <th>Dish Name</th>
              <th>Description</th>
              <th>Meat / Veges</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Wait time</th>
              <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(dish, index) in menuDishes" :key="dish.id">
            <td>{{ index + 1 }}</td>
            <td>{{ dish.name }}</td>
            <td>{{ dish.shortDesc }} <span class="strong" v-if="dish.quantity">- {{ dish.quantity }}</span></td>
            <td>{{ dish.foodType }}</td>
            <td>{{ dish.category }}</td>
            <td>{{ dish.price }} {{ currency }}</td>
            <td>{{ getAvailability(dish) }}</td>
            <td>{{ getWaitTime(dish) }}</td>
            <td>
              <a class="waves-effect edit-icon" @click="handleAddEdit(dish)">
                <PencilIcon />
              </a>
              <a class="waves-effect delete-icon" @click="handleDelete(dish._id)">
                <DeleteIcon />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="center-align no-dish-found" v-if="!menuDishes.length">
        <span class="strong">No Dish Found</span>
      </div>
    </div>
    <!-- Confirmation modal used for deleting dish -->
    <ConfirmationModal
      heading="Confirm Delete?"
      text="Are you sure, you want to delete this dish?"
      actionBtn="Delete"
      closeBtn="Cancel"
      @onActionBtn="deleteDish"
      ref="confirmationModal" />

    <!-- Add / Edit modal for adding and editing a dish -->
    <AddEditDishModal
      @onAddEditDishSuccess="getMenuDishes"
      ref="addEditDishModal" />
  </div>
</template>

<script>
import { getMenuDishes, deleteMenuDish } from '../services/MenuService';
import { days, timeSlots, time, menuDishesCurrency } from '../constants/commonConstants';
import Loader from './CommonComponents/Loader';
import ConfirmationModal from './CommonComponents/ConfirmationModal';
import AddEditDishModal  from './MenuComponents/AddEditDishModal';
import PencilIcon from 'vue-material-design-icons/Pencil';
import DeleteIcon from 'vue-material-design-icons/Delete';
import M from 'materialize-css'

export default {
  name: "MenuDishes",
  mounted() {
    this.getMenuDishes()
  },
  components: {
    Loader,
    AddEditDishModal,
    ConfirmationModal,
    PencilIcon,
    DeleteIcon
  },
  data() {
    return {
      loading: true,
      menuDishes: [],
      currency: menuDishesCurrency
    }
  },
  methods: {
    // Get all menu dishes
    getMenuDishes() {
      this.loading = true
      try {
        getMenuDishes().then(response => {
          if (response.status !== "OK") {
            throw "Unable to get Menu Dishes"
          }
          this.menuDishes = response.data
          this.loading = false
        })
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    // Get availability of dish on time slot and days
    getAvailability(dish) {
      if (dish.status === 'Sold out') {
        return dish.status
      }
      const daysAvailable = dish.daysAvailable.map(day => days[day] || day)
      const timeSlotsAvailable = dish.slotsAvailabe.map(slot => timeSlots[slot] || slot)
      return timeSlotsAvailable.join(', ')
        + ' and ' + daysAvailable.join(', ')
    },
    // Get wait time to prepare the dish
    getWaitTime(dish) {
      return dish.waitTime + ' ' + 
        (time[dish.timeUnit] || dish.timeUnit )
    },
    handleAddEdit(dish) {
      this.$refs.addEditDishModal.dish = { ...dish }
      this.$refs.addEditDishModal.openModal()
    },
    handleDelete(id) {
      this.$refs.confirmationModal.openModal({id: id})
    },
    // delete selected dish
    deleteDish({ id }) {
      this.loading = true
      try {
        if (!id) {
          throw "Unable to get Menu Dish ID"
        }
        deleteMenuDish(id).then(response => {
          if (response.status !== "OK") {
            throw "Unable to delete Menu Dish"
          }
          M.toast({ html: response.message })
          this.getMenuDishes()
          this.loading = false
        })
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    }
  }
}
</script>