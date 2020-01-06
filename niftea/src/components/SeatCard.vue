<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      top
      right
    >
      {{ text }}
      <v-btn
        color="pink"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

    <v-hover v-slot:default="{ hover }">
      <v-card
        class="mx-auto"
        max-width="344"
        :elevation="hover ? 12 : 2"
      >
        <v-list-item three-line>
          <v-list-item-content>
            <div class="overline mb-4">グループ{{ id+1 }}
              <v-icon
                color="red"
                v-if="(count == 6) && $vuetify.breakpoint.smAndDown"
              >mdi-close</v-icon>
              <v-icon
                color="light-green"
                v-else-if="(count <= 3) && $vuetify.breakpoint.smAndDown"
              >mdi-circle-double</v-icon>
              <v-icon
                color="blue"
                v-else-if="$vuetify.breakpoint.smAndDown"
              >mdi-triangle-outline</v-icon>
            </div>



            <v-chip-group
              v-if="show && $vuetify.breakpoint.smAndDown"
            >
              <Indeterminate v-if="loading" />
              <v-chip v-else v-for="(item,i) in filter_reserver" :key="i">
                <v-avatar left>
                  <v-img :src="reserverData[item]['img']"></v-img>
                </v-avatar>
                {{ reserverData[item]["name"] }}
              </v-chip>
            </v-chip-group>
            <v-chip-group
              column
              v-else-if="show"
            >
              <Indeterminate v-if="loading" />
              <v-chip v-else v-for="(item,i) in filter_reserver" :key="i">
                <v-avatar left>
                  <v-img :src="reserverData[item]['img']"></v-img>
                </v-avatar>
                {{ reserverData[item]["name"] }}
              </v-chip>
            </v-chip-group>

            <v-list-item-subtitle v-else>だれもいません</v-list-item-subtitle>
          </v-list-item-content>


          <v-list-item-avatar
            size="70"
            color="red"
            v-if="(count == 6) && $vuetify.breakpoint.mdAndUp"
          >
            <v-icon x-large>mdi-close</v-icon>
          </v-list-item-avatar>
          <v-list-item-avatar
            size="70"
            color="light-green"
            v-else-if="(count <= 3) && $vuetify.breakpoint.mdAndUp"
          >
            <v-icon x-large>mdi-circle-double</v-icon>
          </v-list-item-avatar>
          <v-list-item-avatar
            size="70"
            color="blue"
            v-else-if="$vuetify.breakpoint.mdAndUp"
          >
            <v-icon x-large>mdi-triangle-outline</v-icon>
          </v-list-item-avatar>




        </v-list-item>

        <v-card-actions>
          <v-btn text v-if="reserved" @click="cancel">キャンセル</v-btn>
          <v-btn text v-else-if="count!=6" @click="reserve">予約</v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
  </div>
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
      reserved: false,
      filter_reserver: [],
      reserver: [],
      reserverData: {},
      count: 0,
      text: '', // スナックバーのテキスト
      snackbar: false
    }
  },
  props: {id: Number, day: String},
  components: {
    Indeterminate
  },
  watch: {
    filter_reserver: function(val) {
      if (val.length != 0) {
        this.show = true
      } else {
        this.show = false
      }
      this.count = val.length
      let myUid = firebase.auth().currentUser.uid
      this.reserved = false // 初期化
      console.debug(val)
      for (let i=0; i<val.lebgth; i++) {
        if (val[i] == myUid) { this.reserved = true }
      }
    }
  },
  created() {
    this.getReserverData()
  },
  methods: {
    init() {
      this.show = false
      this.loading = true
      this.reserved = false
      this.filter_reserver = []
      this.reserver = []
      this.reserverData = {}
      this.count = 0
      this.getReserverData()
    },
    async getReserverData() {
      let self = this
      let myUid = firebase.auth().currentUser.uid

      let reserver = await self.getReserver()
      console.log(reserver)


      self.count = reserver.length
      if (reserver.length > 0) {
        // reserverに自分のidがあるかでreservedをtrue
        for (let i=0; i<reserver.length; i++) {
          if (reserver[i] == myUid) { this.reserved = true }
        }
      }

      for (let i=0; i<reserver.length; i++) {
        let userData = await self.getUserData(reserver[i])
        console.debug(userData)
        let userImg = await self.getUserImg(userData.img)
        console.debug(userImg)
        console.log(reserver[i])
        self.reserverData[reserver[i]] = {"name": userData.realName, "img": userImg}
      }
      setTimeout(()=> {
        self.loading = false
      }, 1000)

    },
    getReserver() {
      const database = firebase.database()
      let self = this

      return new Promise(function(resolve) {
        let data = database.ref(`/seats/${self.day}/${self.id}`)
        data.on('value', (snapshot)=> {
          let val = snapshot.val()
          console.log(val)
          self.reserver = val
          val = val.filter(function( item ) { return item != "nil" }) // nilを消す
          self.filter_reserver = val
          console.log(val)
          resolve(val)
        })
      })
    },
    getUserData(uid) {
      return new Promise(function(resolve) {
        let database = firebase.database()
        let userData = database.ref(`/users/${uid}`)
        userData.on('value', (snapshot)=> {
          resolve(snapshot.val())
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
    },
    reserve() {
      const database = firebase.database()
      const myUid = firebase.auth().currentUser.uid // myUid
      const self = this


      var result = new Promise(function(resolve) {
        // 自分が他の場所に予約している場合それをキャンセルする
        let searchList = database.ref(`/seats/${self.day}`)
        searchList.once('value', (snapshot)=> {
          let val = snapshot.val()
          console.debug(val)

          search_loop:
          for (let id=0; id<15; id++) {
            for (let i=0; i<6; i++) {
              if (val[id][i] == myUid) {
                // 見つけたらnirにする
                database.ref(`seats/${self.day}/${id}/${i}`).set("nil")
                break search_loop
              }
            }
          }
          resolve()
        })
      })

      result.then( function() {
        let target = self.reserver.indexOf("nil")
        if (target == -1) {
          console.debug("もう既に予約されています。リロードしてください")
          self.text = '[エラー]予約できませんでした。ページをリロードしてください'
          self.snackbar = true
        } else {
          database.ref(`seats/${self.day}/${self.id}/${target}`).set(myUid)
          self.text = '予約しました！'
          self.snackbar = true
        }
        self.init()
      })
    },
    cancel() {
      const database = firebase.database()
      const myUid = firebase.auth().currentUser.uid

      let target = this.reserver.indexOf(myUid)
      database.ref(`seats/${this.day}/${this.id}/${target}`).set("nil")
      this.init()
      this.text = '予約をキャンセルしました'
      this.snackbar = true
    },
  }
}
</script>

<style lang="css" scoped>
</style>
