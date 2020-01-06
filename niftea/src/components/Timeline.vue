<template>
  <div>
    <Indeterminate v-if="loading"/>
    <v-timeline v-else dense>
      <v-timeline-item v-for="(item, i) in postList" :key="i" large>
        <template v-slot:icon>
          <v-avatar>
            <img :src="imgURL[usersData[item.uid].img]">
          </v-avatar>
        </template>
        <template v-slot:opposite>
          <span>Tus eu perfecto</span>
        </template>
        <v-card class="elevation-2">
          <v-card-title class="headline">{{ usersData[item.uid].name }}</v-card-title>
          <v-card-text class="content">{{ item.content }}
          </v-card-text>

        </v-card>
      </v-timeline-item>
  </v-timeline>
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
      loading: true,
      postList: [],
      usersData: {},
      imgURL: {}
    }
  },
  components: {
    Indeterminate
  },
  created() {
    // めっちゃエラー起きるけどsetTimeoutでごり押ししてます なんか良い解決法ないかな <= async/await
    // firebaseとの通信終わってから<template>読み込むようにすれば良いんだと思う
    // Promiseでループ処理するためになんか変なの使ってる Promise使ってるくせに見通しクソです
    // ソース => 'https://blog.htmlhifive.com/2016/02/22/promise-async-loop/'
    let database = firebase.database()
    let storage = firebase.storage()
    let self = this

    // Promiseで非同期処理するゾ
    let result = new Promise(function(resolve) {
      // postsData(uid, content)の取得
      let posts = database.ref('/posts')
      posts.on('value', (snapshot)=> {
        let postList = []
        let val = snapshot.val()
        // 連想配列をループで展開して配列にする
        Object.keys(val).forEach(function(key) {
          postList.push(val[key])
        })
        console.debug(val)
        console.debug(postList)
        self.postList = postList.reverse() // this.postListに代入 ついでに反転
        //resolve(val)
        resolve(postList)

      })
    })
    result.then( function(datas) {
      console.debug(datas)
      // データベースのpostsを受け取りループで展開してuidを取得 それにfilterかけて次に回す
      new Promise(function(res) {
        let list = []
        // ここにループさせる関数
        // datasのdataを受け取ってuidを返す
        function makeList(index) {
          return new Promise(function(resolve) {
            console.debug(datas[index])
            list.push(datas[index].uid)
            resolve(index+=1)
          }).then(function(index) {
            // ループを抜けるかの判定
            if (index >= datas.length) {
              // 抜ける 重複を弾く
              list = list.filter((x,i,self) => self.indexOf(x) === i)
              res(list)
            } else {
              // 再起的に実行
              makeList(index)
            }
          })
        }
        // 初回実行
        makeList(0)
      }).then(function(list) {
        console.debug(list)
        // 受け取ったuidのlistをループしてfirebaseからデータを取得 this.usersDataにぶち込む
        let imgList = []
        new Promise(function(res) {
          function getUserData(index) {
            let uid = list[index]
            return new Promise(function(resolve) {
              let user = database.ref(`/users/${uid}`)
              user.on('value', (snapshot)=> {
                let val = snapshot.val()
                console.debug(uid)
                self.usersData[uid] = val
                imgList.push(val.img)
                resolve(index+=1)
              })
            }).then(function(index) {
              if (index >= list.length) {
                // 抜ける filterかける
                imgList = imgList.filter((x,i,self) => self.indexOf(x) === i)
                res(imgList)
              } else {
                getUserData(index)
              }
            })
          }
          // 初回実行
          getUserData(0)
        }).then(function(imgList) {
          console.debug(imgList)
          // 受け取ったimgListを展開してURLを取得する this.imgURLに{uid: 取得したURL}の形でぶち込む
          new Promise(function(res) {
            function getImgURL(index) {
              let img = imgList[index]
              return new Promise(function(resolve) {
                // URL取得
                let imgRef = storage.ref(`/${img}`)
                imgRef.getDownloadURL().then((url)=> {
                  let xhr = new XMLHttpRequest()
                  xhr.responseType = 'blob'
                  xhr.onload = ()=> {
                    let blob = xhr.response
                    self.imgURL[img] = URL.createObjectURL(blob)
                  }
                  xhr.open('GET', url)
                  xhr.send()
                  resolve(index+=1)
                }).catch(function(error) {
                  console.debug("GetImgURL Error",error)
                })
              }).then(function(index) {
                if (index >= imgList.length) {
                  // 抜ける
                  res()
                } else {
                  getImgURL(index)
                }
              })
            }
            // 初回実行
            getImgURL(0)
          }).then(function() {
            // 処理終了 結果のログ出力 ごり押しsetTimeout
            console.debug("GetTimeLineFinish!!!")
            console.debug("postList", self.postList)
            console.debug("usersData", self.usersData)
            console.debug("imgURL", self.imgURL)
            setTimeout(() => {
              self.loading = false;
            }, 1000);
          })
        })
      })
    })
  },
}
</script>

<style scoped>
.content {
  white-space: pre-wrap;
}
</style>
