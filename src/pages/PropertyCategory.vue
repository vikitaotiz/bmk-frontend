<template>
  <div>
    <q-page-container>        

      <div class="q-pa-lg" style="background: #fff;" v-if="category">
          <div class="text-center q-mb-sm" style="border-bottom: 1px solid;">
              <h4>{{category.category}}</h4>
              <small>{{category.category_description}}</small>
          </div>

        <div v-for="(property, index) in category.properties" :key="index">
            <q-card class="my-card q-mb-md" flat bordered>
            <q-card-section style="padding: 0px;">
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-carousel
                            swipeable
                            animated
                            v-model="slide"
                            thumbnails
                            infinite
                            :autoplay="true"
                            >
                            <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg" />
                            <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg" />
                            <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg" />
                            <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg" />
                        </q-carousel>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                        <q-card-section>
                            <b>{{property.name}}</b>
                            <q-separator />
                            <p>{{property.description}}</p>
                        </q-card-section>
                    </div>
                </div>
            </q-card-section>

            <q-separator />

            <q-card-actions>
                <q-btn flat round icon="event" />
                <q-btn flat>
                5:30PM
                </q-btn>
                <q-btn flat>
                7:00PM
                </q-btn>
                <q-space />
                <q-btn flat color="primary" @click="bookProperty(property)">
                Book Property
                </q-btn>
            </q-card-actions>
         </q-card>
        </div>

      </div>
    </q-page-container>

    <q-dialog v-model="bookDialog" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card style="width: 700px; max-width: 80vw;">
        <q-bar>
          <strong>Book {{propertySelected.name}} in {{propertySelected.address_id}}</strong>

          <q-space />

          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
         <div v-if="!propertyBooked">
           <div v-if="user">
              <div class="row">
                  <div class="col-xs-12 col-sm-6" style="border: 2px solid orange; background: #fff;">
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
                  <div class="col-xs-12 col-sm-6" style="border: 2px solid orange; background: #fff;">
                    <q-btn @click="setGuests = true" label="Guests" class="full-width" color="orange" flat style="height: 100%;" />
                  </div>
              </div>
              <div v-if="booking_dates.from">
                <q-list bordered dense class="q-mt-sm">
                  <q-item>
                      <q-item-section>Name</q-item-section>
                      <q-item-section avatar>
                        {{propertySelected.name}}
                      </q-item-section>
                    </q-item><q-separator />
                    <q-item>
                      <q-item-section>Location</q-item-section>
                      <q-item-section avatar>
                        {{propertySelected.address_id}}
                      </q-item-section>
                    </q-item><q-separator />
                    <q-item>
                      <q-item-section>Dates</q-item-section>
                      <q-item-section avatar>
                        From: {{booking_dates.from}} - 
                        To: From: {{booking_dates.to}}
                      </q-item-section>
                    </q-item><q-separator />
                    <q-item>
                      <q-item-section>Days</q-item-section>
                      <q-item-section avatar>{{days}}</q-item-section>
                    </q-item><q-separator />
                    <q-item>
                      <q-item-section>Guests</q-item-section>
                      <q-item-section avatar>
                        Adults: {{guests.adults}} - 
                        Children: {{guests.children}} - 
                        Rooms: {{guests.rooms}}
                      </q-item-section>
                    </q-item>
                </q-list>
                <div class="q-mt-md q-mb-md"><q-checkbox v-model="additional_notes" dense /> Additional Notes</div>
                <q-input
                    v-if="additional_notes"
                    v-model="notes"
                    outlined
                    type="textarea"
                  />
                <q-btn dense class="q-mt-sm full-width" color="primary" label="Confirm Booking" @click="confirmBooking" />
              </div>
            </div>
            <div v-else>
                <q-splitter
                  v-model="splitterModel"
                  style="height: 250px"
                >

                  <template v-slot:before>
                    <q-tabs
                      v-model="tab"
                      vertical
                      class="text-teal"
                    >
                      <q-tab name="login" icon="delete" label="Login" />
                      <q-separator />
                      <q-tab name="register" icon="alarm" label="Register" />
                    </q-tabs>
                  </template>

                  <template v-slot:after>
                    <q-tab-panels
                      v-model="tab"
                      animated
                      swipeable
                      vertical
                      transition-prev="jump-up"
                      transition-next="jump-up"
                    >
                      <q-tab-panel name="login">
                        <div class="text-h4 q-mb-md">Login</div>
                        <q-form class="q-gutter-md">
                            <div class="row q-gutter-sm">
                              <div class="col">
                                <q-input
                                  dense
                                  outlined
                                  v-model="loginField.email"
                                  label="Username"
                                  lazy-rules
                                />
                              </div>
                              <div class="col">
                                <q-input
                                  dense
                                  type="password"
                                  outlined
                                  v-model="loginField.password"
                                  label="Password"
                                  lazy-rules
                                />
                              </div>
                            </div>
                            <q-separator />
                            <div class="row">
                              <q-btn class="full-width" label="Login" @click="login()" type="button" color="secondary"/>
                            </div>
                          </q-form>
                      </q-tab-panel>

                      <q-tab-panel name="register">
                        <div class="text-h4 q-mb-md">Register</div>
                          <q-form class="q-gutter-md">
                            <div class="row q-gutter-sm">
                              <div class="col">
                                <q-input
                                  dense
                                  outlined
                                  v-model="registerField.name"
                                  label="Name"
                                  lazy-rules
                                />
                              </div>
                              <div class="col">
                                <q-input
                                  dense
                                  outlined
                                  v-model="registerField.email"
                                  label="email"
                                  lazy-rules
                                />
                              </div>
                            </div>
                              
                            <div class="row q-gutter-sm">
                              <div class="col">
                                <q-input
                                  type="password"
                                  dense
                                  outlined
                                  v-model="registerField.password"
                                  label="Password"
                                  lazy-rules
                                />
                              </div>
                              <div class="col">
                                <q-input
                                  type="password"
                                  dense
                                  outlined
                                  v-model="registerField.password_confirmation"
                                  label="Password Confirmation"
                                  lazy-rules
                                />
                              </div>
                            </div>
                                                    
                          <q-separator />
                          <div class="row">
                            <q-btn dense class="full-width" label="Register" @click="register()" type="button" color="secondary" />
                          </div>
                          </q-form>
                      </q-tab-panel>
                    </q-tab-panels>
                  </template>

                </q-splitter>
            </div>
         </div>
         <div v-if="propertyBooked">
           <div class="row q-gutter-sm">
             <div class="col">
               <q-btn class="full-width" color="teal" label="Continue Booking" link dense />
             </div>
             <div class="col">
               <q-btn class="full-width" color="teal" label="Dashboard" link dense @click="$router.push({ path: `/Account/${user.id}` })"/>
             </div>
           </div>
         </div>
        </q-card-section>
      </q-card>
    </q-dialog>

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
  </div>
