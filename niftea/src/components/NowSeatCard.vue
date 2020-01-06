<template lang="html">
  <v-hover v-slot:default="{ hover }">
    <v-card
      class="mx-auto"
      max-width="344"
      :elevation="hover ? 12 : 2"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">グループ{{ id+1 }}</div>

          <v-chip-group
            column
            active-class="primary--text"
            v-if="show"
          >
            <Indeterminate v-if="loading" />
            <v-chip v-else v-for="(item,i) in userData" :key="i">
              <v-avatar left>
                <v-img :src="imgURL[item.img]"></v-img>
              </v-avatar>
              {{ item.realName }}
            </v-chip>
          </v-chip-group>

          <v-list-item-subtitle v-else>だれもいません</v-list-item-subtitle>
        </v-list-item-content>


      </v-list-item>
    </v-card>
  </v-hover>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import Indeterminate from './Indeterminate'

export default {
  data() {
    return {
      show: false,
      loading: true,
      userData: [],
      imgURL: {}
    }
  },
  props: ['id'],
  components: {
    Indeterminate
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let nowData = await this.getNowData()
      let imgList = []

      for (let i=0; i<nowData.length; i++) {
        imgList.push(await this.getUserData(nowData[i]))
      }

      for (let i=0; i<imgList.length; i++) {
        this.imgURL[imgList[i]] = await this.getUserImg(imgList[i])
      }

      // this.loadingをfalseにする
      this.loading = false
    },
    getNowData() {
      let database = firebase.database()
      let now = database.ref(`seats/Now/${this.id}`)
      let self = this

      return new Promise(function(resolve) {
        now.on('value', (snapshot)=> {
          let val = snapshot.val()
          // nilを消す
          val = val.filter(function( item ) { return item != "nil" })
          // valに値が存在すればthis.showをtrueにする
          if (val.length > 0) {
            self.show = true
          }
          resolve(val)
        })
      })
    },
    getUserData(uid) {
      let database = firebase.database()
      let self = this

      return new Promise(function(resolve) {
        let userData = database.ref(`/users/${uid}`)
        userData.on('value', (snapshot)=> {
          let val = snapshot.val()
          self.userData.push(val)
          resolve(val.img)
        })
      })
    },
    getUserImg(img) {


      return new Promise(function(resolve) {
        let storage = firebase.storage()
        let imgRef = storage.ref(`${img}`)
        imgRef.getDownloadURL().then((url)=> {
          let xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'
          xhr.onload = ()=> {
            let blob = xhr.response
            resolve(URL.createObjectURL(blob))
          }
          xhr.open('GET', url)
          xhr.send()
        })
      })



    }
  }
}
</script>

<style lang="css" scoped>
</style>
