<template>
  <q-layout view="lHh Lpr lFf" class="bg-image">
    <q-header class="bg-transparent text-white">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title class="text-weight-light" to="/">
          <span class="text-bold">(BMK)</span> Book Me Kenya
        </q-toolbar-title>
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <div v-if="user">
            {{user.name}}
            <q-btn round dense flat icon="fas fa-heart" @click="logout()" />
          </div>
          <div v-else>
            <q-btn square dense flat color="text-grey-7" to="/Login" label="Login" icon="lock">
              <q-tooltip>Login</q-tooltip>
            </q-btn>
            <q-btn square dense flat color="text-grey-7" to="/Register" label="Register" icon="lock">
              <q-tooltip>Register</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <section class="flex row flex-center q-py-sm" style="background: #001129; height: 100px;">
      <div class="text-weight-bold text-subtitle2 text-white ">
        Copyright © {{ year }}. Book Me Kenya.
      </div>
    </section>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { mapGetters, mapActions } from "vuex";

export default {
  data(){
    return {
      year: (new Date()).getFullYear(),
      property_categories: [],
      slide: ref(1),
      autoplay: ref(true),
      address: null,
      options1: [],
      addresses: [],
      guests: {
        adults: 1,
        children: 0,
        rooms: 1
      },
      booking_dates: [],
      setGuests: false,
      search_btn: false,
      output: false,
      booking: ""
    }
  },

  mounted() {
    if (localStorage.getItem("authToken")) {
      this.getUserData();
    }
  },

  computed: {
    ...mapGetters("auth", ["user"])
  },

  created(){
    this.$api.get("property_categories").then(res => {
      this.property_categories = res.data
    }).catch(error => {
      console.log(error)
    })

    this.$api.get("addresses").then(res => {
      res.data.forEach(val => {
        this.addresses.push({value: val.id, label: val.name})
      })
    }).catch(error => {
      console.log(error)
    })
  },

  methods: {
    ...mapActions("auth", ["sendLogoutRequest", "getUserData"]),

    setDate(){
      if (this.address && this.booking_dates){
        this.search_btn = true
      }
    },

    filterFn1 (val, update) {
      if (val === '') update(() => this.options1 = this.addresses )
      update(() => this.options1 = this.addresses.filter(v => v.label.toLowerCase().indexOf(val.toLowerCase()) > -1))
    },

    increment(data){
      this.guests[data] ++
    },

    decrement(data){
      if (data === "children"){
        if (this.guests[data] > 0 ) this.guests[data] --
      } else {
        if (this.guests[data] > 1 ) this.guests[data] --
      }
    },

    searchBookings(){
      const data = {
        address: this.addresses.find(val => val.value === this.address).label,
        booking_dates: this.booking_dates,
        guests: this.guests
      }

      this.booking = data
      this.output = true
    },

    logout(){      
      this.sendLogoutRequest();
      this.$router.push("/");
    }
  }
}
</script>

<style>
.bg-image {
  background: #003580;
}

.bg-text {
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0, 0.4); /* Black w/opacity/see-through */
  color: white;
  font-weight: bold;
  border: 1px solid #f1f1f1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 20px;
  text-align: center;
}
</style>
