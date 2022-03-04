<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <q-card v-bind:style="$q.screen.lt.sm?{'width': '80%'}:{'width':'30%'}">
          <q-card-section>
            <q-avatar size="103px" class="absolute-center shadow-10">
              <img src="profile.svg">
            </q-avatar>
          </q-card-section>
          <q-card-section>
            <div class="text-center q-pt-lg">
              <div class="col text-h6 ellipsis">
                Log in
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              class="q-gutter-md"
            >
              <q-input
                filled
                v-model="form.email"
                label="Username"
                lazy-rules
              />

              <q-input
                type="password"
                filled
                v-model="form.password"
                label="Password"
                lazy-rules
              />
              <q-separator />
              <div class="row justify-between">
                <q-btn label="Login" @click="login()" type="button" color="secondary"/>
                <q-btn type="a" label="Register" to="/Register" color="primary"/>
                <q-btn type="a" label="Home" to="/" color="primary"/>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

import { mapGetters, mapActions } from "vuex";

export default {
  data: function() {
    return {
      form: {
        email: null,
        password: null
      }
    };
  },

  computed: {
    ...mapGetters(["errors"])
  },

  mounted() {
    this.$store.commit("setErrors", {});
  },

  methods: {
    ...mapActions("auth", ["sendLoginRequest"]),

    login: function() {
      this.sendLoginRequest(this.form).then(() => {
        this.$router.push({ path: "/Dashboard2" });
      });
    }
  }
};

</script>

<style>
.bg-image {
  background: #003580;
  /* background-image: linear-gradient(135deg, #7028e4 0%, #e5b2ca 100%); */
}
</style>
