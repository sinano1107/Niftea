<template>
  <div class="text-center">
    <v-bottom-sheet v-model="sheet">
      <template v-slot:activator="{ on }">
        <v-fab-transition>
          <v-btn
            color="pink"
            fab
            dark
            fixed
            large
            right
            bottom
            @click="sheet = !sheet"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>

        </v-fab-transition>

      </template>
      <v-sheet class="text-center" height="200px">
        <v-form v-model="valid">
          <v-row :justify="'center'" :align="'center'">
            <v-col cols="9">

              <v-textarea
                v-model="content"
                label="今なにしとーと？？"
                auto-grow
                clearable
                outlined
                counter
                :rules="rules"


                color="cyan"
              ></v-textarea>
            </v-col>
            <v-col cols="1">
              <v-fab-transition>
                <v-btn
                  color="pink"
                  fab
                  dark
                  large
                  required
                  v-show="valid"
                  @click="doSend"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>

              </v-fab-transition>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'

export default {
  data: () => ({
    sheet: false,
    valid: true,
    content: '',
    rules: [v => v.length <= 30 || '投稿は30文字いかにしてください',
            v => v.length > 0 || '内容がないよう😭'],
  }),
  methods: {


    doSend: function() {
      // 電車で作ったのでちゃんとデバッグしてね
      let database = firebase.database()
      let uid = firebase.auth().currentUser.uid

      let val = {
        'uid': uid,
        'content': this.content
      }
      var post = database.ref('posts/').push()
      post.set(val)
      this.content = ''
      this.sheet = false
    }
  },
}

</script>

<style media="screen">

</style>