</template>

<script>
import moment from "moment"
import { ref } from "vue"
import { exportFile, Notify } from 'quasar'
import { mapGetters, mapActions } from "vuex";

import { app_url, headers } from "src/components/GlobalConfig"

const submitBooking = async (method, data) => {
  if(headers.Authorization === "Bearer null"){
    headers.Authorization = `Bearer ${localStorage.getItem("authToken")}`
    const res = await fetch(app_url+"bookings", { method, headers, body: JSON.stringify(data) })
    return res.json()
  } else {
    const res = await fetch(app_url+"bookings", { method, headers, body: JSON.stringify(data) })
    return res.json()
  }
}

export default {
  data(){
   return{
     tab: ref('login'),
     splitterModel: ref(20),
     bookDialog: false,
     category: null,
     bar: false,
     slide: ref(1),
     year: (new Date()).getFullYear(),
     auth: false,
     propertySelected: "",
     carSelected: "",
     loginField: {
        email: null,
        password: null
     },
     registerField: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null
     },
     booking_dates: [],
     setGuests: false,
     guests: {
        adults: 1,
        children: 0,
        rooms: 1
     },
     days: 0,
     additional_notes: false,
     notes: "",
     propertyBooked: false
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
    this.bar = true
    
    this.$api.get("property_categories/"+this.$route.params.id).then(res => {
      this.category = res.data
      this.bar = false
    }).catch(error => {
      console.log(error)
    })
  },

  methods: {
    ...mapActions("auth", ["sendLogoutRequest", "getUserData", "sendLoginRequest", "sendRegisterRequest"]),

    notifyUser(message, color, icon) {
        Notify.create({ message, position: "top-right", color, icon })
    },

    bookProperty(data){
      this.bookDialog = true
      this.propertySelected = data
    },

    login: function() {
      this.sendLoginRequest(this.loginField).then(res => {
        this.notifyUser('Logged in successfully', 'orange', 'warning')
      }).catch(error => {
        this.notifyUser("Bad credentials or user doesn't exist. Try again or register.", 'orange', 'negative')
      });
    },

    register: function() {
      this.sendRegisterRequest(this.registerField).then(res => {
        this.notifyUser('Registration successfully', 'orange', 'warning')
      }).catch(error => {
        this.notifyUser("Bad credentials. Try again.", 'orange', 'negative')
      });
    },

    setDate(){
      const startDate = moment(this.booking_dates.from)
      const endDate = moment(this.booking_dates.to)
      this.days = endDate.diff(startDate, 'days') + 1
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

    async confirmBooking(){
     let car_id = null
     let property_id = null

     if (this.carSelected) car_id = this.carSelected.id
     if (this.propertySelected) property_id = this.propertySelected.id
       
     let data = {
       booking_type: this.propertySelected.type,
       property_id: property_id,
       car_id: car_id,
       start_date: this.booking_dates.from,
       end_date: this.booking_dates.to,
       guests: JSON.stringify(this.guests),
       days: this.days,
       user_id: this.user.id,
       status: "pending",
       notes: this.notes
     }

     // create new booking
     const res = await submitBooking("POST", data)
     if (res) {
        this.notifyUser('Booking created successfully', 'orange', 'warning')
        if(data) this.propertyBooked = true
     }
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
