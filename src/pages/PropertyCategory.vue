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
                <q-btn flat color="primary">
                Book Property
                </q-btn>
            </q-card-actions>
         </q-card>
        </div>

      </div>
    </q-page-container>

    <section class="flex row flex-center q-py-sm" style="background: #001129; height: 100px;">
      <div class="text-weight-bold text-subtitle2 text-white ">
        Copyright © {{ year }}. Book Me Kenya.
      </div>
    </section>

    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="orange"
      size="10px"
      skip-hijack
    />

  </q-layout>
</template>

<script>
import { ref } from "vue"

export default {
  data(){
   return{
     category: null,
     bar: false,
     slide: ref(1)
    };
  },

  created(){
    this.bar = true
    
    this.$api.get("property_categories/"+this.$route.params.id).then(res => {
      this.category = res.data
      this.bar = false
    }).catch(error => {
      console.log(error)
    })
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
