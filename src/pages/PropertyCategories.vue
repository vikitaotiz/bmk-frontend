<template>
  <div class="q-pa-md">
    <q-table
      title="Property Categories"
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
        <q-btn icon="add" label="Add New Property Category" color="green" @click="createUpdatePropertyCategory = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense icon="mode_edit" color="secondary" @click="editPropertyCategory(props.row)"></q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDeletePropertyCategory(props.row)"></q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createUpdatePropertyCategory" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New Property Category</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input dense outlined v-model="name" label="Name" class="q-mb-sm" />
            <q-input outlined v-model="description" type="textarea" label="Description" />
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-space />
          <q-btn flat label="Save" v-if="name" color="primary" @click="savePropertyCategory()" />
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
          <q-btn flat label="Delete" @click="deletePropertyCategory()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import moment from 'moment'
import { app_url, headers } from "src/components/GlobalConfig"

const submitPropertyCategory = async (method, data) => {
    const res = await fetch(app_url+"property_categories", { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const updatePropertyCategory = async (method, category_id, data) => {
    const res = await fetch(app_url+"property_categories/"+category_id, { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const removePropertyCategory = async (method, category_id) => {
    const res = await fetch(app_url+"property_categories/"+category_id, { method, headers })
    return res.json()
}

export default {
    data() {
        return {
          createUpdatePropertyCategory: false,
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
            { name: 'created_at', label: 'Created On', field: 'created_at', sortable: true },
            { name: 'actions', label: 'Action' }
          ],
          rows: [],
          
          name: "",
          description: "",
          property_category: ""
        }
    },

    created(){
        this.fetchPropertyCategories()
    },

    methods: {
        notifyUser(message, color, icon) {
            Notify.create({ message, position: "top-right", color, icon })
        },

        fetchPropertyCategories() {
            this.$api.get("property_categories").then(res => {
                res.data.forEach(val => {
                    let data = {
                        id: val.id,
                        name: val.name,
                        description: val.description,
                        created_at: moment(val.created_at).format('MMMM Do YYYY, h:mm A')
                    }

                    this.rows.push(data)
                })
            }).catch(error => {
                console.log(error)
            })
        },

        async savePropertyCategory() {
            const data = {
                name: this.name,
                description: this.description,
                created_at: moment().format('MMMM Do YYYY, h:mm A')
            }

            if (!this.edit){
                // add new property category
                const res = await submitPropertyCategory("POST", data)
                if (res) {
                    this.createUpdatePropertyCategory = false
                    this.rows.unshift(data)
                    this.notifyUser('Category added successfully', 'primary', 'warning')
                }
            }

            if (this.edit){
                // edit new property category
                const res = await updatePropertyCategory("PUT", this.property_category.id, data)
                if (res) {
                    this.createUpdatePropertyCategory = false
                    this.rows = []
                    this.fetchPropertyCategories()
                    this.edit = false
                    this.property_category = ""
                    this.notifyUser('Category updated successfully', 'primary', 'warning')
                }
            }
            
        },

        confirmDeletePropertyCategory(data) {
            this.confirmDelete = true
            this.property_category = data
        },

        async deletePropertyCategory(){
            const res = await removePropertyCategory("DELETE", this.property_category.id)
            if (res === 1) {
                this.confirmDelete = false
                this.rows.splice(this.rows.indexOf(this.property_category), 1)
                this.notifyUser('Category deleted successfully', 'primary', 'warning')
            }
        },

        editPropertyCategory(data) {
            this.name = data.name
            this.description = data.description
            this.edit = true
            this.createUpdatePropertyCategory = true
            this.property_category = data
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