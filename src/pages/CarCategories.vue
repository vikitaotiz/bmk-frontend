<template>
  <div class="q-pa-md">
    <q-table
      title="Car Categories"
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
        <q-btn icon="add" label="Add New Car Category" color="green" @click="createUpdateCarCategory = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense icon="mode_edit" color="secondary" @click="editCarCategory(props.row)"></q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDeleteCarCategory(props.row)"></q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createUpdateCarCategory" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New Car Category</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input dense outlined v-model="name" label="Name" class="q-mb-sm" />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-space />
          <q-btn flat label="Save" v-if="name" color="primary" @click="saveCarCategory()" />
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
          <q-btn flat label="Delete" @click="deleteCarCategory()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import moment from 'moment'
import { app_url, headers } from "src/components/GlobalConfig"

const submitCarCategory = async (method, data) => {
    const res = await fetch(app_url+"car_categories/", { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const updateCarCategory = async (method, car_id, data) => {
    const res = await fetch(app_url+"car_categories/"+car_id, { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const removeCarCategory = async (method, car_id) => {
    const res = await fetch(app_url+"car_categories/"+car_id, { method, headers })
    return res.json()
}

export default {
    data() {
        return {
          createUpdateCarCategory: false,
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
            { name: 'created_at', label: 'Created On', field: 'created_at', sortable: true },
            { name: 'actions', label: 'Action' }
          ],
          rows: [],
          
          name: "",
          car_category: ""
        }
    },

    created(){
        this.fetchCarCategories()
    },

    methods: {
        notifyUser(message, color, icon) {
            Notify.create({ message, position: "top-right", color, icon })
        },

        fetchCarCategories() {
            this.$api.get("car_categories").then(res => {
                res.data.forEach(val => {
                    let data = {
                        id: val.id,
                        name: val.name,
                        created_at: moment(val.created_at).format('MMMM Do YYYY, h:mm A')
                    }

                    this.rows.push(data)
                })
            }).catch(error => {
                console.log(error)
            })
        },

        async saveCarCategory() {
            const data = {
                name: this.name,
                created_at: moment().format('MMMM Do YYYY, h:mm A')
            }

            if (!this.edit){
                // add new car category
                const res = await submitCarCategory("POST", data)
                if (res) {
                    this.createUpdateCarCategory = false
                    this.rows.unshift(data)
                    this.notifyUser('Category added successfully', 'orange', 'warning')
                }
            }

            if (this.edit){
                // edit new car category
                const res = await updateCarCategory("PUT", this.car_category.id, data)
                if (res) {
                    this.createUpdateCarCategory = false
                    this.rows = []
                    this.fetchCarCategories()
                    this.edit = false
                    this.car_category = ""
                    this.notifyUser('Category updated successfully', 'orange', 'warning')
                }
            }
            
        },

        confirmDeleteCarCategory(data) {
            this.confirmDelete = true
            this.car_category = data
        },

        async deleteCarCategory(){
            const res = await removeCarCategory("DELETE", this.car_category.id)
            if (res === 1) {
                this.confirmDelete = false
                this.rows.splice(this.rows.indexOf(this.car_category), 1)
                this.notifyUser('Category deleted successfully', 'orange', 'warning')
            }
        },

        editCarCategory(data) {
            this.name = data.name
            this.edit = true
            this.createUpdateCarCategory = true
            this.car_category = data
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