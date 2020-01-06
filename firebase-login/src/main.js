import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import firebase from 'firebase'

Vue.config.productionTip = false

const config = {
  apiKey: "AIzaSyCTiEL-WGH3_khJ4qDa8EqXQmInerbJHEQ",
  authDomain: "fir-login-79815.firebaseapp.com",
  databaseURL: "https://fir-login-79815.firebaseio.com",
  projectId: "fir-login-79815",
  storageBucket: "fir-login-79815.appspot.com",
  messagingSenderId: "1069209107974",
  appId: "1:1069209107974:web:55e9ea544529690323cd87",
  measurementId: "G-89XBY2SLKD"
}
firebase.initializeApp(config);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
