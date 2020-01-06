import firebase from 'firebase'
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAmYkiXe6VA01c_bNL1IHtSlIyKy6d8h98",
  authDomain: "chat-app-d0903.firebaseapp.com",
  databaseURL: "https://chat-app-d0903.firebaseio.com",
  projectId: "chat-app-d0903",
  storageBucket: "chat-app-d0903.appspot.com",
  messagingSenderId: "848778253598",
  appId: "1:848778253598:web:9038896eb2479b255ae50f",
  measurementId: "G-EDNDTB4618"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();


/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
