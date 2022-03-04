<template>
  <div class="q-pa-md">
    <q-table
      title="Addresses"
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
        <q-btn icon="add" label="Add New Address" color="green" @click="createUpdateAddress = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense icon="mode_edit" color="secondary" @click="editAddress(props.row)"></q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDeleteAddress(props.row)"></q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createUpdateAddress" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New Address</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-gutter-sm">
            <div class="col">
              <q-select
                    class="q-mb-sm"
                    dense
                    filled
                    v-model="city_id"
                    use-input
                    input-debounce="0"
                    label="Select City"
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
            <div class="col">
              <q-input dense outlined v-model="name" label="Name" class="q-mb-sm" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-space />
          <q-btn flat label="Save" v-if="name" color="primary" @click="saveAddress()" />
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
          <q-btn flat label="Delete" @click="deleteAddress()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import moment from 'moment'
import { app_url, headers } from "src/components/GlobalConfig"

const submitAddress = async (method, data) => {
    const res = await fetch(app_url+"addresses", { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const updateAddress = async (method, category_id, data) => {
    const res = await fetch(app_url+"addresses/"+category_id, { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const removeAddress = async (method, category_id) => {
    const res = await fetch(app_url+"addresses/"+category_id, { method, headers })
    return res.json()
}

export default {
    data() {
        return {
          createUpdateAddress: false,
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
            { name: 'city', align: 'center', label: 'City', field: 'city', sortable: true },
            { name: 'created_at', label: 'Created On', field: 'created_at', sortable: true },
            { name: 'actions', label: 'Action' }
          ],
          rows: [],
          
          name: "",
          city_id: "",
          city: "",
          cities: [],
          options2: []
        }
    },

    created(){
        this.fetchAddresses()
        this.fetchCities()
    },

    methods: {
        notifyUser(message, color, icon) {
            Notify.create({ message, position: "top-right", color, icon })
        },

        filterFn2 (val, update) {
          if (val === '') update(() => this.options2 = this.cities )
          update(() => this.options2 = this.cities.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1))
        },

        fetchAddresses() {
            this.$api.get("addresses").then(res => {
                res.data.forEach(val => {
                    let data = {
                        id: val.id,
                        name: val.name,
                        city: val.city.name,
                        created_at: moment(val.created_at).format('MMMM Do YYYY, h:mm A')
                    }

                    this.rows.push(data)
                })
            }).catch(error => {
                console.log(error)
            })
        },

        fetchCities() {
            this.$api.get("cities").then(res => {
                res.data.forEach(val => {
                  const data = { label: val.name, value: val.id }
                  this.cities.push(data)
                  this.options2 = this.cities
                })
            }).catch(error => {
                console.log(error)
            })
        },

        async saveAddress() {
            const data = {
                name: this.name,
                city_id: this.city_id,
                created_at: moment().format('MMMM Do YYYY, h:mm A')
            }

            if (!this.edit){
                // add new property category
                const res = await submitAddress("POST", data)
                if (res) {
                    this.createUpdateAddress = false
                    this.rows = []
                    this.fetchAddresses()
                    this.notifyUser('Address added successfully', 'orange', 'warning')
                }
            }

            if (this.edit){
                // edit new property category
                const res = await updateAddress("PUT", this.city.id, data)
                if (res) {
                    this.createUpdateAddress = false
                    this.rows = []
                    this.fetchAddresses()
                    this.edit = false
                    this.city = ""
                    this.notifyUser('Address updated successfully', 'orange', 'warning')
                }
            }
            
        },

        confirmDeleteAddress(data) {
            this.confirmDelete = true
            this.city = data
        },

        async deleteAddress(){
            const res = await removeAddress("DELETE", this.city.id)
            if (res === 1) {
                this.confirmDelete = false
                this.rows.splice(this.rows.indexOf(this.city), 1)
                this.notifyUser('Address deleted successfully', 'orange', 'warning')
            }
        },

        editAddress(data) {
            this.name = data.name
            this.city_id = data.city_id
            this.edit = true
            this.createUpdateAddress = true
            this.city = data
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