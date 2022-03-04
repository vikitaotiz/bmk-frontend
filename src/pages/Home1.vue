<template>
  <q-layout view="lHh Lpr lFf" class="bg-image">
    <q-header class="bg-transparent text-white">
      <q-toolbar class="q-pa-md">
        <q-toolbar-title class="text-weight-light">
          <span class="text-bold">(BMK)</span> Book Me Kenya
        </q-toolbar-title>
        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn square dense flat color="text-grey-7" to="/Login" label="Login" icon="lock">
            <q-tooltip>Login</q-tooltip>
          </q-btn>
          <q-btn square dense flat color="text-grey-7" to="/Register" label="Register" icon="lock">
            <q-tooltip>Register</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div>
    <q-carousel
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      :autoplay="autoplay"
    >
      <q-carousel-slide :name="1" img-src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Mount_Kenya.jpg">
        <div class="absolute-center custom-caption q-pa-sm bg-text">
          <div class="text-h2">Mount Kenya</div>
          <q-separator style="border: 1px solid #fff;" />
          <div class="text-subtitle1">Found In Kenya</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="2" img-src="https://cdn.britannica.com/34/153434-050-863E8023/Mount-Kilimanjaro-Tanzania.jpg">
        <div class="absolute-center custom-caption bg-text">
          <div class="text-h2">Mount Kilimanjaro</div>
          <q-separator style="border: 1px solid #fff;" />
          <div class="text-subtitle1">Found In Tanzania</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="3" img-src="https://cdn-images.go2africa.com/wp-content/uploads/2021/04/19071308/migration-rekero-go2africa.jpg">
        <div class="absolute-center custom-caption bg-text">
          <div class="text-h2">Buffalo Migration</div>
          <q-separator style="border: 1px solid #fff;" />
          <div class="text-subtitle1">Found In Kenya and Tanzania</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide :name="4" img-src="https://cdn2.hubspot.net/hubfs/439788/Blog/Featured%20Images/Best%20Hotel%20Website%20Designs.jpg">
        <div class="absolute-center custom-caption bg-text">
          <div class="text-h2">Hotel Room</div>
          <q-separator style="border: 1px solid #fff;" />
          <div class="text-subtitle1">Found In Nairobi</div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    
    <div class="row shadow-20" style="width: 80%; margin: auto; background: orange;">
      <div class="col-xs-12 col-sm-6" style="border: 2px solid orange; background: #fff;">
        <q-select
            dense
            filled
            v-model="address"
            use-input
            input-debounce="0"
            label="Select Location"
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
      <div class="col-xs-12 col-sm-2" style="border: 2px solid orange; background: #fff;">
         
         <q-btn icon="event" flat color="primary" class="full-width" style="height: 100%;">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="booking_dates" range>
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-space />
                  <q-btn label="OK" color="primary" flat @click="setDate" v-close-popup />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-btn>
      
      </div>
      <div class="col-xs-12 col-sm-2" style="border: 2px solid orange; background: #fff;">
        <q-btn @click="setGuests = true" label="Guests" class="full-width" color="orange" flat style="height: 100%;" />
      </div>
      <div class="col-xs-12 col-sm-2" style="border: 2px solid orange; background: #fff;" v-if="search_btn">
        <q-btn @click="searchBookings()" label="Search" class="full-width" color="secondary" flat style="height: 100%;" />
      </div>
    </div>
    <small v-if="output" style="width: 80%; margin: auto; color: white;" class="row q-mt-sm">
      Address: {{booking.address}} | Date(s): {{booking.booking_dates}} | Guest(s): {{booking.guests}}
    </small>

  </div>
      <section style="min-height: 25vh;" class="flex text-white flex-center layout_bg">
        <div style="position: relative">
          <div class="text-h4 text-center">
            Pick the best place for you
          </div>
          <q-separator class="q-mt-md" style="border: 1px solid" />
          <div class="text-subtitle2 q-pt-sm text-center">
            Explore Kenya
          </div>
        </div>
      </section>
      <section class="q-pb-lg">
        <div class="row q-pa-md">
          <div class="col-xs-12 col-sm-3 q-pa-sm" v-for="(category, index) in property_categories" :key="index">
           <q-card class="my-card">
              <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
                <div class="absolute-bottom">
                  <div class="text-h6">{{category.name}}</div>
                  <q-separator inset />
                  <div class="text-subtitle">{{category.description}}</div>
                </div>
              </q-img>

              <q-card-actions>
                <div class="text-subtitle2">Properties: {{category.properties.length}}</div>
                <q-space />
                <q-btn v-if="category.properties.length" flat @click="$router.push({ path: `/PropertyCategory/${category.id}` })">view</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </section>
    </q-page-container>

    <section class="flex row flex-center q-py-sm" style="background: #001129; height: 100px;">
      <div class="text-weight-bold text-subtitle2 text-white ">
        Copyright © {{ year }}. Book Me Kenya.
      </div>
    </section>

    <q-dialog v-model="setGuests" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card class="bg-primary text-white" style="width: 700px; max-width: 80vw;">
        <q-bar>
          <strong>Add Guests</strong>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="row q-gutter-sm q-mb-sm">
            <div class="col q-pa-sm" style="border: 1px solid #ccc;">Adults</div>
            <div class="col q-pa-sm" style="border: 1px solid #ccc; text-align: center;">
              <q-btn icon="arrow_left" flat dense @click="decrement('adults')" /> {{ guests.adults }} <q-btn icon="arrow_right" flat dense @click="increment('adults')" /></div>
          </div>
          <div class="row q-gutter-sm q-mb-sm">
            <div class="col q-pa-sm" style="border: 1px solid #ccc;">
              <b>Children</b><br>
              <small>Between the ages of 0 and 17 years old.</small>
            </div>
            <div class="col q-pa-sm" style="border: 1px solid #ccc; text-align: center;">
              <q-btn icon="arrow_left" flat dense @click="decrement('children')" /> {{ guests.children }} <q-btn icon="arrow_right" flat dense @click="increment('children')" /></div>
          </div>
          <div class="row q-gutter-sm">
            <div class="col q-pa-sm" style="border: 1px solid #ccc;">Rooms</div>
            <div class="col q-pa-sm" style="border: 1px solid #ccc; text-align: center;">
              <q-btn icon="arrow_left" flat dense  @click="decrement('rooms')" /> {{ guests.rooms }} <q-btn icon="arrow_right" flat dense  @click="increment('rooms')" /></div>
          </div>
          <q-btn label="Confirm Guests" class="full-width q-mt-sm" color="secondary" @click="setGuests = false" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import { ref } from 'vue'

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
