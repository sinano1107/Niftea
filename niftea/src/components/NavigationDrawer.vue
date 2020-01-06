<template>
  <div>
    <!--スマホ用-->
    <div v-if="$vuetify.breakpoint.smAndDown">
      <v-app-bar
        :collapse="!collapseOnScroll"
        :collapse-on-scroll="collapseOnScroll"
        color="cyan"
        dark
        app
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title><v-icon>mdi-tea</v-icon>Niftea</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-checkbox
          v-model="collapseOnScroll"
          color="white"
          hide-details
        ></v-checkbox>
      </v-app-bar>



      <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="imgURL"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>

          <v-list-item
            v-for="item in buttonList"
            :key="item.title"
            link
            @click="item.action"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-footer padless fixed>
          <v-col
            class="text-center"
            cols="12"
          >
          <v-list-item-title>プロトよりのプロトタイプ</v-list-item-title>
          <v-list-item-title>
            {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
          </v-list-item-title>
          </v-col>
        </v-footer>
      </v-navigation-drawer>
    </div>


    <!--パソコンよう-->

    <v-navigation-drawer
      expand-on-hover
      permanent
      app
      v-else
    >

      <template v-slot:prepend>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-img :src="imgURL"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item
            link
            two-line
          >
            <v-list-item-content>
              <v-list-item-title class="title">{{ name }}</v-list-item-title>
              <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>mdi-menu-down</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>

      <v-divider></v-divider>

      <v-list
        nav
        dense
        v-for="item in buttonList"
        :key="item.title"

      >
        <v-list-item link @click="item.action">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>


      </v-list>
      <v-footer padless fixed>
        <v-col
          class="text-center"
          cols="12"
        >
        <v-list-item-title>プロトよりのプロトタイプ</v-list-item-title>
        <v-list-item-title>
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-list-item-title>
        </v-col>
      </v-footer>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/database'
  import 'firebase/storage'


  export default {
    name: 'NavigationDrawer',
    data() {
      return {
        email: firebase.auth().currentUser.email,
        imgURL: '',
        name: '',
        buttonList: [
          {action: this.timeline, icon: 'mdi-timeline', title: 'タイムライン＜準備中＞'},
          {action: this.seatReservation, icon: 'mdi-seat', title: '席を予約する'},
          {action: this.issueNumber, icon: 'mdi-ticket-account', title: '登校する'},
          {action: this.signOut, icon: 'mdi-logout', title: 'サインアウト'}
        ],
        drawer: null,
        collapseOnScroll: true,

      }
    },
    created() {
      let database = firebase.database()
      let storage = firebase.storage()
      let uid = firebase.auth().currentUser.uid
      let self = this

      // Promiseでデータ取得
      let result = new Promise(function(resolve) {
        // uidから(name,img)を取得
        let myData = database.ref(`/users/${uid}`)
        myData.on('value', (snapshot)=> {
          let val = snapshot.val()
          self.name = val.name // this.nameにnameを代入
          resolve(val.img) // 次にimgを渡す
        })
      })
      result.then(function(img) {
        console.debug("MyImg:", img)
        // 受け取ったimgからimgURLを取得
        let imgRef = storage.ref(`/${img}`)
        imgRef.getDownloadURL().then((url)=> {
          let xhr = new XMLHttpRequest()
          xhr.responseType = 'blob'
          xhr.onload = ()=> {
            let blob = xhr.response
            self.imgURL = URL.createObjectURL(blob)
          }
          xhr.open('GET', url)
          xhr.send()
          return
        })
      }).then(function() {
        console.debug("MyDataInit Finish!!!")
        console.debug("myEmail:", self.email)
        console.debug("myName:", self.name)
      })
    },
    methods: {
      timeline: function() {
        //this.$router.push('/')
        console.log('準備中、もうちょいまっておくんなし❤️')
      },
      seatReservation: function() {
        this.$router.push('/seatReservation')
      },
      issueNumber: function() {
        this.$router.push('/issueNumber')
      },
      signOut: function() {
        firebase.auth().signOut().then(() => {
          this.$router.push('/signin')
        })
      },

    }

  }
</script>
