<template lang="html">
  <div>
    <NavigationDrawer/>

    <v-content>
      <v-snackbar
        v-model="snackbar"
        top
        right
      >
        あなたは今日登校できません
        <v-btn
          color="pink"
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>

      <Indeterminate v-if="loading"/>
      <div v-else>
        <div v-if="haveNumber" class="mt-12">
          <h1 class="text-center headline">あなたの登校番号: {{ myNumber }}</h1>

        </div>
        <div v-else class="mt-12">

          <div v-if="attendance">
            <h1 class="text-center headline">あなたはもう登校済みです</h1>
            <v-row :justify="'center'">
              <v-col cols="11">
                <NowSeatWrapCard/>
              </v-col>
            </v-row>
          </div>

          <div v-else>


            <h1 class="text-center headline">あなたの番号は存在しませんでした</h1>
            <h1 class="text-center">↓ボタンを押して番号を作って↓</h1>

            <v-row class="mt-12" :justify="'center'">

              <v-tooltip v-model="show" top>
                <template v-slot:activator="{ on }">
                  <v-btn outlined x-large fab color="cyan" v-on="on" @click="makeNumber()">
                    <v-icon>mdi-ticket-account</v-icon>
                  </v-btn>
                </template>
                <span>登校する！</span>
              </v-tooltip>

            </v-row>

          </div>

        </div>
      </div>


    </v-content>
  </div>

</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import NavigationDrawer from './NavigationDrawer'
import Indeterminate from './Indeterminate'
import NowSeatWrapCard from './NowSeatWrapCard'

export default {
  data() {
    return {
      loading: true,
      show: false,
      haveNumber: false,
      attendance: false, // 登校済みかどうか
      myNumber: '',
      realName: '',
      snackbar: false
    }
  },
  components: {
    NavigationDrawer,
    Indeterminate,
    NowSeatWrapCard
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      let attendanceData = await this.getAttendanceData()
      console.debug(attendanceData)
      if (await this.searchMyNumber(attendanceData)) {
        console.debug("自分の番号が存在しました")
        this.haveNumber = true
        let myNumber = await this.getMyNumberData(attendanceData)
        this.myNumber = myNumber
      } else if (await this.searchMyuidNow()) {
        console.debug("お前もう学校おるやんけ")
        this.attendance = true
      } else {
        console.debug("自分の番号がありませんでした")
      }

      this.loading = false

    },
    getAttendanceData() { // attendanceのデータを連想配列でとってくる
      let database = firebase.database()
      let attendance = database.ref('attendance')
      let self = this
      return new Promise(function(resolve) {
        attendance.on('value', (snapshot)=> {
          let val = snapshot.val()
          delete val['nil'] // 空データの削除
          self.attendanceData = val
          resolve(val)
        })
      })
    },
    searchMyNumber(attendanceData) { // attendanceDataのなかに自分の番号があるかしらべる
      let myUid = firebase.auth().currentUser.uid

      return new Promise(function(resolve) {
        for (let key in attendanceData) {
          if (attendanceData[key]['uid'] == myUid) {
            resolve(true)
          }
        }
        resolve(false)
      })
    },
    searchMyuidNow() { // 今の席(now)のデータに自分のuidが存在するか調べる(登校済みかしらべる)
      let database = firebase.database()
      let myUid = firebase.auth().currentUser.uid

      // Nowの取得
      return new Promise(function(resolve) {
        let now = database.ref('/seats/Now')
        now.on('value', (snapshot)=> {
          let val = snapshot.val()
          let answer = false

          // 検索かいし
          search_loop:
          for (let i=0; i<15; i++) {
            for (let j=0; j<6; j++) {
              if (val[i][j] == myUid) {
                answer = true
                break search_loop
              }
            }
          }
          resolve(answer)
        })
      })
    },
    async makeNumber() { // 自分の番号を作る
      // 今の番号一覧と被らない乱数を作る
      let attendanceData = await this.getAttendanceData()
      let random = 0
      let loop = true
      while (loop) {
        let branch = true
        random = Math.floor( Math.random() * 900000 ) + 100000; // 100000~999999の乱数を生成
        for (let key in attendanceData) {
          if (random == key) {
            branch = false
            break
          }
        }
        if (branch) {
          // 重ならなかった時の処理
          this.setNumber(random)
          loop = false
        }
      }
    },
    async setNumber(number) { // 番号の設定関数
      let self = this
      console.debug("setNumber",number)
      let seat = await this.searchMyReservation()
      if (seat == "非登校日") {
        this.snackbar = true
      } else {
        console.debug(seat)

        // 1分後の時間を生成
        let timeLimit = new Date()
        timeLimit.setMinutes(timeLimit.getMinutes() + 1)
        console.debug('timeLimit', timeLimit)

        let database = firebase.database()

        let result = new Promise(function(resolve) {
          database.ref(`attendance/${number}`).set({'uid': firebase.auth().currentUser.uid,
                                                    'seat': seat,
                                                    'timeLimit': {Hours: timeLimit.getHours(),
                                                                  Minutes: timeLimit.getMinutes()}
                                                  })
          resolve()
        })
        result.then(function() {
          self.$router.go({path: self.$router.currentRoute.path, force: true}) // リロード
        })
      }



    },
    searchMyReservation() { // 自分の予約があるか調べる
      let database = firebase.database()
      let myUid = firebase.auth().currentUser.uid
      let now = new Date()
      console.log(now)
      let week = ["Mon","Tue","Wed","Thu","Fri"]


      if (now.getDay() != 0 && now.getDay() != 6) {
        let dayOfWeek = week[now.getDay()-1]

        let reservation = database.ref(`seats/${dayOfWeek}`)

        return new Promise(function(resolve) {
          reservation.on('value', (snapshot)=> {
            let val = snapshot.val()
            let seat = "nil"

            search_loop:
            for (let i=0; i<15; i++) {
              for (let j=0; j<6; j++) {
                if (val[i][j] == myUid) {
                  seat = i
                  break search_loop
                }
              }
            }
            resolve(seat)
          })
        })
      } else {
        return new Promise(function(resolve) {
          console.log('今日は登校日ではありません')
          resolve('非登校日')
        })
      }

    },
    getMyNumberData(attendanceData) { // 自分の番号のデータを返す
      let myUid = firebase.auth().currentUser.uid

      return new Promise(function(resolve) {
        for (let key in attendanceData) {
          if (attendanceData[key]['uid'] == myUid) {
            resolve(key)
          }
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
