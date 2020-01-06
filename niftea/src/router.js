import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '@/components/Home'
import SeatReservation from '@/components/SeatReservation'
import IssueNumber from '@/components/IssueNumber'
import Attendance from '@/components/Attendance'
import Attendance_result from '@/components/Attendance_result'
import Signin from '@/components/Signin'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

let router = new VueRouter({
  routes: [
    {
      path: '*',
      redirect: 'signin'
    },
    /*{
      path: '/timeline-114514',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },*/
    {
      path: '/seatReservation',
      name: 'SeatReservation',
      component: SeatReservation,
      meta: { requiresAuth: true }
    },
    {
      path: '/issueNumber',
      name: 'IssueNumber',
      component: IssueNumber,
      meta: { requiresAuth: true }
    },
    {
      path: '/attendance',
      name: 'Attendance',
      component: Attendance,
      meta: { requiresAuth: true }
    },
    {
      path: '/attendance_result/:number',
      name: 'Attendance_result',
      component: Attendance_result,
      meta: { requiresAuth: true }
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ]
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // このルートはログインされているかどうか認証が必要です。
    // もしされていないならば、ログインページにリダイレクトします。
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        next()
      } else {
        next({
          path: '/signin',
          query: { redirect: to.fullPath }
        })
      }
    })
  } else {
    next() // next() を常に呼び出すようにしてください!
  }
})

export default router
