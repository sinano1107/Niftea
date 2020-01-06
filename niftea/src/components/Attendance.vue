<template lang="html">
  <div>

    <v-toolbar
      dense
      floating
      dark
      class="ma-4"
    >
      <h1>{{ now }}</h1>
    </v-toolbar>
    <v-row>

      <v-col cols="12" class="mt-12">
        <div v-if="show" class="animated" v-bind:class="animated">
          <h1 class="text-center display-4 rainbow">おはよう！</h1>
        </div>
        <div v-else class="animated" v-bind:class="animated">
          <h1 class="text-center display-4 rainbow">ようこそN中へ</h1>
        </div>
      </v-col>
      <v-col class="mt-12">


        <v-row v-if="rejection" :justify="'center'">
          <v-col cols="8">
            <v-alert
            prominent
            type="error"
          >
            <v-row align="center">
              <v-col>これからデータの初期化をはじめます。エラーが起きると管理人がクッソ大変なんでしばらく触らないでください</v-col>
            </v-row>
          </v-alert>
          </v-col>
        </v-row>


        <v-form v-else v-model="valid">
          <v-row  :justify="'center'">
            <v-col cols="3">

              <v-text-field
                v-model="number"

                label="登校番号を入力してね"
                hint="メニューの「登校する」を押して番号を取得してね"
                outlined
                rounded
                persistent-hint
                :rules="rules"

                color="cyan"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-fab-transition>
                <v-btn
                  class="pink"
                  fab
                  dark
                  required
                  v-show="valid"
                  @click="send()"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>

              </v-fab-transition>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-dialog
      v-model="dialog"
      max-width="1200"
    >
      <NowSeatWrapCard/>
    </v-dialog>

    <v-fab-transition>
      <v-btn
        color="cyan"
        fab
        dark
        fixed
        x-large
        right
        bottom
        outlined
        @click="dialog = true"
      >
        <v-icon>mdi-account-group</v-icon>
      </v-btn>

    </v-fab-transition>

    <v-col cols="2" class="qrCord">
      <v-img
        :src="qr"
      ></v-img>
    </v-col>

  </div>



</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import NowSeatWrapCard from './NowSeatWrapCard'

