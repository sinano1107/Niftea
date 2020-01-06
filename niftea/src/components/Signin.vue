<template>
  <div>
    <v-app-bar
      dark
      src="../assets/tea.jpg"
      extended
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>


      <v-icon>mdi-tea</v-icon>

      <v-toolbar-title>Niftea</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-title>signin</v-toolbar-title>
    </v-app-bar>

    <v-row :justify="'center'">
      <v-col cols="10">
        <v-stepper v-model="e6" vertical>
          <v-stepper-step :complete="e6 > 1" step="1">
            メールアドレスの入力
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>
            </v-col>
            <v-btn color="primary" @click="e6 = 2">OK!</v-btn>
          </v-stepper-content>

          <v-stepper-step :complete="e6 > 2" step="2">パスワードの入力</v-stepper-step>

          <v-stepper-content step="2">
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="password"
                type="password"

                label="password"
                required
              ></v-text-field>
            </v-col>
            <div @click="signIn"><v-btn color="primary">signin!!</v-btn></div>
            <v-btn text @click="e6 = 1">return</v-btn>
          </v-stepper-content>


        </v-stepper>
      </v-col>
    </v-row>
    <v-footer padless fixed>
      <v-col
        class="text-center"
        cols="12"
      >
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'
  import 'firebase/storage'

  export default {
    name: 'Signin',
    data () {
      return {
        e6: 1,
        valid: false,
        email: '',
        password: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ]
      }
    },
    methods: {
      signIn: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          () => {
            alert('Success!')
            this.$router.push('/seatReservation')
          },
          err => {
            alert(err.message)
          }
        )
      }
    }
  }
</script>
