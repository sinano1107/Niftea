import Vue from 'vue'
import App from './App.vue'
import store from './store.js'
import router from './router.js'
import firebase from 'firebase/app'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// firebaseの設定
const config = {
  apiKey: "AIzaSyDfAp7xoLCcMyUDAN1_pBQ6tzF28AzEoHI",
  authDomain: "niftea-e6206.firebaseapp.com",
  databaseURL: "https://niftea-e6206.firebaseio.com",
  projectId: "niftea-e6206",
  storageBucket: "niftea-e6206.appspot.com",
  messagingSenderId: "518485193590",
  appId: "1:518485193590:web:1b1bdf7718400b6d02c057",
  measurementId: "G-3DT90DCNHP"
}
firebase.initializeApp(config);

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
