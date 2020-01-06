<template lang="html">
  <div>
    <Clock/>

    <Indeterminate v-if="loading"/>

    <div v-else>
      <div v-if="show">

        <v-row v-if="select" :justify="'center'">
          <v-col class="d-flex" cols="5">
            <v-select
              v-model="selectGroup"

              :items="items"
              label="グループを選んでください"
            ></v-select>

          </v-col>
          <v-col cols="1">
            <v-fab-transition>
              <v-btn
                class="pink"
                fab
                dark
                required
                @click="selectAttendance()"
              >
                <v-icon>mdi-send</v-icon>
              </v-btn>

            </v-fab-transition>
          </v-col>
        </v-row>

        <div v-else>
          <h1 class="text-center display-3">{{ realName }}さんの席が確定しました！</h1>
          <h1 class="text-center">あなたはグループ{{ group+1 }}です。</h1>
        </div>

        <v-row :justify="'center'">
          <v-col cols="10">
            <NowSeatWrapCard/>
          </v-col>
        </v-row>

      </div>
      <div v-else>
        <h1 class="text-center display-3">番号が存在しませんでした</h1>
        <p class="text-center">1分経つと番号は無効になります。もう一度発行してください</p>
      </div>



      <v-row class="mt-12" :justify="'center'">
        <v-col class="mt-12" cols="1">
          <v-btn outlined x-large fab color="cyan" @click="pageReturn()">
            <v-icon>mdi-keyboard-return</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>




  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import Clock from './Clock'
import NowSeatWrapCard from './NowSeatWrapCard'
import Indeterminate from './Indeterminate'

export default {
  data() {
    return {
      loading: true,
      show: false,
      select: false,
      realName: '',
      uid: '',
      group: '',
      items: [],
      selectGroup: '',
      now: []
    }
  },
  components: {
    Clock,
    NowSeatWrapCard,
    Indeterminate
  },
  created() {
    this.searchInputNumber()
    setTimeout(()=> {
      this.loading=false
    }, 1000)
  },
  methods: {
    async searchInputNumber() {
      let attendanceData = await this.getAttendanceData()
      let number = this.$route.params.number
      console.debug(attendanceData)

      this.show = number in attendanceData
      if (this.show) {
        let seat = attendanceData[number]['seat']
        let uid = attendanceData[number]['uid']
        this.uid = uid
        let userData = await this.getUserData(uid)
        let now = await this.getNowData()
        this.now = now
        this.realName = userData['realName']
        console.debug(userData)

        let date = new Date(2020, 1, 1, 9, 30, 0) // 比較対象Date
        let nowDate = new Date() // 現在時刻

        if (date.getHours() >= nowDate.getHours() && date.getMinutes() >= nowDate.getMinutes()) {
          // ９時半以前だったら
          console.debug("９時半以前")
          if (seat == "nil") {
            // 予約していなかったら
            this.select = true
            await this.initSelectItem()
          } else {
            // 予約していたら
            await this.reservationAttendance(uid,seat)
          }
        } else {
          // ９時半以降だったら
          console.debug("９時半以降")
          await this.randomAttendance(uid)
        }
        // 入力されたIDの削除
        this.removeMyNumber()

      }
    },
    getAttendanceData() { // attendanceの情報一覧をとってくる
      let database = firebase.database()
      let attendance = database.ref('attendance/')
      return new Promise(function(resolve) {
        attendance.on('value', (snapshot)=> {
          let val = snapshot.val()
          delete val['nil'] // 空データの削除
          resolve(val)
        })
      })
    },
    getUserData(uid) { // ユーザー情報をとってくる
      let database = firebase.database()
      let user = database.ref(`users/${uid}`)
      return new Promise(function(resolve) {
        user.on('value', (snapshot)=> {
          resolve(snapshot.val())
        })
      })
    },
    getNowData() { // now情報をとってくる
      let database = firebase.database()
      let now = database.ref('seats/Now')
      return new Promise(function(resolve) {
        now.on('value', (snapshot)=> {
          resolve(snapshot.val())
        })
      })
    },
    getReservationData() {
      let database = firebase.database()
      let now = new Date()
      let week = ["Mon","Tue","Wed","Thu","Fri"]
      console.debug(now.getDay())
      if (now.getDay() != 0 && now.getDay() != 6) {
        let dayOfWeek = week[now.getDay()-1]
        let reservation = database.ref(`seats/${dayOfWeek}`)

        return new Promise(function(resolve) {
          reservation.on('value', (snapshot)=> {
            resolve(snapshot.val())
          })
        })
      }
    },

    async initSelectItem() { // セレクトを初期化する
      let now = this.now
      let reservation = await this.getReservationData()
      console.debug(reservation)
      for (let i=0; i<15; i++) {
        // nilを消す
        let x = now[i].filter(function( item ) { return item != "nil" })
        let y = reservation[i].filter(function( item ) { return item != "nil" })
        console.debug('x',x)
        console.debug('y',y)
        if ((x.length + y.length) != 6) {
          this.items.push(`グループ${i+1}`)
        }
      }
      this.selectGroup = this.items[0]
    },
    selectAttendance() { // セレクタの数字の席で確定(9:30以前予約してない人用)
      let database = firebase.database()
      let seat = this.selectGroup.replace('グループ','')-1
      let target = this.now[seat].indexOf("nil")
      database.ref(`seats/Now/${seat}/${target}`).set(this.uid)
      this.pageReturn()
    },
    randomAttendance(uid) { // ランダムに席を確定(9:30以降用)
      let database = firebase.database()
      let now = this.now
      let nowCount = []

      for (let i=0; i<15; i++) {
        // nilを消す
        let x = now[i].filter(function( item ) { return item != "nil" })
        nowCount.push(x.length)
      }
      let min = Math.min.apply(null, nowCount) // 最小値を取得
      console.debug(nowCount)
      console.debug(min)
      // 最小値のグループIDを保存する
      let list = []
      for (let i=0; i<15; i++) {
        if (nowCount[i] == min) {
          list.push(i)
        }
      }
      console.debug(list)

      // 乱数の生成
      let random = Math.floor( Math.random() * list.length )
      this.group = list[random] // 表示用変数に代入
      let target = this.now[list[random]].indexOf("nil")

      database.ref(`seats/Now/${list[random]}/${target}`).set(uid)
    },
    reservationAttendance(uid, seat) { // 予約した席を確定(9:30以前予約した人用)
      let database = firebase.database()
      seat = Number(seat)
      this.group = seat // 表示用変数に代入
      let target = this.now[seat].indexOf("nil")
      database.ref(`seats/Now/${seat}/${target}`).set(uid)
    },
    removeMyNumber() {
      let database = firebase.database()
      database.ref(`attendance/${this.$route.params.number}`).remove()
      console.debug(this.$route.params.number)
    },
    pageReturn() {
      this.$router.push("/attendance")
    }
  }
}
</script>

<style lang="css" scoped>
</style>
