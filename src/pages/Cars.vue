<template>
  <div class="q-pa-md">
    <q-table
      title="Cars"
      :rows="rows"
      :columns="columns"
      color="primary"
      row-key="name"
    >
    <q-separator />
      <template v-slot:top-right>
        <q-btn
          color="orange"
          icon="archive"
          label="Export to csv"
          no-caps
          @click="exportTable"
          class="q-mr-md"
        />
        <q-btn icon="add" label="Add New Car" color="green" @click="createUpdateCar = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense icon="mode_edit" color="secondary" @click="editCar(props.row)"></q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDeleteCar(props.row)"></q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createUpdateCar" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New Car</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <div class="row q-gutter-sm">
              <div class="col">
                <q-select
                  class="q-mb-sm"
                  dense
                  filled
                  v-model="car_category_id"
                  use-input
                  input-debounce="0"
                  label="Select Car Category"
                  :options="options1"
                  @filter="filterFn1"
                  behavior="menu"
                  emit-value
                  map-options
                >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              </div>
              <div class="col">
                <q-select
                    class="q-mb-sm"
                    dense
                    filled
                    v-model="country_id"
                    use-input
                    input-debounce="0"
                    label="Select Country"
                    :options="options2"
                    @filter="filterFn2"
                    behavior="menu"
                    emit-value
                    map-options
                  >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <q-input dense outlined v-model="name" label="Name" class="q-mb-sm" />
            <q-input outlined v-model="description" type="textarea" label="Description" />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-space />
          <q-btn flat label="Save" v-if="name" color="primary" @click="saveCar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDelete" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-negative text-white">
        <q-bar>
          <q-icon name="warning" />         
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6"><q-icon name="warning" /> Are you sure?</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
            This process is permanent and cannot be undone...
        </q-card-section>
        <q-separator color="white" />
        <q-card-actions>
          <q-btn flat label="Cancel" v-close-popup />
          <q-space />
          <q-btn flat label="Delete" @click="deleteCar()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import { app_url, headers } from "src/components/GlobalConfig"
import moment from 'moment'

const submitCar = async (method, data) => {
    const res = await fetch(app_url+"cars", { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const updateCar = async (method, car_id, data) => {
    const res = await fetch(app_url+"cars/"+car_id, { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const removeCar = async (method, car_id) => {
    const res = await fetch(app_url+"cars/"+car_id, { method, headers })
    return res.json()
}

export default {
    data() {
        return {
          createUpdateCar: false,
          edit: false,
          confirmDelete: false,
          columns: [
            {
                name: 'name',
                required: true,
                label: 'Name',
                align: 'left',
                field: row => row.name,
                format: val => `${val}`,
                sortable: true
            },
            { name: 'description', align: 'center', label: 'Description', field: 'description', sortable: true },
            { name: 'category', align: 'center', label: 'Category', field: 'category', sortable: true },
            { name: 'country', align: 'center', label: 'Country', field: 'country', sortable: true },
            { name: 'created_at', label: 'Created On', field: 'created_at', sortable: true },
            { name: 'actions', label: 'Action' }
          ],
          rows: [],
          
          car_category_id: "",
          country_id: "",
          name: "",
          description: "",
          property: "",
          categories: [],
          countries: [],
          options1: [],
          options2: []
        }
    },

    created(){
        this.fetchCars()
        this.fetchCarCategories()
        this.fetchCountries()
    },

    methods: {
        notifyUser(message, color, icon) {
            Notify.create({ message, position: "top-right", color, icon })
        },

        filterFn1 (val, update) {
          if (val === '') update(() => this.options1 = this.categories )
          update(() => this.options1 = this.categories.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1))
        },

        filterFn2 (val, update) {
          if (val === '') update(() => this.options2 = this.countries )
          update(() => this.options2 = this.countries.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1))
        },

        fetchCars() {
            this.$api.get("cars").then(res => {
                res.data.forEach(val => {
                    let data = {
                        id: val.id,
                        name: val.name,
                        category: val.car_category.name,
                        country: val.country.name,
                        description: val.description,
                        created_at: moment(val.created_at).format('MMMM Do YYYY, h:mm A')
                    }

                    this.rows.push(data)
                })
            }).catch(error => {
                console.log(error)
            })
        },

        fetchCarCategories() {
            this.$api.get("car_categories").then(res => {
                res.data.forEach(val => {
                  const data = { label: val.name, value: val.id }
                  this.categories.push(data)
                  this.options1 = this.categories
                })
            }).catch(error => {
                console.log(error)
            })
        },

        fetchCountries() {
            this.$api.get("countries").then(res => {
                res.data.forEach(val => {
                  const data = { label: val.name, value: val.id }
                  this.countries.push(data)
                  this.options2 = this.countries
                })
            }).catch(error => {
                console.log(error)
            })
        },

        async saveCar() {
            const data = {
                name: this.name,
                description: this.description,
                car_category_id: this.car_category_id,
                country_id: this.country_id,
                created_at: moment().format('MMMM Do YYYY, h:mm A')
            }

            if (!this.edit){
                // add new property category
                const res = await submitCar("POST", data)
                if (res) {
                    this.createUpdateCar = false
                    this.rows = []
                    this.fetchCars()
                    this.notifyUser('Car added successfully', 'orange', 'warning')
                }
            }

            if (this.edit){
                // edit new property category
                const res = await updateCar("PUT", this.property.id, data)
                if (res) {
                    this.createUpdateCar = false
                    this.rows = []
                    this.fetchCars()
                    this.edit = false
                    this.property = ""
                    this.notifyUser('Car updated successfully', 'orange', 'warning')
                }
            }
            
        },

        confirmDeleteCar(data) {
            this.confirmDelete = true
            this.property = data
        },

        async deleteCar(){
            const res = await removeCar("DELETE", this.property.id)
            if (res === 1) {
                this.confirmDelete = false
                this.rows.splice(this.rows.indexOf(this.property), 1)
                this.notifyUser('Car deleted successfully', 'orange', 'warning')
            }
        },

        editCar(data) {
            this.name = data.name
            this.description = data.description
            this.edit = true
            this.createUpdateCar = true
            this.property = data
        },

        exportTable () {
            // naive encoding to csv format
            const content = [this.columns.map(col => this.wrapCsvValue(col.label))].concat(
            this.rows.map(row => this.columns.map(col => this.wrapCsvValue(
                typeof col.field === 'function'
                ? col.field(row)
                : row[ col.field === void 0 ? col.name : col.field ],
                col.format
            )).join(','))
            ).join('\r\n')

            const status = exportFile(
            'table-export.csv',
            content,
            'text/csv'
            )

            if (status !== true) {
                this.notifyUser('Browser denied file download...', 'negative', 'warning')
            }
        },
        wrapCsvValue(val, formatFn) {
            let formatted = formatFn !== void 0
                ? formatFn(val)
                : val

            formatted = formatted === void 0 || formatted === null
                ? ''
                : String(formatted)

            formatted = formatted.split('"').join('""')
            return `"${formatted}"`
        }        
    }
}
</script>