export default {
  data() {
    return {
      now: '',
      number: '',
      show: true,
      inAnimated: '',
      outAnimated: '',
      middleAnimated: '',
      color: '',
      animated: '',
      rules: [v => v.length > 0 || '内容がないよう😭'],
      valid: true,
      rejection: false, // 指定時間になったら予約データをリセットするため操作を禁止する
      dialog: false,
      qr: ''//QRコード
    }
  },
  components: {
    NowSeatWrapCard
  },
  created() {
    this.getQR()
    this.getNow()
    setInterval(function() {
      this.animation()
    }.bind(this), 6000)
  },
  methods: {
    getNow() {
      setInterval(function() {
        let now = new Date()
        this.now = now.toLocaleString()
        this.changeScreen(now)
      }.bind(this), 1000)
    },
    async animation() {
      let list = await this.getInAndOut()
      this.inAnimated = list[0]
      this.outAnimated = list[1]
      this.middleAnimated = list[2]
      this.show = !this.show

      this.animated = list[0]
      setTimeout(function() {
        this.animated = list[2]
        setTimeout(function() {
          this.animated = list[1]
        }.bind(this), 2000)
      }.bind(this), 2000)
    },
    getInAndOut() {
      let inList = ['bounceIn','bounceInDown','bounceInLeft','bounceInRight','bounceInUp']
      let outList = ['bounceOut','bounceOutDown','bounceOutLeft','bounceOutRight','bounceOutUp']
      let middleList = ['bounce','flash','pulse','rubberBand','shake','swing','tada','wobble','jello','heartBeat']
      let inRandom = ''
      let outRandom = ''
      let middleRandom = ''
      let self = this
      return new Promise(function(resolve) {
        // whileで違う値が出るまでループ
        let loop = true
        while (loop) {
          inRandom = inList[Math.floor( Math.random() * 5 )]
          if (self.inAnimated != inRandom) {
            loop = false
          }
        }
        // 同じくoutもループ
        loop = true
        while (loop) {
          outRandom = outList[Math.floor( Math.random() * 5 )]
          if (self.outAnimated != outRandom) {
            loop = false
          }
        }
        // 同じくmiddleもループ
        loop = true
        while (loop) {
          middleRandom = middleList[Math.floor( Math.random() * 10 )]
          if (self.middleAnimated != middleRandom) {
            loop = false
          }
        }
        resolve([inRandom,outRandom,middleRandom])
      })
    },
    dataReset(target) { // 予約データや現在のデータをすべてnilに変える 引数で指定されたデータをnilに書き換える
      let database = firebase.database()
      for (let i=0; i<15; i++) {
        for (let j=0; j<6; j++) {
          database.ref(`seats/${target}/${i}/${j}`).set('nil')
        }
      }
      console.debug(`${target}:リセット完了`)
    },
    changeScreen(now) { // 指定時間(9:30)になったときに画面を切り替える
      if (now.getHours() == 9 && now.getMinutes() == 30 && now.getSeconds() == 0) {
        let week = ["Mon","Tue","Wed","Thu","Fri"]
        let dayOfWeek = week[now.getDay()-1]

        this.rejection = true
        setTimeout(()=> {
          this.dataReset(dayOfWeek)
          setTimeout(()=> {
            this.rejection = false
          }, 5000)
        }, 5000)
      } else if (now.getHours() == 16 && now.getMinutes() == 0 && now.getSeconds() == 0) { // 指定時間(16:00)に画面を切り替えてNowをリセット
        this.rejection = true
        setTimeout(()=> {
          this.dataReset("Now")
          setTimeout(()=> {
            this.rejection = false
          }, 5000)
        }, 5000)
      } else if (now.getSeconds() == 55) {
        // １分ごとにattendanceDataを調べて期限が切れていれば消す
        this.cacheAttendanceNumber()
        console.debug("１分")
      }
    },
    cacheAttendanceNumber() { // １分毎にattendanceを確認して古いものを捨てる
      let now = new Date()

      let database = firebase.database()
      let attendance = database.ref('attendance/')
      attendance.on('value', (snapshot)=> {
        let val = snapshot.val()
        delete val['nil'] // 空データの削除

        for (let key in val) {
          let timeLimitData = val[key]['timeLimit']
          let timeLimit = new Date()
          timeLimit.setHours(timeLimitData['Hours'])
          timeLimit.setMinutes(timeLimitData['Minutes'])

          if (timeLimit.getHours() == now.getHours() && timeLimit.getMinutes() <= now.getMinutes()) {
            database.ref(`attendance/${key}`).remove()
            console.debug(`${key}を削除しました`)
          } else if (timeLimit.getMinutes() == 0 && now.getMinutes() == 0) { // リミットがx:00の場合
            database.ref(`attendance/${key}`).remove()
            console.debug(`${key}を削除しました`)
          }


        }

      })

    },
    send() {
      console.log(this.number)
      this.$router.push(`/attendance_result/${this.number}`)
    },
    getQR() {
      let storage = firebase.storage()
      let imgRef = storage.ref('QR.png')
      imgRef.getDownloadURL().then((url)=> {
        let xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = ()=> {
          let blob = xhr.response
          this.qr = URL.createObjectURL(blob)
        }
        xhr.open('GET', url)
        xhr.send()
      })
    }
  }
}
</script>

<style lang="css" scoped>
.rainbow {
  /* 背景グラデーションを指定・幅を 200% にしておく */
  background: linear-gradient(to right, #f00 0%, #f80 14.28%, #dd0 28.56%, #0d0 42.85%, #0dd 57.14%, #00f 71.42%, #e0e 85.71%, #f00 100%) 0% center / 200% auto;

  /* 背景画像を文字でマスクする */
          background-clip: text;
  -webkit-background-clip: text;

  /* 文字色を透明にできればよく color: transparent でも color: rgba(0, 0, 0, 0) でも可 */
          text-fill-color: transparent;
  -webkit-text-fill-color: transparent;

  /* アニメーション指定 */
  animation: rainbow 20s linear infinite;
}

/* 背景の横位置をズラす */
@keyframes rainbow {
  to { background-position-x: 200%; }
}

.qrCord {
  position: fixed;
  left: 10px;
  bottom: 10px;
}


</style>
