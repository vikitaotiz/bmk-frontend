<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
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
        <q-btn icon="add" label="Add New User" color="green" @click="createUpdateUser = true" />
      </template>
      <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat dense icon="mode_edit" color="secondary" @click="editUser(props.row)"></q-btn>
            <q-btn flat dense icon="delete" color="negative" @click="confirmDeleteUser(props.row)"></q-btn>
          </q-td>
      </template>
    </q-table>

    <q-dialog v-model="createUpdateUser" persistent >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Add New User</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row q-gutter-sm">
            <div class="col">
              <q-input dense outlined v-model="name" label="Name" class="q-mb-sm" />
            </div>
            <div class="col">
              <q-input dense outlined v-model="email" label="Email" class="q-mb-sm" />
            </div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col">
              <q-select
                  class="q-mb-sm"
                  dense
                  filled
                  v-model="role_id"
                  use-input
                  input-debounce="0"
                  label="Select Role"
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
              <q-input dense outlined v-model="password" label="Password" type="password" class="q-mb-sm" />
            </div>
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn flat label="Cancel" color="negative" v-close-popup />
          <q-space />
          <q-btn flat label="Save" v-if="name" color="primary" @click="saveUser()" />
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
          <q-btn flat label="Delete" @click="deleteUser()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { exportFile, Notify } from 'quasar'
import moment from 'moment'
import { app_url, headers } from "src/components/GlobalConfig"

const submitUser = async (method, data) => {
    const res = await fetch(app_url+"users/", { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const updateUser = async (method, car_id, data) => {
    const res = await fetch(app_url+"users/"+car_id, { method, headers, body: JSON.stringify(data) })
    return res.json()
}

const removeUser = async (method, car_id) => {
    const res = await fetch(app_url+"users/"+car_id, { method, headers })
    return res.json()
}

const getUsers = async () => {
    const res = await fetch(app_url+"users" , {headers})
    return res.json()
}

const getRoles = async () => {
    const res = await fetch(app_url+"roles" , {headers})
    return res.json()
}

export default {
    data() {
        return {
          createUpdateUser: false,
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
            { name: 'email', label: 'Email', field: 'email', sortable: true },
            { name: 'role', label: 'Role', field: 'role', sortable: true },
            { name: 'created_at', label: 'Created On', field: 'created_at', sortable: true },
            { name: 'actions', label: 'Action' }
          ],
          rows: [],
          roles: [],
          options1: [],
          
          name: "",
          email: "",
          password: "",
          role_id: "",
          user: ""
        }
    },

    created(){
        this.fetchUsers()
        this.fetchRoles()
    },

    methods: {
        notifyUser(message, color, icon) {
            Notify.create({ message, position: "top-right", color, icon })
        },

        filterFn1 (val, update) {
          if (val === '') update(() => this.options1 = this.roles )
          update(() => this.options1 = this.roles.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1))
        },

        async fetchUsers() {
          let res = await getUsers()
          if (res.length){
            res.forEach(val => {
              let data = {
                  id: val.id,
                  name: val.name,
                  email: val.email,
                  role: val.role.name,
                  created_at: moment(val.created_at).format('MMMM Do YYYY, h:mm A')
              }
              this.rows.push(data)
            })
          }
        },

        async fetchRoles() {
            const res = await getRoles()
            if (res.length){
              res.forEach(val => {
                  const data = { label: val.name, value: val.id }
                  this.roles.push(data)
                  this.options1 = this.roles
                })
            }
        },

        async saveUser() {
            const data = {
                name: this.name,
                email: this.email,
                role_id: this.role_id,
                password: this.password,
                // created_at: moment().format('MMMM Do YYYY, h:mm A')
            }

            // console.log(data)

            if (!this.edit){
                // add new car category
                const res = await submitUser("POST", data)
                if (res) {
                    this.createUpdateUser = false
                    this.rows = []
                    this.fetchUsers()
                    this.notifyUser('User added successfully', 'orange', 'warning')
                }
            }

            if (this.edit){
                // edit new car category
                const res = await updateUser("PUT", this.user.id, data)
                if (res) {
                    this.createUpdateUser = false
                    this.rows = []
                    this.fetchUsers()
                    this.edit = false
                    this.user = ""
                    this.notifyUser('User updated successfully', 'orange', 'warning')
                }
            }
            
        },

        confirmDeleteUser(data) {
            this.confirmDelete = true
            this.user = data
        },

        async deleteUser(){
            const res = await removeUser("DELETE", this.user.id)
            if (res === 1) {
                this.confirmDelete = false
                this.rows.splice(this.rows.indexOf(this.user), 1)
                this.notifyUser('User deleted successfully', 'orange', 'warning')
            }
        },

        editUser(data) {
            this.name = data.name
            this.edit = true
            this.createUpdateUser = true
            this.user = data
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