<template>
  <div  style="background: #fff;">
    <div class="row q-gutter-md q-pa-md">
      <div class="col bordered">Bookings
        <q-separator />
        {{loggedInUserBookings}}
      </div>
      <div class="col">Profile
        <q-separator />
        {{user}}
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment"
import { ref } from "vue"
import { exportFile, Notify } from 'quasar'
import { mapGetters, mapActions } from "vuex";

import { headers } from "src/components/GlobalConfig"

export default {
  data(){
   return{
     loggedInUserBookings: []
    }
  },

  mounted() {
    if (localStorage.getItem("authToken")) this.getUserData();
  },

  computed: {
    ...mapGetters("auth", ["user"])
  },

  created(){
    this.bar = true
      console.log(this.user)
    
    this.$api.get("bookings/"+this.$route.params.id, {headers}).then(res => {
      this.loggedInUserBookings = res.data
    }).catch(error => {
      console.log(error)
    })
  },

  methods: {
    ...mapActions("auth", ["getUserData"]),

    notifyUser(message, color, icon) {
        Notify.create({ message, position: "top-right", color, icon })
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
